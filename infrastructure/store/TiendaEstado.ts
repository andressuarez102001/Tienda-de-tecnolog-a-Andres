import { CATALOGO_SEMILLA } from '@/infrastructure/catalog/CatalogoSemilla';
import {
  crearCategoriasSemilla,
  crearConfiguracionSemilla,
  crearPedidosSemilla,
  crearReportesSemilla,
  crearUsuariosSemilla,
} from '@/infrastructure/catalog/DatosSemilla';
import type { Product } from '@/domain/catalog/Producto';
import type { Pedido } from '@/domain/orders/Pedido';
import type { Usuario } from '@/domain/users/Usuario';
import type { Categoria } from '@/domain/tienda/Categoria';
import type { ReportePeriodo } from '@/domain/tienda/ReportePeriodo';
import type { ConfiguracionTienda } from '@/domain/tienda/ConfiguracionTienda';

/**
 * Estado mutable de la tienda.
 *
 * Sustituye a `AdminState`, que exponía un `load()` que **reconstruía** las
 * seis colecciones en cada llamada partiendo de literales sueltos. Como los
 * datos se recreaban siempre, las ediciones hechas en el panel se perdían
 * al recargar y dos llamadas distintas a `load()` no compartían identidad.
 *
 * Aquí el estado se crea **una vez** y los repositorios son los únicos que
 * lo modifican. Los repositorios nunca devuelven la referencia interna: devuelven
 * copias, así que nadie puede saltarse las reglas mutando un array.
 *
 * Solo lo usan los tests (adaptadores en memoria). Los datos de demostración
 * provienen de `DatosSemilla`, la misma fuente que el seed del servidor.
 */
export interface TiendaEstado {
  productos: Product[];
  pedidos: Pedido[];
  usuarios: Usuario[];
  categorias: Categoria[];
  reportes: ReportePeriodo[];
  configuracion: ConfiguracionTienda;
}

/** Copia superficial de un array: aísla la colección de quien la consume. */
export function copia<T>(coleccion: ReadonlyArray<T>): T[] {
  return [...coleccion];
}

/**
 * Fábrica del estado inicial. Se invoca **una vez** por composition root,
 * nunca desde un componente.
 */
export function crearEstadoInicial(): TiendaEstado {
  return {
    productos: copia(CATALOGO_SEMILLA),
    pedidos: crearPedidosSemilla(),
    usuarios: crearUsuariosSemilla(),
    categorias: crearCategoriasSemilla(),
    reportes: crearReportesSemilla(),
    configuracion: crearConfiguracionSemilla(),
  };
}