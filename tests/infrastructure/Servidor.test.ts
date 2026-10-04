import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { AlmacenJsonArchivo, directorioDeDatos } from '@/infrastructure/persistencia/AlmacenJson';
import { EstadoServidor } from '@/infrastructure/persistencia/EstadoServidor';
import { hidratar, deshidratar } from '@/infrastructure/persistencia/HidratacionTienda';
import { BcryptKeyHasher } from '@/infrastructure/auth/BcryptKeyHasher';
import { JwtTokenIssuer } from '@/infrastructure/auth/JwtTokenIssuer';
import { AutenticacionToken } from '@/application/auth/AutenticacionToken';
import { UserRole, UserStatus } from '@/domain/shared/enums';
import { Usuario } from '@/domain/users/Usuario';
import { Categoria } from '@/domain/tienda/Categoria';
import { crearEstadoInicial } from '@/infrastructure/store/TiendaEstado';
import { CATALOGO_SEMILLA } from '@/infrastructure/catalog/CatalogoSemilla';
import { ProductoFabric, type ProductPersisted } from '@/domain/catalog/ProductoFabric';
import { ProductoFisico } from '@/domain/catalog/ProductoFisico';
import { ProductoDigital } from '@/domain/catalog/ProductoDigital';
import { leerDuracionDeToken } from '@/infrastructure/auth/DuracionToken';

/**
 * Pruebas de la capa de servidor: persistencia en archivo, hashing y tokens.
 *
 * El resto de la suite usa repositorios en memoria y no toca el disco. Aquí sí
 * se escribe en un directorio temporal por prueba, porque lo que se verifica
 * es justamente el comportamiento del sistema de archivos: escritura atómica,
 * serialización de escrituras concurrentes y rehidratación tras reiniciar.
 */
let directorio: string;

beforeEach(async () => {
  directorio = await fs.mkdtemp(path.join(os.tmpdir(), 'tecnostore-'));
});

afterEach(async () => {
  await fs.rm(directorio, { recursive: true, force: true });
});

describe('serialización de productos (frontera JSON)', () => {
  it('conserva el precio y el id al ir y volver por el archivo', () => {
    // Regresión: `aDatos()` devolvía un `Dinero`, que al serializar quedaba
    // como `{valor: n}`. Al releerlo, `precioTotal()` fallaba con
    // "multiplicar is not a function" y el catálogo público devolvía 500.
    const original = CATALOGO_SEMILLA[0];
    const recuperado = ProductoFabric.desdeDatos(
      JSON.parse(JSON.stringify(ProductoFabric.aPersisted(original))) as ProductPersisted,
    );

    expect(recuperado.precioTotal().esIgualA(original.precioTotal())).toBe(true);
    expect(recuperado.id.valor).toBe(original.id.valor);
    expect(recuperado.nombre).toBe(original.nombre);
  });

  it('guarda precio e id como primitivos, no como objetos', () => {
    const guardado = ProductoFabric.aPersisted(CATALOGO_SEMILLA[0]);
    expect(typeof guardado.precio).toBe('number');
    expect(typeof guardado.id).toBe('string');
  });

  it('lee también el formato heredado con id y precio como objetos', () => {
    // Un archivo escrito antes del aplanado guardaba `{id:{id}}` y
    // `{precio:{monto}}`. Debe seguir siendo legible en lugar de reventar
    // con "e.trim is not a function".
    const original = CATALOGO_SEMILLA[0];
    const heredado = {
      ...JSON.parse(JSON.stringify(ProductoFabric.aPersisted(original))),
      id: { id: original.id.valor },
      precio: { monto: original.precio.valor },
    } as unknown as ProductPersisted;

    const recuperado = ProductoFabric.desdeDatos(heredado);
    expect(recuperado.id.valor).toBe(original.id.valor);
    expect(recuperado.precioTotal().esIgualA(original.precioTotal())).toBe(true);
  });

  it('mantiene el peso de un producto físico y lo omite en uno digital', () => {
    const fisico = CATALOGO_SEMILLA.find((p) => p instanceof ProductoFisico);
    const digital = CATALOGO_SEMILLA.find((p) => p instanceof ProductoDigital);

    if (fisico) {
      expect(ProductoFabric.aPersisted(fisico).pesoGramos).toBe(fisico.peso);
    }
    if (digital) {
      expect(ProductoFabric.aPersisted(digital).pesoGramos).toBeUndefined();
    }
  });
});

