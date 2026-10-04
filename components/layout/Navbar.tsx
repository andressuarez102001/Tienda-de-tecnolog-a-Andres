'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useServicios } from '@/presentation/ServiciosProvider';

/** El servidor no sabe si hay sesión: siempre parte de "no administrador". */
const snapshotServidor = (): undefined => undefined;

export default function Navbar() {
  const { sesion, autenticacion } = useServicios();
  const router = useRouter();

  const usuario = useSyncExternalStore(sesion.subscribe, sesion.getSnapshot, snapshotServidor);
  const esAdmin = usuario?.puedeAdministrar() ?? false;

  const handleLogout = async (): Promise<void> => {
    // El await importa: mientras el servidor no borre la cookie, recargar la
    // página volvería a entrar al panel.
    await autenticacion.cerrarSesion();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="border-b border-white/10 bg-black text-white sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold text-white tracking-tight hover:opacity-80 transition-opacity"
        >
          Shenzhen<span className="text-blue-500 font-medium">Stock</span>
        </Link>

        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/"
            className="text-xs font-normal text-white/80 hover:text-white transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/productos-top"
            className="text-xs font-normal text-white/80 hover:text-white transition-colors"
          >
            Productos TOP
          </Link>
          <Link
            href="/productos-nuevos"
            className="text-xs font-normal text-white/80 hover:text-white transition-colors"
          >
            Novedades
          </Link>

          {esAdmin ? (
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium">
                Modo Admin
              </span>
              <button
                onClick={handleLogout}
                className="text-[11px] bg-white text-black hover:bg-white/90 px-3 py-1 rounded-full font-medium transition-all duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-[11px] border border-white/20 text-white hover:bg-white hover:text-black px-3 py-1 rounded-full font-medium transition-all duration-200"
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}