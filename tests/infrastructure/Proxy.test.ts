import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createHmac } from 'node:crypto';
import { proxy } from '@/proxy';

/**
 * Pruebas del proxy.
 *
 * El proxy decide si una petición puede llegar al panel, así que se prueba
 * como lo que es: una función que recibe una ruta y una cookie y devuelve una
 * redirección, un 401 o un "sigue". Se firma un token real con el mismo
 * algoritmo del servidor (`node:crypto`), porque un token de mentira que el
 * proxy aceptara probaría lo contrario de lo que se quiere demostrar.
 */
const SECRETO = 'secreto-de-prueba-suficientemente-largo';
const RUTAS_PROTEGIDAS = ['/admin', '/api/admin'];

function firmar(payload: Record<string, unknown>, secreto = SECRETO): string {
  const base64url = (valor: object): string =>
    Buffer.from(JSON.stringify(valor), 'utf8').toString('base64url');
  const cuerpo = `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url(payload)}`;
  const firma = createHmac('sha256', secreto).update(cuerpo).digest('base64url');
  return `${cuerpo}.${firma}`;
}

function tokenValido(): string {
  const ahora = Math.floor(Date.now() / 1000);
  return firmar({ sub: 1, email: 'admin@tecnostore.com', rol: 'Admin', iat: ahora, exp: ahora + 3600 });
}

function tokenCaducado(): string {
  const ahora = Math.floor(Date.now() / 1000);
  return firmar({ sub: 1, email: 'admin@tecnostore.com', rol: 'Admin', iat: ahora - 7200, exp: ahora - 3600 });
}

/** Petición mínima con la forma que usa el proxy (`nextUrl` y `cookies`). */
function peticion(ruta: string, token?: string): Parameters<typeof proxy>[0] {
  const url = new URL(`https://tienda.test${ruta}`);
  return {
    nextUrl: {
      pathname: url.pathname,
      clone: () => new URL(`https://tienda.test${ruta}`),
    },
    cookies: {
      get: (nombre: string) => (nombre === 'shz_sesion' && token ? { name: nombre, value: token } : undefined),
    },
  } as unknown as Parameters<typeof proxy>[0];
}

async function location(respuesta: Response): Promise<string | null> {
  return respuesta.headers.get('location');
}

const original = process.env.JWT_SECRET;

beforeEach(() => {
  process.env.JWT_SECRET = SECRETO;
});

afterEach(() => {
  process.env.JWT_SECRET = original;
});

describe('proxy: rutas protegidas', () => {
  for (const ruta of RUTAS_PROTEGIDAS) {
    it(`${ruta} sin cookie responde 401 si es API y redirige si es página`, async () => {
      const respuesta = await proxy(peticion(ruta));
      if (ruta.startsWith('/api/')) {
        expect(respuesta.status).toBe(401);
      } else {
        expect(respuesta.status).toBe(307);
        expect(await location(respuesta)).toContain('/login?siguiente=%2Fadmin');
      }
    });
  }

  it('protege también las subrutas del panel', async () => {
    const respuesta = await proxy(peticion('/admin/productos/editar'));
    expect(respuesta.status).toBe(307);
    expect(await location(respuesta)).toContain('%2Fadmin%2Fproductos%2Feditar');
  });

  it('deja pasar con un token vigente', async () => {
    const respuesta = await proxy(peticion('/admin', tokenValido()));
    expect(await location(respuesta)).toBeNull();
  });

  it('rechaza un token caducado', async () => {
    const respuesta = await proxy(peticion('/api/admin/pedidos', tokenCaducado()));
    expect(respuesta.status).toBe(401);
  });

  it('rechaza una firma hecha con otro secreto', async () => {
    const falso = firmar({ sub: 1, exp: Math.floor(Date.now() / 1000) + 3600 }, 'otro-secreto-largo-suficiente');
    const respuesta = await proxy(peticion('/admin', falso));
    expect(respuesta.status).toBe(307);
  });

  it('rechaza un token manipurado, aunque conserve la forma', async () => {
    const partes = tokenValido().split('.');
    partes[2] = 'x'.repeat(partes[2].length);
    const respuesta = await proxy(peticion('/api/admin/pedidos', partes.join('.')));
    expect(respuesta.status).toBe(401);
  });

  it('rechaza un token con el payload alterado', async () => {
    // Firma válida sobre otro cuerpo: el caso clásico de manipulación.
    const partes = tokenValido().split('.');
    const alterado = Buffer.from(
      JSON.stringify({ sub: 1, rol: 'Admin', exp: Math.floor(Date.now() / 1000) + 3600 }),
      'utf8',
    ).toString('base64url');
    const respuesta = await proxy(peticion('/admin', `${partes[0]}.${alterado}.${partes[2]}`));
    expect(respuesta.status).toBe(307);
  });

  it('no filtra el rol: un rol no administrador pasa la verificación', async () => {
    // El proxy verifica la firma, no autoriza. La autorización real la hace
    // `exigirAdministrador` en cada endpoint, porque solo el servidor puede
    // consultar si la cuenta sigue activa. Si este test dejara de pasar,
    // significaría que el proxy empezó a hacer trabajo de autorización.
    const cliente = firmar({
      sub: 7,
      email: 'cliente@correo.com',
      rol: 'Cliente',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    const respuesta = await proxy(peticion('/api/admin/pedidos', cliente));
    expect(respuesta.status).not.toBe(401);
  });
});

describe('proxy: rutas de sesión', () => {
  for (const ruta of ['/login', '/api/auth/login']) {
    it(`${ruta} manda a /admin si ya hay sesión`, async () => {
      const respuesta = await proxy(peticion(ruta, tokenValido()));
      expect(respuesta.status).toBe(307);
      expect(await location(respuesta)).toContain('/admin');
    });

    it(`${ruta} se muestra si no hay sesión`, async () => {
      const respuesta = await proxy(peticion(ruta));
      expect(await location(respuesta)).toBeNull();
    });
  }
});

describe('proxy: rutas públicas', () => {
  for (const ruta of ['/', '/productos-top', '/producto/funda-iphone-17', '/api/catalogo']) {
    it(`${ruta} pasa sin cookie`, async () => {
      const respuesta = await proxy(peticion(ruta));
      expect(await location(respuesta)).toBeNull();
      expect(respuesta.status).toBe(200);
    });
  }

  it('no confunde /administracion con /admin', async () => {
    // Sin esta comprobación, un prefijo mal acotado dejaría sin proteger (o
    // protegería de más) rutas que se parecen.
    const respuesta = await proxy(peticion('/administracion'));
    expect(await location(respuesta)).toBeNull();
  });
});

describe('proxy: configuración', () => {
  it('falla cerrado si falta JWT_SECRET', async () => {
    delete process.env.JWT_SECRET;
    const respuesta = await proxy(peticion('/'));
    expect(respuesta.status).toBe(500);
  });

  it('falla cerrado si el secreto es demasiado corto', async () => {
    process.env.JWT_SECRET = 'corto';
    const respuesta = await proxy(peticion('/'));
    expect(respuesta.status).toBe(500);
  });
});
