import type { StoreSettingsRepository } from '@/domain/tienda/contracts';
import type { ConfiguracionTienda } from '@/domain/tienda/ConfiguracionTienda';
import type { EstadoServidor } from './EstadoServidor';

export class JsonStoreSettingsRepository implements StoreSettingsRepository {
  constructor(private readonly estado: EstadoServidor) {}

  async obtener(): Promise<ConfiguracionTienda> {
    const { configuracion } = await this.estado.estado();
    return configuracion;
  }

  async guardar(configuracion: ConfiguracionTienda): Promise<void> {
    await this.estado.transact((estado) => {
      estado.configuracion = configuracion;
      return { valor: undefined, persistir: true };
    });
  }
}