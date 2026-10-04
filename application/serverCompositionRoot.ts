import path from 'node:path';
import { CATALOGO_SEMILLA } from '@/infrastructure/catalog/CatalogoSemilla';
import {
  crearCategoriasSemilla,
  crearConfiguracionSemilla,
  crearPedidosSemilla,
  crearReportesSemilla,
  crearUsuariosSemilla,
  USUARIOS_SEMILLA,
} from '@/infrastructure/catalog/DatosSemilla';
import { ProductoFabric } from '@/domain/catalog/ProductoFabric';
import { UserRole } from '@/domain/shared/enums';
import type { CredencialPersistida } from '@/domain/auth/contracts';
import type { VerificadorDeClaves } from '@/domain/auth/contracts';
import { EstadoServidor } from '@/infrastructure/persistencia/EstadoServidor';
import { VERSION_ACTUAL, type GeneradorSemilla } from '@/infrastructure/persistencia/HidratacionTienda';
import type { InstantaneaTienda } from '@/infrastructure/persistencia/InstantaneaTienda';
import { JsonProductCatalogRepository } from '@/infrastructure/persistencia/JsonProductCatalogRepository';
import { JsonOrderRepository } from '@/infrastructure/persistencia/JsonOrderRepository';
import { JsonUserRepository } from '@/infrastructure/persistencia/JsonUserRepository';
import { JsonCategoryRepository } from '@/infrastructure/persistencia/JsonCategoryRepository';
import { JsonReportRepository } from '@/infrastructure/persistencia/JsonReportRepository';
import { JsonStoreSettingsRepository } from '@/infrastructure/persistencia/JsonStoreSettingsRepository';
import { BcryptKeyHasher } from '@/infrastructure/auth/BcryptKeyHasher';
import { JsonCredentialsGateway } from '@/infrastructure/auth/JsonCredentialsGateway';
import { JwtTokenIssuer } from '@/infrastructure/auth/JwtTokenIssuer';
import { leerDuracionDeToken } from '@/infrastructure/auth/DuracionToken';
import { BasePg } from '@/infrastructure/pg/BasePg';
import { PgProductCatalogRepository } from '@/infrastructure/pg/PgProductCatalogRepository';
import { PgOrderRepository } from '@/infrastructure/pg/PgOrderRepository';
import { PgUserRepository } from '@/infrastructure/pg/PgUserRepository';
import { PgCategoryRepository } from '@/infrastructure/pg/PgCategoryRepository';
import { PgReportRepository } from '@/infrastructure/pg/PgReportRepository';
import { PgStoreSettingsRepository } from '@/infrastructure/pg/PgStoreSettingsRepository';
import { PgCredentialsGateway } from '@/infrastructure/pg/PgCredentialsGateway';
import { CatalogoService } from '@/application/catalog/CatalogoService';
import { ProductoAdminService } from '@/application/catalog/ProductoAdminService';
import { PedidoAdminService } from '@/application/orders/PedidoAdminService';
import { UsuarioAdminService } from '@/application/users/UsuarioAdminService';
import { CategoriaAdminService } from '@/application/tienda/CategoriaAdminService';
import { ReporteService } from '@/application/tienda/ReporteService';
import { ConfiguracionTiendaService } from '@/application/tienda/ConfiguracionTiendaService';
import { DashboardService } from '@/application/dashboard/DashboardService';
import { AutenticacionToken } from '@/application/auth/AutenticacionToken';

/**
 * Semilla del servidor.
 *
 * Es la misma tienda que `TiendaEstado` usa en memoria (mismos 35 productos,
 * 4 pedidos, 4 usuarios), más las credenciales. A diferencia del adaptador del
 * navegador, aquí las contraseñas se **hashean con bcrypt** antes de tocar el
 * almacén: la semilla necesita el hasher porque el hash no puede calcularse sin
 * coste de CPU.
 *
 * Los datos de demostración (pedidos, usuarios, reportes, configuración) viven
 * en `infrastructure/catalog/DatosSemilla` y son la misma fuente que alimenta a
 * `TiendaEstado`: así ningún seed puede desincronizarse del otro.
 *
 * La usa tanto la raíz JSON (escribe una instantánea) como la raíz de
 * PostgreSQL (inserta la primera fila de cada tabla), así que ambos almacenes
 * arrancan con exactamente la misma tienda.
 */
export function crearSemillaServidor(generarHash: VerificadorDeClaves): GeneradorSemilla {
  return async (): Promise<InstantaneaTienda> => {
    const categorias = crearCategoriasSemilla().map((categoria) => categoria.aDatos());

    const cuentas = {
      administrador: USUARIOS_SEMILLA.find((usuario) => usuario.id === 1),
      usuarioDemo: USUARIOS_SEMILLA.find((usuario) => usuario.id === 2),
    };
    if (!cuentas.administrador || !cuentas.usuarioDemo) {
      throw new Error('La semilla necesita las cuentas de demostración.');
    }

    const credenciales: CredencialPersistida[] = [
      {
        usuarioId: cuentas.administrador.id,
        email: cuentas.administrador.email,
        rol: UserRole.Admin,
        hashClave: await generarHash.generar('admin123'),
      },
      {
        usuarioId: cuentas.usuarioDemo.id,
        email: cuentas.usuarioDemo.email,
        rol: UserRole.Cliente,
        hashClave: await generarHash.generar('cliente123'),
      },
    ];

    const configuracion = crearConfiguracionSemilla();

    return {
      version: VERSION_ACTUAL,
      productos: CATALOGO_SEMILLA.map((producto) => ProductoFabric.aPersisted(producto)),
      pedidos: crearPedidosSemilla().map((pedido) => pedido.aPersistido()),
      usuarios: crearUsuariosSemilla().map((usuario) => usuario.aPersistido()),
      credenciales,
      categorias,
      reportes: crearReportesSemilla().map((reporte) => ({
        periodo: reporte.periodo,
        rangoFechas: reporte.rangoFechas,
        totalPedidos: reporte.totalPedidos,
        ventas: reporte.ventas.valor,
        cerrado: reporte.cerrado,
      })),
      configuracion: {
        nombreTienda: configuracion.nombreTienda,
        costoEnvio: configuracion.costoEnvio.valor,
        emailContacto: configuracion.emailContacto.valor,
      },
    };
  };
}

