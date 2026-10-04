import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpProductCatalogRepository } from '@/infrastructure/http/HttpProductCatalogRepository';
import { HttpOrderRepository } from '@/infrastructure/http/HttpOrderRepository';
import {
  HttpCategoryRepository,
  HttpStoreSettingsRepository,
} from '@/infrastructure/http/HttpTiendaRepositories';
import { HttpAuthenticationGateway, SesionHttp } from '@/infrastructure/http/HttpAuthenticationGateway';
import { ErrorDeApi, segmento } from '@/infrastructure/http/ClienteApi';
import { CATALOGO_SEMILLA } from '@/infrastructure/catalog/CatalogoSemilla';
import { ProductoFabric } from '@/domain/catalog/ProductoFabric';
import { Pedido } from '@/domain/orders/Pedido';
import { ProductId } from '@/domain/shared/ProductId';
import { TipoProducto, ProductCollection, CatalogListing, OrderStatus, PaymentMethod } from '@/domain/shared/enums';

/**
 * Pruebas de los adaptadores HTTP del navegador.
 *
 * `fetch` se sustituye por un doble: lo que importa aquí es qué URL se pide,
 * con qué método y cómo se traduce la respuesta en entidades. Comprobarlo
 * contra un servidor real exigiría levantarlo en cada ejecución de la suite,
 * y eso ya lo hace la prueba manual contra el build de producción.
 *
 * El caso que más valor aporta es la rehidratación: si un `Dinero` o un
 * `ProductId` volvieran como objeto plano, el fallo no aparece aquí sino en la
 * vista, cuando alguien llama a `precioTotal()`.
 */
type Peticion = { readonly url: string; readonly method: string; readonly body: string | null };

let peticiones: Peticion[] = [];
const originalFetch = globalThis.fetch;

