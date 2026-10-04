import { Pedido } from '@/domain/orders/Pedido';
import { Usuario } from '@/domain/users/Usuario';
import { Categoria } from '@/domain/tienda/Categoria';
import { ReportePeriodo } from '@/domain/tienda/ReportePeriodo';
import { ConfiguracionTienda } from '@/domain/tienda/ConfiguracionTienda';
import { OrderStatus, PaymentMethod, UserRole, UserStatus } from '@/domain/shared/enums';
import { EMAIL_ADMIN_POR_DEFECTO } from '@/domain/shared/constantes';
import { CATALOGO_SEMILLA, productoSemilla } from '@/infrastructure/catalog/CatalogoSemilla';

/**
 * Datos de demostración compartidos por los dos seeds.
 *
 * Antes los 4 pedidos, 4 usuarios, 4 reportes y la configuración vivían
 * duplicados en `TiendaEstado` (para los tests con adaptadores en memoria) y
 * en `crearSemillaServidor` (para los almacenes JSON y PostgreSQL), con
 * números idénticos copiados a mano. Cualquier ajuste de un lado divergía sin
 * error. Aquí está la única fuente: los 35 productos ya compartían
 * `CATALOGO_SEMILLA`; el resto se unifica en este módulo.
 *
 * Los builders devuelven entidades del dominio con sus invariantes. Cada
 * consumidor proyecta a su propio formato (`aPersistido`, `aDatos`).
 */

export interface PedidoSemilla {
  readonly id: number;
  readonly cliente: string;
  readonly fecha: string;
  readonly productoId: string;
  readonly cantidad: number;
  readonly pago: PaymentMethod;
  readonly transiciones: ReadonlyArray<OrderStatus>;
}

export interface UsuarioSemilla {
  readonly id: number;
  readonly nombre: string;
  readonly email: string;
  readonly rol?: UserRole;
  readonly estado?: UserStatus;
}

export interface ReporteSemilla {
  readonly periodo: string;
  readonly rangoFechas: string;
  readonly totalPedidos: number;
  readonly ventas: number;
}

export const PEDIDOS_SEMILLA: ReadonlyArray<PedidoSemilla> = [
  {
    id: 1,
    cliente: 'Carlos Ramírez',
    fecha: '2026-01-05',
    productoId: 'drone-1',
    cantidad: 1,
    pago: PaymentMethod.Digital,
    transiciones: [OrderStatus.Enviado, OrderStatus.Entregado],
  },
  {
    id: 2,
    cliente: 'Ana Torres',
    fecha: '2026-01-12',
    productoId: 'airpods',
    cantidad: 2,
    pago: PaymentMethod.Contraentrega,
    transiciones: [OrderStatus.Enviado],
  },
  {
    id: 3,
    cliente: 'Jorge Díaz',
    fecha: '2026-02-02',
    productoId: 'funda-iphone-17',
    cantidad: 1,
    pago: PaymentMethod.PSE,
    transiciones: [OrderStatus.Enviado, OrderStatus.Entregado],
  },
  {
    id: 4,
    cliente: 'Laura Méndez',
    fecha: '2026-02-18',
    productoId: 'lego',
    cantidad: 3,
    pago: PaymentMethod.Contraentrega,
    transiciones: [],
  },
];

/** Los usuarios con rol/estado omisos caen en Cliente/Activo (defaults de `Usuario`). */
export const USUARIOS_SEMILLA: ReadonlyArray<UsuarioSemilla> = [
  { id: 1, nombre: 'Administrador', email: EMAIL_ADMIN_POR_DEFECTO, rol: UserRole.Admin, estado: UserStatus.Activo },
  { id: 2, nombre: 'Carlos Ramírez', email: 'carlos.ramirez@correo.com', rol: UserRole.Cliente },
  { id: 3, nombre: 'Ana Torres', email: 'ana.torres@correo.com', rol: UserRole.Cliente, estado: UserStatus.Bloqueado },
  { id: 4, nombre: 'Jorge Díaz', email: 'jorge.diaz@correo.com', rol: UserRole.Cliente },
];

export const REPORTES_SEMILLA: ReadonlyArray<ReporteSemilla> = [
  { periodo: 'Enero 2026', rangoFechas: '1 – 31 ene 2026', totalPedidos: 128, ventas: 18450000 },
  { periodo: 'Diciembre 2025', rangoFechas: '1 – 31 dic 2025', totalPedidos: 214, ventas: 31780000 },
  { periodo: 'Trimestre Q4 2025', rangoFechas: '1 oct – 31 dic 2025', totalPedidos: 602, ventas: 89340000 },
  { periodo: 'Noviembre 2025', rangoFechas: '1 – 30 nov 2025', totalPedidos: 97, ventas: 13920000 },
];

export const CONFIGURACION_SEMILLA = {
  nombreTienda: 'ShenzhenStock',
  costoEnvio: 12000,
  emailContacto: 'contacto@shenzhenstock.co',
} as const;

export function crearPedidosSemilla(): Pedido[] {
  return PEDIDOS_SEMILLA.map((semilla) =>
    semilla.transiciones.reduce(
      (pedido, estado) => pedido.cambiarEstado(estado),
      Pedido.crear(
        semilla.id,
        semilla.cliente,
        semilla.fecha,
        productoSemilla(semilla.productoId),
        semilla.cantidad,
        semilla.pago,
      ),
    ),
  );
}

export function crearUsuariosSemilla(): Usuario[] {
  return USUARIOS_SEMILLA.map(({ id, nombre, email, rol, estado }) =>
    Usuario.crear(id, nombre, email, rol ?? UserRole.Cliente, estado ?? UserStatus.Activo),
  );
}

export function crearReportesSemilla(): ReportePeriodo[] {
  return REPORTES_SEMILLA.map(({ periodo, rangoFechas, totalPedidos, ventas }) =>
    ReportePeriodo.crear(periodo, rangoFechas, totalPedidos, ventas),
  );
}

/** Las categorías se derivan del catálogo: ninguna puede quedar huérfana. */
export function crearCategoriasSemilla(): Categoria[] {
  const nombres = [...new Set(CATALOGO_SEMILLA.map((producto) => producto.categoria))].sort(
    (a, b) => a.localeCompare(b, 'es'),
  );
  return nombres.map((nombre, indice) => Categoria.crear(indice + 1, nombre));
}

export function crearConfiguracionSemilla(): ConfiguracionTienda {
  const { nombreTienda, costoEnvio, emailContacto } = CONFIGURACION_SEMILLA;
  return ConfiguracionTienda.crear(nombreTienda, costoEnvio, emailContacto);
}