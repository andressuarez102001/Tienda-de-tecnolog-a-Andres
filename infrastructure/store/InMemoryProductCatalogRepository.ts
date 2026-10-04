import type { Product, ProductFilter } from '@/domain/catalog/Producto';
import type { ProductCatalogRepository } from '@/domain/catalog/contracts';
import type { ProductId } from '@/domain/shared/ProductId';
import { copia, type TiendaEstado } from './TiendaEstado';

/**
 * Repositorio de catálogo en memoria (solo para pruebas).
 *
 * Implementa `ProductCatalogRepository`, que es un puerto del dominio: esta
 * clase depende de la abstracción, no al revés. Los métodos son asíncronos
 * aunque el almacenamiento no lo sea, para que sustituirlo por PostgreSQL,
 * por JSON o por una API no obligue a cambiar los casos de uso.
 */
export class InMemoryProductCatalogRepository implements ProductCatalogRepository {
  constructor(private readonly estado: TiendaEstado) {}

  async listar(filtro: ProductFilter = {}): Promise<ReadonlyArray<Product>> {
    const candidatos = this.estado.productos.filter((producto) => producto.cumpleFiltro(filtro));
    const orden = filtro.orden ?? 'nombre';
    return copia(candidatos.sort((a, b) => a.compararCon(b, orden)));
  }

  async obtenerPorId(id: ProductId): Promise<Product | undefined> {
    return this.estado.productos.find((producto) => producto.tieneId(id));
  }

  async crear(producto: Product): Promise<Product> {
    if (this.estado.productos.some((p) => p.tieneId(producto.id))) {
      throw new Error(`Ya existe un producto con el identificador "${producto.id.valor}".`);
    }
    this.estado.productos = [...this.estado.productos, producto];
    return producto;
  }

  async actualizar(id: ProductId, producto: Product): Promise<Product> {
    if (!this.estado.productos.some((p) => p.tieneId(id))) {
      throw new Error(`El producto "${id.valor}" no existe.`);
    }
    this.estado.productos = this.estado.productos.map((p) => (p.tieneId(id) ? producto : p));
    return producto;
  }

  async eliminar(id: ProductId): Promise<void> {
    const restantes = this.estado.productos.filter((p) => !p.tieneId(id));
    if (restantes.length === this.estado.productos.length) {
      throw new Error(`El producto "${id.valor}" no existe.`);
    }
    this.estado.productos = restantes;
  }
}