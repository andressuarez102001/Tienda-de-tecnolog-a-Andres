import type { AdminStateRepository } from '@/domain/admin/contracts';
import { Category, type ProductDraft, Product } from '@/domain/admin/entities';

/**
 * Responsabilidad única: gestión del inventario de productos
 * (crear, editar, eliminar y filtrar).
 */
export class ProductAdminService {
  constructor(private readonly repository: AdminStateRepository) {}

  loadInitialState(): { productos: Product[]; categorias: Category[] } {
    const state = this.repository.load();
    return { productos: state.productos, categorias: state.categorias };
  }

  saveProduct(products: Product[], draft: ProductDraft, editingId: number | null): Product[] {
    if (editingId !== null) return products.map((product) => product.id === editingId ? product.update(draft) : product);
    const nextId = products.length ? Math.max(...products.map((product) => product.id)) + 1 : 1;
    return [...products, Product.create(nextId, draft)];
  }

  removeProduct(products: Product[], id: number): Product[] {
    return products.filter((product) => product.id !== id);
  }

  filterProducts(products: Product[], category: string, search: string): Product[] {
    return products.filter((product) => (category === 'Todas' || product.categoria === category) && product.nombre.toLowerCase().includes(search.toLowerCase()));
  }
}