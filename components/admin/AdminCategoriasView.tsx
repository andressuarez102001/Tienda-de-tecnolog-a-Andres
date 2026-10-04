'use client';

import { useState, type FormEvent } from 'react';
import { useServicios } from '@/presentation/ServiciosProvider';
import { useDatos } from '@/presentation/useDatos';

/**
 * Gestión de categorías.
 *
 * Antes el servicio devolvía un array nuevo y el componente lo guardaba en
 * estado local: la creación se perdía al recargar la página. Ahora la vista
 * llama al caso de uso, que persiste, y vuelve a leer.
 */
export default function AdminCategoriasView() {
  const { categorias: servicioCategorias } = useServicios();
  const { datos: categorias, cargando, error: errorDeCarga, refrescar } = useDatos(() =>
    servicioCategorias.listar(),
  );
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const agregar = async (evento: FormEvent<HTMLFormElement>): Promise<void> => {
    evento.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await servicioCategorias.crear(nuevaCategoria);
      setNuevaCategoria('');
      refrescar();
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : 'No se pudo crear la categoría.');
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id: number): Promise<void> => {
    setError('');
    try {
      await servicioCategorias.eliminar(id);
      refrescar();
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : 'No se pudo eliminar la categoría.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white/[0.02] border border-white/10 p-6 rounded-3xl space-y-4">
        <h3 className="text-xl font-bold text-white">Agregar Nueva Categoría</h3>
        <form onSubmit={agregar} className="flex gap-2">
          <input
            type="text"
            placeholder="Ej. Smartwatches"
            className="border border-white/10 bg-black/50 p-3 rounded-xl flex-1 outline-none focus:border-blue-500 text-white text-sm"
            value={nuevaCategoria}
            onChange={(evento) => setNuevaCategoria(evento.target.value)}
            required
          />
          <button
            type="submit"
            disabled={guardando}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20"
          >
            {guardando ? 'Guardando…' : 'Añadir'}
          </button>
        </form>
        {error ? <p className="text-xs text-red-400">{error}</p> : null}
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
            {cargando && !categorias ? (
              <tr>
                <td colSpan={2} className="p-6 text-center text-gray-500 text-xs">
                  Cargando categorías…
                </td>
              </tr>
            ) : null}
            {errorDeCarga ? (
              <tr>
                <td colSpan={2} className="p-6 text-center text-red-400 text-xs">
                  {errorDeCarga}
                </td>
              </tr>
            ) : null}
            {(categorias ?? []).map((categoria) => (
              <tr key={categoria.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-semibold text-white">{categoria.nombre}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => void eliminar(categoria.id)}
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