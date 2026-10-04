import { Dinero } from '@/domain/shared/Dinero';

/**
 * Formateo de precios en pesos colombianos (COP).
 *
 * Vive en presentación porque usa `Intl`, que es una API de interfaz, y
 * recibe un `Dinero` (no un `number`) para que el formato no invite a
 * pasar un valor que no pasó por la validación del value object.
 *
 * SRP: una sola responsabilidad.
 */
export class PriceFormatter {
  format(monto: Dinero): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(monto.valor);
  }
}