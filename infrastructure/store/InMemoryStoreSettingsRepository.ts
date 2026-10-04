import type { StoreSettingsRepository } from '@/domain/tienda/contracts';
import type { ConfiguracionTienda } from '@/domain/tienda/ConfiguracionTienda';
import type { TiendaEstado } from './TiendaEstado';

export class InMemoryStoreSettingsRepository implements StoreSettingsRepository {
  constructor(private readonly estado: TiendaEstado) {}

  async obtener(): Promise<ConfiguracionTienda> {
    return this.estado.configuracion;
  }

  async guardar(configuracion: ConfiguracionTienda): Promise<void> {
    this.estado.configuracion = configuracion;
  }
}