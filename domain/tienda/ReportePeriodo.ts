import { Dinero } from '@/domain/shared/Dinero';

export interface PeriodReportData {
  readonly periodo: string;
  readonly rangoFechas: string;
  readonly totalPedidos: number;
  readonly ventas: Dinero;
  readonly cerrado: boolean;
}

/**
 * Entidad Reporte de período.
 *
 * `estado` era un `string` libre; ahora es un booleano `cerrado`, que es
 * lo que el dominio realmente necesita saber, y la etiqueta se decide en
 * la capa de presentación.
 */
export class ReportePeriodo {
  private readonly reportPeriod: string;
  private readonly reportDateRange: string;
  private readonly reportOrders: number;
  private readonly reportSales: Dinero;
  private readonly reportClosed: boolean;

  constructor(datos: PeriodReportData) {
    if (!datos.periodo.trim() || !datos.rangoFechas.trim()) {
      throw new Error('El reporte debe tener período y rango de fechas.');
    }
    if (!Number.isInteger(datos.totalPedidos) || datos.totalPedidos < 0) {
      throw new Error('El total de pedidos del reporte no es válido.');
    }
    this.reportPeriod = datos.periodo.trim();
    this.reportDateRange = datos.rangoFechas.trim();
    this.reportOrders = datos.totalPedidos;
    this.reportSales = datos.ventas;
    this.reportClosed = datos.cerrado;
  }

  static crear(
    periodo: string,
    rangoFechas: string,
    totalPedidos: number,
    ventas: number,
    cerrado = true,
  ): ReportePeriodo {
    return new ReportePeriodo({
      periodo,
      rangoFechas,
      totalPedidos,
      ventas: Dinero.de(ventas),
      cerrado,
    });
  }

  get periodo(): string {
    return this.reportPeriod;
  }
  get rangoFechas(): string {
    return this.reportDateRange;
  }
  get totalPedidos(): number {
    return this.reportOrders;
  }
  get ventas(): Dinero {
    return this.reportSales;
  }
  get cerrado(): boolean {
    return this.reportClosed;
  }

  esIgualA(otro: ReportePeriodo): boolean {
    return otro instanceof ReportePeriodo && this.reportPeriod === otro.periodo;
  }

  aDatos(): PeriodReportData {
    return Object.freeze({
      periodo: this.reportPeriod,
      rangoFechas: this.reportDateRange,
      totalPedidos: this.reportOrders,
      ventas: this.reportSales,
      cerrado: this.reportClosed,
    });
  }
}
