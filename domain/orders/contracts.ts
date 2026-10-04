import type { Pedido } from './Pedido';

/**
 * Puerto estrecho para el agregado de pedidos (antes parte del
 * `AdminStateRepository`).
 *
 * Los pedidos son hechos de negocio: se crean desde el telégrafo de WhatsApp
 * y el panel solo los mueve de estado, nunca los crea ni los borra. Por eso
 * este puerto no tiene `crear` ni `eliminar`: un pedido que ya ocurrió no se
 * deshace.
 *
 * Asíncrono por la misma razón que el catálogo: el adaptador puede estar
 * detrás de una API o de una base de datos.
 */
export interface OrderRepository {
  listar(): Promise<ReadonlyArray<Pedido>>;
  obtenerPorId(id: number): Promise<Pedido | undefined>;
  actualizar(id: number, pedido: Pedido): Promise<Pedido>;
}