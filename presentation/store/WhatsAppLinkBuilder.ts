import type { Product } from '@/domain/catalog/Producto';
import { Dinero } from '@/domain/shared/Dinero';
import type { PriceFormatter } from './PriceFormatter';

/**
 * Construcción de enlaces de compra por WhatsApp.
 *
 * SRP: el mensaje de venta vive aquí y no en `CatalogoService`, así que
 * consultar el catálogo no arrastra la lógica de redacción comercial.
 *
 * El total se calcula con `producto.cotizar(cantidad)`, que es donde vive
 * la regla de envío: el mensaje nunca puede discrepar del total que cobra
 * la tienda.
 */
export class WhatsAppLinkBuilder {
  constructor(
    private readonly formatter: PriceFormatter,
    private readonly numeroWhatsApp: string,
  ) {}

  enlaceDeCompra(producto: Product, cantidad: number, acabado: string): string {
    const total: Dinero = producto.cotizar(cantidad);
    const mensaje = encodeURIComponent(
      `Hola ShenzhenStock! Quisiera realizar la compra oficial de: ${producto.nombre} ` +
        `(Acabado: ${acabado}, Cantidad: ${cantidad} uds) por un valor de ${this.formatter.format(total)}. ` +
        `¿Tienen disponibilidad?`,
    );
    return this.construir(mensaje);
  }

  enlaceDeConsulta(producto: Product): string {
    const mensaje = encodeURIComponent(
      `Hola ShenzhenStock! Me interesa comprar el producto: ${producto.nombre} ` +
        `por valor de ${this.formatter.format(producto.precio)}. ` +
        `¿Tienen disponibilidad para envío inmediato?`,
    );
    return this.construir(mensaje);
  }

  private construir(mensajeCodificado: string): string {
    return `https://wa.me/${this.numeroWhatsApp}?text=${mensajeCodificado}`;
  }
}