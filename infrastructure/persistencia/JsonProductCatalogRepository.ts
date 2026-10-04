import type { Product, ProductFilter } from '@/domain/catalog/Producto';
import type { ProductCatalogRepository } from '@/domain/catalog/contracts';
import type { ProductId } from '@/domain/shared/ProductId';
import type { EstadoServidor } from './EstadoServidor';

/**
 * Repositorio de catálogo respaldado por el archivo JSON.
 *
 * Implementa el mismo puerto `ProductCatalogRepository` que la versión en
 * memoria: el dominio y los casos de uso no cambian. Es la demostración
 * práctica de que la dependencia apunta hacia la abstracción.
 */
export class JsonProductCatalogRepository implements ProductCatalogRepository {
  constructor(private readonly estado: EstadoServidor) {}

  async listar(filtro: ProductFilter = {}): Promise<ReadonlyArray<Product>> {
    const { productos } = await this.estado.estado();
    const candidatos = productos.filter((producto) => producto.cumpleFiltro(filtro));
    const orden = filtro.orden ?? 'nombre';
    return [...candidatos].sort((a, b) => a.compararCon(b, orden));
  }

  async obtenerPorId(id: ProductId): Promise<Product | undefined> {
    const { productos } = await this.estado.estado();
    return productos.find((producto) => producto.tieneId(id));
  }

  async crear(producto: Product): Promise<Product> {
    await this.estado.transact((estado) => {
      if (estado.productos.some((p) => p.tieneId(producto.id))) {
        throw new Error(`Ya existe un producto con el identificador "${producto.id.valor}".`);
      }
      estado.productos = [...estado.productos, producto];
      return { valor: undefined, persistir: true };
    });
    return producto;
  }

  async actualizar(id: ProductId, producto: Product): Promise<Product> {
    await this.estado.transact((estado) => {
      if (!estado.productos.some((p) => p.tieneId(id))) {
        throw new Error(`El producto "${id.valor}" no existe.`);
      }
      estado.productos = estado.productos.map((p) => (p.tieneId(id) ? producto : p));
      return { valor: undefined, persistir: true };
    });
    return producto;
  }

  async eliminar(id: ProductId): Promise<void> {
    await this.estado.transact((estado) => {
      const restantes = estado.productos.filter((p) => !p.tieneId(id));
      if (restantes.length === estado.productos.length) {
        throw new Error(`El producto "${id.valor}" no existe.`);
      }
      estado.productos = restantes;
      return { valor: undefined, persistir: true };
    });
  }
}