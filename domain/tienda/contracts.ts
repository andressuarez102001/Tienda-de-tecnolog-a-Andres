import type { Categoria } from './Categoria';
import type { ConfiguracionTienda } from './ConfiguracionTienda';
import type { ReportePeriodo } from './ReportePeriodo';

/**
 * Puertos estrechos de los agregados de tienda.
 *
 * Antes existía un `AdminStateRepository` con un solo método `load()` que
 * devolvía las seis colecciones juntas. Quemarse para leer el correo de
 * contacto obligaba a instanciar el catálogo completo: violación de ISP.
 *
 * El identificador de la categoría lo asigna el almacén (una secuencia en la
 * base de datos o en el archivo), no el caso de uso: `crear(nombre)` devuelve
 * la entidad ya persistida con su id real. Así el adaptador de PostgreSQL
 * puede usar `BIGSERIAL` y el de HTTP el id que asigna el servidor, sin que
 * el servicio tenga que adivinar el siguiente id.
 */
export interface CategoryRepository {
  listar(): Promise<ReadonlyArray<Categoria>>;
  crear(nombre: string): Promise<Categoria>;
  eliminar(id: number): Promise<void>;
}

/**
 * Reportes de solo lectura: los calcula el servidor a partir de los pedidos y
 * el panel no los edita, así que no hay `guardar`.
 */
export interface ReportRepository {
  listar(): Promise<ReadonlyArray<ReportePeriodo>>;
}

export interface StoreSettingsRepository {
  obtener(): Promise<ConfiguracionTienda>;
  guardar(configuracion: ConfiguracionTienda): Promise<void>;
}