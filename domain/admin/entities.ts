export type PaymentMethod = 'PSE' | 'Efectivo/Contraentrega' | 'Nequi/Bancolombia';
export type OrderStatus = 'Pendiente' | 'Enviado' | 'Entregado';
export type UserRole = 'Admin' | 'Cliente';
export type UserStatus = 'Activo' | 'Bloqueado';

export interface ProductDraft {
  readonly nombre: string;
  readonly categoria: string;
  readonly precio: number;
  readonly stock: number;
}

/** Entidad de dominio: sus invariantes no dependen de React ni de la interfaz. */
export class Product {
  private readonly productId: number;
  private readonly productName: string;
  private readonly productCategory: string;
  private readonly productPrice: number;
  private readonly productStock: number;

  constructor(
    id: number,
    nombre: string,
    categoria: string,
    precio: number,
    stock: number,
  ) {
    if (!Number.isInteger(id) || id < 1) throw new Error('El identificador del producto no es válido.');
    if (!nombre.trim() || !categoria.trim()) throw new Error('El producto debe tener nombre y categoría.');
    if (!Number.isFinite(precio) || !Number.isInteger(stock) || precio < 0 || stock < 0) {
      throw new Error('El precio y el stock no son válidos.');
    }
    this.productId = id;
    this.productName = nombre;
    this.productCategory = categoria;
    this.productPrice = precio;
    this.productStock = stock;
  }

  get id(): number { return this.productId; }
  get nombre(): string { return this.productName; }
  get categoria(): string { return this.productCategory; }
  get precio(): number { return this.productPrice; }
  get stock(): number { return this.productStock; }

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
  private readonly orderId: number;
  private readonly customerName: string;
  private readonly orderDate: string;
  private readonly orderTotal: number;
  private readonly paymentMethod: PaymentMethod;
  private readonly orderStatus: OrderStatus;

  constructor(
    id: number, cliente: string, fecha: string, total: number, metodoPago: PaymentMethod, estado: OrderStatus,
  ) {
    if (!Number.isInteger(id) || id < 1 || !cliente.trim() || !fecha.trim() || total < 0) {
      throw new Error('El pedido no es válido.');
    }
    this.orderId = id;
    this.customerName = cliente;
    this.orderDate = fecha;
    this.orderTotal = total;
    this.paymentMethod = metodoPago;
    this.orderStatus = estado;
  }
  get id(): number { return this.orderId; }
  get cliente(): string { return this.customerName; }
  get fecha(): string { return this.orderDate; }
  get total(): number { return this.orderTotal; }
  get metodoPago(): PaymentMethod { return this.paymentMethod; }
  get estado(): OrderStatus { return this.orderStatus; }

  changeStatus(estado: OrderStatus): Order {
    return new Order(this.id, this.cliente, this.fecha, this.total, this.metodoPago, estado);
  }
}

export class User {
  private readonly userId: number;
  private readonly userName: string;
  private readonly userEmail: string;
  private readonly userRole: UserRole;
  private readonly userStatus: UserStatus;

  constructor(
    id: number, nombre: string, email: string, rol: UserRole, estado: UserStatus,
  ) {
    if (!Number.isInteger(id) || id < 1 || !nombre.trim() || !email.includes('@')) {
      throw new Error('El usuario no es válido.');
    }
    this.userId = id;
    this.userName = nombre;
    this.userEmail = email;
    this.userRole = rol;
    this.userStatus = estado;
  }
  get id(): number { return this.userId; }
  get nombre(): string { return this.userName; }
  get email(): string { return this.userEmail; }
  get rol(): UserRole { return this.userRole; }
  get estado(): UserStatus { return this.userStatus; }

  toggleStatus(): User {
    return new User(this.id, this.nombre, this.email, this.rol, this.estado === 'Activo' ? 'Bloqueado' : 'Activo');
  }
}

export class Category {
  constructor(private readonly categoryId: number, private readonly categoryName: string) {
    if (!Number.isInteger(categoryId) || categoryId < 1 || !categoryName.trim()) {
      throw new Error('La categoría no es válida.');
    }
  }
  get id(): number { return this.categoryId; }
  get nombre(): string { return this.categoryName; }
}

export class PeriodReport {
  private readonly reportPeriod: string;
  private readonly reportDateRange: string;
  private readonly reportOrders: number;
  private readonly reportSales: number;
  private readonly reportStatus: string;

  constructor(
    periodo: string, rangoFechas: string, totalPedidos: number, ventas: number, estado: string,
  ) {
    if (!periodo.trim() || !rangoFechas.trim() || !estado.trim() || totalPedidos < 0 || ventas < 0) {
      throw new Error('El reporte no es válido.');
    }
    this.reportPeriod = periodo;
    this.reportDateRange = rangoFechas;
    this.reportOrders = totalPedidos;
    this.reportSales = ventas;
    this.reportStatus = estado;
  }
  get periodo(): string { return this.reportPeriod; }
  get rangoFechas(): string { return this.reportDateRange; }
  get totalPedidos(): number { return this.reportOrders; }
  get ventas(): number { return this.reportSales; }
  get estado(): string { return this.reportStatus; }
}

export interface StoreSettings {
  readonly nombreTienda: string;
  readonly costoEnvio: number;
  readonly emailContacto: string;
}
