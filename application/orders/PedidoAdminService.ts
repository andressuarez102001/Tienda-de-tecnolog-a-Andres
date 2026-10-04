import type { OrderRepository } from '@/domain/orders/contracts';
import type { Pedido } from '@/domain/orders/Pedido';
import { OrderStatus } from '@/domain/shared/enums';

/**
 * Caso de uso de administración de pedidos.
 *
 * Depende del puerto estrecho `OrderRepository`. Usa el patrón State de la
 * entidad para que solo se permitan transiciones válidas: el servicio no
 * tiene un `switch` gigante con reglas, esas reglas viven en el dominio.
 *
 * SRP: únicamente cambia estados, no calcula reportes.
 */
export class PedidoAdminService {
  constructor(private readonly pedidos: OrderRepository) {}

  async listar(): Promise<ReadonlyArray<Pedido>> {
    return this.pedidos.listar();
  }

  async cambiarEstado(id: number, destino: OrderStatus): Promise<Pedido> {
    const orden = await this.pedidos.obtenerPorId(id);
    if (!orden) {
      throw new Error(`El pedido con id ${id} no existe.`);
    }
    return this.pedidos.actualizar(id, orden.cambiarEstado(destino));
  }
}