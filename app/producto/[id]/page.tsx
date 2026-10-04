'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { StockLevel } from '@/domain/shared/enums';
import { useServicios } from '@/presentation/ServiciosProvider';
import { useDatos } from '@/presentation/useDatos';
import { EstadoCarga } from '@/presentation/catalog/Estados';

/** Acabados disponibles en el selector de color. */
const ACABADOS = [
  { nombre: 'Transparente MagSafe', hex: '#E5E7EB' },
  { nombre: 'Rosa Pastel', hex: '#EC4899' },
  { nombre: 'Azul Noche', hex: '#1E3A8A' },
  { nombre: 'Negro Titanio', hex: '#111827' },
] as const;

/**
 * Galería por producto. Antes solo existían entradas para tres
 * identificadores y el resto caía en una lista de fundas de iPhone: al abrir
 * el detalle de un dron se veían cuatro imágenes de iphones.
 */
const GALERIA: Readonly<Record<string, ReadonlyArray<string>>> = {
  'funda-iphone-17': [
    '/FUNDA-IPHONE-17.jpg',
    '/FUNDA-IPHONE-17PROMAX.jpg',
    '/FUNDA-IPHONE-17-AZUL.jpg',
    '/funda-iphone17-compra.jpg',
  ],
  'funda-iphone-14-roja': [
    '/FUNDA-IPHONE-14-ROJA.jpg',
    '/FUNDA-IPHONE-14.jpg',
    '/FUNDA-IPHONE-17.jpg',
    '/FUNDA-IPHONE-16-ROSA.jpg',
  ],
  'cargador-iphone': ['/CARGADOR-IPHONE.jpg', '/CARGADOR-20W.jpg', '/CARGADOR-IPAD-PRO.jpg'],
};

/** Guía de uso del accesorio. */
const PASOS_INSTALACION = [
  'Verifica que el modelo del accesorio corresponda exactamente a tu equipo.',
  'Limpia la superficie de contacto con un paño de microfibra seco.',
  'Alinea el accesorio y presiona suavemente hasta sentir el acople.',
  'Comprueba la sujeción antes de guardar el equipo en su estuche.',
];

