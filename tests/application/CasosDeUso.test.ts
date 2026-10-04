import { beforeEach, describe, expect, it } from 'vitest';
import { ProductoAdminService } from '@/application/catalog/ProductoAdminService';
import { CatalogoService } from '@/application/catalog/CatalogoService';
import { PedidoAdminService } from '@/application/orders/PedidoAdminService';
import { UsuarioAdminService } from '@/application/users/UsuarioAdminService';
import { CategoriaAdminService } from '@/application/tienda/CategoriaAdminService';
import { ConfiguracionTiendaService } from '@/application/tienda/ConfiguracionTiendaService';
import { DashboardService } from '@/application/dashboard/DashboardService';
import { InMemoryProductCatalogRepository } from '@/infrastructure/store/InMemoryProductCatalogRepository';
import { InMemoryOrderRepository } from '@/infrastructure/store/InMemoryOrderRepository';
import { InMemoryUserRepository } from '@/infrastructure/store/InMemoryUserRepository';
import { InMemoryCategoryRepository } from '@/infrastructure/store/InMemoryCategoryRepository';
import { InMemoryReportRepository } from '@/infrastructure/store/InMemoryReportRepository';
import { InMemoryStoreSettingsRepository } from '@/infrastructure/store/InMemoryStoreSettingsRepository';
import { crearEstadoInicial, type TiendaEstado } from '@/infrastructure/store/TiendaEstado';
import { CATALOGO_SEMILLA } from '@/infrastructure/catalog/CatalogoSemilla';
import type { ProductDraft } from '@/domain/catalog/ProductoDraft';
import { ProductId } from '@/domain/shared/ProductId';
import { Dinero } from '@/domain/shared/Dinero';
import {
  CatalogListing,
  OrderStatus,
  ProductCollection,
  TipoProducto,
  UserStatus,
} from '@/domain/shared/enums';

const BORRADOR: ProductDraft = {
  nombre: 'Cable USB-C Trenzado 2m',
  descripcion: 'Cable reforzado con carga rápida de 60W.',
  categoria: 'Energía',
  precio: 18000,
  stock: 4,
  imagen: '/CARGADOR-20W.jpg',
  tipo: TipoProducto.Fisico,
  coleccion: ProductCollection.Iphone,
  destacado: false,
  novedad: true,
  tendencia: false,
};

/** Cada prueba recibe un estado nuevo: el repositorio es memoria compartida. */
function contexto() {
  const estado: TiendaEstado = crearEstadoInicial();
  const productos = new InMemoryProductCatalogRepository(estado);
  return {
    estado,
    productos,
    catalogo: new CatalogoService(productos),
    adminProductos: new ProductoAdminService(productos),
    adminPedidos: new PedidoAdminService(new InMemoryOrderRepository(estado)),
    adminUsuarios: new UsuarioAdminService(new InMemoryUserRepository(estado)),
    adminCategorias: new CategoriaAdminService(new InMemoryCategoryRepository(estado)),
    configuracion: new ConfiguracionTiendaService(
      new InMemoryStoreSettingsRepository(estado),
    ),
    dashboard: new DashboardService(productos, new InMemoryReportRepository(estado)),
  };
}

/**
 * Todos los casos de uso son `async` desde que los puertos seAshacen supports
 * repositorios que persisten (JSON o HTTP). Las pruebas esperan la promesa:
 * hacerlo sin `await` daría un `Promise` y las aserciones pasarían por encima
 * del valor real.
 */
