import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { productosRespuesta, productoRespuesta } from '../../_comun/proyecciones';
import { borradorProducto, ErrorDePeticion, leerJson } from '../../_comun/validacion';
import { errorDeDominio, exigirAdmin } from '../../_comun/respuestas';

export const dynamic = 'force-dynamic';

/** `GET /api/admin/productos` �?" listado completo, incluidos los agotados. */
export async function GET(): Promise<NextResponse> {
  const sinPermiso = await exigirAdmin();
  if (sinPermiso) {
    return sinPermiso;
  }
  try {
    const productos = await serviciosServidor().productos.listar({ agotados: true });
    return NextResponse.json({ productos: productosRespuesta(productos) });
  } catch (fallo) {
    return errorDeDominio(fallo);
  }
}

/** `POST /api/admin/productos` �?" crea un producto. */
export async function POST(peticion: Request): Promise<NextResponse> {
  const sinPermiso = await exigirAdmin();
  if (sinPermiso) {
    return sinPermiso;
  }
  try {
    const creado = await serviciosServidor().productos.crear(borradorProducto(await leerJson(peticion)));
    return NextResponse.json({ producto: productoRespuesta(creado) }, { status: 201 });
  } catch (fallo) {
    if (fallo instanceof ErrorDePeticion) {
      return NextResponse.json({ error: 'Petición inválida', detalle: fallo.message }, { status: 400 });
    }
    return errorDeDominio(fallo);
  }
}