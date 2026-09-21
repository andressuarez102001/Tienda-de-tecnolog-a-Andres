import type { AdminStateRepository } from '@/domain/admin/contracts';
import type { User } from '@/domain/admin/entities';

/**
 * Responsabilidad única: gestión de cuentas de usuario (activo/bloqueado).
 */
export class UserAdminService {
  constructor(private readonly repository: AdminStateRepository) {}

  loadInitialState(): { usuarios: User[] } {
    return { usuarios: this.repository.load().usuarios };
  }

  toggleUserStatus(usuarios: User[], id: number): User[] {
    return usuarios.map((user) => user.id === id ? user.toggleStatus() : user);
  }
}