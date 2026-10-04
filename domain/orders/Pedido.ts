import { Dinero } from '@/domain/shared/Dinero';
import { PaymentMethod, OrderStatus } from '@/domain/shared/enums';
import type { Product } from '@/domain/catalog/Producto';
import { ProductoFabric, type ProductPersisted } from '@/domain/catalog/ProductoFabric';
import { estadoDe, type EstadoPedido } from './EstadoPedido';

export interface OrderData {
  readonly id: number;
  readonly cliente: string;
  readonly fecha: string;
  readonly producto: Product;
  readonly cantidad: number;
  readonly metodoPago: PaymentMethod;
  readonly estado: EstadoPedido;
}

/**
 * Forma serializable de `Pedido`.
 *
 * El estado se guarda como el **nombre** del enum y no como la clase: en
 * memoria solo hay cuatro instancias registradas en `EstadoPedido`, y al
 * rehidratar se vuelve a pedir esa instancia con `estadoDe(valor)`. Guardar
 * la clase entera en el JSON produciría datos que no se pueden revisar ni
 * migrar a mano.
 */
export interface PedidoPersistido {
  readonly id: number;
  readonly cliente: string;
  readonly fecha: string;
  readonly producto: ProductPersisted;
  readonly cantidad: number;
  readonly metodoPago: PaymentMethod;
  readonly estado: OrderStatus;
}

/**
 * Entidad Pedido.
 *
 * El total no se guarda: se **deriva** del producto y la cantidad mediante
 * `producto.cotizar(cantidad)`. Así es imposible que el total guardado se
 * desincronice del producto, y el costo de envío se resuelve por
 * polimorfismo según si el producto es físico o digital.
 *
 * Inmutable: `cambiarEstado` devuelve un pedido nuevo.
 */
export class Pedido {
  private readonly orderId: number;
  private readonly customerName: string;
  private readonly orderDate: string;
  private readonly orderedProduct: Product;
  private readonly orderQuantity: number;
  private readonly orderPaymentMethod: PaymentMethod;
  private readonly orderStatus: EstadoPedido;

  constructor(datos: OrderData) {
    if (!Number.isInteger(datos.id) || datos.id < 1) {
      throw new Error('El identificador del pedido no es válido.');
    }
    if (!datos.cliente.trim()) {
      throw new Error('El pedido debe tener un cliente.');
    }
    if (!datos.fecha.trim() || Number.isNaN(Date.parse(datos.fecha))) {
      throw new Error('La fecha del pedido no es válida.');
    }
    if (!Number.isInteger(datos.cantidad) || datos.cantidad < 1) {
      throw new Error('La cantidad del pedido no es válida.');
    }
    this.orderId = datos.id;
    this.customerName = datos.cliente.trim();
    this.orderDate = datos.fecha;
    this.orderedProduct = datos.producto;
    this.orderQuantity = datos.cantidad;
    this.orderPaymentMethod = datos.metodoPago;
    this.orderStatus = datos.estado;
  }

  /**
   * Constructor nombrado: valida que la cantidad exista en inventario
   * antes de dejar existir el pedido.
   */
  static crear(
    id: number,
    cliente: string,
    fecha: string,
    producto: Product,
    cantidad: number,
    metodoPago: PaymentMethod,
  ): Pedido {
    producto.totalPedido(cantidad);
    return new Pedido({
      id,
      cliente,
      fecha,
      producto,
      cantidad,
      metodoPago,
      estado: estadoDe(OrderStatus.Pendiente),
    });
  }

  static desde(datos: OrderData): Pedido {
    return new Pedido(datos);
  }

  /**
   * Rehidratación desde el almacén. El producto se reconstruye con
   * `ProductoFabric.desdeDatos` para que un pedido guardado siga siendo
   * `ProductoFisico` o `ProductoDigital` y siga cobrando el envío correcto.
   */
  static restaurar(datos: PedidoPersistido): Pedido {
    return new Pedido({
      id: datos.id,
      cliente: datos.cliente,
      fecha: datos.fecha,
      producto: ProductoFabric.desdeDatos(datos.producto),
      cantidad: datos.cantidad,
      metodoPago: datos.metodoPago,
      estado: estadoDe(datos.estado),
    });
  }

  get id(): number {
    return this.orderId;
  }
  get cliente(): string {
    return this.customerName;
  }
  get fecha(): string {
    return this.orderDate;
  }
  get producto(): Product {
    return this.orderedProduct;
  }
  get cantidad(): number {
    return this.orderQuantity;
  }
  get metodoPago(): PaymentMethod {
    return this.orderPaymentMethod;
  }
  get estado(): EstadoPedido {
    return this.orderStatus;
  }
  get nombreEstado(): OrderStatus {
    return this.orderStatus.valor;
  }

  /** Derivado, nunca almacenado. */
  get total(): Dinero {
    return this.orderedProduct.cotizar(this.orderQuantity);
  }

  /** Código público de seguimiento, derivado del id. */
  get codigo(): string {
    return `SHZ-${String(this.orderId).padStart(4, '0')}`;
  }

  get esFinalizado(): boolean {
    return this.orderStatus.esTerminal;
  }

  /**
   * Devuelve un pedido nuevo en el estado pedido.
   *
   * Lanza si la transición no está permitida, en lugar de ignorarla en
   * silencio. Antes `changeStatus` aceptaba cualquier valor, así que un
   * pedido entregado podía volver a "Pendiente" sin que nada lo impediera.
   */
  cambiarEstado(destino: OrderStatus): Pedido {
    return new Pedido({ ...this.aDatos(), estado: this.orderStatus.siguiente(destino) });
  }

  puedeCambiarA(destino: OrderStatus): boolean {
    return this.orderStatus.puedeTransicionarA(destino);
  }

  /**
   * Destinos que el panel puede ofrecer. La vista no conoce la máquina de
   * estados: pregunta, en vez de armar un `switch` con los cuatro estados.
   */
  get cambiosDisponibles(): ReadonlyArray<OrderStatus> {
    return this.orderStatus.destinosPermitidos;
  }

  esIgualA(otro: Pedido): boolean {
    return otro instanceof Pedido && this.orderId === otro.id;
  }

  aDatos(): OrderData {
    return Object.freeze({
      id: this.orderId,
      cliente: this.customerName,
      fecha: this.orderDate,
      producto: this.orderedProduct,
      cantidad: this.orderQuantity,
      metodoPago: this.orderPaymentMethod,
      estado: this.orderStatus,
    });
  }

  /** Proyección plana: apta para JSON, sin clases ni value objects. */
  aPersistido(): PedidoPersistido {
    return Object.freeze({
      id: this.orderId,
      cliente: this.customerName,
      fecha: this.orderDate,
      producto: ProductoFabric.aPersisted(this.orderedProduct),
      cantidad: this.orderQuantity,
      metodoPago: this.orderPaymentMethod,
      estado: this.orderStatus.valor,
    });
  }
}
