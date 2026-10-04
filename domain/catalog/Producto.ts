import { Dinero } from '@/domain/shared/Dinero';
import { ProductId } from '@/domain/shared/ProductId';
import { CatalogListing, ProductCollection, ProductSort, StockLevel, TipoProducto } from '@/domain/shared/enums';
import { UMBRAL_STOCK_CRITICO } from '@/domain/shared/constantes';
import type { ProductDraft } from './ProductoDraft';

/** Forma primitiva de un producto, usada para serializar y para reconstruir. */
export interface ProductData {
  readonly id: ProductId;
  readonly nombre: string;
  readonly descripcion: string;
  readonly categoria: string;
  readonly precio: Dinero;
  readonly stock: number;
  readonly imagen: string;
  readonly tipo: TipoProducto;
  readonly coleccion: ProductCollection;
  readonly destacado: boolean;
  readonly novedad: boolean;
  readonly tendencia: boolean;
}

/**
 * Entidad base del catálogo. Reemplaza a los dos modelos que coexistían
 * antes (`StorefrontProduct` en inglés y `Product` del panel), que
 * describían el mismo concepto con nombres, precios y reglas distintas.
 *
 * Es abstracta porque el envío depende del tipo de producto y cada
 * subclase responde distinto. Lo que se polimorfiza es **solo** el costo
 * de envío; el total de la merchandise tiene el mismo significado en
 * todas las subclases.
 *
 * Esto corrige la violación de Liskov que tenía `ProductoFisico`
 * antes: ahí la subclase *reescribía* `calculateTotal` para sumar el
 * envío, de modo que un `precio * cantidad` significaba una cosa u otra
 * según la subclase, y un carrito que sumara totales no lo detectaba.
 * Aquí `totalPedido()` tiene un significado único para todas las
 * subclases y el envío es un método aparte del contrato.
 *
 * TypeScript no tiene un modificador `final`, así que el acuerdo de "no
 * sobrescribir" se documenta en cada método y se verifica en las pruebas
 * (`Producto.test.ts` comprueba que una subclase con un total distinto no
 * puede pasar el contrato). Lo que sí es invariante real es que ninguna
 * subclase toca los campos privados: los implementa `#`, no `private`.
 *
 * Inmutable: cada operación devuelve una instancia nueva.
 */
export abstract class Product {
  private readonly productId: ProductId;
  private readonly productName: string;
  private readonly productDescription: string;
  private readonly productCategory: string;
  private readonly productPrice: Dinero;
  private readonly productStock: number;
  private readonly productImage: string;
  private readonly productType: TipoProducto;
  private readonly productCollection: ProductCollection;
  private readonly isFeatured: boolean;
  private readonly isNewArrival: boolean;
  private readonly isTrending: boolean;

  constructor(datos: ProductData) {
    if (!datos.nombre.trim()) {
      throw new Error('El producto debe tener nombre.');
    }
    if (!datos.descripcion.trim()) {
      throw new Error('El producto debe tener descripción.');
    }
    if (!datos.categoria.trim()) {
      throw new Error('El producto debe tener categoría.');
    }
    if (!datos.imagen.trim()) {
      throw new Error('El producto debe tener imagen.');
    }
    if (!Number.isInteger(datos.stock) || datos.stock < 0) {
      throw new Error('El stock no puede ser negativo.');
    }
    this.productId = datos.id;
    this.productName = datos.nombre.trim();
    this.productDescription = datos.descripcion.trim();
    this.productCategory = datos.categoria.trim();
    this.productPrice = datos.precio;
    this.productStock = datos.stock;
    this.productImage = datos.imagen;
    this.productType = datos.tipo;
    this.productCollection = datos.coleccion;
    this.isFeatured = datos.destacado;
    this.isNewArrival = datos.novedad;
    this.isTrending = datos.tendencia;
  }

  /**
   * Método de fábrica: cada subclase sabe volver a construirse a sí misma.
   * Es lo que permite que `actualizar` y `descontarStock` devuelvan el
   * tipo correcto sin que la clase base tenga que conocer a sus hijas.
   */
  protected abstract reconstruir(datos: ProductData): Product;

  /**
   * Costo de envío del producto. Es lo único que distingue a un producto
   * físico de uno digital, y está declarado en el contrato base, así que
   * cualquier código que reciba un `Product` puede invocarlo sin saber
   * la subclase concreta (eso es polimorfismo, y es seguro para LSP).
   */
  abstract costoEnvio(): Dinero;

  get id(): ProductId {
    return this.productId;
  }
  get nombre(): string {
    return this.productName;
  }
  get descripcion(): string {
    return this.productDescription;
  }
  get categoria(): string {
    return this.productCategory;
  }
  get precio(): Dinero {
    return this.productPrice;
  }
  get stock(): number {
    return this.productStock;
  }
  get imagen(): string {
    return this.productImage;
  }
  get tipo(): TipoProducto {
    return this.productType;
  }
  get coleccion(): ProductCollection {
    return this.productCollection;
  }
  get destacado(): boolean {
    return this.isFeatured;
  }
  get novedad(): boolean {
    return this.isNewArrival;
  }
  get tendencia(): boolean {
    return this.isTrending;
  }

  /**
   * Total de merchandise, sin envío.
   *
   * No sobrescribible por acuerdo: todas las subclases deben dar el mismo
   * significado a `precio * cantidad`.
   */
  totalPedido(cantidad: number): Dinero {
    this.verificarCantidad(cantidad);
    return this.productPrice.multiplicar(cantidad);
  }

  /**
   * Plantilla de método: el precio se calcula igual en todas las
   * subclases, pero el costo de envío se resuelve por polimorfismo.
   */
  cotizar(cantidad: number): Dinero {
    return this.totalPedido(cantidad).sumar(this.costoEnvio());
  }

