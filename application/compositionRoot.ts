import { PriceFormatter } from '@/presentation/store/PriceFormatter';
import { WhatsAppLinkBuilder } from '@/presentation/store/WhatsAppLinkBuilder';
import { CatalogoService } from '@/application/catalog/CatalogoService';
import { ProductoAdminService } from '@/application/catalog/ProductoAdminService';
import { PedidoAdminService } from '@/application/orders/PedidoAdminService';
import { UsuarioAdminService } from '@/application/users/UsuarioAdminService';
import { CategoriaAdminService } from '@/application/tienda/CategoriaAdminService';
import { ReporteService } from '@/application/tienda/ReporteService';
import { ConfiguracionTiendaService } from '@/application/tienda/ConfiguracionTiendaService';
import { DashboardService } from '@/application/dashboard/DashboardService';
import { AutenticacionSesion } from '@/application/auth/AutenticacionSesion';
import { HttpProductCatalogRepository } from '@/infrastructure/http/HttpProductCatalogRepository';
import { HttpOrderRepository } from '@/infrastructure/http/HttpOrderRepository';
import { HttpUserRepository } from '@/infrastructure/http/HttpUserRepository';
import {
  HttpCategoryRepository,
  HttpReportRepository,
  HttpStoreSettingsRepository,
} from '@/infrastructure/http/HttpTiendaRepositories';
import {
  HttpAuthenticationGateway,
  SesionHttp,
} from '@/infrastructure/http/HttpAuthenticationGateway';

/**
 * Raíz de composición del navegador (Composition Root).
 *
 * Aquí se decide **qué implementación** de cada puerto se usa, y el resto del
 * sistema solo conoce las interfaces. Es el único lugar donde se mentions que
 * el catálogo del navegador vive en la API y no en un array.
 *
 * Antes estos adaptadores eran `InMemory*`, con una semilla de 35 productos en
 * `TiendaEstado`. Eso hacía que el panel pareciera funcionar mientras sus
 * cambios se perdían al recargar, y que la página de detalle y la de listado
 * pudieran mostrar precios distintos. Ahora el navegador habla con los mismos
 * endpoints que consume el panel, de modo que lo que se ve es lo que está
 * guardado en el archivo del servidor.
 *
 * Los adaptadores en memoria siguen existiendo para las pruebas, que no
 * necesitan un servidor: por eso los casos de uso pueden verificarse sin
 * levantar nada.
 */
const productCatalogRepo = new HttpProductCatalogRepository();
const orderRepo = new HttpOrderRepository();
const userRepo = new HttpUserRepository();
const categoryRepo = new HttpCategoryRepository();
const reportRepo = new HttpReportRepository();
const settingsRepo = new HttpStoreSettingsRepository();
const authGateway = new HttpAuthenticationGateway();
const authSession = new SesionHttp();

const priceFormatter = new PriceFormatter();
const whatsappLinkBuilder = new WhatsAppLinkBuilder(priceFormatter, '573003256891');

export const catalogoService = new CatalogoService(productCatalogRepo);
export const productoAdminService = new ProductoAdminService(productCatalogRepo);
export const pedidoAdminService = new PedidoAdminService(orderRepo);
export const usuarioAdminService = new UsuarioAdminService(userRepo);
export const categoriaAdminService = new CategoriaAdminService(categoryRepo);
export const reporteService = new ReporteService(reportRepo);
export const configuracionTiendaService = new ConfiguracionTiendaService(settingsRepo);
export const dashboardService = new DashboardService(productCatalogRepo, reportRepo);
export const authenticationService = new AutenticacionSesion(authGateway, authSession);

/**
 * La sesión se expone porque `Navbar` necesita suscribirse a sus cambios
 * (`useSyncExternalStore`). Es un adaptador de infraestructura, no un caso de
 * uso, por eso no se mezcla con el resto.
 */
export { authSession as sesion };

export const presentacion = {
  priceFormatter,
  whatsappLinkBuilder,
} as const;
