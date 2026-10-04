import type { StoreSettingsRepository } from '@/domain/tienda/contracts';
import { ConfiguracionTienda } from '@/domain/tienda/ConfiguracionTienda';
import { Dinero } from '@/domain/shared/Dinero';
import { Email } from '@/domain/shared/Email';

/** Datos editables desde el panel, ya validados por los value objects. */
export interface ConfiguracionEditable {
  readonly nombreTienda: string;
  readonly costoEnvio: number;
  readonly emailContacto: string;
}

/**
 * Caso de uso de la configuración de la tienda.
 *
 * Antes el componente mostraba los valores y el botón "Guardar" solo
 * escribía un mensaje en pantalla: la edición nunca llegaba al
 * repositorio. Ahora toda escritura pasa por aquí y devuelve la entidad
 * resultante, de modo que la vista no toca el repositorio (DIP).
 */
export class ConfiguracionTiendaService {
  constructor(private readonly configuracion: StoreSettingsRepository) {}

  async obtener(): Promise<ConfiguracionTienda> {
    return this.configuracion.obtener();
  }

  /** Reconstruye la entidad con los datos editados y la persiste. */
  async guardar(datos: ConfiguracionEditable): Promise<ConfiguracionTienda> {
    const actualizada = new ConfiguracionTienda({
      nombreTienda: datos.nombreTienda,
      costoEnvio: Dinero.de(datos.costoEnvio),
      emailContacto: new Email(datos.emailContacto),
    });

    await this.configuracion.guardar(actualizada);
    return actualizada;
  }
}