  /** Valor total del producto almacenado: precio x stock. */
  precioTotal(): Dinero {
    return this.productPrice.multiplicar(this.productStock);
  }

  esAgotado(): boolean {
    return this.productStock === 0;
  }

  nivelStock(umbral: number = UMBRAL_STOCK_CRITICO): StockLevel {
    if (this.esAgotado()) {
      return StockLevel.Agotado;
    }
    return this.productStock <= umbral ? StockLevel.Bajo : StockLevel.Disponible;
  }

  necesitaReposicion(umbral: number = UMBRAL_STOCK_CRITICO): boolean {
    return this.nivelStock(umbral) !== StockLevel.Disponible;
  }

  perteneceAColeccion(coleccion: ProductCollection): boolean {
    return this.productCollection === coleccion;
  }

  perteneceAlListado(listado: CatalogListing): boolean {
    return listado === CatalogListing.Destacados ? this.isFeatured : this.isNewArrival;
  }

  cumpleFiltro(filtro: ProductFilter): boolean {
    if (filtro.coleccion && !this.perteneceAColeccion(filtro.coleccion)) {
      return false;
    }
    if (filtro.categoria && !this.coincideConTexto(this.productCategory, filtro.categoria)) {
      return false;
    }
    if (filtro.busqueda) {
      const texto = `${this.productName} ${this.productDescription} ${this.productCategory}`;
      if (!this.coincideConTexto(texto, filtro.busqueda)) {
        return false;
      }
    }
    if (filtro.listado && !this.perteneceAlListado(filtro.listado)) {
      return false;
    }
    if (filtro.agotados === false && this.esAgotado()) {
      return false;
    }
    return true;
  }

  /**
   * Compara este producto con otro según el criterio pedido. Devuelve un
   * número negativo, cero o positivo, listo para `Array.prototype.sort`.
   */
  compararCon(otro: Product, orden: ProductSort): number {
    switch (orden) {
      case 'precio-asc':
        return this.productPrice.valor - otro.precio.valor;
      case 'precio-desc':
        return otro.precio.valor - this.productPrice.valor;
      case 'stock':
        return otro.stock - this.productStock;
      case 'nombre':
      default:
        return this.productName.localeCompare(otro.nombre, 'es');
    }
  }

  actualizar(borrador: ProductDraft): Product {
    return this.reconstruir({
      id: this.productId,
      nombre: borrador.nombre,
      descripcion: borrador.descripcion,
      categoria: borrador.categoria,
      precio: Dinero.de(borrador.precio),
      stock: borrador.stock,
      imagen: borrador.imagen,
      tipo: this.productType,
      coleccion: borrador.coleccion,
      destacado: borrador.destacado,
      novedad: borrador.novedad,
      tendencia: borrador.tendencia,
    });
  }

  /**
   * El borrador que, pasado por `actualizar`, reconstruye este producto.
   *
   * Es la operación inversa de `actualizar` y vive aquí porque el
   * conocimiento de qué campos forman un producto pertenece a la entidad: un
   * adapter HTTP que mapease los campos a mano se desincronizaría en cuanto se
   * añadiera uno nuevo, sin que ninguna comprobación lo detectara.
   */
  borrador(): ProductDraft {
    return {
      nombre: this.productName,
      descripcion: this.productDescription,
      categoria: this.productCategory,
      precio: this.productPrice.valor,
      stock: this.productStock,
      imagen: this.productImage,
      tipo: this.productType,
      coleccion: this.productCollection,
      destacado: this.isFeatured,
      novedad: this.isNewArrival,
      tendencia: this.isTrending,
    };
  }

  descontarStock(cantidad: number): Product {
    this.verificarCantidad(cantidad);
    return this.reconstruir({ ...this.aDatos(), stock: this.productStock - cantidad });
  }

  reponerStock(cantidad: number): Product {
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      throw new Error('La cantidad a reponer no es válida.');
    }
    return this.reconstruir({ ...this.aDatos(), stock: this.productStock + cantidad });
  }

  marcarComoTendencia(valor: boolean): Product {
    return this.reconstruir({ ...this.aDatos(), tendencia: valor });
  }

  /** La identidad de un producto es su identificador, no su contenido. */
  esIgualA(otro: Product): boolean {
    return otro instanceof Product && this.productId.esIgualA(otro.id);
  }

  /** Compara contra un identificador suelto, sin construir un producto. */
  tieneId(id: ProductId): boolean {
    return this.productId.esIgualA(id);
  }

  aDatos(): ProductData {
    return Object.freeze({
      id: this.productId,
      nombre: this.productName,
      descripcion: this.productDescription,
      categoria: this.productCategory,
      precio: this.productPrice,
      stock: this.productStock,
      imagen: this.productImage,
      tipo: this.productType,
      coleccion: this.productCollection,
      destacado: this.isFeatured,
      novedad: this.isNewArrival,
      tendencia: this.isTrending,
    });
  }

  private coincideConTexto(texto: string, criterio: string): boolean {
    const normalizado = criterio.trim().toLowerCase();
    if (!normalizado) {
      return true;
    }
    return texto.toLowerCase().includes(normalizado);
  }

  private verificarCantidad(cantidad: number): void {
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      throw new Error('La cantidad solicitada no es válida.');
    }
    if (cantidad > this.productStock) {
      throw new Error('La cantidad solicitada no está disponible.');
    }
  }
}

/** Criterios de consulta del catálogo. */
export interface ProductFilter {
  readonly coleccion?: ProductCollection;
  readonly categoria?: string;
  readonly busqueda?: string;
  readonly listado?: CatalogListing;
  readonly agotados?: boolean;
  readonly orden?: ProductSort;
}
