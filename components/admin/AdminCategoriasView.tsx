'use client';

import { useState } from 'react';
import { categoryAdminService } from '@/application/admin/createAdminServices';

/**
 * Responsabilidad única: gestión de categorías de la tienda.
 */
export default function AdminCategoriasView() {
  const [initialState] = useState(() => categoryAdminService.loadInitialState());
  const [categorias, setCategorias] = useState(initialState.categorias);
  const [nuevaCategoria, setNuevaCategoria] = useState('');

  const agregarCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaCategoria.trim()) {
      setCategorias(categoryAdminService.addCategory(categorias, nuevaCategoria));
      setNuevaCategoria('');
    }
  };
  const eliminarCategoria = (id: number) => setCategorias(categoryAdminService.removeCategory(categorias, id));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white/[0.02] border border-white/10 p-6 rounded-3xl space-y-4">
        <h3 className="text-xl font-bold text-white">Agregar Nueva Categoría</h3>
        <form onSubmit={agregarCategoria} className="flex gap-2">
          <input
            type="text"
            placeholder="Ej. Smartwatches"
            className="border border-white/10 bg-black/50 p-3 rounded-xl flex-1 outline-none focus:border-blue-500 text-white text-sm"
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20"
          >
            Añadir
          </button>
        </form>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs font-bold uppercase text-gray-400">
              <th className="p-4">Categoría</th>
              <th className="p-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {categorias.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-semibold text-white">{c.nombre}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => eliminarCategoria(c.id)}
                    className="text-red-400 font-bold text-xs hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}