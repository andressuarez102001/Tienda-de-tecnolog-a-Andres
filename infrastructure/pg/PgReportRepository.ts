import type { ReportRepository } from '@/domain/tienda/contracts';
import type { ReportePeriodo } from '@/domain/tienda/ReportePeriodo';
import type { BasePg } from './BasePg';
import { reporteDesdeFila } from './Filas';

const COLUMNAS = `periodo, rango_fechas AS "rangoFechas", total_pedidos AS "totalPedidos",
  ventas, cerrado`;

export class PgReportRepository implements ReportRepository {
  constructor(private readonly base: BasePg) {}

  async listar(): Promise<ReadonlyArray<ReportePeriodo>> {
    const filas = await this.base.consulta(`SELECT ${COLUMNAS} FROM reportes`);
    return filas.map(reporteDesdeFila);
  }
}