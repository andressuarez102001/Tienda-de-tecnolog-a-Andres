'use client';

import { useMemo, useState } from 'react';
import { dashboardMetricsService } from '@/application/admin/createAdminServices';

/**
 * Responsabilidad única: mostrar las métricas del dashboard.
 */
export default function AdminDashboardView() {
  const [initialState] = useState(() => dashboardMetricsService.loadInitialState());
  const dashboard = useMemo(
    () => dashboardMetricsService.dashboard(initialState.productos, initialState.reportesPeriodos),
    [initialState],
  );
  const { totalMesVentas, totalPedidosMes, valorTotalInventario, productosCriticos, totalUnidadesStock } = dashboard;
  const { reportesPeriodos } = initialState;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Dashboard de Administración</h2>
          <p className="text-sm text-gray-400 mt-1">Resumen general del estado comercial y logístico</p>
        </div>
        <button
          onClick={() => alert('Generando reporte consolidado en CSV...')}
          className="bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white px-4 py-2.5 rounded-full border border-white/10 transition-all flex items-center gap-2"
        >
          <span>📥 Exportar Reporte</span>
        </button>
      </div>

      {/* METRICAS PRINCIPALES (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.02] border border-blue-500/20 p-5 rounded-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Valor del Inventario</p>
          <p className="text-2xl font-extrabold text-white mt-2">${valorTotalInventario.toLocaleString('es-CO')}</p>
          <span className="text-[10px] text-blue-400 font-semibold mt-1 inline-block">
            {totalUnidadesStock} unidades en stock total
          </span>
        </div>

        <div className="bg-white/[0.02] border border-emerald-500/20 p-5 rounded-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Ventas de Junio</p>
          <p className="text-2xl font-extrabold text-white mt-2">${totalMesVentas.toLocaleString('es-CO')}</p>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-block">
            {totalPedidosMes} pedidos completados
          </span>
        </div>

        <div className="bg-white/[0.02] border border-purple-500/20 p-5 rounded-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
          <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Canal Principal</p>
          <p className="text-2xl font-extrabold text-white mt-2">WhatsApp</p>
          <span className="text-[10px] text-purple-400 font-medium mt-1 inline-block">Compra directa por Chat</span>
        </div>
      </div>

      {/* MÓDULO DE ALERTAS Y LOGÍSTICA RÁPIDA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TABLA DE REPORTE SEMANAL */}
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Cierre Financiero por Semanas</h3>
              <p className="text-xs text-gray-400 mt-0.5">Control de ingresos y estados de facturación</p>
            </div>
            <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold px-3 py-1 rounded-full">
              Junio 2026
            </span>
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
                {reportesPeriodos.map((rep, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 font-bold text-white">{rep.periodo}</td>
                    <td className="p-3 text-gray-400 text-xs">{rep.rangoFechas}</td>
                    <td className="p-3 text-center font-bold text-gray-300">{rep.totalPedidos}</td>
                    <td className="p-3 font-bold text-blue-400">${rep.ventas.toLocaleString('es-CO')}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          rep.estado.includes('Cerrada')
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : rep.estado.includes('curso')
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-white/5 text-gray-400 border border-white/10'
                        }`}
                      >
                        {rep.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CAJA DE REABASTECIMIENTO Y ALERTAS */}
        <div className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <h3 className="text-lg font-bold text-white">Atención Requerida</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">Productos que requieren pedido a proveedor inmediatamente:</p>

            <div className="space-y-3">
              {productosCriticos.map((p) => (
                <div key={p.id} className="bg-white/[0.02] border border-amber-500/20 p-3 rounded-2xl flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-semibold text-white">{p.nombre}</h4>
                    <span className="text-[10px] text-gray-400">{p.categoria}</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                    {p.stock === 0 ? 'Agotado' : `${p.stock} uds`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-gray-400 flex justify-between items-center">
            <span>Proveedor principal: Shenzhen Port</span>
            <span className="text-blue-400 font-semibold cursor-pointer hover:underline">Pedir →</span>
          </div>
        </div>
      </div>
    </div>
  );
}