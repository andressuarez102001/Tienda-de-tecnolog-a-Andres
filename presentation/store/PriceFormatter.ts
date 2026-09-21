/**
 * Responsabilidad única: formatear precios para presentación (COP).
 * Vive en la capa de presentación porque usa Intl.NumberFormat, una API de UI.
 */
export class PriceFormatter {
  format(amount: number): string {
    if (!Number.isFinite(amount) || amount < 0) throw new Error('El precio no es válido.');
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  }
}