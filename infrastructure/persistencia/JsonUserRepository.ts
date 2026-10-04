import type { UserRepository } from '@/domain/users/contracts';
import type { Usuario } from '@/domain/users/Usuario';
import type { EstadoServidor } from './EstadoServidor';

export class JsonUserRepository implements UserRepository {
  constructor(private readonly estado: EstadoServidor) {}

  async listar(): Promise<ReadonlyArray<Usuario>> {
    const { usuarios } = await this.estado.estado();
    return [...usuarios];
  }

  async obtenerPorId(id: number): Promise<Usuario | undefined> {
    const { usuarios } = await this.estado.estado();
    return usuarios.find((usuario) => usuario.id === id);
  }

  async actualizar(id: number, usuario: Usuario): Promise<Usuario> {
    await this.estado.transact((estado) => {
      if (!estado.usuarios.some((u) => u.id === id)) {
        throw new Error(`El usuario con id ${id} no existe.`);
      }
      estado.usuarios = estado.usuarios.map((u) => (u.id === id ? usuario : u));
      return { valor: undefined, persistir: true };
    });
    return usuario;
  }
}