/** Programa las respuestas por URL; cada entrada se consume una vez. */
function programar(respuestas: Record<string, unknown | Error>): void {
  globalThis.fetch = vi.fn(async (url: string, init?: RequestInit) => {
    const ruta = String(url);
    peticiones.push({
      url: ruta,
      method: init?.method ?? 'GET',
      body: typeof init?.body === 'string' ? init.body : null,
    });

    const encontrado = respuestas[ruta];
    if (encontrado === undefined) {
      return new Response('{}', { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    if (encontrado instanceof Error) {
      throw encontrado;
    }
    return new Response(JSON.stringify(encontrado), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as unknown as typeof fetch;
}

beforeEach(() => {
  peticiones = [];
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('errorDelServidor', () => {
  it('trata un 404 como "no existe", que es un resultado válido', async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ error: 'No encontrado', detalle: 'No existe.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }),
    ) as unknown as typeof fetch;

    const repo = new HttpProductCatalogRepository();
    await expect(repo.obtenerPorId(new ProductId('no-existe'))).resolves.toBeUndefined();
  });

  it('propaga el estado y el mensaje si el fallo no es un 401', async () => {
    // Un 401 es "no hay sesión" y se tradujo a `undefined` arriba; un 500 sí
    // es un fallo y debe llegar a la vista con su mensaje, no tragarse en
    // silencio y dejar el panel en "verificando" para siempre.
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ error: 'Error interno', detalle: 'Se requiere sesión.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }),
    ) as unknown as typeof fetch;

    await expect(new SesionHttp().hidratar()).rejects.toMatchObject({
      estado: 500,
      message: 'Se requiere sesión.',
    });
  });

  it('traduce un fallo de red sin filtrar el error del navegador', async () => {
    programar({});
    globalThis.fetch = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    }) as unknown as typeof fetch;

    await expect(new HttpStoreSettingsRepository().obtener()).rejects.toBeInstanceOf(ErrorDeApi);
  });
});

describe('HttpProductCatalogRepository', () => {
  it('reconstruye productos con Dinero y ProductId reales', async () => {
    const original = CATALOGO_SEMILLA[0];
    programar({
      '/api/catalogo': {
        productos: [
          {
            id: original.id.valor,
            nombre: original.nombre,
            descripcion: original.descripcion,
            categoria: original.categoria,
            precio: original.precio.valor,
            stock: original.stock,
            imagen: original.imagen,
            tipo: original.tipo,
            coleccion: original.coleccion,
            destacado: original.destacado,
            novedad: original.novedad,
            tendencia: original.tendencia,
            costoEnvio: 0,
            nivelStock: 'Disponible',
            totalInventario: 0,
          },
        ],
      },
    });

    const [producto] = await new HttpProductCatalogRepository().listar();
    // Si el precio fuera un objeto plano, esto fallaría al llamar al método.
    expect(producto.precioTotal().esIgualA(original.precioTotal())).toBe(true);
    expect(producto.id.valor).toBe(original.id.valor);
    expect(producto.precio.valor).toBe(original.precio.valor);
  });

  it('manda el filtro en la query en vez de filtrar en el cliente', async () => {
    programar({ '/api/catalogo?busqueda=iphone&listado=Destacados': { productos: [] } });
    await new HttpProductCatalogRepository().listar({
      busqueda: 'iphone',
      listado: CatalogListing.Destacados,
    });

    expect(peticiones[0].url).toBe('/api/catalogo?busqueda=iphone&listado=Destacados');
  });

  it('ignora los filtros vacíos en lugar de mandarlos como cadenas vacías', async () => {
    programar({ '/api/catalogo?busqueda=drone': { productos: [] } });
    await new HttpProductCatalogRepository().listar({ busqueda: 'drone', categoria: '', coleccion: undefined });

    expect(peticiones[0].url).toBe('/api/catalogo?busqueda=drone');
  });

  it('escapa el identificador al construir la URL', () => {
    // `ProductId` normaliza a minúsculas y guiones, así que un id con `/` no
    // llega al adapter. Se prueba el escapado directamente: si un id llegara
    // con `/` desde otra fuente, la URL no debe cambiar de segmento.
    expect(segmento('a/b')).toBe('a%2Fb');
    expect(segmento('a b')).toBe('a%20b');
    expect(segmento('a?b=1')).toBe('a%3Fb%3D1');
  });

  it('crea en el servidor con POST y el borrador del producto', async () => {
    const original = CATALOGO_SEMILLA[0];
    programar({ '/api/admin/productos': { ok: true } });

    await new HttpProductCatalogRepository().crear(original);

    const escritura = peticiones.find((p) => p.url === '/api/admin/productos');
    expect(escritura?.method).toBe('POST');
    expect(escritura?.body).toContain(original.nombre);
  });

  it('actualiza con PUT en la url del producto, no con un cambio de colección', async () => {
    const original = CATALOGO_SEMILLA[0];
    programar({
      [`/api/admin/productos/${encodeURIComponent(original.id.valor)}`]: { ok: true },
    });

    const cambiado = original.actualizar({
      nombre: original.nombre,
      descripcion: 'descripcion nueva',
      categoria: original.categoria,
      precio: 999,
      stock: original.stock,
      imagen: original.imagen,
      tipo: original.tipo,
      coleccion: original.coleccion,
      destacado: original.destacado,
      novedad: original.novedad,
      tendencia: original.tendencia,
    });
    await new HttpProductCatalogRepository().actualizar(original.id, cambiado);

    const escritura = peticiones.find((p) => p.url.includes('/api/admin/productos/'));
    expect(escritura?.method).toBe('PUT');
    expect(escritura?.url).toContain(encodeURIComponent(original.id.valor));
    expect(escritura?.body).toContain('descripcion nueva');
  });

  it('elimina con DELETE en la url del producto', async () => {
    const original = CATALOGO_SEMILLA[0];
    programar({
      [`/api/admin/productos/${encodeURIComponent(original.id.valor)}`]: { ok: true },
    });

    await new HttpProductCatalogRepository().eliminar(original.id);

    expect(peticiones[0].method).toBe('DELETE');
    expect(peticiones[0].url).toContain(encodeURIComponent(original.id.valor));
  });

  it('no rehidrata un borrador fantasma al crear: el dominio manda', async () => {
    const nuevo = ProductoFabric.crear(new ProductId('nuevo'), {
      nombre: 'Nuevo',
      descripcion: 'Nuevo',
      categoria: 'Audio',
      precio: 1000,
      stock: 1,
      imagen: '/n.jpg',
      tipo: TipoProducto.Digital,
      coleccion: ProductCollection.Drone,
      destacado: false,
      novedad: true,
      tendencia: false,
    });
    programar({ '/api/admin/productos': { ok: true } });

    const creado = await new HttpProductCatalogRepository().crear(nuevo);
    const escritura = peticiones.find((p) => p.url === '/api/admin/productos');
    expect(escritura?.method).toBe('POST');
    expect(escritura?.body).toContain('Nuevo');
    expect(creado.id.valor).toBe('nuevo');
  });
});

describe('HttpOrderRepository', () => {
  it('lista los pedidos y los rehidrata como entidades', async () => {
    programar({
      '/api/admin/pedidos': {
        pedidos: [
          {
            id: 1,
            cliente: 'Ana',
            fecha: '2026-01-01',
            producto: {
              id: 'p',
              nombre: 'p',
              descripcion: 'p',
              categoria: 'Audio',
              precio: 100,
              stock: 1,
              imagen: '/p.jpg',
              tipo: TipoProducto.Digital,
              coleccion: ProductCollection.Iphone,
              destacado: false,
              novedad: false,
              tendencia: false,
            },
            cantidad: 1,
            metodoPago: 'Efectivo/Contraentrega',
            estado: 'Pendiente',
          },
        ],
      },
    });

    const [pedido] = await new HttpOrderRepository().listar();
    expect(pedido.id).toBe(1);
    expect(pedido.nombreEstado).toBe('Pendiente');
  });

  it('mueve el estado con PATCH al endpoint del pedido', async () => {
    programar({ '/api/admin/pedidos/1/estado': { ok: true } });

    const pedido = Pedido.restaurar({
      id: 1,
      cliente: 'Ana',
      fecha: '2026-01-01',
      producto: {
        id: 'p',
        nombre: 'p',
        descripcion: 'p',
        categoria: 'Audio',
        precio: 100,
        stock: 1,
        imagen: '/p.jpg',
        tipo: TipoProducto.Digital,
        coleccion: ProductCollection.Iphone,
        destacado: false,
        novedad: false,
        tendencia: false,
      },
      cantidad: 1,
      metodoPago: PaymentMethod.Contraentrega,
      estado: OrderStatus.Enviado,
    });

    await new HttpOrderRepository().actualizar(1, pedido);

    const escritura = peticiones[0];
    expect(escritura.url).toBe('/api/admin/pedidos/1/estado');
    expect(escritura.method).toBe('PATCH');
    expect(escritura.body).toContain('Enviado');
  });
});

describe('HttpCategoryRepository', () => {
  it('crea con POST y devuelve la categoría con el id que asigna el servidor', async () => {
    programar({ '/api/admin/categorias': { categoria: { id: 7, nombre: 'Smartwatches' } } });

    const categoria = await new HttpCategoryRepository().crear('Smartwatches');

    const escritura = peticiones[0];
    expect(escritura.url).toBe('/api/admin/categorias');
    expect(escritura.method).toBe('POST');
    expect(escritura.body).toContain('Smartwatches');
    expect(categoria.id).toBe(7);
    expect(categoria.nombre).toBe('Smartwatches');
  });

  it('elimina con DELETE', async () => {
    programar({ '/api/admin/categorias/3': { ok: true } });

    await new HttpCategoryRepository().eliminar(3);

    expect(peticiones[0].method).toBe('DELETE');
    expect(peticiones[0].url).toBe('/api/admin/categorias/3');
  });
});

describe('HttpAuthenticationGateway y SesionHttp', () => {
  it('devuelve undefined con credenciales incorrectas en vez de lanzar', async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ error: 'No autenticado', detalle: 'Correo o contraseña incorrectos.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    ) as unknown as typeof fetch;

    await expect(new HttpAuthenticationGateway().autenticar('a@b.com', 'mal')).resolves.toBeUndefined();
  });

  it('devuelve undefined si la sesión no existe, que es un estado normal', async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ error: 'No autenticado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    ) as unknown as typeof fetch;

    const sesion = new SesionHttp();
    await expect(sesion.hidratar()).resolves.toBeUndefined();
    expect(sesion.usuarioActual()).toBeUndefined();
  });

  it('expone el usuario que devuelve el servidor', async () => {
    programar({
      '/api/auth/sesion': {
        usuario: { id: 1, nombre: 'Andrés', email: 'admin@tecnostore.com', rol: 'Admin', estado: 'Activo' },
      },
    });

    const sesion = new SesionHttp();
    await sesion.hidratar();
    expect(sesion.usuarioActual()?.nombre).toBe('Andrés');
    expect(sesion.esAdministrador()).toBe(true);
  });

  it('limpia el usuario solo después de que el servidor borre la cookie', async () => {
    programar({ '/api/auth/logout': { ok: true } });
    const sesion = new SesionHttp();
    sesion.iniciar(
      (await import('@/domain/users/Usuario')).Usuario.restaurar({
        id: 1,
        nombre: 'Andrés',
        email: 'admin@tecnostore.com',
        rol: 'Admin' as never,
        estado: 'Activo' as never,
      }),
    );

    await sesion.cerrar();
    expect(sesion.usuarioActual()).toBeUndefined();
    expect(peticiones[0].url).toBe('/api/auth/logout');
  });
});
