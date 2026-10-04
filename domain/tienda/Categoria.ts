export interface CategoryData {
  readonly id: number;
  readonly nombre: string;
}

/**
 * Entidad Categoría.
 *
 * El identificador es numérico y lo asigna una secuencia inyectada
 * (ver `CategoryAdminService`). Antes se usaba `Date.now()`, que produce
 * identificadores no monotónicos y dependentos del reloj del sistema.
 */
export class Categoria {
  private readonly categoryId: number;
  private readonly categoryName: string;

  constructor(datos: CategoryData) {
    if (!Number.isInteger(datos.id) || datos.id < 1) {
      throw new Error('El identificador de la categoría no es válido.');
    }
    if (!datos.nombre.trim()) {
      throw new Error('La categoría debe tener nombre.');
    }
    this.categoryId = datos.id;
    this.categoryName = datos.nombre.trim();
  }

  static crear(id: number, nombre: string): Categoria {
    return new Categoria({ id, nombre });
  }

  get id(): number {
    return this.categoryId;
  }
  get nombre(): string {
    return this.categoryName;
  }

  renombrar(nombre: string): Categoria {
    return new Categoria({ id: this.categoryId, nombre });
  }

  esIgualA(otro: Categoria): boolean {
    return otro instanceof Categoria && this.categoryId === otro.id;
  }

  aDatos(): CategoryData {
    return Object.freeze({ id: this.categoryId, nombre: this.categoryName });
  }
}
