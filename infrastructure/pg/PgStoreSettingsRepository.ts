import type { StoreSettingsRepository } from '@/domain/tienda/contracts';
import type { ConfiguracionTienda } from '@/domain/tienda/ConfiguracionTienda';
import type { BasePg } from './BasePg';
import { configuracionDesdeFila } from './Filas';

const COLUMNAS = `nombre_tienda AS "nombreTienda", costo_envio AS "costoEnvio",
  email_contacto AS "emailContacto"`;

export class PgStoreSettingsRepository implements StoreSettingsRepository {
  constructor(private readonly base: BasePg) {}

  async obtener(): Promise<ConfiguracionTienda> {
    const filas = await this.base.consulta(`SELECT ${COLUMNAS} FROM configuracion WHERE id = 1`);
    return configuracionDesdeFila(filas[0]);
  }

  async guardar(configuracion: ConfiguracionTienda): Promise<void> {
    await this.base.ejecutar(
      `INSERT INTO configuracion (id, nombre_tienda, costo_envio, email_contacto)
       VALUES (1, $1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET nombre_tienda = $1, costo_envio = $2, email_contacto = $3`,
      [configuracion.nombreTienda, configuracion.costoEnvio.valor, configuracion.emailContacto.valor],
    );
  }
}