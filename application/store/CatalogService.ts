import type { ProductRepository } from '@/domain/store/contracts';
import { StorefrontProduct, type StorefrontProductData } from '@/domain/store/entities';

export class CatalogService {
  constructor(private readonly products: ProductRepository) {}

  getProduct(id: string): StorefrontProduct | undefined { return this.products.findById(id); }

  createProduct(data: StorefrontProductData): StorefrontProduct {
    return new StorefrontProduct(data);
  }

  createProducts(data: ReadonlyArray<StorefrontProductData>): ReadonlyArray<StorefrontProduct> {
    return data.map((product) => this.createProduct(product));
  }

  calculatePurchaseTotal(product: StorefrontProduct, quantity: number): number {
    return product.calculateTotal(quantity);
  }

  formatPrice(amount: number): string {
    if (!Number.isFinite(amount) || amount < 0) throw new Error('El precio no es válido.');
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  createWhatsAppLink(product: StorefrontProduct, quantity: number, color: string, phone: string): string {
    const total = this.formatPrice(this.calculatePurchaseTotal(product, quantity));
    const message = encodeURIComponent(
      `Hola ShenzhenStock! Quisiera realizar la compra oficial de: ${product.name} (Acabado: ${color}, Cantidad: ${quantity} uds) por un valor de ${total}. ¿Tienen disponibilidad?`,
    );
    return `https://wa.me/${phone}?text=${message}`;
  }

  createCatalogInquiryLink(product: StorefrontProduct, phone: string): string {
    const message = encodeURIComponent(
      `Hola ShenzhenStock! Me interesa comprar el producto: ${product.name} por valor de ${this.formatPrice(product.price)}. ¿Tienen disponibilidad para envío inmediato?`,
    );
    return `https://wa.me/${phone}?text=${message}`;
  }
}
