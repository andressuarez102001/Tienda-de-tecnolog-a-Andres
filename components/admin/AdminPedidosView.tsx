'use client';

import { useState } from 'react';
import { useServicios } from '@/presentation/ServiciosProvider';
import { useDatos } from '@/presentation/useDatos';
import type { OrderStatus } from '@/domain/shared/enums';

/**
 * Gestión de pedidos.
 *
 * Antes el `<select>` ofrecía los cuatro estados siempre, y el servicio
 * aceptaba el cambio: se podía reabrir un pedido entregado. Ahora la lista
 * de opciones sale de `pedido.cambiosDisponibles`, que es el patrón State
 * decidiendo qué transiciones existen; la vista no repite las reglas.
 */
const ESTILOS_ESTADO: Record<OrderStatus, string> = {
  Pendiente: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Enviado: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Entregado: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Cancelado: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export default function AdminPedidosView() {
  const { pedidos: servicioPedidos, priceFormatter } = useServicios();
  const { datos: pedidos, cargando, error: errorDeCarga, refrescar } = useDatos(() =>
    servicioPedidos.listar(),
  );
  const [error, setError] = useState('');

  const cambiarEstado = async (id: number, destino: OrderStatus): Promise<void> => {
    setError('');
    try {
      await servicioPedidos.cambiarEstado(id, destino);
      refrescar();
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : 'No se pudo cambiar el estado.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Logística y Pedidos</h2>
        <p className="text-sm text-gray-400 mt-1">Gestión de órdenes y métodos de pago registrados</p>
      </div>

      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      {errorDeCarga ? <p className="text-xs text-red-400">{errorDeCarga}</p> : null}

      <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold uppercase text-gray-400">
                <th className="p-4">No. Pedido</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Producto</th>
                <th className="p-4">Método de Pago</th>
                <th className="p-4">Total</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {cargando && !pedidos ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500 text-xs">
                    Cargando pedidos…
                  </td>
                </tr>
              ) : null}
              {(pedidos ?? []).map((pedido) => (
                <tr key={pedido.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono text-xs text-gray-500">{pedido.codigo}</td>
                  <td className="p-4 font-semibold text-white">{pedido.cliente}</td>
                  <td className="p-4 text-gray-400 text-xs">{pedido.fecha}</td>
                  <td className="p-4 text-gray-400 text-xs">
                    {pedido.producto.nombre} × {pedido.cantidad}
                  </td>
                  <td className="p-4 text-xs font-medium text-purple-400">{pedido.metodoPago}</td>
                  <td className="p-4 font-bold text-gray-200">
                    {priceFormatter.format(pedido.total)}
                  </td>
                  <td className="p-4">
                    {pedido.cambiosDisponibles.length > 0 ? (
                      <select
                        className={`p-2 rounded-xl text-xs font-bold outline-none cursor-pointer border ${ESTILOS_ESTADO[pedido.nombreEstado]}`}
                        value={pedido.nombreEstado}
                        onChange={(evento) =>
                          void cambiarEstado(pedido.id, evento.target.value as OrderStatus)
                        }
                      >
                        {pedido.cambiosDisponibles.map((destino) => (
                          <option key={destino} value={destino} className="bg-gray-900 text-white">
                            {destino}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${ESTILOS_ESTADO[pedido.nombreEstado]}`}
                      >
                        {pedido.nombreEstado}
                      </span>
                    )}
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