describe('duración del token (JWT_EXPIRES_IN)', () => {
  it('interpreta los sufijos s/m/h/d en milisegundos', () => {
    const casos: ReadonlyArray<[string, number]> = [
      ['30s', 30_000],
      ['15m', 900_000],
      ['2h', 7_200_000],
      ['7d', 604_800_000],
    ];
    for (const [valor, esperado] of casos) {
      expect(leerDuracionDeToken(valor)).toBe(esperado);
    }
  });

  // Regresión: `Number.parseInt('7d', 10)` es 7 (no NaN), así que `7d`
  // terminaba tratado como 7 segundos y el token moría de inmediato.
  it('no confunde "7d" con 7 segundos', () => {
    expect(leerDuracionDeToken('7d')).toBe(604_800_000);
  });

  it('acepta un número desnudo como segundos', () => {
    expect(leerDuracionDeToken('3600')).toBe(3_600_000);
  });

  it('cae en el valor por defecto con una entrada inválida', () => {
    expect(leerDuracionDeToken('no-es-una-duracion')).toBe(604_800_000);
    expect(leerDuracionDeToken(undefined)).toBe(604_800_000);
  });
});

describe('AlmacenJsonArchivo', () => {
  it('devuelve undefined cuando el archivo no existe, sin lanzar', async () => {
    const almacen = new AlmacenJsonArchivo<{ valor: number }>(
      path.join(directorio, 'no-existe.json'),
    );
    expect(await almacen.leer()).toBeUndefined();
    expect(await almacen.existe()).toBe(false);
  });

  it('crea los directorios intermedios al escribir', async () => {
    const archivo = path.join(directorio, 'anidado', 'aqui', 'tienda.json');
    const almacen = new AlmacenJsonArchivo<{ valor: number }>(archivo);

    await almacen.escribir({ valor: 7 });

    expect(await almacen.existe()).toBe(true);
    expect(await almacen.leer()).toEqual({ valor: 7 });
  });

  it('no deja el archivo temporal cuando la escritura termina bien', async () => {
    const archivo = path.join(directorio, 'tienda.json');
    await new AlmacenJsonArchivo<number>(archivo).escribir(1);

    expect(await fs.readdir(directorio)).toEqual(['tienda.json']);
  });

  it('avisa con un mensaje accionable si el archivo está corrupto', async () => {
    const archivo = path.join(directorio, 'tienda.json');
    await fs.writeFile(archivo, '{ esto no es json', 'utf8');

    await expect(new AlmacenJsonArchivo(archivo).leer()).rejects.toThrow(/bórralo/);
  });

  /**
   * Sin serialización, dos escrituras simultáneas se pisan: la primera
   * termina su `rename` después de que la segunda ya escribió, y el archivo
   * acaba con el valor viejo. Este test falla si se quita la cadena de
   * promesas.
   */
  it('serializa escrituras concurrentes sin perder la última', async () => {
    const almacen = new AlmacenJsonArchivo<number>(path.join(directorio, 'tienda.json'));

    await Promise.all([almacen.escribir(1), almacen.escribir(2), almacen.escribir(3)]);

    expect(await almacen.leer()).toBe(3);
  });

  it('sigue escribiendo después de que una escritura falle', async () => {
    const almacen = new AlmacenJsonArchivo<unknown>(path.join(directorio, 'tienda.json'));
    const ciclico: Record<string, unknown> = {};
    ciclico['uno'] = ciclico; // no es serializable: revienta JSON.stringify

    await expect(almacen.escribir(ciclico)).rejects.toThrow();
    await almacen.escribir(42);
    expect(await almacen.leer()).toBe(42);
  });

  it('respeta DATA_DIR al resolver el directorio de datos', () => {
    const anterior = process.env.DATA_DIR;
    process.env.DATA_DIR = 'almacen';
    try {
      expect(directorioDeDatos('/srv/app')).toBe(path.resolve('/srv/app', 'almacen'));
    } finally {
      if (anterior === undefined) {
        delete process.env.DATA_DIR;
      } else {
        process.env.DATA_DIR = anterior;
      }
    }
  });
});

describe('hidratar / deshidratar', () => {
  function instantaneaDe(estado: ReturnType<typeof crearEstadoInicial>) {
    return deshidratar({ ...estado, credenciales: [] });
  }

  it('conserva el catálogo semilla al ir y volver', () => {
    const estado = crearEstadoInicial();
    const recuperada = hidratar(instantaneaDe(estado));

    expect(recuperada.productos).toHaveLength(CATALOGO_SEMILLA.length);
    expect(recuperada.configuracion.nombreTienda).toBe(estado.configuracion.nombreTienda);
    expect(recuperada.usuarios).toHaveLength(estado.usuarios.length);
  });

  it('conserva las credenciales con su hash', () => {
    const estado = crearEstadoInicial();
    const instantanea = {
      ...instantaneaDe(estado),
      credenciales: [
        { usuarioId: 1, email: 'admin@tecnostore.com', hashClave: '$2b$10$abc', rol: UserRole.Admin },
      ],
    };

    expect(hidratar(instantanea).credenciales[0]).toEqual(instantanea.credenciales[0]);
  });
});

