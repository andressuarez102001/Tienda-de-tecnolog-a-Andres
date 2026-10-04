import type { ProductCollection, TipoProducto } from '@/domain/shared/enums';

/**
 * Borrador de producto: los datos crudos que llegan del formulario.
 *
 * Es intencionadamente un tipo "plano" con números, no con value objects,
 * porque lo rellena un `<input type="number">`. La conversión a `Dinero`
 * ocurre dentro de `Product.actualizar`, de modo que la entidad es la
 * única que conoce las reglas de construcción.
 */
export interface ProductDraft {
  readonly nombre: string;
  readonly descripcion: string;
  readonly categoria: string;
  readonly precio: number;
  readonly stock: number;
  readonly imagen: string;
  readonly tipo: TipoProducto;
  readonly coleccion: ProductCollection;
  readonly destacado: boolean;
  readonly novedad: boolean;
  readonly tendencia: boolean;
}