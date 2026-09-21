import type { AdminStateRepository } from '@/domain/admin/contracts';
import type { StoreSettings } from '@/domain/admin/entities';

/**
 * Responsabilidad única: lectura de la configuración de la tienda.
 */
export class StoreConfigService {
  constructor(private readonly repository: AdminStateRepository) {}

  loadInitialState(): { config: StoreSettings } {
    return { config: this.repository.load().config };
  }
}