describe('CatalogoService', () => {
  it('devuelve el catálogo semilla completo', async () => {
    const { catalogo } = contexto();
    expect(await catalogo.listar()).toHaveLength(CATALOGO_SEMILLA.length);
  });

  it('filtra por colección sin que la página mantenga su propio array', async () => {
    const { catalogo } = contexto();
    const iphone = await catalogo.listarPorColeccion(ProductCollection.Iphone);
    expect(iphone.length).toBeGreaterThan(0);
    expect(iphone.every((p) => p.coleccion === ProductCollection.Iphone)).toBe(true);
  });

  it('separa destacados de novedades', async () => {
    const { catalogo } = contexto();
    const destacados = await catalogo.listarPorListado(CatalogListing.Destacados);
    const novedades = await catalogo.listarPorListado(CatalogListing.Novedades);

    expect(destacados.every((p) => p.destacado)).toBe(true);
    expect(novedades.every((p) => p.novedad)).toBe(true);
  });

  it('busca por nombre y descripción, ignorando mayúsculas', async () => {
    const { catalogo } = contexto();
    expect((await catalogo.buscar('DRONE')).length).toBeGreaterThan(0);
    expect((await catalogo.buscar('dron')).length).toBeGreaterThan(0);
  });

  // Antes la página caía en un producto genérico con precio y stock inventados.
  it('devuelve undefined para un id desconocido en vez de un producto por defecto', async () => {
    const { catalogo } = contexto();
    expect(await catalogo.obtenerPorId('no-existe')).toBeUndefined();
    expect(await catalogo.existe('no-existe')).toBe(false);
  });

  it('encuentra un producto real por su id', async () => {
    const { catalogo } = contexto();
    expect((await catalogo.obtenerPorId('funda-iphone-17'))?.nombre).toBe(
      'Funda iPhone 17 Pro Max',
    );
  });
});

describe('ProductoAdminService', () => {
  let ctx: ReturnType<typeof contexto>;
  beforeEach(() => {
    ctx = contexto();
  });

  it('crea un producto y lo persiste', async () => {
    const creado = await ctx.adminProductos.crear(BORRADOR);
    expect(await ctx.productos.obtenerPorId(creado.id)).toBeDefined();
    expect(await ctx.adminProductos.listar()).toHaveLength(CATALOGO_SEMILLA.length + 1);
  });

  it('deriva el id del nombre normalizado', async () => {
    const creado = await ctx.adminProductos.crear(BORRADOR);
    expect(creado.id.valor).toBe('cable-usb-c-trenzado-2m');
  });

  it('rechaza identificadores duplicados', async () => {
    await ctx.adminProductos.crear(BORRADOR);
    await expect(ctx.adminProductos.crear(BORRADOR)).rejects.toThrow(/Ya existe/);
  });

  // El bug original: el servicio devolvía el array y nadie lo guardaba.
  it('la edición sobrevive a una lectura posterior', async () => {
    await ctx.adminProductos.actualizar('drone-1', {
      ...BORRADOR,
      nombre: 'Drone ALPHA 4K Pro',
      precio: 99000,
    });
    expect((await ctx.productos.obtenerPorId(new ProductId('drone-1')))?.precio.valor).toBe(99000);
  });

  it('conserva el tipo del producto al editarlo', async () => {
    const actualizado = await ctx.adminProductos.actualizar('drone-1', {
      ...BORRADOR,
      nombre: 'Drone ALPHA 4K Pro',
      precio: 99000,
    });
    expect(actualizado.tipo).toBe(TipoProducto.Fisico);
  });

  it('cambia la subclase cuando el borrador cambia el tipo', async () => {
    const comoDigital = await ctx.adminProductos.actualizar('drone-1', {
      ...BORRADOR,
      nombre: 'Drone ALPHA 4K Pro',
      precio: 99000,
      tipo: TipoProducto.Digital,
    });

    expect(comoDigital.tipo).toBe(TipoProducto.Digital);
    expect(await ctx.productos.obtenerPorId(new ProductId('drone-1'))).toBe(comoDigital);
    expect(comoDigital.costoEnvio().esIgualA(Dinero.cero())).toBe(true);
  });

  it('elimina un producto', async () => {
    await ctx.adminProductos.eliminar('soporte-digital-premium');
    expect(await ctx.productos.obtenerPorId(new ProductId('soporte-digital-premium'))).toBeUndefined();
  });

  it('falla de forma clara al editar o eliminar un id inexistente', async () => {
    await expect(ctx.adminProductos.actualizar('fantasma', BORRADOR)).rejects.toThrow(/no existe/);
    await expect(ctx.adminProductos.eliminar('fantasma')).rejects.toThrow(/no existe/);
  });

  it('alterna la marca de tendencia', async () => {
    const antes = (await ctx.productos.obtenerPorId(new ProductId('drone-1')))?.tendencia;
    const despues = (await ctx.adminProductos.alternarTendencia('drone-1')).tendencia;
    expect(despues).toBe(!antes);
  });

  it('devuelve una copia, no la referencia interna del array', async () => {
    const primera = await ctx.productos.listar();
    const segunda = await ctx.productos.listar();
    expect(primera).not.toBe(segunda);
    expect(primera).toHaveLength(CATALOGO_SEMILLA.length);
  });
});

