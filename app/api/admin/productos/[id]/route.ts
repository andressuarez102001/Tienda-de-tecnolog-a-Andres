import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { productoRespuesta } from '../../../_comun/proyecciones';
import { borradorProducto, ErrorDePeticion, leerJson } from '../../../_comun/validacion';
import { errorDeDominio, exigirAdmin } from '../../../_comun/respuestas';

export const dynamic = 'force-dynamic';

type Contexto = { params: Promise<{ id: string }> };

/** `PUT /api/admin/productos/[id]` �?" actualización completa. */
export async function PUT(peticion: Request, contexto: Contexto): Promise<NextResponse> {
  const sinPermiso = await exigirAdmin();
  if (sinPermiso) {
    return sinPermiso;
  }
  const { id } = await contexto.params;
  try {
    const actualizado = await serviciosServidor().productos.actualizar(
      id,
      borradorProducto(await leerJson(peticion)),
    );
    return NextResponse.json({ producto: productoRespuesta(actualizado) });
  } catch (fallo) {
    if (fallo instanceof ErrorDePeticion) {
      return NextResponse.json({ error: 'Petición inválida', detalle: fallo.message }, { status: 400 });
    }
    return errorDeDominio(fallo);
  }
}

/** `DELETE /api/admin/productos/[id]` */
export async function DELETE(_peticion: Request, contexto: Contexto): Promise<NextResponse> {
  const sinPermiso = await exigirAdmin();
  if (sinPermiso) {
    return sinPermiso;
  }
  const { id } = await contexto.params;
  try {
    await serviciosServidor().productos.eliminar(id);
    return NextResponse.json({ ok: true });
  } catch (fallo) {
    return errorDeDominio(fallo);
  }
}