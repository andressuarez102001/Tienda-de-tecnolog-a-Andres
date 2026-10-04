import type { ReportRepository } from '@/domain/tienda/contracts';
import type { ReportePeriodo } from '@/domain/tienda/ReportePeriodo';
import { copia, type TiendaEstado } from './TiendaEstado';

/** Reportes en memoria (solo para pruebas): de solo lectura. */
export class InMemoryReportRepository implements ReportRepository {
  constructor(private readonly estado: TiendaEstado) {}

  async listar(): Promise<ReadonlyArray<ReportePeriodo>> {
    return copia(this.estado.reportes);
  }
}