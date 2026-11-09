import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { COOKIE_SESION } from '@/infrastructure/auth/CookieSesion';
import { tokenDeLaPeticion } from '../../_comun/respuestas';

export const dynamic = 'force-dynamic';

/**
 * `GET /api/auth/sesion`
 *
 * Responde quién es la sesión actual a partir de la cookie. El panel lo usa
 * al montar para decidir si entra o si manda al login, en lugar de fiarse de
 * un valor guardado en `localStorage` (que el usuario puede editar).
 *
 * Solo se considera sesión válida la de un administrador activo. Si el token
 * es válido pero la cuenta fue bloqueada o perdió el rol, se borra la cookie:
 * de lo contrario `proxy.ts` seguiría mandando `/login` a `/admin` y el panel
 * devolvería a `/login`, produciendo un bucle infinito.
 */
export async function GET(): Promise<NextResponse> {
  const usuario = await serviciosServidor().autenticacion.usuarioDesdeToken(
    (await tokenDeLaPeticion()) ?? '',
  );
  if (!usuario?.puedeAdministrar()) {
    const almacen = await cookies();
    almacen.delete(COOKIE_SESION);
    return NextResponse.json({ usuario: null }, { status: 401 });
  }
  return NextResponse.json({ usuario: usuario.aPersistido() });
}