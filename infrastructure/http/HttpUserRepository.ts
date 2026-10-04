import type { UserRepository } from '@/domain/users/contracts';
import type { Usuario } from '@/domain/users/Usuario';
import { clienteApi, segmento } from './ClienteApi';
import { usuarioDesdeJson } from './Deserializadores';

/**
 * Usuarios por HTTP.
 *
 * La API expone "alternar estado" (habilitar/bloquear): un `PATCH` sin cuerpo
 * que invierte el estado actual. El puerto manda el estado **absoluto** que
 * debe quedar persistido, así que aquí se comparan estados y solo se llama a
 * la API cuando realmente difieren; de lo contrario, dos `PATCH` seguidos
 * volverían al estado original.
 */
export class HttpUserRepository implements UserRepository {
  async listar(): Promise<ReadonlyArray<Usuario>> {
    const cuerpo = await clienteApi.obtener<{ usuarios: unknown[] }>('/api/admin/usuarios');
    return cuerpo.usuarios.map(usuarioDesdeJson);
  }

  async obtenerPorId(id: number): Promise<Usuario | undefined> {
    // El endpoint de detalle no existe: son 2-3 cuentas de administración. Se
    // filtran en el cliente para no añadir un endpoint que solo existiría para
    // esto.
    return (await this.listar()).find((usuario) => usuario.id === id);
  }

  async actualizar(id: number, usuario: Usuario): Promise<Usuario> {
    const previo = (await this.listar()).find((u) => u.id === id);
    if (previo && previo.estado !== usuario.estado) {
      await clienteApi.actualizar(`/api/admin/usuarios/${segmento(String(id))}`, {});
    }
    return usuario;
  }
}