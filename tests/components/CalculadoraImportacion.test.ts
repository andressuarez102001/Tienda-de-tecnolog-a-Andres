import { describe, expect, it } from 'vitest';
import { calcularImportacion } from '@/components/CalculadoraImportacion';

describe('calcularImportacion', () => {
  it('liquida arancel e IVA sobre la base CIF con flete marítimo', () => {
    const resultado = calcularImportacion(120, 'maritimo');

    expect(resultado.costoFob).toBe(10_200_000);
    expect(resultado.flete).toBe(420_000);
    expect(resultado.arancel).toBe(1_062_000);
    expect(resultado.iva).toBe(2_219_580);
    expect(resultado.total).toBe(13_901_580);
  });

  it('cambia solo el flete al elegir la modalidad aérea', () => {
    const maritimo = calcularImportacion(10, 'maritimo');
    const aereo = calcularImportacion(10, 'aereo');

    expect(aereo.costoFob).toBe(maritimo.costoFob);
    expect(aereo.flete).toBeGreaterThan(maritimo.flete);
    expect(aereo.total).toBeGreaterThan(maritimo.total);
  });

  it('escala linealmente con el número de unidades', () => {
    const diez = calcularImportacion(10, 'aereo');
    const quinientas = calcularImportacion(500, 'aereo');

    expect(quinientas.total).toBe(diez.total * 50);
  });
});
