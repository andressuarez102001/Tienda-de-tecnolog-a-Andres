import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { configuracionRespuesta } from '../_comun/proyecciones';
import { errorDeDominio } from '../_comun/respuestas';

export const dynamic = 'force-dynamic';

/**
 * `GET /api/configuracion`
 *
 * Lectura pública de la configuración de la tienda. La vitrina necesita la
 * tarifa de envío vigente para cotizar igual que el panel, pero no debe
 * exigir sesión: es el mismo dato que ya se muestra en cada ficha.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const configuracion = await serviciosServidor().configuracion.obtener();
    return NextResponse.json({ configuracion: configuracionRespuesta(configuracion) });
  } catch (fallo) {
    return errorDeDominio(fallo);
  }
}
