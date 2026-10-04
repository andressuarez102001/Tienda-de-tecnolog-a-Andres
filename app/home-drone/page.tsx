'use client';

import Image from 'next/image';
import { ProductCollection } from '@/domain/shared/enums';
import { useServicios } from '@/presentation/ServiciosProvider';
import { useDatos } from '@/presentation/useDatos';
import { PaginaCatalogo } from '@/presentation/catalog/PaginaCatalogo';
import { CabeceraCatalogo, GrillaProductos } from '@/presentation/catalog/CabeceraCatalogo';
import { EsqueletoGrilla, EstadoError } from '@/presentation/catalog/Estados';

/** Página de la colección de drones y accesorios de grabación. */
export default function HomeDronePage() {
  const { catalogo } = useServicios();
  const { datos: productos, cargando, error, refrescar } = useDatos(
    () => catalogo.listarPorColeccion(ProductCollection.Drone),
  );

  return (
    <PaginaCatalogo>
      <div className="relative w-full h-52 sm:h-72 rounded-3xl overflow-hidden border border-white/10 mb-12 bg-gradient-to-br from-purple-900/30 to-black">
        <Image
          src="/DRONE-PORTADA.jpg"
          alt="Drones y accesorios de grabación"
          fill
          priority
          className="object-cover opacity-60"
        />
      </div>

      <CabeceraCatalogo
        etiqueta="Tecnología Aérea & Filming"
        titulo="Drones & Accesorios de Grabación"
        descripcion="Equipos de alta resolución, sensores de vuelo seguro y controladores de precisión con garantía y soporte técnico local."
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