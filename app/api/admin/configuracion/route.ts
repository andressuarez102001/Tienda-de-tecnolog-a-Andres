import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { configuracionRespuesta, reporteRespuesta } from '../../_comun/proyecciones';
import { cuerpoObjeto, correo, ErrorDePeticion, leerJson, numero, texto } from '../../_comun/validacion';
import { errorDeDominio, exigirAdmin } from '../../_comun/respuestas';

export const dynamic = 'force-dynamic';

/**
 * `GET /api/admin/configuracion`
 *
 * Devuelve configuración y reportes juntos porque el panel los pinta en la
 * misma vista y son los dos datos "de la tienda" que no son catálogo.
 */
export async function GET(): Promise<NextResponse> {
  const sinPermiso = await exigirAdmin();
  if (sinPermiso) {
    return sinPermiso;
  }
  try {
    const servicios = serviciosServidor();
    const [configuracion, reportes] = await Promise.all([
      servicios.configuracion.obtener(),
      servicios.reportes.listar(),
    ]);
    return NextResponse.json({
      configuracion: configuracionRespuesta(configuracion),
      reportes: reportes.map(reporteRespuesta),
    });
  } catch (fallo) {
    return errorDeDominio(fallo);
  }
}

/** `PUT /api/admin/configuracion` */
export async function PUT(peticion: Request): Promise<NextResponse> {
  const sinPermiso = await exigirAdmin();
  if (sinPermiso) {
    return sinPermiso;
  }
  try {
    const datos = cuerpoObjeto(await leerJson(peticion));
    const actualizada = await serviciosServidor().configuracion.guardar({
      nombreTienda: texto(datos, 'nombreTienda'),
      costoEnvio: numero(datos, 'costoEnvio', { minimo: 0 }),
      emailContacto: correo(datos, 'emailContacto'),
    });
    return NextResponse.json({ configuracion: configuracionRespuesta(actualizada) });
  } catch (fallo) {
    if (fallo instanceof ErrorDePeticion) {
      return NextResponse.json({ error: 'Petición inválida', detalle: fallo.message }, { status: 400 });
    }
    return errorDeDominio(fallo);
  }
}