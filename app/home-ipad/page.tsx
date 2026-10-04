'use client';

import Image from 'next/image';
import { ProductCollection } from '@/domain/shared/enums';
import { useServicios } from '@/presentation/ServiciosProvider';
import { useDatos } from '@/presentation/useDatos';
import { PaginaCatalogo } from '@/presentation/catalog/PaginaCatalogo';
import { CabeceraCatalogo, GrillaProductos } from '@/presentation/catalog/CabeceraCatalogo';
import { EsqueletoGrilla, EstadoError } from '@/presentation/catalog/Estados';

/** Página de la colección iPad. */
export default function HomeIpadPage() {
  const { catalogo } = useServicios();
  const { datos: productos, cargando, error, refrescar } = useDatos(() =>
    catalogo.listarPorColeccion(ProductCollection.Ipad),
  );

  return (
    <PaginaCatalogo>
      <div className="relative w-full h-52 sm:h-72 rounded-3xl overflow-hidden border border-white/10 mb-12 bg-gradient-to-br from-indigo-900/30 to-black">
        <Image
          src="/IPAD-PORTADA.jpg"
          alt="Accesorios para iPad"
          fill
          priority
          className="object-cover opacity-60"
        />
      </div>

      <CabeceraCatalogo
        etiqueta="Línea iPad & Productividad"
        titulo="Accesorios Exclusivos para iPad"
        descripcion="Fundas magnéticas, cargadores de alta potencia y periféricos seleccionados para convertir tu iPad en la estación de trabajo definitiva."
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