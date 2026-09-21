'use client';

import { useState } from 'react';
import { userAdminService } from '@/application/admin/createAdminServices';

/**
 * Responsabilidad única: gestión de cuentas de usuario.
 */
export default function AdminUsuariosView() {
  const [initialState] = useState(() => userAdminService.loadInitialState());
  const [usuarios, setUsuarios] = useState(initialState.usuarios);

  const cambiarEstadoUsuario = (id: number) => setUsuarios(userAdminService.toggleUserStatus(usuarios, id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Gestión de Usuarios</h2>
        <p className="text-sm text-gray-400 mt-1">Cuentas con acceso a la plataforma</p>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold uppercase text-gray-400">
                <th className="p-4">Nombre / Cliente</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-semibold text-white">{u.nombre}</td>
                  <td className="p-4 text-gray-400 text-xs">{u.email}</td>
                  <td className="p-4 font-medium text-blue-400 text-xs">{u.rol}</td>
                  <td className="p-4">
                    <button
                      onClick={() => cambiarEstadoUsuario(u.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                        u.estado === 'Activo'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}
                    >
                      {u.estado}
                    </button>
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