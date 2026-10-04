import type { ProductId } from '@/domain/shared/ProductId';
import type { Product, ProductFilter } from './Producto';

export type { ProductFilter } from './Producto';

/**
 * Puerto de acceso al catálogo.
 *
 * Antes existía un `AdminStateRepository` con un único método `load()` que
 * devolvía las seis colecciones de la tienda a la vez. Eso obligaba a
 * `StoreConfigService` (que solo lee tres campos de configuración) a
 * construir 19 productos, 3 pedidos, 2 usuarios, 4 categorías y 4 reportes.
 * Violación de ISP.
 *
 * Después existió un `guardar(colección completa)`: el adaptador JSON y el de
 * memoria lo soportaban sin problema, pero el HTTP tenía que traducir el diff
 * contra el servidor para no reenviar los 35 productos en cada edición. Ese
 * contrato casaba mal con una base de datos, donde lo natural es una fila por
 * entidad.
 *
 * Hoy el puerto es CRUD fino: `crear`, `actualizar` y `eliminar` operan sobre
 * una entidad (una fila) en vez de sobre la colección, que es lo que entienden
 * PostgreSQL, el archivo JSON, la API y la memoria por igual.
 *
 * Los métodos son asíncronos porque el adaptador real no está en memoria:
 * puede ser una base de datos, un archivo JSON o una API HTTP. Un puerto
 * síncrono obligaría a untruecer la interfaz (`Promise<T>` no es `T`) en
 * cuanto eso ocurra.
 */
export interface ProductCatalogRepository {
  listar(filtro?: ProductFilter): Promise<ReadonlyArray<Product>>;
  obtenerPorId(id: ProductId): Promise<Product | undefined>;
  crear(producto: Product): Promise<Product>;
  actualizar(id: ProductId, producto: Product): Promise<Product>;
  eliminar(id: ProductId): Promise<void>;
}