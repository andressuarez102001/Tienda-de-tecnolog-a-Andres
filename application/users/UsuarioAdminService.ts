import type { UserRepository } from '@/domain/users/contracts';
import type { Usuario } from '@/domain/users/Usuario';

/**
 * Caso de uso de administración de usuarios.
 *
 * Inmutable: `alternarEstado` devuelve un nuevo `Usuario` y el repositorio
 * persiste solo esa fila. No modifica el objeto existente.
 */
export class UsuarioAdminService {
  constructor(private readonly usuarios: UserRepository) {}

  async listar(): Promise<ReadonlyArray<Usuario>> {
    return this.usuarios.listar();
  }

  async alternarEstado(id: number): Promise<Usuario> {
    const usuario = await this.usuarios.obtenerPorId(id);
    if (!usuario) {
      throw new Error(`El usuario con id ${id} no existe.`);
    }
    return this.usuarios.actualizar(id, usuario.alternarEstado());
  }
}