import type { Product, ProductFilter } from '@/domain/catalog/Producto';
import type { ProductCatalogRepository } from '@/domain/catalog/contracts';
import type { ProductDraft } from '@/domain/catalog/ProductoDraft';
import { ProductoFabric } from '@/domain/catalog/ProductoFabric';
import { ProductId } from '@/domain/shared/ProductId';

/**
 * Caso de uso de administración del catálogo.
 *
 * Antes el servicio era una función pura que recibía el array, devolvía el
 * array, y el componente se encargaba de guardarlo... lo cual no ocurría:
 * el resultado se quedaba en estado local y se perdía al recargar. Hoy el
 * servicio persiste a través del puerto.
 *
 * Como la entidad es inmutable, "editar" significa producir una entidad
 * nueva y escribirla. El puerto es CRUD fino (`crear`/`actualizar`/
 * `eliminar` sobre una entidad), así que aquí no se reconstruye la colección
 * entera para guardarla: se le dice al almacén qué fila cambió.
 */
export class ProductoAdminService {
  constructor(private readonly productos: ProductCatalogRepository) {}

  async listar(filtro: ProductFilter = {}): Promise<ReadonlyArray<Product>> {
    return this.productos.listar(filtro);
  }

  /**
   * Crea un producto. El identificador se deriva del nombre comercial con
   * `ProductId.generarDesde`, que normaliza a minúsculas y guiones, así que
   * el id es legible y único sin depender del reloj del sistema
   * (`Date.now()`, que era lo que usaba el servicio de categorías antes).
   */
  async crear(borrador: ProductDraft): Promise<Product> {
    const id = ProductId.generarDesde(borrador.nombre);
    if (await this.productos.obtenerPorId(id)) {
      throw new Error(`Ya existe un producto con el identificador "${id.valor}".`);
    }
    return this.productos.crear(ProductoFabric.crear(id, borrador));
  }

  /**
   * Actualiza un producto conservando su identificador.
   *
   * Si el borrador cambia el tipo (físico ↔ digital) se reconstruye la
   * entidad con `ProductoFabric`: la entidad base no puede convertirse en
   * su propia subclase.
   */
  async actualizar(id: string, borrador: ProductDraft): Promise<Product> {
    const productId = new ProductId(id);
    const actual = await this.productos.obtenerPorId(productId);
    if (!actual) {
      throw new Error(`El producto "${id}" no existe.`);
    }

    const actualizado =
      actual.tipo === borrador.tipo
        ? actual.actualizar(borrador)
        : ProductoFabric.crear(productId, borrador);

    return this.productos.actualizar(productId, actualizado);
  }

  async eliminar(id: string): Promise<void> {
    const productId = new ProductId(id);
    if (!(await this.productos.obtenerPorId(productId))) {
      throw new Error(`El producto "${id}" no existe.`);
    }
    await this.productos.eliminar(productId);
  }

  async alternarTendencia(id: string): Promise<Product> {
    const productId = new ProductId(id);
    const actual = await this.productos.obtenerPorId(productId);
    if (!actual) {
      throw new Error(`El producto "${id}" no existe.`);
    }
    const actualizado = actual.marcarComoTendencia(!actual.tendencia);
    return this.productos.actualizar(productId, actualizado);
  }
}