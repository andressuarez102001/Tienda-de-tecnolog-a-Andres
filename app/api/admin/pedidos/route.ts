import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { pedidosRespuesta } from '../../_comun/proyecciones';
import { errorDeDominio, exigirAdmin } from '../../_comun/respuestas';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const sinPermiso = await exigirAdmin();
  if (sinPermiso) {
    return sinPermiso;
  }
  try {
    return NextResponse.json({ pedidos: pedidosRespuesta(await serviciosServidor().pedidos.listar()) });
  } catch (fallo) {
    return errorDeDominio(fallo);
  }
}