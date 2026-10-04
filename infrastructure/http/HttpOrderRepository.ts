import type { OrderRepository } from '@/domain/orders/contracts';
import type { Pedido } from '@/domain/orders/Pedido';
import { clienteApi, segmento } from './ClienteApi';
import { pedidoDesdeJson } from './Deserializadores';

/**
 * Pedidos por HTTP.
 *
 * La única mutación que permite el negocio es mover el estado, y la API lo
 * expone así: `PATCH /api/admin/pedidos/:id/estado`. El caso de uso entrega
 * el pedido ya rehidratado con su nuevo estado; aquí eso se traduce a ese
 * `PATCH`, que es quien revalida la transición en el dominio del servidor.
 */
export class HttpOrderRepository implements OrderRepository {
  async listar(): Promise<ReadonlyArray<Pedido>> {
    const cuerpo = await clienteApi.obtener<{ pedidos: unknown[] }>('/api/admin/pedidos');
    return cuerpo.pedidos.map(pedidoDesdeJson);
  }

  async obtenerPorId(id: number): Promise<Pedido | undefined> {
    return (await this.listar()).find((pedido) => pedido.id === id);
  }

  async actualizar(id: number, pedido: Pedido): Promise<Pedido> {
    await clienteApi.actualizar(
      `/api/admin/pedidos/${segmento(String(id))}/estado`,
      { estado: pedido.estado },
    );
    return pedido;
  }
}