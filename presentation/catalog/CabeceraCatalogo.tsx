import Link from 'next/link';
import type { Product } from '@/domain/catalog/Producto';
import { TarjetaProducto } from './TarjetaProducto';

export interface CabeceraCatalogoProps {
  readonly etiqueta: string;
  readonly titulo: string;
  readonly descripcion: string;
  readonly cantidad: number;
  readonly voltarA?: string;
}

/**
 * Cabecera compartida por las páginas de catálogo.
 *
 * Las cuatro páginas de colección y las dos de listado repetían el mismo
 * bloque (volver, badge, título, descripción, contador). Un solo componente
 * con props evita que una de ellas se quede atrás en el próximo rediseño.
 */
export function CabeceraCatalogo({
  etiqueta,
  titulo,
  descripcion,
  cantidad,
  voltarA = '/',
}: CabeceraCatalogoProps) {
  return (
    <div className="mb-12">
      <Link
        href={voltarA}
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-blue-400 transition-colors mb-6 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
      >
        ← Volver al Inicio
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            {etiqueta}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-3">
            {titulo}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-normal max-w-xl mt-2">
            {descripcion}
          </p>
        </div>

        <div className="text-xs text-gray-400 bg-white/[0.02] border border-white/[0.06] px-4 py-2.5 rounded-xl self-start md:self-auto">
          Mostrando <span className="text-white font-bold">{cantidad}</span> ítems
          disponibles
        </div>
      </div>
    </div>
  );
}

export interface GrillaProductosProps {
  readonly productos: ReadonlyArray<Product>;
  readonly compacta?: boolean;
  readonly mensajeVacio?: string;
}

/** Grilla responsiva compartida. Si no hay resultados, lo dice explícitamente. */
export function GrillaProductos({
  productos,
  compacta = false,
  mensajeVacio = 'No hay productos que coincidan con esta selección.',
}: GrillaProductosProps) {
  if (productos.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500 border border-dashed border-white/10 rounded-2xl py-16">
        {mensajeVacio}
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map((producto) => (
        <TarjetaProducto key={producto.id.valor} producto={producto} compacta={compacta} />
      ))}
    </div>
  );
}