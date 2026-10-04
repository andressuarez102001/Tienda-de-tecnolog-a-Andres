import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { productoRespuesta } from '../../_comun/proyecciones';
import { errorDeDominio } from '../../_comun/respuestas';

export const dynamic = 'force-dynamic';

/**
 * `GET /api/productos/[id]`
 *
 * Devuelve 404 si el producto no existe. Es la diferencia importante frente a
 * la versión anterior, que caía en un producto genérico con precio y stock
 * inventados: un enlace roto ahora se ve como un enlace roto.
 */
export async function GET(
  _peticion: Request,
  contexto: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await contexto.params;
  try {
    const producto = await serviciosServidor().catalogo.obtenerPorId(id);
    if (!producto) {
      return NextResponse.json(
        { error: 'No encontrado', detalle: `No existe el producto "${id}".` },
        { status: 404 },
      );
    }
    return NextResponse.json({ producto: productoRespuesta(producto) });
  } catch (fallo) {
    return errorDeDominio(fallo);
  }
}