'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import type { AdminView } from './types';
import { useServicios } from '@/presentation/ServiciosProvider';

interface AdminMenuOption {
  readonly id: AdminView;
  readonly icono: string;
  readonly nombre: string;
}

const ADMIN_MENU: ReadonlyArray<AdminMenuOption> = [
  { id: 'dashboard', icono: '📊', nombre: 'Dashboard' },
  { id: 'pedidos', icono: '🚚', nombre: 'Pedidos' },
  { id: 'productos', icono: '📦', nombre: 'Inventario' },
  { id: 'categorias', icono: '🗂️', nombre: 'Categorías' },
  { id: 'usuarios', icono: '👥', nombre: 'Usuarios' },
  { id: 'configuracion', icono: '⚙️', nombre: 'Ajustes' },
];

const snapshotServidor = (): undefined => undefined;

/**
 * Navegación lateral del panel.
 *
 * El pie con el usuario ya no es texto fijo ("Andres Suarez /
 * Administrador"): muestra la entidad `Usuario` de la sesión, que es el
 * mismo dato que se usó para autenticar.
 */
export default function AdminSidebar({
  vistaActual,
  onSelect,
}: {
  vistaActual: AdminView;
  onSelect: (vista: AdminView) => void;
}) {
  const { sesion } = useServicios();
  const usuario = useSyncExternalStore(sesion.subscribe, sesion.getSnapshot, snapshotServidor);

  const inicial = usuario?.nombre.charAt(0).toUpperCase() ?? '?';

  return (
    <aside className="w-64 bg-black/60 border-r border-white/10 text-white flex flex-col justify-between backdrop-blur-xl">
      <div>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight">
            Shenzhen<span className="text-blue-500">Stock</span>
          </h1>
          <p className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-widest">
            Panel de Administración
          </p>
        </div>

        <nav className="p-4 space-y-1.5">
          {ADMIN_MENU.map((menu) => (
            <button
              key={menu.id}
              onClick={() => onSelect(menu.id)}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all text-xs font-semibold flex items-center gap-3 ${
                vistaActual === menu.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{menu.icono}</span>
              <span>{menu.nombre}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 text-xs">
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            {inicial}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-white truncate">{usuario?.nombre ?? 'Sesión cerrada'}</p>
            <p className="text-[10px] text-gray-400 truncate">
              {usuario ? usuario.email.valor : 'Sin sesión'}
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="block text-center mt-3 text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>
    </aside>
  );
}