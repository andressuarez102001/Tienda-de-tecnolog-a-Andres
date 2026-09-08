export type PaymentMethod = 'PSE' | 'Efectivo/Contraentrega' | 'Nequi/Bancolombia';
export type OrderStatus = 'Pendiente' | 'Enviado' | 'Entregado';
export type UserRole = 'Admin' | 'Cliente';
export type UserStatus = 'Activo' | 'Bloqueado';

export interface ProductDraft {
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

/** Entidad de dominio: sus invariantes no dependen de React ni de la interfaz. */
export class Product {
  constructor(
    public readonly id: number,
    public readonly nombre: string,
    public readonly categoria: string,
    public readonly precio: number,
    public readonly stock: number,
  ) {
    if (precio < 0 || stock < 0) throw new Error('El precio y el stock no pueden ser negativos.');
  }

  static create(id: number, draft: ProductDraft): Product {
    return new Product(id, draft.nombre, draft.categoria, draft.precio, draft.stock);
  }

  update(draft: ProductDraft): Product {
    return Product.create(this.id, draft);
  }

  valorEnInventario(): number {
    return this.precio * this.stock;
  }

  necesitaReposicion(limite = 2): boolean {
    return this.stock <= limite;
  }
}

export class Order {
  constructor(
    public readonly id: number,
    public readonly cliente: string,
    public readonly fecha: string,
    public readonly total: number,
    public readonly metodoPago: PaymentMethod,
    public readonly estado: OrderStatus,
  ) {}

  changeStatus(estado: OrderStatus): Order {
    return new Order(this.id, this.cliente, this.fecha, this.total, this.metodoPago, estado);
  }
}

export class User {
  constructor(
    public readonly id: number,
    public readonly nombre: string,
    public readonly email: string,
    public readonly rol: UserRole,
    public readonly estado: UserStatus,
  ) {}

  toggleStatus(): User {
    return new User(this.id, this.nombre, this.email, this.rol, this.estado === 'Activo' ? 'Bloqueado' : 'Activo');
  }
}

export class Category {
  constructor(public readonly id: number, public readonly nombre: string) {}
}

export class PeriodReport {
  constructor(
    public readonly periodo: string,
    public readonly rangoFechas: string,
    public readonly totalPedidos: number,
    public readonly ventas: number,
    public readonly estado: string,
  ) {}
}

export interface StoreSettings {
  nombreTienda: string;
  costoEnvio: number;
  emailContacto: string;
}
