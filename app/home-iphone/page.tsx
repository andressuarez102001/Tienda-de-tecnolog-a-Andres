'use client';

import Image from 'next/image';
import { ProductCollection } from '@/domain/shared/enums';
import { useServicios } from '@/presentation/ServiciosProvider';
import { useDatos } from '@/presentation/useDatos';
import { PaginaCatalogo } from '@/presentation/catalog/PaginaCatalogo';
import { CabeceraCatalogo, GrillaProductos } from '@/presentation/catalog/CabeceraCatalogo';
import { EsqueletoGrilla, EstadoError } from '@/presentation/catalog/Estados';

/**
 * Página de la colección iPhone.
 *
 * Antes declaraba seis objetos planos en el propio archivo y los mapeaba a
 * `StorefrontProduct`. Ahora pide al caso de uso los productos de la
 * colección: añadir un producto nuevo no obliga a tocar esta página.
 */
export default function HomeIPhonePage() {
  const { catalogo } = useServicios();
  const { datos: productos, cargando, error, refrescar } = useDatos(() =>
    catalogo.listarPorColeccion(ProductCollection.Iphone),
  );

  return (
    <PaginaCatalogo>
      <div className="relative w-full h-52 sm:h-72 rounded-3xl overflow-hidden border border-white/10 mb-12 bg-gradient-to-br from-blue-900/30 to-black">
        <Image
          src="/IMAGEN-IPHONE-PORTADA.jpg"
          alt="Accesorios para iPhone"
          fill
          priority
          className="object-cover opacity-60"
        />
      </div>

      <CabeceraCatalogo
        etiqueta="Ecosistema Apple"
        titulo="Accesorios para iPhone"
        descripcion="Fundas MagSafe, cargadores ultrarrápidos y accesorios diseñados exclusivamente para proteger y potenciar tu dispositivo."
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