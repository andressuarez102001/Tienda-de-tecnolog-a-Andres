import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { errorDeDominio, exigirAdmin } from '../../../_comun/respuestas';

export const dynamic = 'force-dynamic';

type Contexto = { params: Promise<{ id: string }> };

export async function DELETE(_peticion: Request, contexto: Contexto): Promise<NextResponse> {
  const sinPermiso = await exigirAdmin();
  if (sinPermiso) {
    return sinPermiso;
  }
  const categoriaId = Number((await contexto.params).id);
  if (!Number.isInteger(categoriaId) || categoriaId < 1) {
    return NextResponse.json(
      { error: 'Petición inválida', detalle: 'El identificador no es válido.' },
      { status: 400 },
    );
  }
  try {
    await serviciosServidor().categorias.eliminar(categoriaId);
    return NextResponse.json({ ok: true });
  } catch (fallo) {
    return errorDeDominio(fallo);
  }
}
