import type { AdminStateRepository } from '@/domain/admin/contracts';
import { Category } from '@/domain/admin/entities';

/**
 * Responsabilidad única: gestión del catálogo de categorías.
 */
export class CategoryAdminService {
  constructor(private readonly repository: AdminStateRepository) {}

  loadInitialState(): { categorias: Category[] } {
    return { categorias: this.repository.load().categorias };
  }

  addCategory(categorias: Category[], nombre: string): Category[] {
    return nombre.trim() ? [...categorias, new Category(Date.now(), nombre)] : categorias;
  }

  removeCategory(categorias: Category[], id: number): Category[] {
    return categorias.filter((category) => category.id !== id);
  }
}