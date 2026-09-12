import { AdminManagementService } from '@/application/admin/AdminManagementService';
import { InMemoryAdminStateRepository } from '@/infrastructure/admin/InMemoryAdminStateRepository';

/** Singleton de composición para que la UI no cree servicios durante un render. */
export const adminManagementService = new AdminManagementService(new InMemoryAdminStateRepository());
