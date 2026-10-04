import type { Product, ProductFilter } from '@/domain/catalog/Producto';
import type { ProductCatalogRepository } from '@/domain/catalog/contracts';
import { ProductId } from '@/domain/shared/ProductId';
import { CatalogListing, ProductCollection, ProductSort } from '@/domain/shared/enums';
import { MAXIMO_PRODUCTOS_POR_PAGINA } from '@/domain/shared/constantes';

/**
 * Caso de uso de consulta del catálogo público.
 *
 * Depende del puerto `ProductCatalogRepository`, no de una implementación
 * concreta: por eso `listarPorColeccion`, `destacados` y `novedades` son
 * el mismo método con distinto filtro, en lugar de tres servicios o de
 * seis arrays hardcodeados en las páginas.
 *
 * Los identificadores viajan como `string` desde la URL; convertirlos a
 * `ProductId` aquí (y no en la vista) mantiene el value object en una sola
 * frontera.
 */
export class CatalogoService {
  constructor(private readonly productos: ProductCatalogRepository) {}

  async listar(filtro: ProductFilter = {}): Promise<ReadonlyArray<Product>> {
    return this.productos.listar({ agotados: false, ...filtro });
  }

  async listarPorColeccion(coleccion: ProductCollection): Promise<ReadonlyArray<Product>> {
    return this.listar({ coleccion, orden: 'nombre' });
  }

  async listarPorListado(listado: CatalogListing): Promise<ReadonlyArray<Product>> {
    return this.listar({ listado, orden: 'nombre' });
  }

  async destacados(limite = MAXIMO_PRODUCTOS_POR_PAGINA): Promise<ReadonlyArray<Product>> {
    return (await this.listarPorListado(CatalogListing.Destacados)).slice(0, limite);
  }

  async novedades(limite = MAXIMO_PRODUCTOS_POR_PAGINA): Promise<ReadonlyArray<Product>> {
    return (await this.listarPorListado(CatalogListing.Novedades)).slice(0, limite);
  }

  async buscar(texto: string, orden: ProductSort = 'nombre'): Promise<ReadonlyArray<Product>> {
    return this.listar({ busqueda: texto, orden });
  }

  /**
   * Busca por identificador. Devuelve `undefined` en vez de un producto
   * genérico: antes la página de detalle caía en un `DEFAULT_PRODUCT` con
   * precio y stock inventados, así que casi ningún enlace mostraba el
   * producto real.
   */
  async obtenerPorId(id: string): Promise<Product | undefined> {
    return this.productos.obtenerPorId(new ProductId(id));
  }

  async existe(id: string): Promise<boolean> {
    return (await this.obtenerPorId(id)) !== undefined;
  }
}