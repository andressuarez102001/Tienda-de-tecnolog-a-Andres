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

/** Código SQLSTATE de un error de PostgreSQL, si lo trae. */
function codigoPostgres(fallo: unknown): string | undefined {
  if (typeof fallo !== 'object' || fallo === null || !('code' in fallo)) {
    return undefined;
  }
  const codigo = (fallo as { code?: unknown }).code;
  return typeof codigo === 'string' ? codigo : undefined;
}

/** Convierte el error del dominio en una respuesta con código adecuado. */
export function errorDeDominio(fallo: unknown): NextResponse {
  const mensaje = fallo instanceof Error ? fallo.message : 'Error inesperado.';
  const codigo = codigoPostgres(fallo);

  if (codigo === '23503') {
    return json(
      {
        error: 'Conflicto',
        detalle: 'No se puede completar: el registro está en uso por otros datos.',
      },
      409,
    );
  }
  if (codigo === '23505') {
    return json(
      { error: 'Conflicto', detalle: 'Ya existe un registro con ese valor.' },
      409,
    );
  }
  if (codigo === '23514' || codigo === '22P02') {
    return json(
      { error: 'Petición inválida', detalle: 'Los datos no cumplen una restricción del servidor.' },
      400,
    );
  }

  const esValidacion =
    fallo instanceof Error &&
    /no existe|debe tener|ya existe|no es válido|no es válida|no puede|inválid/i.test(mensaje);
  return NextResponse.json(
    { error: esValidacion ? 'Petición inválida' : 'Error interno', detalle: mensaje },
    { status: esValidacion ? 400 : 500 },
  );
}
