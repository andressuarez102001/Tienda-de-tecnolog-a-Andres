import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { productosRespuesta } from '../_comun/proyecciones';
import { CatalogListing, ProductCollection, ProductSort } from '@/domain/shared/enums';
import { errorDeDominio } from '../_comun/respuestas';

export const dynamic = 'force-dynamic';

const ORDENES: ReadonlyArray<ProductSort> = ['nombre', 'precio-asc', 'precio-desc', 'stock'];

/**
 * `GET /api/catalogo`
 *
 * Endpoint público de lectura. Acepta los mismos filtros que la interfaz
 * (`coleccion`, `categoria`, `listado`, `busqueda`, `agotados`, `orden`) para
 * que la vitrina y la API devuelvan exactamente el mismo conjunto.
 *
 * Un filtro con valor no reconocido se descarta en lugar de causing un error:
 * una URL manipulada a mano o un cliente desactualizado no deberían poder tumbar
 * la vitrina. El coste es que devuelve la lista completa, que es el mismo
 * resultado que pedir la página sin filtros.
 */
export async function GET(peticion: Request): Promise<NextResponse> {
  const url = new URL(peticion.url);
  const coleccion = url.searchParams.get('coleccion');
  const listado = url.searchParams.get('listado');
  const busqueda = url.searchParams.get('busqueda') ?? '';
  const orden = url.searchParams.get('orden') ?? 'nombre';
  const categoria = url.searchParams.get('categoria');
  const agotados = url.searchParams.get('agotados');

  try {
    const catalogo = serviciosServidor().catalogo;
    const productos = await catalogo.listar({
      ...(coleccion && esColeccion(coleccion) ? { coleccion } : {}),
      ...(listado && esListado(listado) ? { listado } : {}),
      ...(categoria ? { categoria } : {}),
      ...(agotados === 'true' ? { agotados: true } : {}),
      busqueda,
      orden: esOrden(orden) ? orden : 'nombre',
    });
    return NextResponse.json({ productos: productosRespuesta(productos) });
  } catch (fallo) {
    return errorDeDominio(fallo);
  }
}

function esColeccion(valor: string): valor is ProductCollection {
  return Object.values(ProductCollection).includes(valor as ProductCollection);
}

function esListado(valor: string): valor is CatalogListing {
  return Object.values(CatalogListing).includes(valor as CatalogListing);
}

function esOrden(valor: string): valor is ProductSort {
  return ORDENES.includes(valor as ProductSort);
}