'use client';

import { useMemo, useState } from 'react';
import { productAdminService } from '@/application/admin/createAdminServices';
import type { Product, ProductDraft } from '@/domain/admin/entities';

/**
 * Responsabilidad única: inventario de productos (listado, filtros, CRUD).
 */
export default function AdminProductosView() {
  const [initialState] = useState(() => productAdminService.loadInitialState());
  const [productos, setProductos] = useState(initialState.productos);
  const [categorias] = useState(initialState.categorias);

  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas');
  const [busquedaProducto, setBusquedaProducto] = useState<string>('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductDraft>({ nombre: '', categoria: 'Fundas', precio: 0, stock: 0 });

  const guardarProducto = (e: React.FormEvent) => {
    e.preventDefault();
    setProductos(productAdminService.saveProduct(productos, formData, productoEditando?.id ?? null));
    setMostrarFormulario(false);
    setProductoEditando(null);
    setFormData({ nombre: '', categoria: categorias[0]?.nombre || 'Fundas', precio: 0, stock: 0 });
  };

  const eliminarProducto = (id: number) => window.confirm('¿Eliminar producto del inventario?') && setProductos(productAdminService.removeProduct(productos, id));
  const iniciarEdicion = (producto: Product) => {
    setProductoEditando(producto);
    setFormData({ nombre: producto.nombre, categoria: producto.categoria, precio: producto.precio, stock: producto.stock });
    setMostrarFormulario(true);
  };

  const productosFiltrados = useMemo(
    () => productAdminService.filterProducts(productos, filtroCategoria, busquedaProducto),
    [productos, filtroCategoria, busquedaProducto],
  );
  const categoriasDisponibles = useMemo(
    () => categorias.map((categoria) => ({ id: categoria.id, nombre: categoria.nombre })),
    [categorias],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Inventario de Productos</h2>
          <p className="text-sm text-gray-400">
            Valor total del stock: <span className="text-blue-400 font-bold">${productos.reduce((acc, p) => acc + p.precio * p.stock, 0).toLocaleString('es-CO')} COP</span>
          </p>
        </div>
        <button
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setProductoEditando(null);
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-5 rounded-full transition-all shadow-lg shadow-blue-500/25 text-sm"
        >
          {mostrarFormulario ? 'Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {/* BUSCADOR Y FILTROS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre..."
          className="border border-white/10 bg-black/50 p-3 rounded-2xl outline-none focus:border-blue-500 text-white text-xs sm:col-span-2"
          value={busquedaProducto}
          onChange={(e) => setBusquedaProducto(e.target.value)}
        />
        <select
          className="border border-white/10 bg-black/50 p-3 rounded-2xl outline-none focus:border-blue-500 text-white text-xs"
          value={filtroCategoria}
          onChange={(e) => {
            const siguienteFiltro = e.target.value;
            setFiltroCategoria((filtroActual) =>
              filtroActual === siguienteFiltro ? filtroActual : siguienteFiltro,
            );
          }}
        >
          <option value="Todas" className="bg-gray-900 text-white">Todas las Categorías</option>
          {categoriasDisponibles.map((c) => (
            <option key={c.id} value={c.nombre} className="bg-gray-900 text-white">
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {mostrarFormulario && (
        <form onSubmit={guardarProducto} className="bg-white/[0.02] border border-white/10 p-6 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-white mb-2">
            {productoEditando ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre del producto"
              required
              className="border border-white/10 bg-black/50 p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
            <select
              className="border border-white/10 bg-black/50 p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            >
              {categoriasDisponibles.map((c) => (
                <option key={c.id} value={c.nombre} className="bg-gray-900 text-white">
                  {c.nombre}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Precio ($)"
              required
              className="border border-white/10 bg-black/50 p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Stock disponible"
              required
              className="border border-white/10 bg-black/50 p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-6 rounded-full font-semibold text-sm transition-all"
          >
            Guardar Producto
          </button>
        </form>
      )}

      <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold uppercase text-gray-400">
                <th className="p-4">ID</th>
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio Unitario</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Total Valor</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {productosFiltrados.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono text-xs text-gray-500">#{item.id}</td>
                  <td className="p-4 font-semibold text-white">{item.nombre}</td>
                  <td className="p-4 text-gray-400 text-xs">{item.categoria}</td>
                  <td className="p-4 font-bold text-gray-200">${item.precio.toLocaleString('es-CO')}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.stock === 0
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : item.stock <= 2
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {item.stock} uds
                    </span>
                  </td>
                  <td className="p-4 font-bold text-blue-400">
                    ${(item.precio * item.stock).toLocaleString('es-CO')}
                  </td>
                  <td className="p-4 text-right space-x-3 text-xs">
                    <button onClick={() => iniciarEdicion(item)} className="text-blue-400 font-bold hover:underline">
                      Editar
                    </button>
                    <button onClick={() => eliminarProducto(item.id)} className="text-red-400 font-bold hover:underline">
                      Eliminar
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