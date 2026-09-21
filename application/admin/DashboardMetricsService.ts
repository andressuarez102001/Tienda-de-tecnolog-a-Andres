import type { AdminStateRepository } from '@/domain/admin/contracts';
import type { PeriodReport, Product } from '@/domain/admin/entities';

export interface DashboardMetrics {
  totalMesVentas: number;
  totalPedidosMes: number;
  valorTotalInventario: number;
  productosCriticos: Product[];
  totalUnidadesStock: number;
}

/**
 * Responsabilidad única: cálculo de métricas para el dashboard.
 */
export class DashboardMetricsService {
  constructor(private readonly repository: AdminStateRepository) {}

  loadInitialState(): { productos: Product[]; reportesPeriodos: PeriodReport[] } {
    const state = this.repository.load();
    return { productos: state.productos, reportesPeriodos: state.reportesPeriodos };
  }

  dashboard(products: Product[], reports: PeriodReport[]): DashboardMetrics {
    return {
      totalMesVentas: reports.reduce((sum, report) => sum + report.ventas, 0),
      totalPedidosMes: reports.reduce((sum, report) => sum + report.totalPedidos, 0),
      valorTotalInventario: products.reduce((sum, product) => sum + product.valorEnInventario(), 0),
      productosCriticos: products.filter((product) => product.necesitaReposicion()),
      totalUnidadesStock: products.reduce((sum, product) => sum + product.stock, 0),
    };
  }
}