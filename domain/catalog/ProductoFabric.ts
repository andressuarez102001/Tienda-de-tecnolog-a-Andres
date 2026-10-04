import { Dinero } from '@/domain/shared/Dinero';
import { ProductId } from '@/domain/shared/ProductId';
import { TipoProducto, type ProductCollection } from '@/domain/shared/enums';
import { PESO_GRAMOS_POR_DEFECTO } from '@/domain/shared/constantes';
import { ProductoDigital } from './ProductoDigital';
import { ProductoFisico } from './ProductoFisico';
import type { ProductDraft } from './ProductoDraft';
import { Product, type ProductData } from './Producto';

/**
 * Forma serializable de un producto, con el peso incluido solo cuando
 * aplica. Es lo que se guarda en el repositorio.
 *
 * `precio` es un número plano, no un `Dinero`: al serializar a JSON un
 * `Dinero` se convierte en `{ "valor": 18000 }` y al releerlo es un objeto
 * sin métodos, así que `precioTotal()` fallaría con
 * `multiplicar is not a function`. Aplanar en la frontera evita arrastrar
 * ese error a cada vista.
 */
export interface ProductPersisted {
  readonly id: IdPersistido;
  readonly nombre: string;
  readonly descripcion: string;
  readonly categoria: string;
  readonly precio: PrecioPersistido;
  readonly stock: number;
  readonly imagen: string;
  readonly tipo: TipoProducto;
  readonly coleccion: ProductCollection;
  readonly destacado: boolean;
  readonly novedad: boolean;
  readonly tendencia: boolean;
  readonly pesoGramos?: number;
}

/**
 * Fábrica de productos.
 *
 * Único lugar del sistema que decide qué subclase corresponde a un producto.
 * Antes cada vista decidía por su cuenta: `home-juguetes` creaba objetos
 * planos y `producto/[id]` creaba `StorefrontProduct`, así que el mismo
 * producto tenía dos clases según la página.
 *
 * Vive en el dominio porque elegir la subclase es una regla de negocio
 * (un producto digital no paga envío), no un detalle de persistencia.
 */
/**
 * Un `ProductId` serializado a JSON queda como `{ "id": "..." }`, y un `Dinero`
 * como `{ "monto": 18000 }`: al releerlos no son nadahind instances, solo
 * objetos planos. Estos lectores aceptan tanto esas formas heredadas como los
 * primitivos planos que escribe `aPersisted`, para que un archivo creado por
 * una versión anterior siga siendo legible.
 */
type IdPersistido = string | { readonly id: string; readonly valor?: string };
type PrecioPersistido = number | { readonly monto: number; readonly valor?: number };

function idDe(guardado: IdPersistido): string {
  if (typeof guardado === 'string') {
    return guardado;
  }
  return guardado.valor ?? guardado.id;
}

function montoDe(guardado: PrecioPersistido): number {
  if (typeof guardado === 'number') {
    return guardado;
  }
  return guardado.valor ?? guardado.monto;
}

export const ProductoFabric = {
  /** Construye un producto nuevo a partir de lo que escribió el panel. */
  crear(id: ProductId, borrador: ProductDraft): Product {
    const base = {
      id,
      nombre: borrador.nombre,
      descripcion: borrador.descripcion,
      categoria: borrador.categoria,
      precio: Dinero.de(borrador.precio),
      stock: borrador.stock,
      imagen: borrador.imagen,
      tipo: borrador.tipo,
      coleccion: borrador.coleccion,
      destacado: borrador.destacado,
      novedad: borrador.novedad,
      tendencia: borrador.tendencia,
    };
    return borrador.tipo === TipoProducto.Digital
      ? new ProductoDigital(base)
      : new ProductoFisico({ ...base, pesoGramos: PESO_GRAMOS_POR_DEFECTO });
  },

  /**
   * Rehidratación. El tipo viene guardado, así que no se adivina: un
   * producto físico guardado sin peso recuperaría el peso por defecto en
   * lugar de convertirse por accidente en digital.
   */
  desdeDatos(datos: ProductPersisted): Product {
    const base: ProductData = {
      id: new ProductId(idDe(datos.id)),
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      categoria: datos.categoria,
      precio: Dinero.de(montoDe(datos.precio)),
      stock: datos.stock,
      imagen: datos.imagen,
      tipo: datos.tipo,
      coleccion: datos.coleccion,
      destacado: datos.destacado,
      novedad: datos.novedad,
      tendencia: datos.tendencia,
    };
    return datos.tipo === TipoProducto.Digital
      ? new ProductoDigital(base)
      : new ProductoFisico({ ...base, pesoGramos: datos.pesoGramos ?? PESO_GRAMOS_POR_DEFECTO });
  },

  /** Normaliza un `Product` a su forma primitiva serializable. */
  aPersisted(producto: Product): ProductPersisted {
    const datos = producto.aDatos();
    return {
      id: datos.id.valor,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      categoria: datos.categoria,
      precio: datos.precio.valor,
      stock: datos.stock,
      imagen: datos.imagen,
      tipo: datos.tipo,
      coleccion: datos.coleccion,
      destacado: datos.destacado,
      novedad: datos.novedad,
      tendencia: datos.tendencia,
      ...(producto instanceof ProductoFisico ? { pesoGramos: producto.peso } : {}),
    };
  },
} as const;