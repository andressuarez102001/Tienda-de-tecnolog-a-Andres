import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { COOKIE_SESION, opcionCookieSesion } from '@/infrastructure/auth/CookieSesion';
import { errorDeDominio } from '../../_comun/respuestas';
import { ErrorDePeticion, leerJson } from '../../_comun/validacion';

export const dynamic = 'force-dynamic';

/**
 * `POST /api/auth/login`
 *
 * Verifica el hash bcrypt de la contraseña, comprueba que la cuenta esté
 * activa y con permisos de administración, y solo entonces firma el JWT.
 *
 * El token viaja en una cookie httpOnly: no se devuelve en el cuerpo, para
 * que no quede accesible desde JavaScript.
 */
export async function POST(peticion: Request): Promise<NextResponse> {
  let cuerpo: { email?: unknown; password?: unknown };
  try {
    cuerpo = (await leerJson(peticion)) as typeof cuerpo;
  } catch (fallo) {
    if (fallo instanceof ErrorDePeticion) {
      return NextResponse.json({ error: 'Petición inválida', detalle: fallo.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Petición inválida', detalle: 'El cuerpo debe ser JSON.' },
      { status: 400 },
    );
  }

  const { email, password } = cuerpo;
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return NextResponse.json(
      { error: 'Petición inválida', detalle: 'Se requieren "email" y "password".' },
      { status: 400 },
    );
  }

  try {
    const { autenticacion, duracionDeSesionMs } = serviciosServidor();
    const resultado = await autenticacion.autenticar(email, password);

    if (!resultado.ok) {
      const detalle =
        resultado.motivo === 'inactivo'
          ? 'La cuenta está bloqueada.'
          : resultado.motivo === 'sin-permisos'
            ? 'La cuenta no tiene permisos de administración.'
            : 'Correo o contraseña incorrectos.';
      return NextResponse.json({ error: 'No autenticado', detalle }, { status: 401 });
    }

    const almacen = await cookies();
    almacen.set(COOKIE_SESION, resultado.token, opcionCookieSesion(duracionDeSesionMs));

    return NextResponse.json({ usuario: resultado.usuario.aPersistido() });
  } catch (fallo) {
    return errorDeDominio(fallo);
  }
}