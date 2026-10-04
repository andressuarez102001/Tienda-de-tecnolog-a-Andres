import type { OrderRepository } from '@/domain/orders/contracts';
import type { Pedido } from '@/domain/orders/Pedido';
import type { EstadoServidor } from './EstadoServidor';

export class JsonOrderRepository implements OrderRepository {
  constructor(private readonly estado: EstadoServidor) {}

  async listar(): Promise<ReadonlyArray<Pedido>> {
    const { pedidos } = await this.estado.estado();
    return [...pedidos].sort((a, b) => b.id - a.id);
  }

  async obtenerPorId(id: number): Promise<Pedido | undefined> {
    const { pedidos } = await this.estado.estado();
    return pedidos.find((pedido) => pedido.id === id);
  }

  async actualizar(id: number, pedido: Pedido): Promise<Pedido> {
    await this.estado.transact((estado) => {
      if (!estado.pedidos.some((p) => p.id === id)) {
        throw new Error(`El pedido con id ${id} no existe.`);
      }
      estado.pedidos = estado.pedidos.map((p) => (p.id === id ? pedido : p));
      return { valor: undefined, persistir: true };
    });
    return pedido;
  }
}