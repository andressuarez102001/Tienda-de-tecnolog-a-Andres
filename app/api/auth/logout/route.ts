import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { COOKIE_SESION } from '@/infrastructure/auth/CookieSesion';

export const dynamic = 'force-dynamic';

/**
 * `POST /api/auth/logout`
 *
 * Borra la cookie. No hay estado en el servidor que revocar: el token es
 * autocontenido y caduca solo, que es el compromiso habitual de un JWT.
 */
export async function POST(): Promise<NextResponse> {
  const almacen = await cookies();
  almacen.delete(COOKIE_SESION);
  return NextResponse.json({ ok: true });
}