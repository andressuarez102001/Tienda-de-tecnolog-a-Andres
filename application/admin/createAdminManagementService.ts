import { AdminManagementService } from '@/application/admin/AdminManagementService';
import { InMemoryAdminStateRepository } from '@/infrastructure/admin/InMemoryAdminStateRepository';

/** Punto de composición: cambia aquí el repositorio, no las pantallas. */
export const createAdminManagementService = () => new AdminManagementService(new InMemoryAdminStateRepository());
