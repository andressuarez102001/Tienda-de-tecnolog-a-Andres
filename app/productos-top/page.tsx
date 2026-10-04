'use client';

import { CatalogListing } from '@/domain/shared/enums';
import { useServicios } from '@/presentation/ServiciosProvider';
import { useDatos } from '@/presentation/useDatos';
import { PaginaCatalogo } from '@/presentation/catalog/PaginaCatalogo';
import { CabeceraCatalogo, GrillaProductos } from '@/presentation/catalog/CabeceraCatalogo';
import { EsqueletoGrilla, EstadoError } from '@/presentation/catalog/Estados';

/**
 * Listado de productos destacados.
 *
 * El array de 14 objetos que estaba incrustado en este archivo ya no existe:
 * los productos salen del catálogo con el flag `destacado`, así que la
 * vitrina y la administración nunca se desincronizan.
 */
export default function ProductosTopPage() {
  const { catalogo } = useServicios();
  const { datos: productos, cargando, error, refrescar } = useDatos(() =>
    catalogo.listarPorListado(CatalogListing.Destacados),
  );

  return (
    <PaginaCatalogo>
      <CabeceraCatalogo
        etiqueta="Selección Exclusiva"
        titulo="Productos TOP Destacados"
        descripcion="Los accesorios y dispositivos más solicitados con garantía, tecnología avanzada y entrega inmediata."
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