import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { tokenDeLaPeticion } from '../../_comun/respuestas';

export const dynamic = 'force-dynamic';

/**
 * `GET /api/auth/sesion`
 *
 * Responde quién es la sesión actual a partir de la cookie. El panel lo usa
 * al montar para decidir si entra o si manda al login, en lugar de fiarse de
 * un valor guardado en `localStorage` (que el usuario puede editar).
 */
export async function GET(): Promise<NextResponse> {
  const usuario = await serviciosServidor().autenticacion.usuarioDesdeToken(
    (await tokenDeLaPeticion()) ?? '',
  );
  if (!usuario) {
    return NextResponse.json({ usuario: null }, { status: 401 });
  }
  return NextResponse.json({ usuario: usuario.aPersistido() });
}