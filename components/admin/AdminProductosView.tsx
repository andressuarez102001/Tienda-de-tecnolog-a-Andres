'use client';

import { useState, type FormEvent } from 'react';
import type { Product } from '@/domain/catalog/Producto';
import type { ProductDraft } from '@/domain/catalog/ProductoDraft';
import { ProductCollection, StockLevel, TipoProducto } from '@/domain/shared/enums';
import { Dinero } from '@/domain/shared/Dinero';
import { useServicios } from '@/presentation/ServiciosProvider';
import { useDatos } from '@/presentation/useDatos';

/** Color del badge de stock según el nivel que decide el dominio. */
const ESTILOS_STOCK: Record<StockLevel, string> = {
  [StockLevel.Agotado]: 'bg-red-500/10 text-red-400 border border-red-500/20',
  [StockLevel.Bajo]: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  [StockLevel.Disponible]: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};

const BORRADOR_VACIO: ProductDraft = {
  nombre: '',
  descripcion: '',
  categoria: 'Servicios Digitales',
  precio: 0,
  stock: 0,
  imagen: '/globe.svg',
  tipo: TipoProducto.Fisico,
  coleccion: ProductCollection.Iphone,
  destacado: false,
  novedad: false,
  tendencia: false,
};

/** Extrae el borrador de un producto existente para precargar el formulario. */
function borradorDe(producto: Product): ProductDraft {
  return {
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    categoria: producto.categoria,
    precio: producto.precio.valor,
    stock: producto.stock,
    imagen: producto.imagen,
    tipo: producto.tipo,
    coleccion: producto.coleccion,
    destacado: producto.destacado,
    novedad: producto.novedad,
    tendencia: producto.tendencia,
  };
}

/**
 * Inventario de productos: listado, búsqueda, filtros y CRUD.
 *
 * Este archivo tenía 197 líneas con cinco responsabilidades mezcladas
 * (estado del formulario, filtrado, totales, acciones y tabla). Ahora el
 * filtrado vive en `Product.cumpleFiltro`, los totales en
 * `DashboardService`, y las escrituras en `ProductoAdminService`, que
 * persiste de verdad: antes el alta de un producto se perdía al recargar.
 */
