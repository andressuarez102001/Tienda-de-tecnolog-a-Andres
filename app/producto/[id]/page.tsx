'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const MI_TELEFONO = "573003256891";

export default function ProductDetailPage() {
  const params = useParams();
  const idProducto = params.id as string;

  // Estados interactivos
  const [imagenActiva, setImagenActiva] = useState(0);
  const [colorSeleccionado, setColorSeleccionado] = useState(0);
  const [cantidad, setCantidad] = useState(1);

  // Base de datos de productos con acabado estilo Apple Store
  const baseDeDatos = [
    { 
      id: 'funda-iphone-17', 
      nombre: 'Funda iPhone 17 Pro Max con MagSafe', 
      categoria: 'Fundas & Protección', 
      precio: 25000, 
      stock: 10, 
      descripcion: 'Diseñada para complementar tu dispositivo. Su acabado exterior de silicona resulta muy agradable al tacto y el interior está forrado de suave microfibra para proteger tu iPhone.' 
    },
    { 
      id: 'funda-iphone-14-roja', 
      nombre: 'Funda iPhone 14 Roja MagSafe', 
      categoria: 'Fundas & Protección', 
      precio: 20000, 
      stock: 30, 
      descripcion: 'Silicona líquida de primera calidad con tecnología de absorción de impactos y alineación magnética perfecta.' 
    },
    { 
      id: 'cargador-iphone', 
      nombre: 'Adaptador de Corriente USB-C de 20W', 
      categoria: 'Cargadores & Energía', 
      precio: 45000, 
      stock: 120, 
      descripcion: 'Carga ultrarrápida e inteligente diseñada para cargar tu iPhone de 0 a 50% en solo 30 minutos.' 
    }
  ];

  const coloresDisponibles = [
    { nombre: 'Transparente MagSafe', hex: '#E5E7EB', border: 'border-white' },
    { nombre: 'Rosa Pastel', hex: '#EC4899', border: 'border-pink-500' },
    { nombre: 'Azul Noche', hex: '#1E3A8A', border: 'border-blue-700' },
    { nombre: 'Negro Titanio', hex: '#111827', border: 'border-gray-700' },
  ];

  const productoEncontrado = baseDeDatos.find(p => p.id === idProducto);
  
  const producto = productoEncontrado || {
    id: idProducto,
    nombre: 'Funda Premium MagSafe',
    categoria: 'Ecosistema Apple',
    precio: 25000,
    stock: 15,
    descripcion: 'Diseño ultra elegante con bordes biselados, protección anticaídas de grado militar y compatibilidad completa con accesorios MagSafe.'
  };

  const galeriaPorProducto: { [key: string]: string[] } = {
    'funda-iphone-17': [
      '/FUNDA-IPHONE-17.jpg',
     
      
    ],
    'funda-iphone-14-roja': [
      '/FUNDA-IPHONE-14-ROJA.jpg',
      '/FUNDA-IPHONE-14.jpg',
      '/FUNDA-IPHONE-17.jpg',
      '/FUNDA-IPHONE-16-ROSA.jpg',
    ],
    'cargador-iphone': [
      '/CARGADOR-IPHONE.jpg',
      '/CARGADOR-IPAD-PRO.jpg',
      '/CARGADOR-IPHONE.jpg',
      '/CARGADOR-IPAD-PRO.jpg',
    ]
  };

  const imagenesGaleria = galeriaPorProducto[idProducto] || [
    '/FUNDA-IPHONE-17.jpg',
    '/FUNDA-IPHONE-14-TRANSPARENTE.jpg',
    '/FUNDA-IPHONE-14.jpg',
    '/FUNDA-IPHONE-16-ROSA.jpg',
  ];

  const pasosTutorial = [
    'Limpia la superficie trasera del iPhone con un paño de microfibra seco.',
    'Alinea la parte superior de la funda con el módulo de cámaras.',
    'Presiona suavemente las esquinas inferiores hasta escuchar el clic de acople.',
    'Disfruta de la alineación automática con tus accesorios MagSafe.'
  ];

  const precioTotal = producto.precio * cantidad;

  const precioTotalFormateado = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(precioTotal);

  const getWhatsAppLink = () => {
    const colorNombre = coloresDisponibles[colorSeleccionado]?.nombre || 'Estándar';
    const mensaje = encodeURIComponent(
      `Hola ShenzhenStock! Quisiera realizar la compra oficial de: ${producto.nombre} (Acabado: ${colorNombre}, Cantidad: ${cantidad} uds) por un valor de ${precioTotalFormateado}. ¿Tienen disponibilidad?`
    );
    return `https://wa.me/${MI_TELEFONO}?text=${mensaje}`;
  };

  return (
    <div className="relative min-h-screen bg-[#050507] text-[#F5F5F7] font-sans selection:bg-[#0071E3] selection:text-white overflow-hidden antialiased">
      
      {/* 🌌 LUZ AMBIENTAL DE FONDO (APPLE CYBERPUNK GLOW) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-[#0071E3]/20 via-[#6366F1]/10 to-transparent blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[180px] pointer-events-none rounded-full" />

      {/* HEADER MINIMALISTA TIPO APPLE STORE */}
      <nav className="border-b border-white/10 py-4 px-6 sm:px-12 sticky top-0 bg-[#050507]/80 backdrop-blur-2xl z-50 flex items-center justify-between">
        <Link 
          href="/home-iphone" 
          className="text-xs font-semibold text-[#2997FF] hover:text-white transition-all flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Volver a la selección de iPhone</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-widest text-gray-500">
            ShenzhenStock Direct Store
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL LAYOUT 2 COLUMNAS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-start">
        
        {/* COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tarjeta Principal de Presentación del Producto */}
          <div className="w-full h-[420px] sm:h-[520px] relative rounded-3xl overflow-hidden bg-gradient-to-b from-gray-900/90 via-[#0a0a0d] to-black border border-white/10 flex items-center justify-center p-8 shadow-2xl backdrop-blur-md group">
            <span className="absolute top-6 left-6 bg-white/5 backdrop-blur-xl border border-white/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
              {producto.categoria}
            </span>

            <img 
              src={imagenesGaleria[imagenActiva] || imagenesGaleria[0]} 
              alt={producto.nombre} 
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

          {/* Carrusel de Miniaturas Interactivas */}
          <div className="grid grid-cols-4 gap-4">
            {imagenesGaleria.map((img, index) => (
              <button 
                key={index} 
                onClick={() => setImagenActiva(index)}
                className={`aspect-square rounded-2xl overflow-hidden border transition-all duration-300 bg-gradient-to-b from-gray-900 to-black p-3 relative ${
                  imagenActiva === index 
                    ? 'border-[#2997FF] ring-2 ring-[#2997FF]/40 scale-105 opacity-100' 
                    : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
                }`}
              >
                <img src={img} alt={`Vista ${index + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* ESPECIFICACIONES TÉCNICAS (BLOQUE INFERIOR DE COMPLEMENTO) */}
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span>💎</span> Especificaciones de Construcción
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                <span className="text-gray-500 block font-medium mb-1">Compatibilidad</span>
                <span className="text-gray-200 font-bold">Permite carga inhalambrica 15W</span>
              </div>
              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                <span className="text-gray-500 block font-medium mb-1">Protección</span>
                <span className="text-gray-200 font-bold">Bordes de Absorción Anti-Impacto</span>
              </div>
              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                <span className="text-gray-500 block font-medium mb-1">Origen</span>
                <span className="text-gray-200 font-bold">Shenzhen, China</span>
              </div>
              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                <span className="text-gray-500 block font-medium mb-1">Garantía</span>
                <span className="text-gray-200 font-bold">3 Meses de Garantía Limitada</span>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: PANEL DE COMPRA ESTILO APPLE (5 COLS STICKY) */}
        <div className="lg:col-span-5 space-y-8 sticky top-24">
          
          {/* Titular y Descripción */}
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-3 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              En Inventario • {producto.stock} Unidades
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {producto.nombre}
            </h1>

            <p className="text-sm text-gray-400 font-normal leading-relaxed mt-4">
              {producto.descripcion}
            </p>
          </div>

          {/* SELECTOR DE COLOR (SWATCHES ESTILO APPLE STORE) */}
          <div className="space-y-3 border-t border-b border-white/10 py-6">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
              Acabado: <span className="text-white font-semibold">{coloresDisponibles[colorSeleccionado]?.nombre}</span>
            </label>
            <div className="flex items-center gap-3">
              {coloresDisponibles.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setColorSeleccionado(idx)}
                  className={`w-9 h-9 rounded-full transition-all flex items-center justify-center p-0.5 ${
                    colorSeleccionado === idx ? `ring-2 ring-[#0071E3] scale-110` : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.nombre}
                >
                  {colorSeleccionado === idx && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-md"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* PRECIO FINAL Y PANEL DE ORDEN */}
          <div className="bg-white/[0.02] border border-white/10 p-6 sm:p-8 rounded-3xl space-y-6 backdrop-blur-xl shadow-2xl">
            
            <div className="flex items-baseline justify-between border-b border-white/5 pb-4">
              <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Precio Total</span>
              <div className="text-right">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {precioTotalFormateado}
                </span>
                <span className="text-xs font-medium text-gray-400 ml-1">COP</span>
              </div>
            </div>

            {/* Selector de Unidades */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Unidades:</span>
              <div className="flex items-center bg-black/60 border border-white/10 rounded-2xl p-1">
                <button 
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))} 
                  className="w-9 h-9 flex items-center justify-center text-white text-lg rounded-xl hover:bg-white/10 transition-colors font-bold"
                >
                  -
                </button>
                <span className="text-white font-bold w-10 text-center text-sm">{cantidad}</span>
                <button 
                  onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))} 
                  className="w-9 h-9 flex items-center justify-center text-white text-lg rounded-xl hover:bg-white/10 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* BOTONES DE COMPRA DIRECTA */}
            <div className="space-y-3 pt-2">
              <a 
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-[#0071E3] to-[#005bb5] hover:from-[#0077ed] hover:to-[#0066cc] text-white font-bold py-4 px-6 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Añadir a la Canasta - {precioTotalFormateado}</span>
              </a>

              <a 
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white text-black hover:bg-gray-100 font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Comprar ahora por WhatsApp / PSE</span>
              </a>
            </div>

            <div className="pt-2 flex justify-center items-center gap-6 text-[11px] text-gray-400 font-medium">
              <span className="flex items-center gap-1.5">🔒 Transacción Segura</span>
              <span className="flex items-center gap-1.5">🚚 Envío Garantizado</span>
            </div>
          </div>

          {/* PASOS DE INSTALACIÓN RÁPIDA */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Guía de Instalación Rápida
            </h3>
            <div className="space-y-2.5">
              {pasosTutorial.map((paso, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 text-xs text-gray-400 bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl"
                >
                  <span className="w-5 h-5 rounded-full bg-[#0071E3]/20 text-[#2997FF] font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{paso}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}