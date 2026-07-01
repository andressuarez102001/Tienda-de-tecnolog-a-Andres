'use client';

import React, { useState } from 'react';

export default function AdminPage() {
  // Estado para simular el filtro por categorías interactivo
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

  // Datos del inventario con las categorías reales de ShenzhenStock
  const inventarioCompleto = [
    { id: 1, nombre: 'iPhone 17 Pro Max (Titanio)', categoria: 'Fundas', precio: '$120.000', stock: 45 },
    { id: 2, nombre: 'Cargador GaN 65W Ultra Fast', categoria: 'Cargadores', precio: '$185.000', stock: 120 },
    { id: 3, nombre: 'Cable USB-C a USB-C Trenzado (2m)', categoria: 'Cables', precio: '$65.000', stock: 300 },
    { id: 4, nombre: 'iPad Pro M4 Ultra Slim Case', categoria: 'Fundas', precio: '$150.000', stock: 28 },
    { id: 5, nombre: 'Drone DJI Mavic 3 Pro Cine', categoria: 'Drones', precio: '$9.800.000', stock: 3 },
    { id: 6, nombre: 'Power Bank 20.000mAh MagSafe', categoria: 'Power Banks', precio: '$220.000', stock: 65 },
  ];

  const categorias = ['Todos', 'Cargadores', 'Power Banks', 'Cables', 'Fundas', 'Drones'];

  // Filtrar productos dinámicamente en pantalla
  const productosFiltrados = categoriaActiva === 'Todos'
    ? inventarioCompleto
    : inventarioCompleto.filter(p => p.categoria === categoriaActiva);

  return (
    <div className="min-h-screen bg-[#000000] text-[#F5F5F7] font-sans antialiased selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header Estilo Apple: Tipografía fina y limpia */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b border-[#1D1D1F] pb-8">
          <div>
            <span className="text-xs font-medium tracking-widest text-[#86868B] uppercase">Consola de Control</span>
            <h1 className="text-3xl font-semibold tracking-tight text-white mt-1">ShenzhenStock Admin</h1>
          </div>
          <button 
            onClick={() => alert('Operación: Añadir nuevo ítem al manifiesto de importación.')}
            className="bg-[#F5F5F7] hover:bg-white text-[#1D1D1F] text-xs font-medium px-4 py-2 rounded-full transition-all duration-200 shadow-sm"
          >
            Añadir Producto
          </button>
        </header>

        {/* Métricas en Tarjetas Monocromáticas de Bordes Suaves */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#121212] border border-[#1D1D1F] p-6 rounded-2xl">
            <h3 className="text-xs font-medium text-[#86868B] tracking-wide">Valor del Inventario</h3>
            <p className="text-2xl font-normal tracking-tight text-white mt-2">$24.530.000</p>
          </div>
          <div className="bg-[#121212] border border-[#1D1D1F] p-6 rounded-2xl">
            <h3 className="text-xs font-medium text-[#86868B] tracking-wide">Unidades Disponibles (LCL)</h3>
            <p className="text-2xl font-normal tracking-tight text-white mt-2">561 uds</p>
          </div>
          <div className="bg-[#121212] border border-[#1D1D1F] p-6 rounded-2xl">
            <h3 className="text-xs font-medium text-[#86868B] tracking-wide">Despachos Pendientes</h3>
            <p className="text-2xl font-normal tracking-tight text-white mt-2">3 solicitudes</p>
          </div>
        </section>

        {/* Filtros de Categorías Interactivos tipo Píldora de Apple */}
        <section className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`text-xs px-4 py-1.5 rounded-full transition-all duration-200 border ${
                categoriaActiva === cat
                  ? 'bg-[#F5F5F7] text-[#1D1D1F] border-[#F5F5F7]'
                  : 'bg-transparent text-[#86868B] border-[#1D1D1F] hover:text-white hover:border-[#86868B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Tabla Minimalista de Gestión */}
        <section className="bg-[#121212] border border-[#1D1D1F] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1D1D1F] bg-[#1C1C1E]/30 text-[#86868B] text-xs tracking-wider uppercase">
                  <th className="p-4 font-medium">Especificación</th>
                  <th className="p-4 font-medium">Categoría</th>
                  <th className="p-4 font-medium">Precio Unitario</th>
                  <th className="p-4 font-medium">Existencias</th>
                  <th className="p-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D1D1F] text-sm text-[#E8E8ED]">
                {productosFiltrados.length > 0 ? (
                  productosFiltrados.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1C1C1E]/40 transition-colors duration-150">
                      <td className="p-4 font-medium text-white">{item.nombre}</td>
                      <td className="p-4 text-[#86868B] text-xs">{item.categoria}</td>
                      <td className="p-4 font-mono text-xs">{item.precio}</td>
                      <td className="p-4">
                        <span className={`text-xs font-medium ${item.stock <= 5 ? 'text-orange-400' : 'text-[#86868B]'}`}>
                          {item.stock} unidades
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-4 text-xs font-medium">
                        <button 
                          onClick={() => alert(`Modificar: ${item.nombre}`)}
                          className="text-[#2997FF] hover:underline"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => alert(`Remover: ${item.nombre}`)}
                          className="text-[#FF453A] hover:underline"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-[#86868B]">
                      No hay productos registrados en esta categoría de importación.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}