export default function AdminProductosView() {
  const { productos: servicioProductos, categorias: servicioCategorias, priceFormatter } =
    useServicios();

  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState<string | null>(null);
  const [borrador, setBorrador] = useState<ProductDraft>(BORRADOR_VACIO);
  const [error, setError] = useState('');

  const { datos: productos, cargando, error: errorDeCarga, refrescar } = useDatos(
    () => servicioProductos.listar({ busqueda, categoria: filtroCategoria, agotados: true }),
    [busqueda, filtroCategoria],
  );
  const { datos: categorias } = useDatos(() => servicioCategorias.listar());

  const listaProductos = productos ?? [];
  const listaCategorias = categorias ?? [];

  const valorInventario = listaProductos.reduce(
    (suma, producto) => suma.sumar(producto.precioTotal()),
    Dinero.cero(),
  );

  const guardar = async (evento: FormEvent<HTMLFormElement>): Promise<void> => {
    evento.preventDefault();
    setError('');
    try {
      if (productoEditando) {
        await servicioProductos.actualizar(productoEditando, borrador);
      } else {
        await servicioProductos.crear(borrador);
      }
      setFormularioAbierto(false);
      setProductoEditando(null);
      setBorrador(BORRADOR_VACIO);
      refrescar();
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : 'No se pudo guardar el producto.');
    }
  };

  const eliminar = async (producto: Product): Promise<void> => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}" del inventario?`)) {
      return;
    }
    try {
      await servicioProductos.eliminar(producto.id.valor);
      refrescar();
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : 'No se pudo eliminar el producto.');
    }
  };

  const alternarTendencia = async (producto: Product): Promise<void> => {
    await servicioProductos.alternarTendencia(producto.id.valor);
    refrescar();
  };

  const iniciarEdicion = (producto: Product): void => {
    setProductoEditando(producto.id.valor);
    setBorrador(borradorDe(producto));
    setFormularioAbierto(true);
    setError('');
  };

  const alternar = <K extends keyof ProductDraft>(campo: K, valor: ProductDraft[K]): void =>
    setBorrador((actual) => ({ ...actual, [campo]: valor }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Inventario de Productos
          </h2>
          <p className="text-sm text-gray-400">
            Valor total del stock:{' '}
            <span className="text-blue-400 font-bold">
              {priceFormatter.format(valorInventario)}
            </span>
          </p>
        </div>
        <button
          onClick={() => {
            setFormularioAbierto((abierto) => !abierto);
            setProductoEditando(null);
            setBorrador(BORRADOR_VACIO);
            setError('');
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-5 rounded-full transition-all shadow-lg shadow-blue-500/25 text-sm"
        >
          {formularioAbierto ? 'Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          className="border border-white/10 bg-black/50 p-3 rounded-2xl outline-none focus:border-blue-500 text-white text-xs sm:col-span-2"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />
        <select
          className="border border-white/10 bg-black/50 p-3 rounded-2xl outline-none focus:border-blue-500 text-white text-xs"
          value={filtroCategoria}
          onChange={(evento) => setFiltroCategoria(evento.target.value)}
        >
          <option value="" className="bg-gray-900 text-white">
            Todas las Categorías
          </option>
          {listaCategorias.map((categoria) => (
            <option key={categoria.id} value={categoria.nombre} className="bg-gray-900 text-white">
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="text-xs text-red-400 border border-red-500/20 bg-red-500/5 rounded-xl p-3">
          {error}
        </p>
      ) : null}

      {formularioAbierto ? (
        <form
          onSubmit={guardar}
          className="bg-white/[0.02] border border-white/10 p-6 rounded-3xl space-y-4"
        >
          <h3 className="text-lg font-bold text-white">
            {productoEditando ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-xs font-bold uppercase text-gray-400">Nombre</span>
              <input
                type="text"
                required
                className="w-full border border-white/10 bg-black/50 p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
                value={borrador.nombre}
                onChange={(evento) => alternar('nombre', evento.target.value)}
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-bold uppercase text-gray-400">Categoría</span>
              <select
                className="w-full border border-white/10 bg-black/50 p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
                value={borrador.categoria}
                onChange={(evento) => alternar('categoria', evento.target.value)}
              >
                {listaCategorias.map((categoria) => (
                  <option
                    key={categoria.id}
                    value={categoria.nombre}
                    className="bg-gray-900 text-white"
                  >
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 sm:col-span-2">
              <span className="text-xs font-bold uppercase text-gray-400">Descripción</span>
              <textarea
                required
                rows={2}
                className="w-full border border-white/10 bg-black/50 p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
                value={borrador.descripcion}
                onChange={(evento) => alternar('descripcion', evento.target.value)}
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-bold uppercase text-gray-400">Precio (COP)</span>
              <input
                type="number"
                min={0}
                required
                className="w-full border border-white/10 bg-black/50 p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
                value={borrador.precio}
                onChange={(evento) => alternar('precio', Number(evento.target.value))}
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-bold uppercase text-gray-400">Stock</span>
              <input
                type="number"
                min={0}
                required
                className="w-full border border-white/10 bg-black/50 p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
                value={borrador.stock}
                onChange={(evento) => alternar('stock', Number(evento.target.value))}
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-bold uppercase text-gray-400">Imagen (ruta)</span>
              <input
                type="text"
                required
                className="w-full border border-white/10 bg-black/50 p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
                value={borrador.imagen}
                onChange={(evento) => alternar('imagen', evento.target.value)}
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-bold uppercase text-gray-400">
                Tipo (define el envío)
              </span>
              <select
                className="w-full border border-white/10 bg-black/50 p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
                value={borrador.tipo}
                onChange={(evento) => alternar('tipo', evento.target.value as TipoProducto)}
              >
                {Object.values(TipoProducto).map((tipo) => (
                  <option key={tipo} value={tipo} className="bg-gray-900 text-white">
                    {tipo}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-bold uppercase text-gray-400">Colección</span>
              <select
                className="w-full border border-white/10 bg-black/50 p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
                value={borrador.coleccion}
                onChange={(evento) =>
                  alternar('coleccion', evento.target.value as ProductCollection)
                }
              >
                {Object.values(ProductCollection).map((coleccion) => (
                  <option key={coleccion} value={coleccion} className="bg-gray-900 text-white">
                    {coleccion}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-end gap-4 flex-wrap">
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={borrador.destacado}
                  onChange={(evento) => alternar('destacado', evento.target.checked)}
                />
                Destacado
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={borrador.novedad}
                  onChange={(evento) => alternar('novedad', evento.target.checked)}
                />
                Novedad
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={borrador.tendencia}
                  onChange={(evento) => alternar('tendencia', evento.target.checked)}
                />
                Tendencia
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-6 rounded-full font-semibold text-sm transition-all"
          >
            Guardar Producto
          </button>
        </form>
      ) : null}

      <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold uppercase text-gray-400">
                <th className="p-4">ID</th>
                <th className="p-4">Producto</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Valor</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {cargando && !productos ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500 text-xs">
                    Cargando inventario…
                  </td>
                </tr>
              ) : null}
              {errorDeCarga ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-red-400 text-xs">
                    {errorDeCarga}
                  </td>
                </tr>
              ) : null}
              {listaProductos.map((producto) => (
                <tr key={producto.id.valor} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono text-xs text-gray-500">{producto.id.valor}</td>
                  <td className="p-4 font-semibold text-white">
                    {producto.nombre}
                    <span className="block text-[10px] text-gray-500">{producto.categoria}</span>
                  </td>
                  <td className="p-4 text-xs text-gray-400">{producto.tipo}</td>
                  <td className="p-4 font-bold text-gray-200">
                    {priceFormatter.format(producto.precio)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${ESTILOS_STOCK[producto.nivelStock()]}`}
                    >
                      {producto.stock} uds
                    </span>
                  </td>
                  <td className="p-4 font-bold text-blue-400">
                    {priceFormatter.format(producto.precioTotal())}
                  </td>
                  <td className="p-4 text-right space-x-3 text-xs">
                    <button
                      onClick={() => void alternarTendencia(producto)}
                      className="text-gray-300 font-bold hover:underline"
                    >
                      {producto.tendencia ? 'Quitar tendencia' : 'Marcar tendencia'}
                    </button>
                    <button
                      onClick={() => iniciarEdicion(producto)}
                      className="text-blue-400 font-bold hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => void eliminar(producto)}
                      className="text-red-400 font-bold hover:underline"
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
    </div>
  );
}