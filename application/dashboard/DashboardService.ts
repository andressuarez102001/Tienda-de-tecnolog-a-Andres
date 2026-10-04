import type { ProductCatalogRepository } from '@/domain/catalog/contracts';
import type { ReportRepository } from '@/domain/tienda/contracts';
import type { Product } from '@/domain/catalog/Producto';
import type { ReportePeriodo } from '@/domain/tienda/ReportePeriodo';
import { Dinero } from '@/domain/shared/Dinero';

/**
 * Métricas del panel.
 *
 * Los importes son `Dinero`, no `number`: así la vista no puede sumar ni
 * restar sobre un valor que no pasó por la validación del value object, y
 * `PriceFormatter` recibe siempre lo que espera.
 */
export interface DashboardMetrics {
  readonly totalMesVentas: Dinero;
  readonly totalPedidosMes: number;
  readonly valorTotalInventario: Dinero;
  readonly productosCriticos: ReadonlyArray<Product>;
  readonly totalUnidadesStock: number;
}

/**
 * Caso de uso: métricas del dashboard.
 *
 * No accede al repositorio monolítico `AdminStateRepository`, sino a dos
 * puertos estrechos. Antes esto no era posible: para leer las ventas del
 * mes había que cargar también los 35 productos, 4 pedidos, etc.
 *
 * SRP: solo calcula agregados, no modifica estado.
 */
export class DashboardService {
  constructor(
    private readonly productos: ProductCatalogRepository,
    private readonly reportes: ReportRepository,
  ) {}

  async metricas(): Promise<DashboardMetrics> {
    const catalogo = await this.productos.listar();
    const listadoReportes = await this.reportes.listar();
    return {
      totalMesVentas: this.sumarVentas(listadoReportes),
      totalPedidosMes: this.sumarPedidos(listadoReportes),
      valorTotalInventario: this.sumarInventario(catalogo),
      productosCriticos: catalogo.filter((p) => p.necesitaReposicion()),
      totalUnidadesStock: this.sumarStock(catalogo),
    };
  }

  private sumarVentas(reportes: ReadonlyArray<ReportePeriodo>): Dinero {
    return reportes.reduce((suma, r) => suma.sumar(r.ventas), Dinero.cero());
  }

  private sumarPedidos(reportes: ReadonlyArray<ReportePeriodo>): number {
    return reportes.reduce((suma, r) => suma + r.totalPedidos, 0);
  }

  private sumarInventario(productos: ReadonlyArray<Product>): Dinero {
    return productos.reduce((suma, p) => suma.sumar(p.precioTotal()), Dinero.cero());
  }

  private sumarStock(productos: ReadonlyArray<Product>): number {
    return productos.reduce((suma, p) => suma + p.stock, 0);
  }
}