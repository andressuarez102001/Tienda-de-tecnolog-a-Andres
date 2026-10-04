import type {
  CategoryRepository,
  ReportRepository,
  StoreSettingsRepository,
} from '@/domain/tienda/contracts';
import type { Categoria } from '@/domain/tienda/Categoria';
import type { ReportePeriodo } from '@/domain/tienda/ReportePeriodo';
import type { ConfiguracionTienda } from '@/domain/tienda/ConfiguracionTienda';
import { clienteApi, segmento } from './ClienteApi';
import { categoriaDesdeJson, reporteDesdeJson, configuracionDesdeJson } from './Deserializadores';

/**
 * Categorías por HTTP: crear y eliminar, que es todo lo que hace el panel.
 *
 * El id lo asigna el servidor (el endpoint solo recibe el nombre), así que
 * `crear` devuelve la entidad rehidratada de la respuesta, con su id real.
 */
export class HttpCategoryRepository implements CategoryRepository {
  async listar(): Promise<ReadonlyArray<Categoria>> {
    const cuerpo = await clienteApi.obtener<{ categorias: unknown[] }>('/api/admin/categorias');
    return cuerpo.categorias.map(categoriaDesdeJson);
  }

  async crear(nombre: string): Promise<Categoria> {
    const cuerpo = await clienteApi.crear<{ categoria: unknown }>('/api/admin/categorias', {
      nombre,
    });
    return categoriaDesdeJson(cuerpo.categoria);
  }

  async eliminar(id: number): Promise<void> {
    await clienteApi.borrar(`/api/admin/categorias/${segmento(String(id))}`);
  }
}

/** Reportes por HTTP: de solo lectura; los genera el servicio de reportes. */
export class HttpReportRepository implements ReportRepository {
  async listar(): Promise<ReadonlyArray<ReportePeriodo>> {
    const cuerpo = await clienteApi.obtener<{ reportes: unknown[] }>('/api/admin/configuracion');
    return cuerpo.reportes.map(reporteDesdeJson);
  }
}

/** Configuración de la tienda por HTTP. */
export class HttpStoreSettingsRepository implements StoreSettingsRepository {
  async obtener(): Promise<ConfiguracionTienda> {
    const cuerpo = await clienteApi.obtener<{ configuracion: unknown }>('/api/admin/configuracion');
    return configuracionDesdeJson(cuerpo.configuracion);
  }

  async guardar(configuracion: ConfiguracionTienda): Promise<void> {
    await clienteApi.reemplazar('/api/admin/configuracion', {
      nombreTienda: configuracion.nombreTienda,
      costoEnvio: configuracion.costoEnvio.valor,
      emailContacto: configuracion.emailContacto.valor,
    });
  }
}