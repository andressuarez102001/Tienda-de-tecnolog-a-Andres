import { COSTO_ENVIO_POR_KILO } from '@/domain/shared/constantes';
import { Dinero } from '@/domain/shared/Dinero';
import { Product, type ProductData } from './Producto';

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

  /** $5.000 COP por cada kilogramo, redondeado al peso total. */
  override costoEnvio(): Dinero {
    return Dinero.de((this.productWeight / 1000) * COSTO_ENVIO_POR_KILO);
  }

  protected override reconstruir(datos: ProductData): Product {
    return new ProductoFisico({ ...datos, pesoGramos: this.productWeight });
  }
}
