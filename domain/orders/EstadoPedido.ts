import { OrderStatus } from '@/domain/shared/enums';

/**
 * Patrón State para el ciclo de vida de un pedido.
 *
 * Antes `Order.changeStatus(estado: OrderStatus)` aceptaba cualquier
 * estado: se podía pasar un pedido de "Entregado" a "Pendiente" sin que
 * nada lo impidiera, y la vista terminaba con cadenas de `if`/`ternary`
 * para decidir colores y transiciones.
 *
 * Con este patrón cada estado es una clase que **solo** conoce sus
 * destinos válidos. Agregar un estado nuevo (por ejemplo "Devuelto")
 * consiste en escribir una clase nueva y registrarla en el mapa: no hay
 * que editar ni la entidad ni las vistas.
 *
 * Nota sobre el diseño: las clases de estado devuelven el *siguiente
 * estado*, no un `Pedido`. Así se evita la dependencia circular
 * `EstadoPedido -> Pedido -> EstadoPedido`, y `Pedido` conserva el
 * control de la reconstrucción de la entidad.
 */
export interface EstadoPedido {
  readonly valor: OrderStatus;
  readonly esTerminal: boolean;
  /** Única fuente de verdad sobre a qué estados puede pasar este pedido. */
  readonly destinosPermitidos: ReadonlyArray<OrderStatus>;
  puedeTransicionarA(destino: OrderStatus): boolean;
  siguiente(destino: OrderStatus): EstadoPedido;
}

/** Base común: delega la validación en la lista de destinos de cada estado. */
abstract class EstadoTransicion implements EstadoPedido {
  protected constructor(readonly valor: OrderStatus) {}

  abstract get destinosPermitidos(): ReadonlyArray<OrderStatus>;

  get esTerminal(): boolean {
    return this.destinosPermitidos.length === 0;
  }

  puedeTransicionarA(destino: OrderStatus): boolean {
    return this.destinosPermitidos.includes(destino);
  }

  siguiente(destino: OrderStatus): EstadoPedido {
    if (!this.puedeTransicionarA(destino)) {
      throw new Error(
        `Un pedido en estado "${this.valor}" no puede pasar a "${destino}".`,
      );
    }
    return estadoDe(destino);
  }
}

export class EstadoPendiente extends EstadoTransicion {
  constructor() {
    super(OrderStatus.Pendiente);
  }
  override get destinosPermitidos(): ReadonlyArray<OrderStatus> {
    return [OrderStatus.Enviado, OrderStatus.Cancelado];
  }
}

export class EstadoEnviado extends EstadoTransicion {
  constructor() {
    super(OrderStatus.Enviado);
  }
  override get destinosPermitidos(): ReadonlyArray<OrderStatus> {
    return [OrderStatus.Entregado, OrderStatus.Cancelado];
  }
}

export class EstadoEntregado extends EstadoTransicion {
  constructor() {
    super(OrderStatus.Entregado);
  }
  override get destinosPermitidos(): ReadonlyArray<OrderStatus> {
    return [];
  }
}

export class EstadoCancelado extends EstadoTransicion {
  constructor() {
    super(OrderStatus.Cancelado);
  }
  override get destinosPermitidos(): ReadonlyArray<OrderStatus> {
    return [];
  }
}

/**
 * Registro de estados. Son instancias únicas e inmutables, así que
 * `estadoDe(Pendiente) === estadoDe(Pendiente)`.
 */
const REGISTRO: Readonly<Record<OrderStatus, EstadoPedido>> = Object.freeze({
  [OrderStatus.Pendiente]: new EstadoPendiente(),
  [OrderStatus.Enviado]: new EstadoEnviado(),
  [OrderStatus.Entregado]: new EstadoEntregado(),
  [OrderStatus.Cancelado]: new EstadoCancelado(),
});

export function estadoDe(valor: OrderStatus): EstadoPedido {
  const estado = REGISTRO[valor];
  if (!estado) {
    throw new Error(`El estado de pedido "${valor}" no está registrado.`);
  }
  return estado;
}

export function estadosDisponibles(): ReadonlyArray<OrderStatus> {
  return Object.values(OrderStatus);
}
