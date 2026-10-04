import type { UserRepository } from '@/domain/users/contracts';
import type { Usuario } from '@/domain/users/Usuario';
import type { BasePg } from './BasePg';
import { usuarioDesdeFila } from './Filas';

const COLUMNAS = `id, nombre, email, rol, estado`;

export class PgUserRepository implements UserRepository {
  constructor(private readonly base: BasePg) {}

  async listar(): Promise<ReadonlyArray<Usuario>> {
    const filas = await this.base.consulta(`SELECT ${COLUMNAS} FROM usuarios`);
    return filas.map(usuarioDesdeFila);
  }

  async obtenerPorId(id: number): Promise<Usuario | undefined> {
    const filas = await this.base.consulta(`SELECT ${COLUMNAS} FROM usuarios WHERE id = $1`, [id]);
    return filas.length > 0 ? usuarioDesdeFila(filas[0]) : undefined;
  }

  async actualizar(id: number, usuario: Usuario): Promise<Usuario> {
    const { afectadas } = await this.base.ejecutar(
      `UPDATE usuarios SET estado = $2 WHERE id = $1`,
      [id, usuario.estado],
    );
    if (afectadas === 0) {
      throw new Error(`El usuario con id ${id} no existe.`);
    }
    return usuario;
  }
}