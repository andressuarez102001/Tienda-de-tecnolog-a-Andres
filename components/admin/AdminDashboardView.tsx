'use client';

import { StockLevel } from '@/domain/shared/enums';
import { useServicios } from '@/presentation/ServiciosProvider';
import { useDatos } from '@/presentation/useDatos';

/**
 * Métricas del panel.
 *
 * Los importes se formatean con `PriceFormatter` y los estados de los
 * reportes con el booleano `cerrado`, no con `estado.includes('Cerrada')`,
 * que fallaba en silencio si cambiaba la cadena.
 */
export default function AdminDashboardView() {
  const { dashboard, reportes, priceFormatter } = useServicios();
  const { datos: metricas, cargando: cargandoMetricas, error: errorMetricas } = useDatos(() =>
    dashboard.metricas(),
  );
  const { datos: reportesPeriodo, cargando: cargandoReportes, error: errorReportes } = useDatos(() =>
    reportes.listar(),
  );

  if (errorMetricas || errorReportes) {
    return (
      <p className="text-sm text-red-400 border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        {errorMetricas ?? errorReportes}
      </p>
    );
  }

  if ((cargandoMetricas && !metricas) || (cargandoReportes && !reportesPeriodo)) {
    return (
      <p className="text-sm text-gray-500 border border-dashed border-white/10 rounded-2xl p-6">
        Cargando métricas…
      </p>
    );
  }

  if (!metricas || !reportesPeriodo) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Dashboard de Administración
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Resumen general del estado comercial y logístico
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white/[0.02] border border-blue-500/20 p-5 rounded-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">
            Valor del Inventario
          </p>
          <p className="text-2xl font-extrabold text-white mt-2">
            {priceFormatter.format(metricas.valorTotalInventario)}
          </p>
          <span className="text-[10px] text-blue-400 font-semibold mt-1 inline-block">
            {metricas.totalUnidadesStock} unidades en stock total
          </span>
        </div>

        <div className="bg-white/[0.02] border border-emerald-500/20 p-5 rounded-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">
            Ventas del Período
          </p>
          <p className="text-2xl font-extrabold text-white mt-2">
            {priceFormatter.format(metricas.totalMesVentas)}
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-block">
            {metricas.totalPedidosMes} pedidos registrados
          </span>
        </div>

        <div className="bg-white/[0.02] border border-purple-500/20 p-5 rounded-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">
            Canal Principal
          </p>
          <p className="text-2xl font-extrabold text-white mt-2">WhatsApp</p>
          <span className="text-[10px] text-purple-400 font-medium mt-1 inline-block">
            Compra directa por Chat
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Cierre Financiero por Períodos</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Control de ingresos y estados de facturación
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-bold uppercase text-gray-400">
                  <th className="p-3">Período</th>
                  <th className="p-3">Fechas</th>
                  <th className="p-3 text-center">Pedidos</th>
                  <th className="p-3">Ventas</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {reportesPeriodo.map((reporte) => (
                  <tr key={reporte.periodo} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 font-bold text-white">{reporte.periodo}</td>
                    <td className="p-3 text-gray-400 text-xs">{reporte.rangoFechas}</td>
                    <td className="p-3 text-center font-bold text-gray-300">
                      {reporte.totalPedidos}
                    </td>
                    <td className="p-3 font-bold text-blue-400">
                      {priceFormatter.format(reporte.ventas)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          reporte.cerrado
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-white/5 text-gray-400 border border-white/10'
                        }`}
                      >
                        {reporte.cerrado ? 'Cerrado' : 'En curso'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-lg font-bold text-white">Atención Requerida</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Productos que requieren pedido a proveedor inmediatamente:
            </p>

            <div className="space-y-3">
              {metricas.productosCriticos.map((producto) => (
                <div
                  key={producto.id.valor}
                  className="bg-white/[0.02] border border-amber-500/20 p-3 rounded-2xl flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-white">{producto.nombre}</h4>
                    <span className="text-[10px] text-gray-400">{producto.categoria}</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                    {producto.nivelStock() === StockLevel.Agotado
                      ? 'Agotado'
                      : `${producto.stock} uds`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-gray-400 flex justify-between items-center">
            <span>Proveedor principal: Shenzhen Port</span>
          </div>
        </div>
      </div>
    </div>
  );
}