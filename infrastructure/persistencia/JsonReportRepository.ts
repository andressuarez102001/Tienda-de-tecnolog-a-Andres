import type { ReportRepository } from '@/domain/tienda/contracts';
import type { ReportePeriodo } from '@/domain/tienda/ReportePeriodo';
import type { EstadoServidor } from './EstadoServidor';

export class JsonReportRepository implements ReportRepository {
  constructor(private readonly estado: EstadoServidor) {}

  async listar(): Promise<ReadonlyArray<ReportePeriodo>> {
    const { reportes } = await this.estado.estado();
    return [...reportes];
  }
}