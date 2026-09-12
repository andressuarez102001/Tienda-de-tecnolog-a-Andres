import type { ProductRepository } from '@/domain/store/contracts';
import { StorefrontProduct } from '@/domain/store/entities';

export class CatalogService {
  constructor(private readonly products: ProductRepository) {}

  getProduct(id: string): StorefrontProduct | undefined { return this.products.findById(id); }

  calculatePurchaseTotal(product: StorefrontProduct, quantity: number): number {
    return product.calculateTotal(quantity);
  }

  createWhatsAppLink(product: StorefrontProduct, quantity: number, color: string, phone: string): string {
    const total = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
      .format(this.calculatePurchaseTotal(product, quantity));
    const message = encodeURIComponent(
      `Hola ShenzhenStock! Quisiera realizar la compra oficial de: ${product.name} (Acabado: ${color}, Cantidad: ${quantity} uds) por un valor de ${total}. ¿Tienen disponibilidad?`,
    );
    return `https://wa.me/${phone}?text=${message}`;
  }
}
