import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { COOKIE_SESION } from '@/infrastructure/auth/CookieSesion';

export const dynamic = 'force-dynamic';

/**
 * `DELETE /api/auth/logout`
 *
 * Borra la cookie. No hay estado en el servidor que revocar: el token es
 * autocontenido y caduca solo, que es el compromiso habitual de un JWT.
 */
async function cerrarSesion(): Promise<NextResponse> {
  const almacen = await cookies();
  almacen.delete(COOKIE_SESION);
  return NextResponse.json({ ok: true });
}

/** El cliente HTTP modela el cierre de sesión como la eliminación de este recurso. */
export async function DELETE(): Promise<NextResponse> {
  return cerrarSesion();
}

/** Compatibilidad con clientes que todavía envían el cierre como POST. */
export async function POST(): Promise<NextResponse> {
  return cerrarSesion();
}