export interface ServiciosServidor {
  readonly catalogo: CatalogoService;
  readonly productos: ProductoAdminService;
  readonly pedidos: PedidoAdminService;
  readonly usuarios: UsuarioAdminService;
  readonly categorias: CategoriaAdminService;
  readonly reportes: ReporteService;
  readonly configuracion: ConfiguracionTiendaService;
  readonly dashboard: DashboardService;
  readonly autenticacion: AutenticacionToken;
  /** Vigencia de la cookie; la cookie debe vivir al menos tanto como el token. */
  readonly duracionDeSesionMs: number;
}

/**
 * Raíz de composición del servidor.
 *
 * Dependiendo de la configuración se compone con un almacén u otro:
 *
 *  - Con `DATABASE_URL` → adaptadores de **PostgreSQL**.
 *  - Sin `DATABASE_URL` → adaptadores de **archivo JSON** (desarrollo y
 *    pruebas sin levantar una base).
 *
 * Es la contraparte de `application/compositionRoot.ts`: allí los puertos se
 * resuelven con adaptadores HTTP para el navegador. Los casos de uso son los
 * mismos en los tres, lo que confirma que las dependencias apuntan hacia las
 * abstracciones.
 *
 * El resultado se memoriza a nivel de módulo: crear un `EstadoServidor` o una
 * conexión por petición descartaría la caché y escribiría en cada request.
 */
let servicios: ServiciosServidor | undefined;

export function serviciosServidor(): ServiciosServidor {
  if (servicios) {
    return servicios;
  }
  servicios = process.env.DATABASE_URL
    ? crearServiciosConPostgres()
    : crearServiciosConArchivo();
  return servicios;
}

function crearServiciosConArchivo(): ServiciosServidor {
  const { claves, duracionDeSesionMs } = baseComun();
  const estado = new EstadoServidor(
    crearSemillaServidor(claves),
    path.join(process.cwd(), process.env.DATA_DIR ?? '.data', 'tienda.json'),
  );

  return componer(
    new JsonProductCatalogRepository(estado),
    new JsonOrderRepository(estado),
    new JsonUserRepository(estado),
    new JsonCategoryRepository(estado),
    new JsonReportRepository(estado),
    new JsonStoreSettingsRepository(estado),
    new JsonCredentialsGateway(estado),
    claves,
    tokens(duracionDeSesionMs),
    duracionDeSesionMs,
  );
}

function crearServiciosConPostgres(): ServiciosServidor {
  const { claves, duracionDeSesionMs } = baseComun();
  const base = new BasePg(crearSemillaServidor(claves));

  return componer(
    new PgProductCatalogRepository(base),
    new PgOrderRepository(base),
    new PgUserRepository(base),
    new PgCategoryRepository(base),
    new PgReportRepository(base),
    new PgStoreSettingsRepository(base),
    new PgCredentialsGateway(base),
    claves,
    tokens(duracionDeSesionMs),
    duracionDeSesionMs,
  );
}

/** Datos compartidos por las dos raíces: hasher y vigencia de la cookie. */
function baseComun(): { claves: BcryptKeyHasher; duracionDeSesionMs: number } {
  return {
    claves: new BcryptKeyHasher(),
    duracionDeSesionMs: leerDuracionDeToken(process.env.JWT_EXPIRES_IN),
  };
}

function tokens(duracionDeSesionMs: number): JwtTokenIssuer {
  return new JwtTokenIssuer({
    secreto: process.env.JWT_SECRET ?? '',
    expiraEnMilisegundos: duracionDeSesionMs,
  });
}

/**
 * Ensambla los mismos casos de uso alrededor de un conjunto de adaptadores.
 * Que esta función sea una sola para JSON y PostgreSQL es la prueba de que
 * el servidor no sabe qué almacén usa.
 */
function componer(
  productos: JsonProductCatalogRepository | PgProductCatalogRepository,
  pedidos: JsonOrderRepository | PgOrderRepository,
  usuarios: JsonUserRepository | PgUserRepository,
  categorias: JsonCategoryRepository | PgCategoryRepository,
  reportes: JsonReportRepository | PgReportRepository,
  configuracion: JsonStoreSettingsRepository | PgStoreSettingsRepository,
  credenciales: JsonCredentialsGateway | PgCredentialsGateway,
  claves: BcryptKeyHasher,
  emisorDeTokens: JwtTokenIssuer,
  duracionDeSesionMs: number,
): ServiciosServidor {
  return {
    duracionDeSesionMs,
    catalogo: new CatalogoService(productos),
    productos: new ProductoAdminService(productos),
    pedidos: new PedidoAdminService(pedidos),
    usuarios: new UsuarioAdminService(usuarios),
    categorias: new CategoriaAdminService(categorias),
    reportes: new ReporteService(reportes),
    configuracion: new ConfiguracionTiendaService(configuracion),
    dashboard: new DashboardService(productos, reportes),
    autenticacion: new AutenticacionToken(credenciales, claves, emisorDeTokens, usuarios),
  };
}