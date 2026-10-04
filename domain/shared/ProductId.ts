/**
 * Value Object: identificador de producto.
 *
 * Un identificador no es un `string`: es un valor con normalización y
 * con igualdad por valor. Modelarlo como clase aporta:
 *
 *   - Seguridad de tipo: no se puede pasar un id de producto donde se
 *     espera un id de pedido, porque son clases distintas.
 *   - Una única forma canónica de escribirlo.
 *   - Igualdad por valor (`esIgualA`), requisito para deduplicar y para
 *     las pruebas unitarias.
 *
 * Inmutable: no expone setters, todas las operaciones devuelven instancias nuevas.
 */
export class ProductId {
  private readonly id: string;

  constructor(id: string) {
    const normalizado = ProductId.normalizar(id);
    if (!normalizado) {
      throw new Error('El identificador del producto no es válido.');
    }
    this.id = normalizado;
  }

  /** Construye un identificador a partir del nombre comercial del producto. */
  static generarDesde(nombre: string): ProductId {
    return new ProductId(ProductId.normalizar(nombre));
  }

  /**
   * Deja una única forma canónica: minúsculas, sin acentos, sin signos
   * y separada por guiones. `iPhone 17 Pro Max` -> `iphone-17-pro-max`.
   */
  private static normalizar(valor: string): string {
    return valor
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  get valor(): string {
    return this.id;
  }

  toString(): string {
    return this.id;
  }

  esIgualA(otro: ProductId): boolean {
    return this.id === otro.valor;
  }
}
