import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { COOKIE_SESION } from '@/infrastructure/auth/CookieSesion';

/**
 * Utilidades compartidas por los Route Handlers.
 *
 * Centraliza las tres cosas que de otro modo se repiten en cada endpoint:
 * leer la cookie, exigir un administrador y responder errores. Un endpoint
 * sin permiso debe fallar de la misma manera en todas partes.
 */

export async function tokenDeLaPeticion(): Promise<string | undefined> {
  const almacen = await cookies();
  return almacen.get(COOKIE_SESION)?.value;
}

export async function exigirAdmin(): Promise<NextResponse | undefined> {
  const token = await tokenDeLaPeticion();
  const usuario = await serviciosServidor().autenticacion.exigirAdministrador(token);
  if (!usuario) {
    return NextResponse.json(
      { error: 'No autenticado', detalle: 'Se requiere una sesión de administrador.' },
      { status: 401 },
    );
  }
  return undefined;
}

export function json<T>(datos: T, status = 200): NextResponse {
  return NextResponse.json(datos, { status });
}

/** Convierte el error del dominio en una respuesta con código adecuado. */
export function errorDeDominio(fallo: unknown): NextResponse {
  const mensaje = fallo instanceof Error ? fallo.message : 'Error inesperado.';
  const esValidacion =
    fallo instanceof Error &&
    /no existe|debe tener|ya existe|no es válido|no es válida|no puede|inválid/i.test(mensaje);
  return NextResponse.json(
    { error: esValidacion ? 'Petición inválida' : 'Error interno', detalle: mensaje },
    { status: esValidacion ? 400 : 500 },
  );
}
