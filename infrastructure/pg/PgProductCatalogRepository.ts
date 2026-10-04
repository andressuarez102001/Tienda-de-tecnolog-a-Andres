import type { ProductCatalogRepository } from '@/domain/catalog/contracts';
import type { Product, ProductFilter } from '@/domain/catalog/Producto';
import { ProductoFisico } from '@/domain/catalog/ProductoFisico';
import type { ProductId } from '@/domain/shared/ProductId';
import type { BasePg } from './BasePg';
import { productoDesdeFila } from './Filas';

const COLUMNAS = `id, nombre, descripcion, categoria, precio, stock, imagen, tipo, coleccion,
  destacado, novedad, tendencia, peso_gramos AS "pesoGramos"`;

/**
 * Catálogo respaldado por PostgreSQL.
 *
 * El filtrado y el orden se delegan al dominio (`cumpleFiltro`/`compararCon`),
 * igual que hacen los repositorios JSON y en memoria: el criterio vive en la
 * entidad, no se duplica en un `WHERE` por adaptador. Con 35 productos leer
 * la tabla y filtrar en memoria es indiferente, y así el comportamiento es
 * idéntico en los tres almacenes.
 */
export class PgProductCatalogRepository implements ProductCatalogRepository {
  constructor(private readonly base: BasePg) {}

  async listar(filtro: ProductFilter = {}): Promise<ReadonlyArray<Product>> {
    const filas = await this.base.consulta(`SELECT ${COLUMNAS} FROM productos`);
    const candidatos = filas.map(productoDesdeFila).filter((producto) => producto.cumpleFiltro(filtro));
    const orden = filtro.orden ?? 'nombre';
    return candidatos.sort((a, b) => a.compararCon(b, orden));
  }

  async obtenerPorId(id: ProductId): Promise<Product | undefined> {
    const filas = await this.base.consulta(`SELECT ${COLUMNAS} FROM productos WHERE id = $1`, [
      id.valor,
    ]);
    return filas.length > 0 ? productoDesdeFila(filas[0]) : undefined;
  }

  async crear(producto: Product): Promise<Product> {
    const persistido = producto.aDatos();
    const { afectadas } = await this.base.ejecutar(
      `INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock, imagen,
         tipo, coleccion, destacado, novedad, tendencia, peso_gramos)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (id) DO NOTHING`,
      [
        persistido.id.valor,
        persistido.nombre,
        persistido.descripcion,
        persistido.categoria,
        persistido.precio.valor,
        persistido.stock,
        persistido.imagen,
        persistido.tipo,
        persistido.coleccion,
        persistido.destacado,
        persistido.novedad,
        persistido.tendencia,
        persistido instanceof ProductoFisico ? persistido.peso : null,
      ],
    );
    if (afectadas === 0) {
      throw new Error(`Ya existe un producto con el identificador "${persistido.id.valor}".`);
    }
    return producto;
  }

  async actualizar(id: ProductId, producto: Product): Promise<Product> {
    const persistido = producto.aDatos();
    const { afectadas } = await this.base.ejecutar(
      `UPDATE productos SET nombre = $2, descripcion = $3, categoria = $4, precio = $5,
         stock = $6, imagen = $7, tipo = $8, coleccion = $9, destacado = $10,
         novedad = $11, tendencia = $12, peso_gramos = $13
       WHERE id = $1`,
      [
        id.valor,
        persistido.nombre,
        persistido.descripcion,
        persistido.categoria,
        persistido.precio.valor,
        persistido.stock,
        persistido.imagen,
        persistido.tipo,
        persistido.coleccion,
        persistido.destacado,
        persistido.novedad,
        persistido.tendencia,
        persistido instanceof ProductoFisico ? persistido.peso : null,
      ],
    );
    if (afectadas === 0) {
      throw new Error(`El producto "${id.valor}" no existe.`);
    }
    return producto;
  }

  async eliminar(id: ProductId): Promise<void> {
    const { afectadas } = await this.base.ejecutar(`DELETE FROM productos WHERE id = $1`, [
      id.valor,
    ]);
    if (afectadas === 0) {
      throw new Error(`El producto "${id.valor}" no existe.`);
    }
  }
}