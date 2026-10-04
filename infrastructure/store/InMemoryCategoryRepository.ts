import type { CategoryRepository } from '@/domain/tienda/contracts';
import { Categoria } from '@/domain/tienda/Categoria';
import { copia, type TiendaEstado } from './TiendaEstado';

/**
 * Categorías en memoria (solo para pruebas).
 *
 * El id lo asigna aquí (máximo + 1) igual que lo asignará la secuencia en
 * PostgreSQL: el caso de uso ya no adivina ids, el almacén es la autoridad.
 */
export class InMemoryCategoryRepository implements CategoryRepository {
  constructor(private readonly estado: TiendaEstado) {}

  async listar(): Promise<ReadonlyArray<Categoria>> {
    return copia(this.estado.categorias).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }

  async crear(nombre: string): Promise<Categoria> {
    const siguiente = Math.max(0, ...this.estado.categorias.map((c) => c.id)) + 1;
    const categoria = Categoria.crear(siguiente, nombre);
    this.estado.categorias = [...this.estado.categorias, categoria];
    return categoria;
  }

  async eliminar(id: number): Promise<void> {
    const restantes = this.estado.categorias.filter((c) => c.id !== id);
    if (restantes.length === this.estado.categorias.length) {
      throw new Error(`La categoría con id ${id} no existe.`);
    }
    this.estado.categorias = restantes;
  }
}