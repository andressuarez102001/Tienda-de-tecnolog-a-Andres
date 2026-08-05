'use client';

import React, { useState } from 'react';

// ==========================================
// 1. POO: INTERFACES (Molde de las Entidades)
// ==========================================
interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

interface Pedido {
  id: number;
  cliente: string;
  fecha: string;
  total: number;
  metodoPago: 'PSE' | 'Efectivo/Contraentrega' | 'Nequi/Bancolombia';
  estado: 'Pendiente' | 'Enviado' | 'Entregado';
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'Admin' | 'Cliente';
  estado: 'Activo' | 'Bloqueado';
}

interface Categoria {
  id: number;
  nombre: string;
}

interface ReportePeriodo {
  periodo: string;
  rangoFechas: string;
  totalPedidos: number;
  ventas: number;
  estado: string;
}

export default function AdminPage() {
  // ==========================================
  // 2. ESTADOS DEL SISTEMA (Ajustado para ~ $2.7M COP)
  // ==========================================
  const [vistaActual, setVistaActual] = useState<
    'dashboard' | 'productos' | 'pedidos' | 'usuarios' | 'categorias' | 'configuracion'
  >('dashboard');

  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas');
  const [busquedaProducto, setBusquedaProducto] = useState<string>('');

  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, nombre: 'Funda iPhone 17 Pro Max', categoria: 'Fundas', precio: 9500, stock: 8 }, // $280.000
    { id: 2, nombre: 'Funda iPhone 14 Roja', categoria: 'Fundas', precio: 8500, stock: 5 },   // $150.000
    { id: 3, nombre: 'Funda iPhone 14 Transparente', categoria: 'Fundas', precio:8500, stock: 6 }, // $150.000
    { id: 4, nombre: 'Cargador iPhone 20W', categoria: 'Cargadores', precio: 20000, stock: 10 }, // $350.000
    { id: 5, nombre: 'Funda iPhone 14 Normal', categoria: 'Fundas', precio: 8000, stock: 4 }, // $100.000
    { id: 6, nombre: 'Funda iPhone 16 Rosada', categoria: 'Fundas', precio: 8000, stock: 5 }, // $150.000
    { id: 7, nombre: 'Funda iPad Pro', categoria: 'Fundas', precio: 18000, stock: 4 },        // $180.000
    { id: 8, nombre: 'Funda iPad Pro Negra', categoria: 'Fundas', precio: 17000, stock: 3 },  // $120.000
    { id: 9, nombre: 'Funda iPad Pro V2', categoria: 'Fundas', precio: 18000, stock: 2 },     // $80.000
    { id: 10, nombre: 'Cargador iPad Pro 30W', categoria: 'Cargadores', precio: 21000, stock: 5 }, // $225.000
    { id: 11, nombre: 'Funda iPad Pro V3', categoria: 'Fundas', precio: 18000, stock: 2 },    // $80.000
    { id: 12, nombre: 'Drone ALPHA 4K', categoria: 'Drones', precio: 52000, stock: 1 },     // $210.000
    { id: 13, nombre: 'Drone ALPHA 2K', categoria: 'Drones', precio: 45000, stock: 1 },     // $165.000
    { id: 14, nombre: 'Control de Drone', categoria: 'Drones', precio: 25000, stock: 2 }, // $170.000
    { id: 15, nombre: 'Batería Portátil 10000mAh', categoria: 'Gadgets', precio: 20000, stock: 3 }, // $105.000
    { id: 16, nombre: 'Extensor de Enchufe Smart', categoria: 'Gadgets', precio: 15000, stock: 2 }, // $60.000
    { id: 17, nombre: 'Gafas VR 3D Lite', categoria: 'Gadgets', precio: 22000, stock: 2 },     // $80.000
    { id: 18, nombre: 'Inflador Portátil 12V', categoria: 'Gadgets', precio: 19000, stock: 2 }, // $60.000
    { id: 19, nombre: 'Trípode para Celular', categoria: 'Gadgets', precio: 11000, stock: 0 },  // $0 (Agotado)
  ]); // Suma total del inventario: $2.715.000 COP

  const [pedidos, setPedidos] = useState<Pedido[]>([
    { id: 101, cliente: 'Andres Suarez', fecha: '2026-08-01', total: 35000, metodoPago: 'Nequi/Bancolombia', estado: 'Entregado' },
    { id: 102, cliente: 'Carlos Mendoza', fecha: '2026-08-02', total: 20000, metodoPago: 'PSE', estado: 'Enviado' },
    { id: 103, cliente: 'Maria Fernanda', fecha: '2026-08-04', total: 72000, metodoPago: 'Efectivo/Contraentrega', estado: 'Pendiente' },
  ]);

  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nombre: 'Andres Elian Diaz Suarez', email: 'admin@shenzhenstock.com', rol: 'Admin', estado: 'Activo' },
    { id: 2, nombre: 'Cliente Prueba 1', email: 'cliente@gmail.com', rol: 'Cliente', estado: 'Activo' },
  ]);

  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: 1, nombre: 'Fundas' },
    { id: 2, nombre: 'Cargadores' },
    { id: 3, nombre: 'Drones' },
    { id: 4, nombre: 'Gadgets' },
  ]);

  const [reportesPeriodos] = useState<ReportePeriodo[]>([
    { periodo: 'Semana 1', rangoFechas: '01 Jun - 07 Jun 2026', totalPedidos: 1, ventas: 35000, estado: 'Cerrada / Facturada' },
    { periodo: 'Semana 2', rangoFechas: '08 Jun - 14 Jun 2026', totalPedidos: 1, ventas: 20000, estado: 'Cerrada / Facturada' },
    { periodo: 'Semana 3', rangoFechas: '15 Jun - 21 Jun 2026', totalPedidos: 1, ventas: 72000, estado: 'Cerrada / Facturada' },
    { periodo: 'Semana 4', rangoFechas: '22 Jun - 30 Jun 2026', totalPedidos: 0, ventas: 0, estado: 'Programada' },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [formData, setFormData] = useState({ nombre: '', categoria: 'Fundas', precio: 0, stock: 0 });
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [config, setConfig] = useState({
    nombreTienda: 'ShenzhenStock',
    costoEnvio: 12000,
    emailContacto: 'soporte@shenzhenstock.com',
  });

  // ==========================================
  // 3. MÉTODOS DE NEGOCIO
  // ==========================================
  const guardarProducto = (e: React.FormEvent) => {
    e.preventDefault();
    if (productoEditando) {
      setProductos(productos.map((p) => (p.id === productoEditando.id ? { ...formData, id: p.id } : p)));
    } else {
      setProductos([
        ...productos,
        { ...formData, id: productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1 },
      ]);
    }
    setMostrarFormulario(false);
    setProductoEditando(null);
    setFormData({ nombre: '', categoria: categorias[0]?.nombre || 'Fundas', precio: 0, stock: 0 });
  };

  const eliminarProducto = (id: number) => window.confirm('¿Eliminar producto del inventario?') && setProductos(productos.filter((p) => p.id !== id));
  const iniciarEdicion = (producto: Producto) => {
    setProductoEditando(producto);
    setFormData({ ...producto });
    setMostrarFormulario(true);
  };
  const cambiarEstadoPedido = (id: number, estado: Pedido['estado']) =>
    setPedidos(pedidos.map((p) => (p.id === id ? { ...p, estado } : p)));
  const cambiarEstadoUsuario = (id: number) =>
    setUsuarios(
      usuarios.map((u) => (u.id === id ? { ...u, estado: u.estado === 'Activo' ? 'Bloqueado' : 'Activo' } : u))
    );
  const agregarCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaCategoria.trim()) {
      setCategorias([...categorias, { id: Date.now(), nombre: nuevaCategoria }]);
      setNuevaCategoria('');
    }
  };
  const eliminarCategoria = (id: number) => setCategorias(categorias.filter((c) => c.id !== id));

  // Productos filtrados para el inventario
  const productosFiltrados = productos.filter((p) => {
    const coincideCategoria = filtroCategoria === 'Todas' || p.categoria === filtroCategoria;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  // ==========================================
  // 4. RENDERIZADO DE LAS VISTAS
  // ==========================================

  const renderDashboard = () => {
    const totalMesVentas = reportesPeriodos.reduce((acc, curr) => acc + curr.ventas, 0);
    const totalPedidosMes = reportesPeriodos.reduce((acc, curr) => acc + curr.totalPedidos, 0);
    const valorTotalInventario = productos.reduce((acc, p) => acc + p.precio * p.stock, 0);
    const productosCriticos = productos.filter((p) => p.stock <= 2);
    const totalUnidadesStock = productos.reduce((acc, p) => acc + p.stock, 0);

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Dashboard de Administración</h2>
            <p className="text-sm text-gray-400 mt-1">Resumen general del estado comercial y logístico</p>
          </div>
          <button
            onClick={() => alert('Generando reporte consolidado en CSV...')}
            className="bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white px-4 py-2.5 rounded-full border border-white/10 transition-all flex items-center gap-2"
          >
            <span>📥 Exportar Reporte</span>
          </button>
        </div>

        {/* METRICAS PRINCIPALES (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/[0.02] border border-blue-500/20 p-5 rounded-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Valor del Inventario</p>
            <p className="text-2xl font-extrabold text-white mt-2">${valorTotalInventario.toLocaleString('es-CO')}</p>
            <span className="text-[10px] text-blue-400 font-semibold mt-1 inline-block">
              {totalUnidadesStock} unidades en stock total
            </span>
          </div>

          <div className="bg-white/[0.02] border border-emerald-500/20 p-5 rounded-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Ventas de Junio</p>
            <p className="text-2xl font-extrabold text-white mt-2">${totalMesVentas.toLocaleString('es-CO')}</p>
            <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-block">
              {totalPedidosMes} pedidos completados
            </span>
          </div>

        

          <div className="bg-white/[0.02] border border-purple-500/20 p-5 rounded-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
            <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Canal Principal</p>
            <p className="text-2xl font-extrabold text-white mt-2">WhatsApp</p>
            <span className="text-[10px] text-purple-400 font-medium mt-1 inline-block">Compra directa por Chat</span>
          </div>
        </div>

        {/* MÓDULO DE ALERTAS Y LOGÍSTICA RÁPIDA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* TABLA DE REPORTE SEMANAL */}
          <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Cierre Financiero por Semanas</h3>
                <p className="text-xs text-gray-400 mt-0.5">Control de ingresos y estados de facturación</p>
              </div>
              <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold px-3 py-1 rounded-full">
                Junio 2026
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-bold uppercase text-gray-400">
                    <th className="p-3">Período</th>
                    <th className="p-3">Fechas</th>
                    <th className="p-3 text-center">Pedidos</th>
                    <th className="p-3">Ventas</th>
                    <th className="p-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {reportesPeriodos.map((rep, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-bold text-white">{rep.periodo}</td>
                      <td className="p-3 text-gray-400 text-xs">{rep.rangoFechas}</td>
                      <td className="p-3 text-center font-bold text-gray-300">{rep.totalPedidos}</td>
                      <td className="p-3 font-bold text-blue-400">${rep.ventas.toLocaleString('es-CO')}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            rep.estado.includes('Cerrada')
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : rep.estado.includes('curso')
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-white/5 text-gray-400 border border-white/10'
                          }`}
                        >
                          {rep.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CAJA DE REABASTECIMIENTO Y ALERTAS (NUEVO DATO CLAVE DE ADMIN) */}
          <div className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <h3 className="text-lg font-bold text-white">Atención Requerida</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4">Productos que requieren pedido a proveedor inmediatamente:</p>

              <div className="space-y-3">
                {productosCriticos.map((p) => (
                  <div key={p.id} className="bg-white/[0.02] border border-amber-500/20 p-3 rounded-2xl flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-semibold text-white">{p.nombre}</h4>
                      <span className="text-[10px] text-gray-400">{p.categoria}</span>
                    </div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                      {p.stock === 0 ? 'Agotado' : `${p.stock} uds`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-gray-400 flex justify-between items-center">
              <span>Proveedor principal: Shenzhen Port</span>
              <span className="text-blue-400 font-semibold cursor-pointer hover:underline">Pedir →</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProductos = () => (
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
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="Todas" className="bg-gray-900 text-white">Todas las Categorías</option>
          {categorias.map((c) => (
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
              {categorias.map((c) => (
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

  const renderPedidos = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Logística y Pedidos</h2>
        <p className="text-sm text-gray-400 mt-1">Gestión de órdenes y métodos de pago registrados</p>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold uppercase text-gray-400">
                <th className="p-4">No. Pedido</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Método de Pago</th>
                <th className="p-4">Total</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {pedidos.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono text-xs text-gray-500">#{p.id}</td>
                  <td className="p-4 font-semibold text-white">{p.cliente}</td>
                  <td className="p-4 text-gray-400 text-xs">{p.fecha}</td>
                  <td className="p-4 text-xs font-medium text-purple-400">{p.metodoPago}</td>
                  <td className="p-4 font-bold text-gray-200">${p.total.toLocaleString('es-CO')}</td>
                  <td className="p-4">
                    <select
                      className={`p-2 rounded-xl text-xs font-bold outline-none cursor-pointer border ${
                        p.estado === 'Pendiente'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : p.estado === 'Enviado'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                      value={p.estado}
                      onChange={(e) => cambiarEstadoPedido(p.id, e.target.value as Pedido['estado'])}
                    >
                      <option value="Pendiente" className="bg-gray-900 text-white">
                        Pendiente
                      </option>
                      <option value="Enviado" className="bg-gray-900 text-white">
                        Enviado
                      </option>
                      <option value="Entregado" className="bg-gray-900 text-white">
                        Entregado
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsuarios = () => (
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

  const renderCategorias = () => (
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

  const renderConfiguracion = () => (
    <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl max-w-2xl space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Ajustes de Tienda</h2>
        <p className="text-sm text-gray-400 mt-1">Parámetros generales de envíos y contacto</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Nombre Comercial</label>
          <input
            type="text"
            className="border border-white/10 bg-black/50 w-full p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
            value={config.nombreTienda}
            onChange={(e) => setConfig({ ...config, nombreTienda: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Costo Envío Nacional ($)</label>
          <input
            type="number"
            className="border border-white/10 bg-black/50 w-full p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
            value={config.costoEnvio}
            onChange={(e) => setConfig({ ...config, costoEnvio: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Email de Contacto</label>
          <input
            type="email"
            className="border border-white/10 bg-black/50 w-full p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
            value={config.emailContacto}
            onChange={(e) => setConfig({ ...config, emailContacto: e.target.value })}
          />
        </div>

        <button
          onClick={() => alert('Configuración guardada exitosamente.')}
          className="bg-emerald-600 hover:bg-emerald-500 transition-all text-white font-bold py-3 px-8 rounded-full text-sm shadow-lg shadow-emerald-500/20"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );

  // ==========================================
  // ESTRUCTURA PRINCIPAL (LAYOUT)
  // ==========================================
  return (
    <div className="flex h-screen bg-[#08080a] font-sans text-white overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* SIDEBAR NAVEGACIÓN */}
      <aside className="w-64 bg-black/60 border-r border-white/10 text-white flex flex-col justify-between backdrop-blur-xl">
        <div>
          <div className="p-6 border-b border-white/10">
            <h1 className="text-xl font-bold tracking-tight">
              Shenzhen<span className="text-blue-500">Stock</span>
            </h1>
            <p className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-widest">Panel de Administración</p>
          </div>

          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', icono: '📊', nombre: 'Dashboard' },
              { id: 'pedidos', icono: '📦', nombre: 'Pedidos' },
              { id: 'productos', icono: '🏷️', nombre: 'Inventario' },
              { id: 'categorias', icono: '📁', nombre: 'Categorías' },
              { id: 'usuarios', icono: '👥', nombre: 'Usuarios' },
              { id: 'configuracion', icono: '⚙️', nombre: 'Ajustes' },
            ].map((menu) => (
              <button
                key={menu.id}
                onClick={() => setVistaActual(menu.id as any)}
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

        {/* PIE DE SIDEBAR CON USUARIO */}
        <div className="p-4 border-t border-white/10 text-xs">
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              A
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-white truncate">Andres Suarez</p>
              <p className="text-[10px] text-gray-400 truncate">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto">
          {vistaActual === 'dashboard' && renderDashboard()}
          {vistaActual === 'productos' && renderProductos()}
          {vistaActual === 'pedidos' && renderPedidos()}
          {vistaActual === 'usuarios' && renderUsuarios()}
          {vistaActual === 'categorias' && renderCategorias()}
          {vistaActual === 'configuracion' && renderConfiguracion()}
        </div>
      </main>
    </div>
  );
}