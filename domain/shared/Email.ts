/**
 * Value Object: correo electrónico.
 *
 * `StoreUser` validaba con `email.includes('@')`, lo que acepta
 * `"@"`, `"a@b"` o `"espacio @ aqui"`. Este value object normaliza a
 * minúsculas y exige una estructura mínima real.
 *
 * Inmutable.
 */
export class Email {
  private readonly correo: string;

  constructor(correo: string) {
    const normalizado = correo.trim().toLowerCase();
    if (!Email.tieneForma(normalizado)) {
      throw new Error('El correo electrónico no es válido.');
    }
    this.correo = normalizado;
  }

  private static tieneForma(valor: string): boolean {
    // El último segmento exige 2+ caracteres: sin eso "a@b.c" se aceptaba.
    const patron = /^[^\s@]+@[^\s@.]+(\.[^\s@.]{2,})+$/;
    return valor.length <= 254 && patron.test(valor);
  }

  get valor(): string {
    return this.correo;
  }

  get dominio(): string {
    return this.correo.split('@')[1];
  }

  toString(): string {
    return this.correo;
  }

  esIgualA(otro: Email): boolean {
    return this.correo === otro.valor;
  }
}
