import type { ProductRepository } from '@/domain/store/contracts';
import { StorefrontProduct, type StorefrontProductData } from '@/domain/store/entities';

/**
 * Responsabilidad única: gestión del catálogo (consulta y creación de productos).
 * El formateo de precios y los enlaces de WhatsApp viven en sus propios
 * servicios de presentación (PriceFormatter y WhatsAppLinkBuilder).
 */
export class CatalogService {
  constructor(private readonly products: ProductRepository) {}

  getProduct(id: string): StorefrontProduct | undefined { return this.products.findById(id); }

  createProduct(data: StorefrontProductData): StorefrontProduct {
    return new StorefrontProduct(data);
  }

  createProducts(data: ReadonlyArray<StorefrontProductData>): ReadonlyArray<StorefrontProduct> {
    return data.map((product) => this.createProduct(product));
  }
}