import type { ProductCatalogRepository } from '@/domain/catalog/contracts';
import type { Product, ProductFilter } from '@/domain/catalog/Producto';
import { ProductId } from '@/domain/shared/ProductId';
import { clienteApi, segmento } from './ClienteApi';
import { productoDesdeJson } from './Deserializadores';

/**
 * Catálogo por HTTP.
 *
 * El filtro viaja en la query en lugar de filtrar en el cliente a propósito:
 * el servidor es quien tiene la lista completa, y filtrar en el navegador
 * obligaría a descargarla entera para descartar la mayoría.
 *
 * La lista de parámetros admitidos es explícita y coincide con lo que lee
 * `GET /api/catalogo`. Si se mandara un parámetro que el servidor no entiende,
 * lo ignoraría en silencio y devolvería la lista completa: la vista mostraría
 * resultados que el usuario no pidió, sin ningún error que lo delate.
 */
const FILTROS = ['coleccion', 'categoria', 'busqueda', 'listado', 'agotados', 'orden'] as const;

function aQuery(filtro: ProductFilter | undefined): string {
  if (!filtro) {
    return '';
  }
  const params = new URLSearchParams();
  for (const clave of FILTROS) {
    const valor = filtro[clave];
    if (valor === undefined || valor === null || valor === '') {
      continue;
    }
    params.set(clave, String(valor));
  }
  const texto = params.toString();
  return texto ? `?${texto}` : '';
}

/**
 * Las escrituras se mandan una a una a los endpoints de administración, que
 * son quienes revalidan los invariantes en el servidor: el cliente no es la
 * autoridad. Cada mutación viaja como la operación que representa (`crear` →
 * `POST`, `actualizar` → `PUT`, `eliminar` → `DELETE`) en vez de como una
 * colección reescrita.
 */
export class HttpProductCatalogRepository implements ProductCatalogRepository {
  async listar(filtro?: ProductFilter): Promise<ReadonlyArray<Product>> {
    const cuerpo = await clienteApi.obtener<{ productos: unknown[] }>(`/api/catalogo${aQuery(filtro)}`);
    return cuerpo.productos.map(productoDesdeJson);
  }

  async obtenerPorId(id: ProductId): Promise<Product | undefined> {
    try {
      const cuerpo = await clienteApi.obtener<{ producto: unknown }>(`/api/productos/${segmento(id.valor)}`);
      return productoDesdeJson(cuerpo.producto);
    } catch (fallo) {
      // Un 404 significa "no existe", que es un resultado válido del
      // contrato, no un error. Re-lanzar el resto de fallos.
      if (fallo instanceof Error && (fallo as { estado?: number }).estado === 404) {
        return undefined;
      }
      throw fallo;
    }
  }

  async crear(producto: Product): Promise<Product> {
    await clienteApi.crear('/api/admin/productos', producto.borrador());
    return producto;
  }

  async actualizar(id: ProductId, producto: Product): Promise<Product> {
    // `PUT`, no `PATCH`: el endpoint reemplaza el producto completo, que es
    // exactamente lo que hace `Product.actualizar`. Un `PATCH` devolvería 405
    // y el cambio se perdería en silencio.
    await clienteApi.reemplazar(`/api/admin/productos/${segmento(id.valor)}`, producto.borrador());
    return producto;
  }

  async eliminar(id: ProductId): Promise<void> {
    await clienteApi.borrar(`/api/admin/productos/${segmento(id.valor)}`);
  }
}