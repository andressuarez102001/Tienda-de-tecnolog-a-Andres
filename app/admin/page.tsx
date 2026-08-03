'use client';

import React, { useState } from 'react';

// ==========================================
// 1. POO: INTERFACES (Molde de las Entidades)
// ==========================================
interface Producto { id: number; nombre: string; categoria: string; precio: number; stock: number; }
interface Pedido { id: number; cliente: string; fecha: string; total: number; estado: 'Pendiente' | 'Enviado' | 'Entregado'; }
interface Usuario { id: number; nombre: string; email: string; rol: 'Admin' | 'Cliente'; estado: 'Activo' | 'Bloqueado'; }
interface Categoria { id: number; nombre: string; }
interface ReportePeriodo { periodo: string; rangoFechas: string; totalPedidos: number; ventas: number; estado: string; }

export default function AdminPage() {
  // ==========================================
  // 2. ESTADOS DEL SISTEMA (Inventario real de tu tienda)
  // ==========================================
  const [vistaActual, setVistaActual] = useState<'dashboard' | 'productos' | 'pedidos' | 'usuarios' | 'categorias' | 'configuracion'>('dashboard');

  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, nombre: 'Funda iPhone 17 Pro Max', categoria: 'Fundas', precio: 35000, stock: 45 },
    { id: 2, nombre: 'Funda iPhone 14 Roja', categoria: 'Fundas', precio: 85000, stock: 30 },
    { id: 3, nombre: 'Funda iPhone 14 Transparente', categoria: 'Fundas', precio: 85000, stock: 25 },
    { id: 4, nombre: 'Cargador iPhone', categoria: 'Cargadores', precio: 15000, stock: 120 },
    { id: 5, nombre: 'Funda iPhone 14 Normal', categoria: 'Fundas', precio: 85000, stock: 40 },
    { id: 6, nombre: 'Funda iPhone 16 Rosada', categoria: 'Fundas', precio: 85000, stock: 35 },
    { id: 7, nombre: 'Funda iPad Pro', categoria: 'Fundas', precio: 35000, stock: 20 },
    { id: 8, nombre: 'Funda iPad Pro Negra', categoria: 'Fundas', precio: 85000, stock: 18 },
    { id: 9, nombre: 'Funda iPad Pro V2', categoria: 'Fundas', precio: 85000, stock: 15 },
    { id: 10, nombre: 'Cargador iPad Pro', categoria: 'Cargadores', precio: 15000, stock: 90 },
    { id: 11, nombre: 'Funda iPad Pro V3', categoria: 'Fundas', precio: 85000, stock: 12 },
    { id: 12, nombre: 'Drone ALPHA 4K', categoria: 'Drones', precio: 410000, stock: 5 },
    { id: 13, nombre: 'Drone ALPHA 2K', categoria: 'Drones', precio: 325000, stock: 8 },
    { id: 14, nombre: 'Controlador de Drone', categoria: 'Drones', precio: 150000, stock: 10 },
    { id: 15, nombre: 'Batería Portátil 20000mAh', categoria: 'Gadgets', precio: 45000, stock: 50 },
    { id: 16, nombre: 'Extensor de Enchufe Inteligente', categoria: 'Gadgets', precio: 80000, stock: 30 },
    { id: 17, nombre: 'Gafas de Realidad Virtual 3D', categoria: 'Gadgets', precio: 120000, stock: 14 },
    { id: 18, nombre: 'Inflador Portátil 12V', categoria: 'Gadgets', precio: 30000, stock: 25 },
    { id: 19, nombre: 'Trípode para Celular', categoria: 'Gadgets', precio: 25000, stock: 60 },
  ]);

  const [pedidos, setPedidos] = useState<Pedido[]>([
    { id: 101, cliente: 'Andres-1', fecha: '2026-08-01', total: 20000, estado: 'Pendiente' },
    { id: 102, cliente: 'Andres-2', fecha: '2026-08-02', total: 20000, estado: 'Enviado' },
    { id: 103, cliente: 'Andres-3', fecha: '2026-08-03', total: 28000, estado: 'Entregado' },
  ]);

  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nombre: 'Andres Elian Diaz Suarez', email: 'admin@shenzhenstock.com', rol: 'Admin', estado: 'Activo' },
    
  ]); 

  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: 1, nombre: 'Fundas' }, 
    { id: 2, nombre: 'Cargadores' }, 
    { id: 3, nombre: 'Drones' }, 
    { id: 4, nombre: 'Gadgets' }
  ]);

  const [reportesPeriodos] = useState<ReportePeriodo[]>([
    { periodo: 'Semana 1', rangoFechas: '01 Ago - 07 Ago 2026', totalPedidos: 3, ventas: 60000, estado: 'Cerrada / Facturada' },
    { periodo: 'Semana 2', rangoFechas: '08 Ago - 14 Ago 2026', totalPedidos: 1, ventas: 8000, estado: 'En curso' },
    { periodo: 'Semana 3', rangoFechas: '15 Ago - 21 Ago 2026', totalPedidos: 0, ventas: 0, estado: 'Programada' },
    { periodo: 'Semana 4', rangoFechas: '22 Ago - 31 Ago 2026', totalPedidos: 0, ventas: 0, estado: 'Programada' },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [formData, setFormData] = useState({ nombre: '', categoria: 'Fundas', precio: 0, stock: 0 });
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [config, setConfig] = useState({ nombreTienda: 'ShenzhenStock', costoEnvio: 15000, emailContacto: 'soporte@shenzhenstock.com' });

  // ==========================================
  // 3. MÉTODOS DE NEGOCIO
  // ==========================================
  const guardarProducto = (e: React.FormEvent) => {
    e.preventDefault();
    if (productoEditando) {
      setProductos(productos.map((p) => p.id === productoEditando.id ? { ...formData, id: p.id } : p));
    } else {
      setProductos([...productos, { ...formData, id: productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1 }]);
    }
    setMostrarFormulario(false); setProductoEditando(null); setFormData({ nombre: '', categoria: categorias[0]?.nombre || 'Fundas', precio: 0, stock: 0 });
  };
  
  const eliminarProducto = (id: number) => window.confirm('¿Eliminar producto?') && setProductos(productos.filter((p) => p.id !== id));
  const iniciarEdicion = (producto: Producto) => { setProductoEditando(producto); setFormData({ ...producto }); setMostrarFormulario(true); };
  const cambiarEstadoPedido = (id: number, estado: Pedido['estado']) => setPedidos(pedidos.map(p => p.id === id ? { ...p, estado } : p));
  const cambiarEstadoUsuario = (id: number) => setUsuarios(usuarios.map(u => u.id === id ? { ...u, estado: u.estado === 'Activo' ? 'Bloqueado' : 'Activo' } : u));
  const agregarCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    if(nuevaCategoria.trim()) { setCategorias([...categorias, { id: Date.now(), nombre: nuevaCategoria }]); setNuevaCategoria(''); }
  };
  const eliminarCategoria = (id: number) => setCategorias(categorias.filter(c => c.id !== id));

  // ==========================================
  // 4. RENDERIZADO DE LAS VISTAS
  // ==========================================

  const renderDashboard = () => {
    const totalMesVentas = reportesPeriodos.reduce((acc, curr) => acc + curr.ventas, 0);
    const totalPedidosMes = reportesPeriodos.reduce((acc, curr) => acc + curr.totalPedidos, 0);

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen General y Consolidado</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-blue-500"><p className="text-xs text-gray-500 uppercase font-bold">Ventas del Mes</p><p className="text-2xl font-bold text-gray-900">${totalMesVentas.toLocaleString('es-CO')}</p></div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-green-500"><p className="text-xs text-gray-500 uppercase font-bold">Total Pedidos</p><p className="text-2xl font-bold text-gray-900">{totalPedidosMes}</p></div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-yellow-500"><p className="text-xs text-gray-500 uppercase font-bold">Clientes Registrados</p><p className="text-2xl font-bold text-gray-900">{usuarios.length}</p></div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-red-500"><p className="text-xs text-gray-500 uppercase font-bold">Alertas de Stock</p><p className="text-2xl font-bold text-gray-900">{productos.filter(p => p.stock < 15).length}</p></div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Reporte Financiero por Períodos (Agosto 2026)</h3>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">Sincronizado con Inventario Real</span>
          </div>
          
          <table className="w-full text-left border-collapse overflow-hidden rounded-lg">
            <thead className="bg-gray-100 text-gray-800 text-sm">
              <tr className="border-b">
                <th className="p-4 font-bold">Período</th>
                <th className="p-4 font-bold">Rango de Fechas</th>
                <th className="p-4 font-bold text-center">Pedidos</th>
                <th className="p-4 font-bold">Ventas Totales</th>
                <th className="p-4 font-bold">Estado del Ciclo</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y">
              {reportesPeriodos.map((rep, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-900">{rep.periodo}</td>
                  <td className="p-4 text-gray-600 font-medium">{rep.rangoFechas}</td>
                  <td className="p-4 text-center font-bold text-gray-800">{rep.totalPedidos}</td>
                  <td className="p-4 font-bold text-blue-600">${rep.ventas.toLocaleString('es-CO')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      rep.estado.includes('Cerrada') ? 'bg-green-100 text-green-800' :
                      rep.estado.includes('curso') ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {rep.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-bold text-gray-900 border-t-2 border-gray-200">
                <td className="p-4" colSpan={2}>TOTAL ACUMULADO DEL MES</td>
                <td className="p-4 text-center">{totalPedidosMes}</td>
                <td className="p-4 text-blue-700">${totalMesVentas.toLocaleString('es-CO')}</td>
                <td className="p-4 text-xs text-gray-500">Cierre Financiero Activo</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const renderProductos = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventario de Productos</h2>
          <p className="text-sm text-gray-500">Total artículos registrados: {productos.length}</p>
        </div>
        <button onClick={() => { setMostrarFormulario(!mostrarFormulario); setProductoEditando(null); }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors shadow-sm">{mostrarFormulario ? 'Cancelar' : '+ Nuevo Producto'}</button>
      </div>
      {mostrarFormulario && (
        <form onSubmit={guardarProducto} className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre del producto" required className="border p-2 rounded outline-none focus:border-blue-500 bg-white text-gray-900" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
            <select className="border p-2 rounded outline-none focus:border-blue-500 bg-white text-gray-900" value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})}>
              {categorias.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
            </select>
            <input type="number" placeholder="Precio ($)" required className="border p-2 rounded outline-none focus:border-blue-500 bg-white text-gray-900" value={formData.precio} onChange={(e) => setFormData({...formData, precio: Number(e.target.value)})} />
            <input type="number" placeholder="Stock disponible" required className="border p-2 rounded outline-none focus:border-blue-500 bg-white text-gray-900" value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} />
          </div>
          <button type="submit" className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded font-semibold transition-colors shadow-sm">Guardar Producto</button>
        </form>
      )}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-800 text-sm"><tr className="border-b"><th className="p-4 font-bold">ID</th><th className="p-4 font-bold">Producto</th><th className="p-4 font-bold">Categoría</th><th className="p-4 font-bold">Precio</th><th className="p-4 font-bold">Stock</th><th className="p-4 text-right font-bold">Acciones</th></tr></thead>
          <tbody className="text-sm divide-y">
            {productos.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 text-gray-500 font-mono">#{item.id}</td>
                <td className="p-4 font-medium text-gray-900">{item.nombre}</td>
                <td className="p-4 text-gray-600 font-medium">{item.categoria}</td>
                <td className="p-4 font-bold text-gray-800">${item.precio.toLocaleString('es-CO')}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${item.stock < 15 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {item.stock} uds
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => iniciarEdicion(item)} className="text-blue-600 font-bold hover:underline">Editar</button> <span className="text-gray-300">|</span> <button onClick={() => eliminarProducto(item.id)} className="text-red-600 font-bold hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPedidos = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Logística de Pedidos</h2>
      <table className="w-full bg-white shadow-sm rounded-lg text-left overflow-hidden border-collapse">
        <thead className="bg-gray-100 text-gray-800 text-sm">
          <tr className="border-b"><th className="p-4 font-bold">No. Pedido</th><th className="p-4 font-bold">Cliente</th><th className="p-4 font-bold">Fecha</th><th className="p-4 font-bold">Total</th><th className="p-4 font-bold">Estado</th></tr>
        </thead>
        <tbody className="text-sm divide-y">
          {pedidos.map(p => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="p-4 font-mono text-gray-500">#{p.id}</td>
              <td className="p-4 font-medium text-gray-900">{p.cliente}</td>
              <td className="p-4 text-gray-600 font-medium">{p.fecha}</td>
              <td className="p-4 font-bold text-gray-900">${p.total.toLocaleString('es-CO')}</td>
              <td className="p-4">
                <select 
                  className={`p-1.5 rounded text-xs font-bold border-none outline-none cursor-pointer text-gray-900 ${
                    p.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                    p.estado === 'Enviado' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}
                  value={p.estado} 
                  onChange={(e) => cambiarEstadoPedido(p.id, e.target.value as Pedido['estado'])}
                >
                  <option value="Pendiente" className="bg-white text-gray-900">Pendiente</option>
                  <option value="Enviado" className="bg-white text-gray-900">Enviado</option>
                  <option value="Entregado" className="bg-white text-gray-900">Entregado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderUsuarios = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Usuarios</h2>
      <table className="w-full text-left border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-800 text-sm"><tr className="border-b"><th className="p-4 font-bold">Nombre / Cliente</th><th className="p-4 font-bold">Email</th><th className="p-4 font-bold">Rol</th><th className="p-4 font-bold">Estado</th></tr></thead>
        <tbody className="text-sm divide-y">
          {usuarios.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="p-4 font-medium text-gray-900">{u.nombre}</td><td className="p-4 text-gray-600 font-medium">{u.email}</td><td className="p-4 text-gray-900 font-medium">{u.rol}</td>
              <td className="p-4">
                <button onClick={() => cambiarEstadoUsuario(u.id)} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-sm ${u.estado === 'Activo' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}>
                  {u.estado}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCategorias = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Agregar Categoría</h3>
        <form onSubmit={agregarCategoria} className="flex space-x-2">
          <input type="text" placeholder="Ej. Smartwatches" className="border p-2 rounded flex-1 outline-none focus:border-blue-500 bg-white text-gray-900" value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} required />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition-colors shadow-sm">Añadir</button>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left"><thead className="bg-gray-100 text-sm text-gray-800"><tr className="border-b"><th className="p-4 font-bold">Nombre de Categoría</th><th className="p-4 text-right font-bold">Acción</th></tr></thead>
          <tbody className="divide-y text-sm">{categorias.map(c => <tr key={c.id} className="hover:bg-gray-50"><td className="p-4 font-medium text-gray-900">{c.nombre}</td><td className="p-4 text-right"><button onClick={() => eliminarCategoria(c.id)} className="text-red-600 font-bold hover:underline">Eliminar</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );

  const renderConfiguracion = () => (
    <div className="bg-white p-8 rounded-lg shadow-sm border max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración de la Tienda</h2>
      <div className="space-y-4">
        <div><label className="block text-sm font-bold mb-1 text-gray-800">Nombre Comercial</label><input type="text" className="border w-full p-2 rounded outline-none focus:border-blue-500 bg-white text-gray-900" value={config.nombreTienda} onChange={e => setConfig({...config, nombreTienda: e.target.value})} /></div>
        <div><label className="block text-sm font-bold mb-1 text-gray-800">Costo Envío Nacional ($)</label><input type="number" className="border w-full p-2 rounded outline-none focus:border-blue-500 bg-white text-gray-900" value={config.costoEnvio} onChange={e => setConfig({...config, costoEnvio: Number(e.target.value)})} /></div>
        <div><label className="block text-sm font-bold mb-1 text-gray-800">Email de Contacto</label><input type="email" className="border w-full p-2 rounded outline-none focus:border-blue-500 bg-white text-gray-900" value={config.emailContacto} onChange={e => setConfig({...config, emailContacto: e.target.value})} /></div>
        <button onClick={() => alert('Configuración guardada.')} className="bg-green-600 hover:bg-green-700 transition-colors text-white font-bold py-2 px-6 rounded mt-4 shadow-sm">Guardar Cambios</button>
      </div>
    </div>
  );

  // ==========================================
  // ESTRUCTURA PRINCIPAL (LAYOUT)
  // ==========================================
  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Shenzhen<span className="text-blue-500">Stock</span></h1>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', icono: '📊', nombre: 'Dashboard' },
            { id: 'pedidos', icono: '🚚', nombre: 'Pedidos' },
            { id: 'productos', icono: '📦', nombre: 'Inventario' },
            { id: 'categorias', icono: '🏷️', nombre: 'Categorías' },
            { id: 'usuarios', icono: '👥', nombre: 'Usuarios' },
            { id: 'configuracion', icono: '⚙️', nombre: 'Ajustes' }
          ].map(menu => (
            <button key={menu.id} onClick={() => setVistaActual(menu.id as any)} className={`w-full text-left px-4 py-3 rounded transition-colors font-medium ${vistaActual === menu.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
              <span className="mr-2">{menu.icono}</span> {menu.nombre}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 text-gray-900">
        {vistaActual === 'dashboard' && renderDashboard()}
        {vistaActual === 'productos' && renderProductos()}
        {vistaActual === 'pedidos' && renderPedidos()}
        {vistaActual === 'usuarios' && renderUsuarios()}
        {vistaActual === 'categorias' && renderCategorias()}
        {vistaActual === 'configuracion' && renderConfiguracion()}
      </main>
    </div>
  );
}