import type { ReportRepository } from '@/domain/tienda/contracts';
import type { ReportePeriodo } from '@/domain/tienda/ReportePeriodo';

/**
 * Caso de uso de reportes. Lee datos (CQRS ligero): no modifica.
 */
export class ReporteService {
  constructor(private readonly reportes: ReportRepository) {}

  async listar(): Promise<ReadonlyArray<ReportePeriodo>> {
    return this.reportes.listar();
  }
}