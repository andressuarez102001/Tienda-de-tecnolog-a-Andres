import { NextResponse, type NextRequest } from 'next/server';

/**
 * Protección de rutas (antes de que la petición llegue a la página o al
 * endpoint).
 *
 * En Next.js 16 el archivo se llama `proxy.ts` y exporta `proxy`;
 * `middleware.ts` está deprecado.
 *
 * Qué hace y qué NO hace, que es lo importante:
 *
 *  - **Verifica** que haya un token con la firma esperada y que no haya
 *    caducado. Eso evita que un usuario anónimo llegue a renderizar el
 *    panel o a ejecutar un endpoint.
 *  - **NO autoriza**. Un token bien formado de un cliente normal también
 *    pasa esta comprobación. La autorización real (rol de administrador,
 *    cuenta activa) la hace `exigirAdministrador` en cada endpoint, porque
 *    solo el servidor puede consultar el estado de la cuenta.
 *
 * Por eso esta comprobación se puedeCachear en el proxy pero la
 * autorización no: separar ambas cosas es lo que permite escalar a una lista
 * de revocación más adelante.
 */
const RUTAS_PROTEGIDAS = ['/admin', '/api/admin'];
const RUTAS_SESION = ['/login', '/api/auth/login'];

/** Comprueba firma y expiración sin depender de `node:crypto` ni de `Buffer`. */
async function tokenValido(token: string, secreto: string): Promise<boolean> {
  const partes = token.split('.');
  if (partes.length !== 3) {
    return false;
  }
  const cuerpo = `${partes[0]}.${partes[1]}`;

  try {
    const clave = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secreto),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const firma = await crypto.subtle.sign('HMAC', clave, new TextEncoder().encode(cuerpo));
    const esperada = bytesABase64Url(new Uint8Array(firma));
    return constanteIgual(esperada, partes[2]) && payloadVigente(partes[1]);
  } catch {
    return false;
  }
}

/**
 * `Buffer.from(..., 'base64url')` no está disponible en el runtime Edge, así
 * que se decodifica con `atob`. Un JWT usa base64url (`-` y `_` en lugar de
 * `+` y `/`), de ahí el reemplazo antes de pasar a `atob`.
 */
function bytesABase64Url(bytes: Uint8Array): string {
  let binario = '';
  for (const byte of bytes) {
    binario += String.fromCharCode(byte);
  }
  return btoa(binario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlATexto(segmento: string): string {
  const base64 = segmento.replace(/-/g, '+').replace(/_/g, '/');
  const relleno = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binario = atob(relleno);
  const bytes = Uint8Array.from(binario, (caracter) => caracter.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function payloadVigente(segmento: string): boolean {
  try {
    const payload = JSON.parse(base64UrlATexto(segmento)) as { exp?: number };
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

/** Comparación en tiempo constante sobre cadenas de la misma longitud. */
function constanteIgual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diferencia = 0;
  for (let i = 0; i < a.length; i += 1) {
    diferencia |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diferencia === 0;
}

export async function proxy(peticion: NextRequest): Promise<NextResponse> {
  const ruta = peticion.nextUrl.pathname;
  const secreto = process.env.JWT_SECRET ?? '';

  if (secreto.length < 16) {
    // Sin secreto no se puede verificar nada. Es preferible bloquear el
    // acceso a fallar abiertos.
    return NextResponse.json(
      { error: 'Servidor mal configurado', detalle: 'Falta definir JWT_SECRET.' },
      { status: 500 },
    );
  }

  const token = peticion.cookies.get('shz_sesion')?.value;
  const autenticado = token ? await tokenValido(token, secreto) : false;

  if (!autenticado && RUTAS_PROTEGIDAS.some((protegida) => ruta === protegida || ruta.startsWith(`${protegida}/`))) {
    if (ruta.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'No autenticado', detalle: 'Se requiere una sesión de administrador.' },
        { status: 401 },
      );
    }
    const destino = peticion.nextUrl.clone();
    destino.pathname = '/login';
    destino.search = `?siguiente=${encodeURIComponent(ruta)}`;
    return NextResponse.redirect(destino);
  }

  if (autenticado && RUTAS_SESION.some((r) => ruta === r)) {
    const destino = peticion.nextUrl.clone();
    destino.pathname = '/admin';
    destino.search = '';
    return NextResponse.redirect(destino);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/auth/login', '/login'],
};
