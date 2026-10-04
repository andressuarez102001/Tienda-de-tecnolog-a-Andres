'use client';

import { useServicios } from '@/presentation/ServiciosProvider';
import { useDatos } from '@/presentation/useDatos';
import { UserStatus } from '@/domain/shared/enums';

/** Cuentas de usuario y su estado de habilitación. */
export default function AdminUsuariosView() {
  const { usuarios: servicioUsuarios } = useServicios();
  const { datos: usuarios, cargando, error, refrescar } = useDatos(() => servicioUsuarios.listar());

  const alternar = async (id: number): Promise<void> => {
    await servicioUsuarios.alternarEstado(id);
    refrescar();
  };

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
              {cargando && !usuarios ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500 text-xs">
                    Cargando usuarios…
                  </td>
                </tr>
              ) : null}
              {error ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-red-400 text-xs">
                    {error}
                  </td>
                </tr>
              ) : null}
              {(usuarios ?? []).map((usuario) => (
                <tr key={usuario.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-semibold text-white">{usuario.nombre}</td>
                  <td className="p-4 text-gray-400 text-xs">{usuario.email.valor}</td>
                  <td className="p-4 font-medium text-blue-400 text-xs">{usuario.rol}</td>
                  <td className="p-4">
                    <button
                      onClick={() => void alternar(usuario.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                        usuario.estado === UserStatus.Activo
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}
                    >
                      {usuario.estado}
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