describe('PedidoAdminService', () => {
  it('cambia el estado y persiste el cambio', async () => {
    const ctx = contexto();
    await ctx.adminPedidos.cambiarEstado(4, OrderStatus.Enviado);
    expect((await ctx.adminPedidos.listar()).find((p) => p.id === 4)?.nombreEstado).toBe(
      OrderStatus.Enviado,
    );
  });

  it('rechaza una transición inválida en lugar de aceptarla en silencio', async () => {
    const ctx = contexto();
    const entregado = (await ctx.adminPedidos.listar()).find((p) => p.id === 1);
    expect(entregado?.nombreEstado).toBe(OrderStatus.Entregado);
    await expect(ctx.adminPedidos.cambiarEstado(1, OrderStatus.Pendiente)).rejects.toThrow();
  });
});

describe('UsuarioAdminService', () => {
  it('alterna el estado y persiste', async () => {
    const ctx = contexto();
    const usuario = await ctx.adminUsuarios.alternarEstado(2);
    expect(usuario.estado).toBe(UserStatus.Bloqueado);
    expect((await ctx.adminUsuarios.listar()).find((u) => u.id === 2)?.estado).toBe(
      UserStatus.Bloqueado,
    );
  });
});

describe('ConfiguracionTiendaService', () => {
  it('guarda los tres campos y los devuelve persistidos', async () => {
    const ctx = contexto();
    await ctx.configuracion.guardar({
      nombreTienda: 'ShenzhenStock Colombia',
      costoEnvio: 15000,
      emailContacto: 'contacto@shenzhenstock.co',
    });

    const guardada = await ctx.configuracion.obtener();
    expect(guardada.nombreTienda).toBe('ShenzhenStock Colombia');
    expect(guardada.costoEnvio.valor).toBe(15000);
    expect(guardada.emailContacto.valor).toBe('contacto@shenzhenstock.co');
  });

  it('propaga el error del value object en vez de guardar datos inválidos', async () => {
    const ctx = contexto();
    const antes = await ctx.configuracion.obtener();
    await expect(
      ctx.configuracion.guardar({
        nombreTienda: 'Tienda',
        costoEnvio: -5,
        emailContacto: 'correo-malo',
      }),
    ).rejects.toThrow();
    expect((await ctx.configuracion.obtener()).esIgualA(antes)).toBe(true);
  });
});

describe('CategoriaAdminService', () => {
  it('crea con una secuencia monotónica, no con Date.now()', async () => {
    const ctx = contexto();
    const maximoPrevio = Math.max(...(await ctx.adminCategorias.listar()).map((c) => c.id));
    const nueva = await ctx.adminCategorias.crear('Smartwatches');
    expect(nueva.id).toBe(maximoPrevio + 1);
  });

  it('rechaza nombres vacíos', async () => {
    await expect(contexto().adminCategorias.crear('   ')).rejects.toThrow();
  });
});

describe('DashboardService', () => {
  it('suma inventario y ventas como Dinero', async () => {
    const { dashboard } = contexto();
    const metricas = await dashboard.metricas();
    expect(metricas.valorTotalInventario.valor).toBeGreaterThan(0);
    expect(metricas.totalMesVentas.valor).toBeGreaterThan(0);
    expect(metricas.totalUnidadesStock).toBeGreaterThan(0);
  });

  it('lista solo los productos que necesitan reposición', async () => {
    const { dashboard } = contexto();
    expect((await dashboard.metricas()).productosCriticos.every((p) => p.necesitaReposicion())).toBe(
      true,
    );
  });
});