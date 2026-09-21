'use client';

import { useState } from 'react';
import { orderAdminService } from '@/application/admin/createAdminServices';
import type { OrderStatus } from '@/domain/admin/entities';

/**
 * Responsabilidad única: gestión de pedidos y su estado.
 */
export default function AdminPedidosView() {
  const [initialState] = useState(() => orderAdminService.loadInitialState());
  const [pedidos, setPedidos] = useState(initialState.pedidos);

  const cambiarEstadoPedido = (id: number, estado: OrderStatus) => setPedidos(orderAdminService.changeOrderStatus(pedidos, id, estado));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Logística y Pedidos</h2>
        <p className="text-sm text-gray-400 mt-1">Gestión de órdenes y métodos de pago registrados</p>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold uppercase text-gray-400">
                <th className="p-4">No. Pedido</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Método de Pago</th>
                <th className="p-4">Total</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {pedidos.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono text-xs text-gray-500">#{p.id}</td>
                  <td className="p-4 font-semibold text-white">{p.cliente}</td>
                  <td className="p-4 text-gray-400 text-xs">{p.fecha}</td>
                  <td className="p-4 text-xs font-medium text-purple-400">{p.metodoPago}</td>
                  <td className="p-4 font-bold text-gray-200">${p.total.toLocaleString('es-CO')}</td>
                  <td className="p-4">
                    <select
                      className={`p-2 rounded-xl text-xs font-bold outline-none cursor-pointer border ${
                        p.estado === 'Pendiente'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : p.estado === 'Enviado'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                      value={p.estado}
                      onChange={(e) => cambiarEstadoPedido(p.id, e.target.value as OrderStatus)}
                    >
                      <option value="Pendiente" className="bg-gray-900 text-white">
                        Pendiente
                      </option>
                      <option value="Enviado" className="bg-gray-900 text-white">
                        Enviado
                      </option>
                      <option value="Entregado" className="bg-gray-900 text-white">
                        Entregado
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}