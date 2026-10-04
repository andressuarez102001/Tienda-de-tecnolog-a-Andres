import { Dinero } from '@/domain/shared/Dinero';
import { Product, type ProductData } from './Producto';

/**
 * Producto que se entrega sin envío físico (licencia, código de descarga,
 * suscripción). Existe para que el polimorfismo sea real: el mismo código
 * que procesa un pedido obtiene `$0` de envío sin preguntar el tipo.
 */
export class ProductoDigital extends Product {
  override costoEnvio(): Dinero {
    return Dinero.cero();
  }

  protected override reconstruir(datos: ProductData): Product {
    return new ProductoDigital(datos);
  }
}
