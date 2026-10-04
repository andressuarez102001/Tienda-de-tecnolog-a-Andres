/**
 * Value Object: cantidad de dinero en pesos colombianos (COP).
 *
 * Un número decimal no distingue "cantidades" de "precios" y permite
 * que entren valores inválidos (-500, NaN, Infinity). `Dinero` centraliza
 * la invariante "el dinero no es negativo ni infinito" y hace que las
 * operaciones devuelvan instancias nuevas, nunca muten el valor.
 *
 * Inmutable: todas las operaciones son no destructivas.
 */
export class Dinero {
  private readonly monto: number;

  constructor(monto: number) {
    if (!Number.isFinite(monto) || monto < 0) {
      throw new Error('El monto no es válido.');
    }
    // COP no maneja centavos: se redondea para que las sumas de línea
    // nunca produzcan 3_499.9999999999995.
    this.monto = Math.round(monto);
  }

  static cero(): Dinero {
    return new Dinero(0);
  }

  static de(monto: number): Dinero {
    return new Dinero(monto);
  }

  get valor(): number {
    return this.monto;
  }

  /** Acepta multiplicadores desde cero (cálculos de inventario). */
  multiplicar(factor: number): Dinero {
    if (!Number.isFinite(factor) || factor < 0) {
      throw new Error('El factor de multiplicación no es válido.');
    }
    return new Dinero(this.monto * factor);
  }

  sumar(otro: Dinero): Dinero {
    return new Dinero(this.monto + otro.valor);
  }

  restar(otro: Dinero): Dinero {
    return new Dinero(this.monto - otro.valor);
  }

  esIgualA(otro: Dinero): boolean {
    return this.monto === otro.valor;
  }

  esMayorQue(otro: Dinero): boolean {
    return this.monto > otro.valor;
  }
}
