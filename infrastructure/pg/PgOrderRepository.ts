import type { OrderRepository } from '@/domain/orders/contracts';
import type { Pedido } from '@/domain/orders/Pedido';
import type { BasePg } from './BasePg';
import { pedidoDesdeFila } from './Filas';

const COLUMNAS = `id, cliente, fecha, producto, cantidad, metodo_pago AS "metodoPago", estado`;

export class PgOrderRepository implements OrderRepository {
  constructor(private readonly base: BasePg) {}

  async listar(): Promise<ReadonlyArray<Pedido>> {
    const filas = await this.base.consulta(`SELECT ${COLUMNAS} FROM pedidos ORDER BY id DESC`);
    return filas.map(pedidoDesdeFila);
  }

  async obtenerPorId(id: number): Promise<Pedido | undefined> {
    const filas = await this.base.consulta(`SELECT ${COLUMNAS} FROM pedidos WHERE id = $1`, [id]);
    return filas.length > 0 ? pedidoDesdeFila(filas[0]) : undefined;
  }

  async actualizar(id: number, pedido: Pedido): Promise<Pedido> {
    const { afectadas } = await this.base.ejecutar(
      `UPDATE pedidos SET estado = $2 WHERE id = $1`,
      [id, pedido.nombreEstado],
    );
    if (afectadas === 0) {
      throw new Error(`El pedido con id ${id} no existe.`);
    }
    return pedido;
  }
}