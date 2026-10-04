import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { categoriaRespuesta } from '../../_comun/proyecciones';
import { cuerpoObjeto, ErrorDePeticion, leerJson, texto } from '../../_comun/validacion';
import { errorDeDominio, exigirAdmin } from '../../_comun/respuestas';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const sinPermiso = await exigirAdmin();
  if (sinPermiso) {
    return sinPermiso;
  }
  try {
    const categorias = await serviciosServidor().categorias.listar();
    return NextResponse.json({ categorias: categorias.map(categoriaRespuesta) });
  } catch (fallo) {
    return errorDeDominio(fallo);
  }
}

export async function POST(peticion: Request): Promise<NextResponse> {
  const sinPermiso = await exigirAdmin();
  if (sinPermiso) {
    return sinPermiso;
  }
  try {
    const creada = await serviciosServidor().categorias.crear(
      texto(cuerpoObjeto(await leerJson(peticion)), 'nombre'),
    );
    return NextResponse.json({ categoria: categoriaRespuesta(creada) }, { status: 201 });
  } catch (fallo) {
    if (fallo instanceof ErrorDePeticion) {
      return NextResponse.json({ error: 'Petición inválida', detalle: fallo.message }, { status: 400 });
    }
    return errorDeDominio(fallo);
  }
}