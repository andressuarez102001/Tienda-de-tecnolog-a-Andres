import type { CategoryRepository } from '@/domain/tienda/contracts';
import { Categoria } from '@/domain/tienda/Categoria';
import type { EstadoServidor } from './EstadoServidor';

export class JsonCategoryRepository implements CategoryRepository {
  constructor(private readonly estado: EstadoServidor) {}

  async listar(): Promise<ReadonlyArray<Categoria>> {
    const { categorias } = await this.estado.estado();
    return [...categorias].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }

  async crear(nombre: string): Promise<Categoria> {
    return this.estado.transact((estado) => {
      const siguiente = Math.max(0, ...estado.categorias.map((c) => c.id)) + 1;
      const categoria = Categoria.crear(siguiente, nombre);
      estado.categorias = [...estado.categorias, categoria];
      return { valor: categoria, persistir: true };
    });
  }

  async eliminar(id: number): Promise<void> {
    await this.estado.transact((estado) => {
      const restantes = estado.categorias.filter((c) => c.id !== id);
      if (restantes.length === estado.categorias.length) {
        throw new Error(`La categoría con id ${id} no existe.`);
      }
      estado.categorias = restantes;
      return { valor: undefined, persistir: true };
    });
  }
}