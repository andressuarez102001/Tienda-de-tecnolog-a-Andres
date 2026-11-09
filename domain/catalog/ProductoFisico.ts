import { COSTO_ENVIO_POR_KILO } from '@/domain/shared/constantes';
import { Dinero } from '@/domain/shared/Dinero';
import { Product, type ProductData } from './Producto';
import type { ProductDraft } from './ProductoDraft';

/** Datos de un producto físico: los de la base más su peso. */
export interface PhysicalProductData extends ProductData {
  readonly pesoGramos: number;
}

/**
 * Producto que se transporta, por lo que tiene peso y paga envío.
 *
 * Solo añade su característica propia (`peso`) y cumple el contrato
 * abstracto `costoEnvio`. No modifica ninguna operación heredada.
 */
export class ProductoFisico extends Product {
  private readonly productWeight: number;

  constructor(datos: PhysicalProductData) {
    super(datos);
    if (!Number.isFinite(datos.pesoGramos) || datos.pesoGramos <= 0) {
      throw new Error('El peso del producto debe ser mayor a cero.');
    }
    this.productWeight = datos.pesoGramos;
  }

  get peso(): number {
    return this.productWeight;
  }

  /** Costo del envío según el peso y la tarifa vigente por kilogramo. */
  override costoEnvioConTarifa(tarifaPorKilo: number): Dinero {
    return Dinero.de((this.productWeight / 1000) * tarifaPorKilo);
  }

  override costoEnvio(): Dinero {
    return this.costoEnvioConTarifa(COSTO_ENVIO_POR_KILO);
  }

  protected override reconstruir(datos: ProductData): Product {
    return new ProductoFisico({ ...datos, pesoGramos: this.productWeight });
  }

  /**
   * Actualiza también el peso, que solo existe en los productos físicos.
   * La entidad base no puede conocerlo, así que la subclase completa el
   * borrador sin que `ProductoAdminService` tenga que distinguir tipos.
   */
  override actualizar(borrador: ProductDraft): Product {
    return new ProductoFisico({
      ...this.aDatos(),
      nombre: borrador.nombre,
      descripcion: borrador.descripcion,
      categoria: borrador.categoria,
      precio: Dinero.de(borrador.precio),
      stock: borrador.stock,
      imagen: borrador.imagen,
      coleccion: borrador.coleccion,
      destacado: borrador.destacado,
      novedad: borrador.novedad,
      tendencia: borrador.tendencia,
      pesoGramos: borrador.pesoGramos ?? this.productWeight,
    });
  }

  override borrador(): ProductDraft {
    return { ...super.borrador(), pesoGramos: this.productWeight };
  }
}
