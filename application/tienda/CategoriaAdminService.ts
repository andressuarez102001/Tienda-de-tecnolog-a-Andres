import type { CategoryRepository } from '@/domain/tienda/contracts';
import type { Categoria } from '@/domain/tienda/Categoria';

/**
 * Caso de uso de administración de categorías.
 *
 * El identificador numérico lo asigna el almacén (una secuencia en la base de
 * datos o en el archivo), no el caso de uso: `crear(nombre)` devuelve la
 * categoría ya persistida con su id real. Así el adaptador de PostgreSQL
 * puede usar `BIGSERIAL` y el de HTTP el id que asigna el servidor, sin que
 * este servicio tenga que calcular `Date.now()` ni `max(id) + 1`.
 */
export class CategoriaAdminService {
  constructor(private readonly categorias: CategoryRepository) {}

  async listar(): Promise<ReadonlyArray<Categoria>> {
    return this.categorias.listar();
  }

  async crear(nombre: string): Promise<Categoria> {
    const limpia = nombre.trim();
    if (!limpia) {
      throw new Error('La categoría debe tener nombre.');
    }
    return this.categorias.crear(limpia);
  }

  async eliminar(id: number): Promise<void> {
    const actuales = await this.categorias.listar();
    if (!actuales.some((c) => c.id === id)) {
      throw new Error(`La categoría con id ${id} no existe.`);
    }
    await this.categorias.eliminar(id);
  }
}