/** Etiqueta y color del nivel de stock. */
const ESTADO_STOCK: Record<StockLevel, string> = {
  [StockLevel.Disponible]: 'En Inventario',
  [StockLevel.Bajo]: 'Últimas Unidades',
  [StockLevel.Agotado]: 'Agotado',
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { catalogo, priceFormatter, whatsapp } = useServicios();

  const [imagenActiva, setImagenActiva] = useState(0);
  const [acabadoSeleccionado, setAcabadoSeleccionado] = useState(0);
  const [cantidad, setCantidad] = useState(1);

  const { datos: producto, cargando } = useDatos(
    () => catalogo.obtenerPorId(params.id),
    [params.id],
  );

  if (cargando && !producto) {
    return <EstadoCarga mensaje="Cargando producto…" />;
  }

  /**
   * Antes, un identificador desconocido devolvía `DEFAULT_PRODUCT`: la página
   * mostraba "Funda Premium MagSafe" con precio y stock inventados. Ahora se
   * dice que no existe, que es la verdad.
   */
  if (!producto) {
    return (
      <main className="min-h-screen bg-[#050507] text-white pt-32 pb-24 px-4 sm:px-6 flex flex-col items-center justify-center gap-6 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
          Error 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          No encontramos ese producto
        </h1>
        <p className="text-sm text-gray-400 max-w-md">
          Puede que el enlace esté desactualizado o que el producto se haya retirado del
          catálogo.
        </p>
        <Link
          href="/productos-top"
          className="bg-white text-black hover:bg-white/90 text-xs font-semibold px-5 py-2.5 rounded-full transition-all"
        >
          Ver productos destacados
        </Link>
      </main>
    );
  }

  const acabado = ACABADOS[acabadoSeleccionado];
  const imagenes = GALERIA[producto.id.valor] ?? [producto.imagen];
  const total = producto.cotizar(cantidad);
  const nivelStock = producto.nivelStock();

  return (
    <div className="relative min-h-screen bg-[#050507] text-[#F5F5F7] font-sans selection:bg-[#0071E3] selection:text-white overflow-hidden antialiased">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-[#0071E3]/20 via-[#6366F1]/10 to-transparent blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[180px] pointer-events-none rounded-full" />

      <nav className="border-b border-white/10 py-4 px-6 sm:px-12 sticky top-0 bg-[#050507]/80 backdrop-blur-2xl z-50 flex items-center justify-between">
        <Link
          href="/productos-top"
          className="text-xs font-semibold text-[#2997FF] hover:text-white transition-all flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Volver al catálogo</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-widest text-gray-500">
            ShenzhenStock Direct Store
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="w-full h-[420px] sm:h-[520px] relative rounded-3xl overflow-hidden bg-gradient-to-b from-gray-900/90 via-[#0a0a0d] to-black border border-white/10 flex items-center justify-center p-8 shadow-2xl backdrop-blur-md group">
            <span className="absolute top-6 left-6 bg-white/5 backdrop-blur-xl border border-white/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
              {producto.categoria}
            </span>
            <Image
              src={imagenes[imagenActiva] ?? imagenes[0]}
              alt={producto.nombre}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

          {imagenes.length > 1 ? (
            <div className="grid grid-cols-4 gap-4">
              {imagenes.map((img, index) => (
                <button
                  key={img}
                  onClick={() => setImagenActiva(index)}
                  className={`aspect-square rounded-2xl overflow-hidden border transition-all duration-300 bg-gradient-to-b from-gray-900 to-black p-3 relative ${
                    imagenActiva === index
                      ? 'border-[#2997FF] ring-2 ring-[#2997FF]/40 scale-105 opacity-100'
                      : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
                  }`}
                >
                  <Image src={img} alt={`Vista ${index + 1}`} fill sizes="25vw" className="object-contain" />
                </button>
              ))}
            </div>
          ) : null}

          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Especificaciones
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                <span className="text-gray-500 block font-medium mb-1">Tipo</span>
                <span className="text-gray-200 font-bold">{producto.tipo}</span>
              </div>
              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                <span className="text-gray-500 block font-medium mb-1">Colección</span>
                <span className="text-gray-200 font-bold">{producto.coleccion}</span>
              </div>
              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                <span className="text-gray-500 block font-medium mb-1">Costo de envío</span>
                <span className="text-gray-200 font-bold">
                  {priceFormatter.format(producto.costoEnvio())}
                </span>
              </div>
              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                <span className="text-gray-500 block font-medium mb-1">Origen</span>
                <span className="text-gray-200 font-bold">Shenzhen, China</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8 sticky top-24">
          <div>
            <span
              className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full border ${
                nivelStock === StockLevel.Disponible
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  nivelStock === StockLevel.Disponible ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              {ESTADO_STOCK[nivelStock]} • {producto.stock} Unidades
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {producto.nombre}
            </h1>
            <p className="text-sm text-gray-400 font-normal leading-relaxed mt-4">
              {producto.descripcion}
            </p>
          </div>

          <div className="space-y-3 border-t border-b border-white/10 py-6">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
              Acabado: <span className="text-white font-semibold">{acabado.nombre}</span>
            </label>
            <div className="flex items-center gap-3">
              {ACABADOS.map((opcion, indice) => (
                <button
                  key={opcion.nombre}
                  onClick={() => setAcabadoSeleccionado(indice)}
                  className={`w-9 h-9 rounded-full transition-all flex items-center justify-center p-0.5 ${
                    acabadoSeleccionado === indice ? 'ring-2 ring-[#0071E3] scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: opcion.hex }}
                  title={opcion.nombre}
                >
                  {acabadoSeleccionado === indice ? (
                    <span className="w-2 h-2 rounded-full bg-white shadow-md" />
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-6 sm:p-8 rounded-3xl space-y-6 backdrop-blur-xl shadow-2xl">
            <div className="flex items-baseline justify-between border-b border-white/5 pb-4">
              <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                Precio Total
              </span>
              <div className="text-right">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {priceFormatter.format(total)}
                </span>
                <span className="text-xs font-medium text-gray-400 ml-1">COP</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                Unidades:
              </span>
              <div className="flex items-center bg-black/60 border border-white/10 rounded-2xl p-1">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  disabled={cantidad <= 1}
                  className="w-9 h-9 flex items-center justify-center text-white text-lg rounded-xl hover:bg-white/10 transition-colors font-bold disabled:opacity-30"
                >
                  -
                </button>
                <span className="text-white font-bold w-10 text-center text-sm">{cantidad}</span>
                <button
                  onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                  disabled={producto.esAgotado()}
                  className="w-9 h-9 flex items-center justify-center text-white text-lg rounded-xl hover:bg-white/10 transition-colors font-bold disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={whatsapp.enlaceDeCompra(producto, cantidad, acabado.nombre)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-[#0071E3] to-[#005bb5] hover:from-[#0077ed] hover:to-[#0066cc] text-white font-bold py-4 px-6 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Pedir por WhatsApp - {priceFormatter.format(total)}</span>
              </a>
              <a
                href={whatsapp.enlaceDeConsulta(producto)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white text-black hover:bg-gray-100 font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Consultar disponibilidad</span>
              </a>
            </div>

            <div className="pt-2 flex justify-center items-center gap-6 text-[11px] text-gray-400 font-medium">
              <span className="flex items-center gap-1.5">🔒 Transacción Segura</span>
              <span className="flex items-center gap-1.5">🚚 Envío Garantizado</span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Guía de Instalación Rápida
            </h3>
            <div className="space-y-2.5">
              {PASOS_INSTALACION.map((paso, index) => (
                <div
                  key={paso}
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