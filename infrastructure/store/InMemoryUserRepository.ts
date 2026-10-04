import type { UserRepository } from '@/domain/users/contracts';
import type { Usuario } from '@/domain/users/Usuario';
import { copia, type TiendaEstado } from './TiendaEstado';

/** Usuarios en memoria (solo para pruebas). */
export class InMemoryUserRepository implements UserRepository {
  constructor(private readonly estado: TiendaEstado) {}

  async listar(): Promise<ReadonlyArray<Usuario>> {
    return copia(this.estado.usuarios);
  }

  async obtenerPorId(id: number): Promise<Usuario | undefined> {
    return this.estado.usuarios.find((usuario) => usuario.id === id);
  }

  async actualizar(id: number, usuario: Usuario): Promise<Usuario> {
    if (!this.estado.usuarios.some((u) => u.id === id)) {
      throw new Error(`El usuario con id ${id} no existe.`);
    }
    this.estado.usuarios = this.estado.usuarios.map((u) => (u.id === id ? usuario : u));
    return usuario;
  }
}