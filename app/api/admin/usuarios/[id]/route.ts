import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { usuarioRespuesta } from '../../../_comun/proyecciones';
import { errorDeDominio, exigirAdmin } from '../../../_comun/respuestas';

export const dynamic = 'force-dynamic';

type Contexto = { params: Promise<{ id: string }> };

/**
 * `PATCH /api/admin/usuarios/[id]`
 *
 * Habilita o bloquea la cuenta. Si queda bloqueada, su JWT deja de servir en
 * la siguiente petición porque `exigirAdministrador` vuelve a leer la entidad
 * y no se limita a confiar en el `rol` del token.
 */
export async function PATCH(_peticion: Request, contexto: Contexto): Promise<NextResponse> {
  const sinPermiso = await exigirAdmin();
  if (sinPermiso) {
    return sinPermiso;
  }
  const { id } = await contexto.params;
  const usuarioId = Number(id);
  if (!Number.isInteger(usuarioId) || usuarioId < 1) {
    return NextResponse.json(
      { error: 'Petición inválida', detalle: 'El identificador no es válido.' },
      { status: 400 },
    );
  }
  try {
    const usuario = await serviciosServidor().usuarios.alternarEstado(usuarioId);
    return NextResponse.json({ usuario: usuarioRespuesta(usuario) });
  } catch (fallo) {
    return errorDeDominio(fallo);
  }
}