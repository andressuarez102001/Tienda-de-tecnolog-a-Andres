import { describe, expect, it } from 'vitest';
import { ProductId } from '@/domain/shared/ProductId';
import { Dinero } from '@/domain/shared/Dinero';
import { Email } from '@/domain/shared/Email';

describe('ProductId (value object)', () => {
  it('normaliza el identificador a una única forma canónica', () => {
    expect(new ProductId('  Funda iPhone 17  ').valor).toBe('funda-iphone-17');
    expect(new ProductId('FUNDA_IPHONE 17').valor).toBe('funda-iphone-17');
    expect(new ProductId('Set de Ladrillos LEGO CITY').valor).toBe('set-de-ladrillos-lego-city');
  });

  it('quita acentos y signos', () => {
    expect(new ProductId('Cámara GoPro Hero 11').valor).toBe('camara-gopro-hero-11');
    expect(ProductId.generarDesde('AirPods Pro 2').valor).toBe('airpods-pro-2');
  });

  it('rechaza identificadores vacíos', () => {
    expect(() => new ProductId('   ')).toThrow();
    expect(() => new ProductId('---')).toThrow();
  });

  it('compara por valor, no por referencia', () => {
    const a = new ProductId('drone-1');
    const b = new ProductId('DRONE-1');
    expect(a).not.toBe(b);
    expect(a.esIgualA(b)).toBe(true);
  });
});

describe('Dinero (value object)', () => {
  it('rechaza montos negativos, infinitos y NaN', () => {
    expect(() => Dinero.de(-1)).toThrow();
    expect(() => Dinero.de(Number.NaN)).toThrow();
    expect(() => Dinero.de(Number.POSITIVE_INFINITY)).toThrow();
  });

  it('redondea porque COP no maneja centavos', () => {
    expect(Dinero.de(3499.9999999999995).valor).toBe(3500);
  });

  it('no muta la instancia original al operar', () => {
    const base = Dinero.de(1000);
    const suma = base.sumar(Dinero.de(500));
    expect(base.valor).toBe(1000);
    expect(suma.valor).toBe(1500);
  });

  it('permite multiplicar por cero en cálculos de inventario', () => {
    expect(Dinero.de(25000).multiplicar(0).valor).toBe(0);
  });

  it('impide restar por debajo de cero', () => {
    expect(() => Dinero.de(100).restar(Dinero.de(500))).toThrow();
  });
});

describe('Email (value object)', () => {
  it('acepta una estructura real y normaliza a minúsculas', () => {
    expect(new Email('  ADMIN@TecnoStore.COM ').valor).toBe('admin@tecnostore.com');
  });

  // Antes `StoreUser` validaba con `includes('@')`, que aceptaba estos casos.
  it.each(['@', 'a@b', 'espacio @ aqui', 'sin-arroba.com', 'a@b.c'])(
    'rechaza "%s"',
    (invalido) => {
      expect(() => new Email(invalido)).toThrow();
    },
  );

  it('expone el dominio para reglas de negocio', () => {
    expect(new Email('cliente@tecnostore.com').dominio).toBe('tecnostore.com');
  });
});