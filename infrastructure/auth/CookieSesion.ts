/**
 * Cookie de sesión del servidor.
 *
 * Es httpOnly: el JavaScript del navegador no puede leerla, así que un XSS no
 * puede robar el token. `sameSite: 'lax'` bloquea el envío en peticiones
 * POST de terceros, y `secure` se activa en producción.
 */
export const COOKIE_SESION = 'shz_sesion';

const unDia = 24 * 60 * 60;

export function esProduccion(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function opcionCookieSesion(expiraEnMilisegundos: number): {
  readonly httpOnly: true;
  readonly sameSite: 'lax';
  readonly path: string;
  readonly secure: boolean;
  readonly maxAge: number;
} {
  return {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: esProduccion(),
    maxAge: Math.floor(expiraEnMilisegundos / 1000 / unDia) + 1,
  };
}
