'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboardView from '@/components/admin/AdminDashboardView';
import AdminProductosView from '@/components/admin/AdminProductosView';
import AdminPedidosView from '@/components/admin/AdminPedidosView';
import AdminUsuariosView from '@/components/admin/AdminUsuariosView';
import AdminCategoriasView from '@/components/admin/AdminCategoriasView';
import AdminConfiguracionView from '@/components/admin/AdminConfiguracionView';
import type { AdminView } from '@/components/admin/types';
import { useServicios } from '@/presentation/ServiciosProvider';

const VISTAS: Record<AdminView, () => React.JSX.Element | null> = {
  dashboard: () => <AdminDashboardView />,
  productos: () => <AdminProductosView />,
  pedidos: () => <AdminPedidosView />,
  usuarios: () => <AdminUsuariosView />,
  categorias: () => <AdminCategoriasView />,
  configuracion: () => <AdminConfiguracionView />,
};

const SIN_SESION = (): undefined => undefined;

/**
 * Panel de administración.
 *
 * Antes se montaban las seis vistas a la vez y se ocultaban con `hidden`, de
 * modo que las seis leían datos aunque ninguna fuera visible; y entrar a
 * `/admin` directamente mostraba el panel sin autenticarse.
 *
 * La sesión ya no está en `localStorage`: la cookie del servidor es la única
 * fuente de verdad, y consultarla es asíncrono. Por eso hay tres estados y no
 * dos: "verificando" (la cookie aún no respondió), "sin sesión" y "autorizado".
 * Reducirlo a un booleano hacía que el panel se montara antes de saber si la
 * petición iba a devolver un usuario o un 401.
 *
 * Esta comprobación no sustituye a `proxy.ts`: el proxy impide que la petición
 * llegue al servidor sin firma válida, y esto evita el parpadeo de montar el
 * panel para luego expulsar.
 */
export default function AdminPage() {
  const { sesion } = useServicios();
  const router = useRouter();
  const usuario = useSyncExternalStore(sesion.subscribe, sesion.getSnapshot, SIN_SESION);
  const [vistaActual, setVistaActual] = useState<AdminView>('dashboard');
  const [verificando, setVerificando] = useState(true);

  const autorizado = usuario?.puedeAdministrar() === true;

  useEffect(() => {
    let vigente = true;
    // Sin `await` en el efecto ni estado inicial derivado: la consulta decide
    // cuándo termina de verificar.
    void sesion
      .hidratar()
      .catch(() => undefined)
      .finally(() => {
        if (vigente) {
          setVerificando(false);
        }
      });
    return () => {
      vigente = false;
    };
  }, [sesion]);

  useEffect(() => {
    if (!verificando && !autorizado) {
      router.replace('/login?siguiente=%2Fadmin');
    }
  }, [autorizado, router, verificando]);

  if (verificando || !usuario) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#08080a] text-sm text-gray-400">
        Verificando sesión…
      </div>
    );
  }

  if (!autorizado) {
    return null;
  }

  const VistaActual = VISTAS[vistaActual];

  return (
    <div className="flex h-screen bg-[#08080a] font-sans text-white overflow-hidden selection:bg-blue-500 selection:text-white">
      <AdminSidebar vistaActual={vistaActual} onSelect={setVistaActual} />
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto">
          <VistaActual />
        </div>
      </main>
    </div>
  );
}