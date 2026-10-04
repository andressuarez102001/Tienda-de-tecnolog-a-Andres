'use client';

import { CatalogListing } from '@/domain/shared/enums';
import { useServicios } from '@/presentation/ServiciosProvider';
import { useDatos } from '@/presentation/useDatos';
import { PaginaCatalogo } from '@/presentation/catalog/PaginaCatalogo';
import { CabeceraCatalogo, GrillaProductos } from '@/presentation/catalog/CabeceraCatalogo';
import { EsqueletoGrilla, EstadoError } from '@/presentation/catalog/Estados';

/**
 * Listado de novedades.
 *
 * Reemplaza el array local con su campo `isHot`. El badge "Nuevo" se decide
 * aquí, en presentación, y el dato (`novedad`) vive en el dominio.
 */
export default function ProductosNuevosPage() {
  const { catalogo } = useServicios();
  const { datos: productos, cargando, error, refrescar } = useDatos(() =>
    catalogo.listarPorListado(CatalogListing.Novedades),
  );

  return (
    <PaginaCatalogo>
      <CabeceraCatalogo
        etiqueta="Recién Llegados"
        titulo="Recién Llegados al Mercado"
        descripcion="Las incorporaciones más recientes a nuestro inventario, con disponibilidad inmediata."
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