describe('EstadoServidor', () => {
  it('sembla el archivo la primera vez y lo relee después', async () => {
    const archivo = path.join(directorio, 'tienda.json');
    const primero = new EstadoServidor(() => Promise.resolve(deshidratar({ ...crearEstadoInicial(), credenciales: [] })), archivo);

    const estado = await primero.estado();
    expect((await fs.stat(archivo)).isFile()).toBe(true);

    // Una instancia nueva sobre el mismo archivo lee lo que había.
    const segundo = new EstadoServidor(
      () => Promise.resolve(deshidratar({ ...crearEstadoInicial(), credenciales: [] })),
      archivo,
    );
    expect((await segundo.estado()).productos).toHaveLength(estado.productos.length);
  });

  it('expone la ruta del archivo', () => {
    const archivo = path.join(directorio, 'tienda.json');
    expect(new EstadoServidor(async () => deshidratar({ ...crearEstadoInicial(), credenciales: [] }), archivo).ruta).toBe(archivo);
  });

  it('rechaza un archivo de una versión más nueva que el código', async () => {
    const archivo = path.join(directorio, 'tienda.json');
    const instantanea = deshidratar({ ...crearEstadoInicial(), credenciales: [] });
    await fs.writeFile(archivo, JSON.stringify({ ...instantanea, version: 99 }), 'utf8');

    const estado = new EstadoServidor(async () => instantanea, archivo);
    await expect(estado.estado()).rejects.toThrow(/versión más nueva/);
  });

  it('serializa transacciones concurrentes sin perder actualizaciones', async () => {
    const archivo = path.join(directorio, 'tienda.json');
    const estado = new EstadoServidor(
      async () => deshidratar({ ...crearEstadoInicial(), credenciales: [] }),
      archivo,
    );

    const antes = (await estado.estado()).categorias.length;

    // Dos "crear categoría" simultáneos sobre el mismo estado base.
    await Promise.all([
      estado.transact((actual) => {
        actual.categorias = [...actual.categorias, Categoria.crear(99, 'Concurrente')];
        return { valor: undefined, persistir: true };
      }),
      estado.transact((actual) => {
        actual.categorias = [...actual.categorias, Categoria.crear(100, 'Segunda')];
        return { valor: undefined, persistir: true };
      }),
    ]);

    // Sin la cola, la segunda escritura partiría del mismo estado base y solo
    // su propia categoría quedaría en el archivo (se perdería la primera).
    const guardado = JSON.parse(await fs.readFile(archivo, 'utf8')) as { categorias: unknown[] };
    expect(guardado.categorias).toHaveLength(antes + 2);
  });
});

describe('BcryptKeyHasher', () => {
  const hasher = new BcryptKeyHasher();

  it('nunca guarda la contraseña en claro', async () => {
    const hash = await hasher.generar('admin123');
    expect(hash).not.toContain('admin123');
    expect(hash).toMatch(/^\$2[aby]\$/);
  });

  it('verifica la clave correcta y rechaza la incorrecta', async () => {
    const hash = await hasher.generar('admin123');
    expect(await hasher.verificar('admin123', hash)).toBe(true);
    expect(await hasher.verificar('admin124', hash)).toBe(false);
  });

  it('devuelve false en vez de lanzar si el hash está corrupto', async () => {
    expect(await hasher.verificar('admin123', 'no-es-un-hash')).toBe(false);
  });

  it('genera un hash distinto cada vez (sal aleatoria)', async () => {
    expect(await hasher.generar('admin123')).not.toBe(await hasher.generar('admin123'));
  });
});

