import type { AdminStateRepository } from '@/domain/admin/contracts';
import { type Order, type OrderStatus } from '@/domain/admin/entities';

/**
 * Responsabilidad única: gestión del flujo de pedidos y sus estados.
 */
export class OrderAdminService {
  constructor(private readonly repository: AdminStateRepository) {}

  loadInitialState(): { pedidos: Order[] } {
    return { pedidos: this.repository.load().pedidos };
  }

  changeOrderStatus(pedidos: Order[], id: number, status: OrderStatus): Order[] {
    return pedidos.map((order) => order.id === id ? order.changeStatus(status) : order);
  }
}