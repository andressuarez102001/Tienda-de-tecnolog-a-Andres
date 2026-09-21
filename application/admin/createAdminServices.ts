import { CategoryAdminService } from '@/application/admin/CategoryAdminService';
import { DashboardMetricsService } from '@/application/admin/DashboardMetricsService';
import { OrderAdminService } from '@/application/admin/OrderAdminService';
import { ProductAdminService } from '@/application/admin/ProductAdminService';
import { StoreConfigService } from '@/application/admin/StoreConfigService';
import { UserAdminService } from '@/application/admin/UserAdminService';
import { InMemoryAdminStateRepository } from '@/infrastructure/admin/InMemoryAdminStateRepository';

/**
 * Raíz de composición: un repositorio compartido y un servicio por dominio.
 * Cada servicio tiene una única responsabilidad (SRP).
 */
const adminStateRepository = new InMemoryAdminStateRepository();

export const productAdminService = new ProductAdminService(adminStateRepository);
export const orderAdminService = new OrderAdminService(adminStateRepository);
export const userAdminService = new UserAdminService(adminStateRepository);
export const categoryAdminService = new CategoryAdminService(adminStateRepository);
export const dashboardMetricsService = new DashboardMetricsService(adminStateRepository);
export const storeConfigService = new StoreConfigService(adminStateRepository);