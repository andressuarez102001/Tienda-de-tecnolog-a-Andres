import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { usuarioRespuesta } from '../../_comun/proyecciones';
import { errorDeDominio, exigirAdmin } from '../../_comun/respuestas';

export const dynamic = 'force-dynamic';

/** `GET /api/admin/usuarios` */
export async function GET(): Promise<NextResponse> {
  const sinPermiso = await exigirAdmin();
  if (sinPermiso) {
    return sinPermiso;
  }
  try {
    const usuarios = await serviciosServidor().usuarios.listar();
    return NextResponse.json({ usuarios: usuarios.map(usuarioRespuesta) });
  } catch (fallo) {
    return errorDeDominio(fallo);
  }
}