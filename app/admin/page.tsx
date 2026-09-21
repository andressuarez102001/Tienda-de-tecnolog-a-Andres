'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboardView from '@/components/admin/AdminDashboardView';
import AdminProductosView from '@/components/admin/AdminProductosView';
import AdminPedidosView from '@/components/admin/AdminPedidosView';
import AdminUsuariosView from '@/components/admin/AdminUsuariosView';
import AdminCategoriasView from '@/components/admin/AdminCategoriasView';
import AdminConfiguracionView from '@/components/admin/AdminConfiguracionView';
import type { AdminView } from '@/components/admin/types';

export default function AdminPage() {
  const [vistaActual, setVistaActual] = useState<AdminView>('dashboard');

  return (
    <div className="flex h-screen bg-[#08080a] font-sans text-white overflow-hidden selection:bg-blue-500 selection:text-white">
      <AdminSidebar vistaActual={vistaActual} onSelect={setVistaActual} />

      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className={vistaActual === 'dashboard' ? '' : 'hidden'}><AdminDashboardView /></div>
          <div className={vistaActual === 'productos' ? '' : 'hidden'}><AdminProductosView /></div>
          <div className={vistaActual === 'pedidos' ? '' : 'hidden'}><AdminPedidosView /></div>
          <div className={vistaActual === 'usuarios' ? '' : 'hidden'}><AdminUsuariosView /></div>
          <div className={vistaActual === 'categorias' ? '' : 'hidden'}><AdminCategoriasView /></div>
          <div className={vistaActual === 'configuracion' ? '' : 'hidden'}><AdminConfiguracionView /></div>
        </div>
      </main>
    </div>
  );
}