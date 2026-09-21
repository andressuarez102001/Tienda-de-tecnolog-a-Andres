import type { StorefrontProduct } from '@/domain/store/entities';
import type { PriceFormatter } from './PriceFormatter';

/**
 * Responsabilidad única: construir enlaces de contacto/compra por WhatsApp.
 * Separado de CatalogService para que la creación del mensaje de venta
 * no dependa ni contamine la lógica del catálogo.
 */
export class WhatsAppLinkBuilder {
  constructor(private readonly formatter: PriceFormatter) {}

  createPurchaseLink(product: StorefrontProduct, quantity: number, color: string, phone: string): string {
    const total = this.formatter.format(product.calculateTotal(quantity));
    const message = encodeURIComponent(
      `Hola ShenzhenStock! Quisiera realizar la compra oficial de: ${product.name} (Acabado: ${color}, Cantidad: ${quantity} uds) por un valor de ${total}. ¿Tienen disponibilidad?`,
    );
    return `https://wa.me/${phone}?text=${message}`;
  }

  createCatalogInquiryLink(product: StorefrontProduct, phone: string): string {
    const message = encodeURIComponent(
      `Hola ShenzhenStock! Me interesa comprar el producto: ${product.name} por valor de ${this.formatter.format(product.price)}. ¿Tienen disponibilidad para envío inmediato?`,
    );
    return `https://wa.me/${phone}?text=${message}`;
  }
}