import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Pool } from 'pg';
import { BasePg } from '@/infrastructure/pg/BasePg';
import { PgProductCatalogRepository } from '@/infrastructure/pg/PgProductCatalogRepository';
import { PgOrderRepository } from '@/infrastructure/pg/PgOrderRepository';
import { PgUserRepository } from '@/infrastructure/pg/PgUserRepository';
import { PgCategoryRepository } from '@/infrastructure/pg/PgCategoryRepository';
import { PgStoreSettingsRepository } from '@/infrastructure/pg/PgStoreSettingsRepository';
import { PgCredentialsGateway } from '@/infrastructure/pg/PgCredentialsGateway';
import { BcryptKeyHasher } from '@/infrastructure/auth/BcryptKeyHasher';
import { JwtTokenIssuer } from '@/infrastructure/auth/JwtTokenIssuer';
import { crearSemillaServidor } from '@/application/serverCompositionRoot';
import { CatalogoService } from '@/application/catalog/CatalogoService';
import { ProductoAdminService } from '@/application/catalog/ProductoAdminService';
import { PedidoAdminService } from '@/application/orders/PedidoAdminService';
import { CategoriaAdminService } from '@/application/tienda/CategoriaAdminService';
import { ConfiguracionTiendaService } from '@/application/tienda/ConfiguracionTiendaService';
import { AutenticacionToken } from '@/application/auth/AutenticacionToken';
import { CATALOGO_SEMILLA, productoSemilla } from '@/infrastructure/catalog/CatalogoSemilla';
import { OrderStatus, ProductCollection, TipoProducto } from '@/domain/shared/enums';
import type { ProductDraft } from '@/domain/catalog/ProductoDraft';

/**
 * Pruebas de integración con PostgreSQL real.
 *
 * Se saltan por completo si no hay `DATABASE_URL` (el caso habitual de `npm
 * run verify`): no levantan un servidor, dosifican sobre la base de verdad.
 * Cuando la hay, trabajan en un esquema desechable para no tocar los datos
 * de desarrollo.
 */
const hayBase = Boolean(process.env.DATABASE_URL);

const ESQUEMA = `tecnostore_integracion_${Date.now().toString(36)}`;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  options: `-c search_path=${ESQUEMA}`,
  max: 5,
});

beforeAll(async () => {
  await pool.query(`CREATE SCHEMA "${ESQUEMA}"`);
});

afterAll(async () => {
  try {
    await pool.query(`DROP SCHEMA IF EXISTS "${ESQUEMA}" CASCADE`);
  } finally {
    await pool.end();
  }
});

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

describe.skipIf(!hayBase)('PostgreSQL: persistencia real', () => {
  it('siembra y lee el catálogo, los pedidos y las credenciales', async () => {
    const claves = new BcryptKeyHasher();
    const base = new BasePg(crearSemillaServidor(claves), pool);
    const productos = new PgProductCatalogRepository(base);

    // La siembra vende 1 unidad de drone-1 (stock 1): el trigger lo deja en 0
    // y el catálogo público lo oculta por agotado, de ahí el `- 1`.
    expect(await new CatalogoService(productos).listar()).toHaveLength(
      CATALOGO_SEMILLA.length - 1,
    );
    expect(await new PedidoAdminService(new PgOrderRepository(base)).listar()).toHaveLength(4);

    const resultado = await new AutenticacionToken(
      new PgCredentialsGateway(base),
      claves,
      new JwtTokenIssuer({ secreto: 'secreto-de-prueba-1234', expiraEnMilisegundos: 60_000 }),
      new PgUserRepository(base),
    ).autenticar('admin@tecnostore.com', 'admin123');
    expect(resultado.ok).toBe(true);
  });

  it('un CRUD de producto sobrevive a una lectura posterior', async () => {
    const claves = new BcryptKeyHasher();
    const base = new BasePg(crearSemillaServidor(claves), pool);
    const adminProductos = new ProductoAdminService(new PgProductCatalogRepository(base));

    const creado = await adminProductos.crear(BORRADOR);
    await adminProductos.actualizar('cable-usb-c-trenzado-2m', {
      ...BORRADOR,
      nombre: 'Cable USB-C Trenzado 3m',
    });
    const leido = await adminProductos.listar({ busqueda: 'Cable USB-C Trenzado' });
    expect(leido[0]?.nombre).toBe('Cable USB-C Trenzado 3m');

    await adminProductos.eliminar(creado.id.valor);
    expect(await adminProductos.listar({ busqueda: 'Cable' })).toHaveLength(0);
  });

  it('asigna el id de la categoría desde la secuencia y persiste la configuración', async () => {
    const claves = new BcryptKeyHasher();
    const base = new BasePg(crearSemillaServidor(claves), pool);
    const adminCategorias = new CategoriaAdminService(new PgCategoryRepository(base));
    const maximoPrevio = Math.max(...(await adminCategorias.listar()).map((c) => c.id));

    const nueva = await adminCategorias.crear('Smartwatches');
    expect(nueva.id).toBe(maximoPrevio + 1);

    const configuracion = new ConfiguracionTiendaService(new PgStoreSettingsRepository(base));
    await configuracion.guardar({
      nombreTienda: 'ShenzhenStock Colombia',
      costoEnvio: 15000,
      emailContacto: 'contacto@shenzhenstock.co',
    });
    const guardada = await configuracion.obtener();
    expect(guardada.nombreTienda).toBe('ShenzhenStock Colombia');
    expect(guardada.costoEnvio.valor).toBe(15000);
  });

  it('mueve el estado de un pedido y lo devuelve cambiado', async () => {
    const claves = new BcryptKeyHasher();
    const base = new BasePg(crearSemillaServidor(claves), pool);
    const pedidos = new PedidoAdminService(new PgOrderRepository(base));

    const actualizado = await pedidos.cambiarEstado(4, OrderStatus.Enviado);
    expect(actualizado.nombreEstado).toBe(OrderStatus.Enviado);
    expect((await pedidos.listar()).find((p) => p.id === 4)?.nombreEstado).toBe(
      OrderStatus.Enviado,
    );
  });

  it('el procedimiento registra la venta y el trigger descuenta el stock', async () => {
    const claves = new BcryptKeyHasher();
    const base = new BasePg(crearSemillaServidor(claves), pool);
    const repositorioPedidos = new PgOrderRepository(base);
    const stockProducto = async (id: string): Promise<number> =>
      Number((await base.consulta('SELECT stock::int AS stock FROM productos WHERE id = $1', [id]))[0]?.stock);

    expect(await stockProducto('drone-1')).toBe(0);

    const stockAntes = await stockProducto('dinosaurio');
    await base.ejecutar(`CALL registrar_pedido($1, $2, $3, $4, $5, $6)`, [
      999,
      'Laura Méndez',
      '2026-03-05',
      'dinosaurio',
      2,
      'Nequi/Bancolombia',
    ]);
    expect(await stockProducto('dinosaurio')).toBe(stockAntes - 2);

    const creado = await repositorioPedidos.obtenerPorId(999);
    expect(creado?.cliente).toBe('Laura Méndez');
    expect(creado?.nombreEstado).toBe(OrderStatus.Pendiente);
    expect(creado?.total.valor).toBe(productoSemilla('dinosaurio').cotizar(2).valor);

    await expect(
      base.ejecutar(`CALL registrar_pedido($1, $2, $3, $4, $5, $6)`, [
        998,
        'Laura Méndez',
        '2026-03-05',
        'drone-1',
        1,
        'Nequi/Bancolombia',
      ]),
    ).rejects.toThrow(/Stock insuficiente/);
  });
});