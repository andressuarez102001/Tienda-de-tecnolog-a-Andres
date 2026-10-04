'use client';

import Image from 'next/image';
import type { Product } from '@/domain/catalog/Producto';
import { StockLevel } from '@/domain/shared/enums';
import { useServicios } from '@/presentation/ServiciosProvider';

/**
 * Etiqueta de disponibilidad.
 *
 * Antes cada página escribía a mano `<span>Disponible</span> en verde, aunque
 * un producto con stock 0 se seguía announcing como disponible. El color se
 * deriva de `StockLevel`, que es un enum del dominio: la regla no está en la
 * vista.
 */
const ESTILO_NIVEL: Record<StockLevel, { texto: string; clases: string; punto: string }> = {
  [StockLevel.Disponible]: {
    texto: 'Disponible',
    clases: 'text-emerald-400',
    punto: 'bg-emerald-400',
  },
  [StockLevel.Bajo]: {
    texto: 'Pocas unidades',
    clases: 'text-amber-400',
    punto: 'bg-amber-400',
  },
  [StockLevel.Agotado]: {
    texto: 'Agotado',
    clases: 'text-rose-400',
    punto: 'bg-rose-400',
  },
};

export interface TarjetaProductoProps {
  readonly producto: Product;
  /** Oculta el precio (uso interno del panel). */
  readonly compacta?: boolean;
}

/**
 * Tarjeta de producto compartida por todas las páginas del catálogo.
 *
 * Existían cuatro implementaciones casi idénticas (una por página) con
 * Pequeñas variaciones de precio y badge. Centralizarla significa que corregir un
 * detalle visual se hace en un solo lugar.
 */
export function TarjetaProducto({ producto, compacta = false }: TarjetaProductoProps) {
  const { priceFormatter, whatsapp } = useServicios();
  const nivel = producto.nivelStock();
  const estilo = ESTILO_NIVEL[nivel];

  return (
    <article className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-blue-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl group">
      <div>
        <div className="w-full h-56 relative overflow-hidden rounded-2xl mb-4 bg-gradient-to-b from-gray-900/60 to-black/80 border border-white/5 flex justify-center items-center">
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-gray-300 text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
            {producto.categoria}
          </span>
          {producto.tendencia ? (
            <span className="absolute top-3 right-3 bg-blue-500/15 backdrop-blur-md text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-500/25">
              Tendencia
            </span>
          ) : null}
        </div>

        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase mb-1 ${estilo.clases}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${estilo.punto}`} />
          {estilo.texto}
        </span>

        <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors line-clamp-1">
          {producto.nombre}
        </h3>
        <p className="text-xs text-gray-400 mt-1.5 font-normal leading-relaxed line-clamp-2">
          {producto.descripcion}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-gray-400 block font-medium">
            {compacta ? 'Stock' : 'Precio Final'}
          </span>
          <span className="text-base font-bold text-white tracking-tight">
            {compacta ? `${producto.stock} uds` : priceFormatter.format(producto.precio)}
          </span>
        </div>

        <a
          href={whatsapp.enlaceDeConsulta(producto)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold py-2.5 px-4 rounded-full transition-all duration-300 shadow-md shadow-blue-500/20 hover:scale-105 flex items-center gap-1.5"
        >
          <span>Comprar</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      </div>
    </article>
  );
}