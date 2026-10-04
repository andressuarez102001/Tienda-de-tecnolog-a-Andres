import type { CategoryRepository } from '@/domain/tienda/contracts';
import type { Categoria } from '@/domain/tienda/Categoria';
import type { BasePg } from './BasePg';
import { categoriaDesdeFila } from './Filas';

export class PgCategoryRepository implements CategoryRepository {
  constructor(private readonly base: BasePg) {}

  async listar(): Promise<ReadonlyArray<Categoria>> {
    const filas = await this.base.consulta(
      `SELECT id, nombre FROM categorias ORDER BY nombre`,
    );
    return filas.map(categoriaDesdeFila);
  }

  async crear(nombre: string): Promise<Categoria> {
    const { filas } = await this.base.ejecutar(
      `INSERT INTO categorias (nombre) VALUES ($1) RETURNING id, nombre`,
      [nombre],
    );
    return categoriaDesdeFila(filas[0]);
  }

  async eliminar(id: number): Promise<void> {
    const { afectadas } = await this.base.ejecutar(`DELETE FROM categorias WHERE id = $1`, [id]);
    if (afectadas === 0) {
      throw new Error(`La categoría con id ${id} no existe.`);
    }
  }
}