describe('JwtTokenIssuer', () => {
  const contenido = {
    usuarioId: 1,
    email: 'admin@tecnostore.com',
    rol: UserRole.Admin,
  };

  it('exige un secreto de al menos 16 caracteres', () => {
    expect(() => new JwtTokenIssuer({ secreto: 'corto', expiraEnMilisegundos: 1000 })).toThrow(
      /16 caracteres/,
    );
  });

  it('emite un token de tres segmentos que se puede verificar', async () => {
    const issuer = new JwtTokenIssuer({ secreto: 'secreto-de-prueba-1234', expiraEnMilisegundos: 60_000 });
    const emitido = await issuer.emitir(contenido);

    expect(emitido.valor.split('.')).toHaveLength(3);
    expect(await issuer.verificar(emitido.valor)).toEqual(contenido);
  });

  it('rechaza un token firmado con otro secreto', async () => {
    const uno = new JwtTokenIssuer({ secreto: 'secreto-de-prueba-1234', expiraEnMilisegundos: 60_000 });
    const otro = new JwtTokenIssuer({ secreto: 'otro-secreto-1234567', expiraEnMilisegundos: 60_000 });
    const emitido = await uno.emitir(contenido);

    expect(await otro.verificar(emitido.valor)).toBeUndefined();
  });

  it('rechaza un token caducado', async () => {
    let ahora = 1_000_000;
    const issuer = new JwtTokenIssuer({
      secreto: 'secreto-de-prueba-1234',
      expiraEnMilisegundos: 1_000,
      ahora: () => ahora,
    });
    const emitido = await issuer.emitir(contenido);

    expect(await issuer.verificar(emitido.valor)).toBeDefined();
    ahora += 5_000; // el token expiró hace 4 s
    expect(await issuer.verificar(emitido.valor)).toBeUndefined();
  });

  it('rechaza tokens malformados sin lanzar', async () => {
    const issuer = new JwtTokenIssuer({ secreto: 'secreto-de-prueba-1234', expiraEnMilisegundos: 60_000 });
    for (const token of ['', 'abc', 'a.b', 'a.b.c.d', '...']) {
      expect(await issuer.verificar(token)).toBeUndefined();
    }
  });
});

describe('AutenticacionToken', () => {
  /** Entidad real, no un doble: `estaActivo` y `puedeAdministrar` son dominio. */
  function usuario(estado: UserStatus, rol = UserRole.Admin): Usuario {
    return Usuario.restaurar({
      id: 1,
      nombre: 'Administrador',
      email: 'admin@tecnostore.com',
      rol,
      estado,
    });
  }

  function servicio(usuarioDevuelto: Usuario): AutenticacionToken {
    const hash = new BcryptKeyHasher();
    return new AutenticacionToken(
      {
        buscarPorEmail: async () => ({
          usuarioId: 1,
          hashClave: await hash.generar('admin123'),
          rol: UserRole.Admin,
        }),
      },
      hash,
      new JwtTokenIssuer({ secreto: 'secreto-de-prueba-1234', expiraEnMilisegundos: 60_000 }),
      {
        obtenerPorId: async () => usuarioDevuelto,
        listar: async () => [usuarioDevuelto],
        actualizar: async (_id, usuario) => usuario,
      },
    );
  }

  it('devuelve token y usuario cuando las credenciales son válidas', async () => {
    const resultado = await servicio(usuario(UserStatus.Activo)).autenticar(
      'admin@tecnostore.com',
      'admin123',
    );

    expect(resultado.ok).toBe(true);
    if (resultado.ok) {
      expect(resultado.token.split('.')).toHaveLength(3);
      expect(resultado.usuario.puedeAdministrar()).toBe(true);
    }
  });

  it('rechaza una clave incorrecta', async () => {
    const resultado = await servicio(usuario(UserStatus.Activo)).autenticar(
      'admin@tecnostore.com',
      'mala',
    );

    expect(resultado).toEqual({ ok: false, motivo: 'credenciales' });
  });

  it('rechaza una cuenta bloqueada con un motivo distinto al de la clave', async () => {
    const resultado = await servicio(usuario(UserStatus.Bloqueado)).autenticar(
      'admin@tecnostore.com',
      'admin123',
    );

    expect(resultado).toEqual({ ok: false, motivo: 'inactivo' });
  });

  it('rechaza a un cliente aunque su clave sea correcta', async () => {
    const resultado = await servicio(usuario(UserStatus.Activo, UserRole.Cliente)).autenticar(
      'admin@tecnostore.com',
      'admin123',
    );

    expect(resultado).toEqual({ ok: false, motivo: 'sin-permisos' });
  });

  it('devuelve undefined cuando no hay token', async () => {
    expect(await servicio(usuario(UserStatus.Activo)).exigirAdministrador(undefined)).toBeUndefined();
  });

  it('exige un administrador: un token de cliente no pasa', async () => {
    const emisor = new JwtTokenIssuer({
      secreto: 'secreto-de-prueba-1234',
      expiraEnMilisegundos: 60_000,
    });
    const tokenCliente = await emisor.emitir({
      usuarioId: 7,
      email: 'cliente@correo.com',
      rol: UserRole.Cliente,
    });

    expect(
      await servicio(usuario(UserStatus.Activo, UserRole.Cliente)).exigirAdministrador(
        tokenCliente.valor,
      ),
    ).toBeUndefined();
  });
});
