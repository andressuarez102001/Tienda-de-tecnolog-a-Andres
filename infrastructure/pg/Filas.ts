import { ProductoFabric, type ProductPersisted } from '@/domain/catalog/ProductoFabric';
import type { Product } from '@/domain/catalog/Producto';
import { Pedido, type PedidoPersistido } from '@/domain/orders/Pedido';
import { Usuario, type UsuarioPersistido } from '@/domain/users/Usuario';
import { Categoria } from '@/domain/tienda/Categoria';
import { ReportePeriodo } from '@/domain/tienda/ReportePeriodo';
import { ConfiguracionTienda } from '@/domain/tienda/ConfiguracionTienda';
import type { CredencialAlmacenada } from '@/domain/auth/contracts';
import type { FilaPg } from './BasePg';

/**
 * Conversión fila → entidad para PostgreSQL.
 *
 * Cada `SELECT` pide las columnas con alias `camelCase`, así que la fila
 * llega con la misma forma que la instantánea JSON: el rehidratado es obra
 * de las entidades (`desdeDatos`/`restaurar`/`crear`), los únicos que saben
 * revalidar invariantes. Las columnas son `NOT NULL`, así que no hace falta
 * tolerar datos ausentes como sí ocurre al leer respuestas de una API.
 */

export function productoDesdeFila(fila: FilaPg): Product {
  return ProductoFabric.desdeDatos(fila as unknown as ProductPersisted);
}

export function pedidoDesdeFila(fila: FilaPg): Pedido {
  return Pedido.restaurar({
    id: fila.id as number,
    cliente: fila.cliente as string,
    fecha: fila.fecha as string,
    producto: fila.producto as ProductPersisted,
    cantidad: fila.cantidad as number,
    metodoPago: fila.metodoPago as PedidoPersistido['metodoPago'],
    estado: fila.estado as PedidoPersistido['estado'],
  });
}

export function usuarioDesdeFila(fila: FilaPg): Usuario {
  return Usuario.restaurar(fila as unknown as UsuarioPersistido);
}

export function categoriaDesdeFila(fila: FilaPg): Categoria {
  return Categoria.crear(fila.id as number, fila.nombre as string);
}

export function reporteDesdeFila(fila: FilaPg): ReportePeriodo {
  return ReportePeriodo.crear(
    fila.periodo as string,
    fila.rangoFechas as string,
    fila.totalPedidos as number,
    fila.ventas as number,
    fila.cerrado as boolean,
  );
}

export function configuracionDesdeFila(fila: FilaPg): ConfiguracionTienda {
  return ConfiguracionTienda.crear(
    fila.nombreTienda as string,
    fila.costoEnvio as number,
    fila.emailContacto as string,
  );
}

export function credencialDesdeFila(fila: FilaPg): CredencialAlmacenada {
  return {
    usuarioId: fila.usuarioId as number,
    hashClave: fila.hashClave as string,
    rol: fila.rol as CredencialAlmacenada['rol'],
  };
}