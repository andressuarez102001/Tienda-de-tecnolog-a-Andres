'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProductDetailPage() {
  // 1. Leemos el ID como texto (String) para que coincida con "funda-iphone-17"
  const params = useParams();
  const idProducto = params.id as string;

  // Estados interactivos
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cantidad, setCantidad] = useState(1);

  // 2. Base de datos con los IDs exactos de tu catálogo
  const baseDeDatos = [
    { 
      id: 'funda-iphone-17', 
      nombre: 'Funda iPhone 17 Pro Max', 
      categoria: 'Fundas', 
      precio: 35000, 
      stock: 45, 
      descripcion: 'Funda Premium con tecnología MagSafe integrada. Máxima protección con diseño ultradelgado.' 
    },
    { 
      id: 'funda-iphone-14-roja', 
      nombre: 'Funda iPhone 14 Roja', 
      categoria: 'Fundas', 
      precio: 85000, 
      stock: 30, 
      descripcion: 'Silicona líquida de alta calidad, tacto suave y protección antigolpes de grado militar.' 
    },
    { 
      id: 'cargador-iphone', 
      nombre: 'Cargador iPhone', 
      categoria: 'Cargadores', 
      precio: 15000, 
      stock: 120, 
      descripcion: 'Cargador rápido con tecnología MagSafe para mantener tu dispositivo energizado.' 
    }
  ];

  // Buscamos el producto comparando textos
  const productoEncontrado = baseDeDatos.find(p => p.id === idProducto);
  
  // Si no se encuentra, usamos un valor por defecto seguro
  const producto = productoEncontrado || {
    id: idProducto,
    nombre: 'Producto Exclusivo ShenzhenStock',
    categoria: 'Tecnología',
    precio: 35000,
    stock: 15,
    descripcion: 'Accesorio premium seleccionado para nuestros clientes más exigentes con altos estándares de calidad.'
  };

  // 3. Diccionario de imágenes conectadas a tu carpeta public/
  const galeriaPorProducto: { [key: string]: string[] } = {
    'funda-iphone-17': [
      '/funda-iphone17-compra.jpg', // Reemplaza aquí con la ruta de tu imagen real si deseas otra
      '/funda-iphone17-compra2.jpg',
      '/funda-iphone17-compra3.jpg',
      '/funda-iphone17-compra4.jpg',
    ],
    'funda-iphone-14-roja': [
      '/FUNDA-IPHONE-14-ROJA.jpg',
      'https://via.placeholder.com/600x600/1C1C1E/FFFFFF?text=Vista+Lateral',
      'https://via.placeholder.com/600x600/2C2C2E/FFFFFF?text=Interior',
      'https://via.placeholder.com/600x600/121212/FFFFFF?text=Empaque',
    ],
    'cargador-iphone': [
      '/CARGADOR-IPHONE.jpg',
      'https://via.placeholder.com/600x600/1C1C1E/FFFFFF?text=Cable',
      'https://via.placeholder.com/600x600/2C2C2E/FFFFFF?text=Adaptador',
      'https://via.placeholder.com/600x600/121212/FFFFFF?text=Caja',
    ]
  };

  // Asignamos la galería del producto o una por defecto si no existe
  const imagenesGaleria = galeriaPorProducto[idProducto] || [
    '/AIRPODS.jpg',
    '/AIRPODS.jpg',
    '/AIRPODS.jpg',
    '/AIRPODS.jpg',
  ];

  const pasosTutorial = [
    'Limpia cuidadosamente la superficie del dispositivo con un paño de microfibra.',
    'Alinea el accesorio con los puertos y botones de tu dispositivo.',
    'Ejerce una presión uniforme hasta escuchar un ligero clic de acople.',
    'Verifica que el ajuste sea perfecto y sin holguras.'
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-[#F5F5F7] font-sans selection:bg-blue-500/30">
      
      {/* Navbar Minimalista */}
      <nav className="border-b border-[#1D1D1F] py-4 px-8 sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <Link href="/productos-top" className="text-sm font-medium text-[#2997FF] hover:text-white transition-colors flex items-center gap-2">
          ← Volver a la Tienda Principal
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* COLUMNA IZQUIERDA: Galería Dinámica */}
        <div className="space-y-6">
          <div className="aspect-square bg-[#121212] rounded-3xl overflow-hidden border border-[#1D1D1F] flex items-center justify-center relative group">
            <img 
              src={imagenesGaleria[imagenActiva]} 
              alt={producto.nombre} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-6 left-6 bg-blue-600/20 text-blue-500 text-xs font-bold px-4 py-1.5 rounded-full border border-blue-500/30 backdrop-blur-md">
              {producto.categoria.toUpperCase()}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {imagenesGaleria.map((img, index) => (
              <button 
                key={index} 
                onClick={() => setImagenActiva(index)}
                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                  imagenActiva === index ? 'border-[#2997FF] scale-95 opacity-100' : 'border-transparent opacity-40 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Miniatura ${index}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: Datos del Producto y Compra */}
        <div className="flex flex-col justify-start">
          
          <div className="mb-6">
            <span className="text-xs font-bold tracking-widest text-green-500 mb-3 block">EN INVENTARIO • {producto.stock} UNIDADES</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">{producto.nombre}</h1>
            <p className="text-[#86868B] text-lg leading-relaxed">{producto.descripcion}</p>
          </div>
          
          <div className="text-5xl font-semibold text-white mb-8 tracking-tight border-b border-[#1D1D1F] pb-8">
            ${producto.precio.toLocaleString('es-CO')} <span className="text-xl text-[#86868B] font-normal">COP</span>
          </div>

          {/* Panel de Compra interactivo */}
          <div className="bg-[#121212] border border-[#1D1D1F] p-6 rounded-3xl mb-10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-[#86868B]">Cantidad requerida:</span>
              <div className="flex items-center bg-[#1C1C1E] rounded-full p-1 border border-[#333336]">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="w-10 h-10 flex items-center justify-center text-white text-xl rounded-full hover:bg-[#2C2C2E] transition-colors">-</button>
                <span className="text-white font-semibold w-12 text-center">{cantidad}</span>
                <button onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))} className="w-10 h-10 flex items-center justify-center text-white text-xl rounded-full hover:bg-[#2C2C2E] transition-colors">+</button>
              </div>
            </div>
            
            <div className="space-y-3 relative z-10">
              <button 
                onClick={() => alert(`✅ Has añadido ${cantidad} unidad(es) de ${producto.nombre} a tu carrito de compras.`)} 
                className="w-full bg-[#2997FF] hover:bg-[#0071E3] text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
              >
                Agregar a la Canasta - ${(producto.precio * cantidad).toLocaleString('es-CO')}
              </button>
              
              <button 
                onClick={() => alert('Abriendo pasarela de pagos PSE...')}
                className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Comprar ahora con PSE
              </button>
            </div>
            
            <div className="mt-6 flex justify-center items-center gap-6 text-xs text-[#86868B] font-medium">
              <span className="flex items-center gap-1">🔒 Transacción Segura</span>
              <span className="flex items-center gap-1">🚚 Importación Directa</span>
            </div>
          </div>

          {/* Especificaciones Técnicas */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Especificaciones Técnicas</h3>
              <div className="space-y-2">
                <p className="text-sm text-[#86868B] flex justify-between border-b border-[#1D1D1F] pb-2">
                  <span className="text-white">Origen</span> <span>Shenzhen, China</span>
                </p>
                <p className="text-sm text-[#86868B] flex justify-between border-b border-[#1D1D1F] pb-2">
                  <span className="text-white">Control de Calidad</span> <span>ADSO</span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Guía de Instalación Rápida</h3>
              <ul className="space-y-4">
                {pasosTutorial.map((paso, index) => (
                  <li key={index} className="flex gap-4 text-sm text-[#86868B]">
                    <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#1C1C1E] text-[#2997FF] font-bold text-xs border border-[#333336]">
                      {index + 1}
                    </span>
                    <span className="pt-1 leading-relaxed">{paso}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}