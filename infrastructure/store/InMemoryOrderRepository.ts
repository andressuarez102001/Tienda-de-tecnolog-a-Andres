import type { OrderRepository } from '@/domain/orders/contracts';
import type { Pedido } from '@/domain/orders/Pedido';
import { copia, type TiendaEstado } from './TiendaEstado';

/** Pedidos en memoria (solo para pruebas): el panel solo los mueve de estado. */
export class InMemoryOrderRepository implements OrderRepository {
  constructor(private readonly estado: TiendaEstado) {}

  async listar(): Promise<ReadonlyArray<Pedido>> {
    return copia(this.estado.pedidos).sort((a, b) => b.id - a.id);
  }

  async obtenerPorId(id: number): Promise<Pedido | undefined> {
    return this.estado.pedidos.find((pedido) => pedido.id === id);
  }

  async actualizar(id: number, pedido: Pedido): Promise<Pedido> {
    if (!this.estado.pedidos.some((p) => p.id === id)) {
      throw new Error(`El pedido con id ${id} no existe.`);
    }
    this.estado.pedidos = this.estado.pedidos.map((p) => (p.id === id ? pedido : p));
    return pedido;
  }
}