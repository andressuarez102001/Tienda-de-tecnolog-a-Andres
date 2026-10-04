import type { Product } from '@/domain/catalog/Producto';
import { ProductoFabric } from '@/domain/catalog/ProductoFabric';
import type { Pedido } from '@/domain/orders/Pedido';
import type { Usuario } from '@/domain/users/Usuario';
import type { Categoria } from '@/domain/tienda/Categoria';
import type { ReportePeriodo } from '@/domain/tienda/ReportePeriodo';
import type { ConfiguracionTienda } from '@/domain/tienda/ConfiguracionTienda';

/**
 * Proyecciones de lectura de la API.
 *
 * Las entidades no son serializables tal cual: `Dinero` y `Email` son clases,
 * `Pedido` referencia un `Product` con su peso, y `costoEnvio` es un método
 * polimórfico. Un `JSON.stringify` directo produciría `{}` en varios campos y
 * filtraría detalles internos.
 *
 * Además, enviar `costoEnvio` calculado evita que cada cliente reimplemente el
 * polimorfismo físico/digital, que es la regla de negocio que más ha cambiado
 * en este proyecto.
 */

export interface ProductoRespuesta {
  readonly id: string;
  readonly nombre: string;
  readonly descripcion: string;
  readonly categoria: string;
  readonly precio: number;
  readonly stock: number;
  readonly imagen: string;
  readonly tipo: string;
  readonly coleccion: string;
  readonly destacado: boolean;
  readonly novedad: boolean;
  readonly tendencia: boolean;
  readonly pesoGramos?: number;
  readonly costoEnvio: number;
  readonly nivelStock: string;
  readonly totalInventario: number;
}

export function productoRespuesta(producto: Product): ProductoRespuesta {
  return {
    ...ProductoFabric.aPersisted(producto),
    id: producto.id.valor,
    precio: producto.precio.valor,
    costoEnvio: producto.costoEnvio().valor,
    nivelStock: producto.nivelStock(),
    totalInventario: producto.precioTotal().valor,
  };
}

export function productosRespuesta(productos: ReadonlyArray<Product>): ProductoRespuesta[] {
  return productos.map(productoRespuesta);
}

export interface PedidoRespuesta {
  readonly id: number;
  readonly codigo: string;
  readonly cliente: string;
  readonly fecha: string;
  readonly producto: ProductoRespuesta;
  readonly cantidad: number;
  readonly metodoPago: string;
  readonly estado: string;
  readonly total: number;
  readonly esFinalizado: boolean;
  readonly cambiosDisponibles: ReadonlyArray<string>;
}

export function pedidoRespuesta(pedido: Pedido): PedidoRespuesta {
  return {
    id: pedido.id,
    codigo: pedido.codigo,
    cliente: pedido.cliente,
    fecha: pedido.fecha,
    producto: productoRespuesta(pedido.producto),
    cantidad: pedido.cantidad,
    metodoPago: pedido.metodoPago,
    estado: pedido.nombreEstado,
    total: pedido.total.valor,
    esFinalizado: pedido.esFinalizado,
    cambiosDisponibles: pedido.cambiosDisponibles,
  };
}

export function pedidosRespuesta(pedidos: ReadonlyArray<Pedido>): PedidoRespuesta[] {
  return pedidos.map(pedidoRespuesta);
}

export interface UsuarioRespuesta {
  readonly id: number;
  readonly nombre: string;
  readonly email: string;
  readonly rol: string;
  readonly estado: string;
}

export function usuarioRespuesta(usuario: Usuario): UsuarioRespuesta {
  return usuario.aPersistido();
}

export interface CategoriaRespuesta {
  readonly id: number;
  readonly nombre: string;
}

export function categoriaRespuesta(categoria: Categoria): CategoriaRespuesta {
  return categoria.aDatos();
}

export interface ReporteRespuesta {
  readonly periodo: string;
  readonly rangoFechas: string;
  readonly totalPedidos: number;
  readonly ventas: number;
  readonly cerrado: boolean;
}

export function reporteRespuesta(reporte: ReportePeriodo): ReporteRespuesta {
  return {
    periodo: reporte.periodo,
    rangoFechas: reporte.rangoFechas,
    totalPedidos: reporte.totalPedidos,
    ventas: reporte.ventas.valor,
    cerrado: reporte.cerrado,
  };
}

export interface ConfiguracionRespuesta {
  readonly nombreTienda: string;
  readonly costoEnvio: number;
  readonly emailContacto: string;
}

export function configuracionRespuesta(
  configuracion: ConfiguracionTienda,
): ConfiguracionRespuesta {
  return {
    nombreTienda: configuracion.nombreTienda,
    costoEnvio: configuracion.costoEnvio.valor,
    emailContacto: configuracion.emailContacto.valor,
  };
}