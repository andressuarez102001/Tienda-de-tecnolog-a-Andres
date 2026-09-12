/**
 * Entidades del dominio de la tienda. No conocen React, Next, localStorage ni
 * la forma en que finalmente se muestran los datos.
 */
export interface StorefrontProductData {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly imageSrc: string;
  readonly category?: string;
  readonly stock?: number;
}

export class StorefrontProduct {
  private readonly productId: string;
  private readonly productName: string;
  private readonly productDescription: string;
  private readonly productPrice: number;
  private readonly productImageSrc: string;
  private readonly productCategory?: string;
  private readonly availableStock: number;

  constructor(data: StorefrontProductData) {
    if (!data.id.trim() || !data.name.trim()) throw new Error('El producto debe tener identificador y nombre.');
    if (!data.description.trim() || !data.imageSrc.trim()) throw new Error('El producto debe incluir descripción e imagen.');
    if (data.price < 0 || !Number.isFinite(data.price)) throw new Error('El precio del producto no es válido.');
    if ((data.stock ?? 1) < 0) throw new Error('El stock no puede ser negativo.');
    this.productId = data.id;
    this.productName = data.name;
    this.productDescription = data.description;
    this.productPrice = data.price;
    this.productImageSrc = data.imageSrc;
    this.productCategory = data.category;
    this.availableStock = data.stock ?? 1;
  }

  get id(): string { return this.productId; }
  get name(): string { return this.productName; }
  get description(): string { return this.productDescription; }
  get price(): number { return this.productPrice; }
  get imageSrc(): string { return this.productImageSrc; }
  get category(): string | undefined { return this.productCategory; }
  get stock(): number { return this.availableStock; }

  calculateTotal(quantity: number): number {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > this.availableStock) {
      throw new Error('La cantidad solicitada no está disponible.');
    }
    return this.productPrice * quantity;
  }

  toData(): Readonly<StorefrontProductData> {
    return Object.freeze({ id: this.id, name: this.name, description: this.description, price: this.price, imageSrc: this.imageSrc, category: this.category, stock: this.stock });
  }
}

export class StoreUser {
  private readonly userEmail: string;
  private readonly userRole: 'admin' | 'cliente';

  constructor(email: string, role: 'admin' | 'cliente') {
    if (!email.includes('@')) throw new Error('El correo del usuario no es válido.');
    this.userEmail = email;
    this.userRole = role;
  }

  get email(): string { return this.userEmail; }
  isAdministrator(): boolean { return this.userRole === 'admin'; }
}
