'use client';

import Image from 'next/image';
import { ProductCollection } from '@/domain/shared/enums';
import { useServicios } from '@/presentation/ServiciosProvider';
import { useDatos } from '@/presentation/useDatos';
import { PaginaCatalogo } from '@/presentation/catalog/PaginaCatalogo';
import { CabeceraCatalogo, GrillaProductos } from '@/presentation/catalog/CabeceraCatalogo';
import { EsqueletoGrilla, EstadoError } from '@/presentation/catalog/Estados';

/** Página de la colección de juguetes y entretenimiento. */
export default function HomeJuguetesPage() {
  const { catalogo } = useServicios();
  const { datos: productos, cargando, error, refrescar } = useDatos(() =>
    catalogo.listarPorColeccion(ProductCollection.Juguetes),
  );

  return (
    <PaginaCatalogo>
      <div className="relative w-full h-52 sm:h-72 rounded-3xl overflow-hidden border border-white/10 mb-12 bg-gradient-to-br from-amber-900/25 to-black">
        <Image
          src="/JUGUETES.jpg"
          alt="Juguetes y entretenimiento"
          fill
          priority
          className="object-cover opacity-60"
        />
      </div>

      <CabeceraCatalogo
        etiqueta="Diversión y Entretenimiento"
        titulo="Productos para la diversión de tus hijos"
        descripcion="Ladrillos, peluches y accesorios pensados para acompañar sus momentos de juego."
        cantidad={productos?.length ?? 0}
      />

      {error ? (
        <EstadoError mensaje={error} onReintentar={refrescar} />
      ) : cargando && !productos ? (
        <EsqueletoGrilla />
      ) : (
        <GrillaProductos productos={productos ?? []} />
      )}
    </PaginaCatalogo>
  );
}