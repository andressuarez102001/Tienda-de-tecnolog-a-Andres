import type { AdminState, AdminStateRepository } from '@/domain/admin/contracts';
import { Category, type OrderStatus, type ProductDraft, Product } from '@/domain/admin/entities';

export class AdminManagementService {
  constructor(private readonly repository: AdminStateRepository) {}

  loadInitialState(): AdminState { return this.repository.load(); }
  saveProduct(products: Product[], draft: ProductDraft, editingId: number | null): Product[] {
    if (editingId !== null) return products.map((product) => product.id === editingId ? product.update(draft) : product);
    const nextId = products.length ? Math.max(...products.map((product) => product.id)) + 1 : 1;
    return [...products, Product.create(nextId, draft)];
  }
  removeProduct(products: Product[], id: number): Product[] { return products.filter((product) => product.id !== id); }
  changeOrderStatus(state: AdminState['pedidos'], id: number, status: OrderStatus) { return state.map((order) => order.id === id ? order.changeStatus(status) : order); }
  toggleUserStatus(users: AdminState['usuarios'], id: number) { return users.map((user) => user.id === id ? user.toggleStatus() : user); }
  addCategory(categories: AdminState['categorias'], nombre: string) { return nombre.trim() ? [...categories, new Category(Date.now(), nombre)] : categories; }
  removeCategory(categories: AdminState['categorias'], id: number) { return categories.filter((category) => category.id !== id); }
  filterProducts(products: Product[], category: string, search: string) { return products.filter((product) => (category === 'Todas' || product.categoria === category) && product.nombre.toLowerCase().includes(search.toLowerCase())); }
  dashboard(products: Product[], reports: AdminState['reportesPeriodos']) { return { totalMesVentas: reports.reduce((sum, report) => sum + report.ventas, 0), totalPedidosMes: reports.reduce((sum, report) => sum + report.totalPedidos, 0), valorTotalInventario: products.reduce((sum, product) => sum + product.valorEnInventario(), 0), productosCriticos: products.filter((product) => product.necesitaReposicion()), totalUnidadesStock: products.reduce((sum, product) => sum + product.stock, 0) }; }
}
