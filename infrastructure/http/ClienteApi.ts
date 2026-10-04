/**
 * Cliente HTTP del navegador.
 *
 * Un solo sitio donde se hacen las peticiones. Centralizarlo permite:
 *
 *  - Decodificar los errores del servidor una vez y convertirlos en un tipo
 *    común, en lugar de repetir el `try/catch` en cada vista.
 *  - Añadir la cookie de sesión sin que el código de la vista sepa que existe:
 *    va sola porque es `httpOnly` y de mismo origen, así que no hay que
 *    manipulations de `credentials` ni manejo del token.
 *
 * La cookie es `httpOnly` a propósito: el JavaScript no puede leerla, y por
 * eso tampoco puede reenviarla a mano. `same-origin` solo hace falta para
 * que el navegador adjunte la cookie en `fetch`, que es el comportamiento
 * por defecto enrutando al mismo origen, pero se deja explícito porque
 * cambiarlo a `include` es un error silencioso si alguien lo edita.
 */
export class ErrorDeApi extends Error {
  readonly estado: number;

  constructor(mensaje: string, estado: number) {
    super(mensaje);
    this.name = 'ErrorDeApi';
    this.estado = estado;
  }
}

export interface RespuestaApi<T> {
  readonly codigo: number;
  readonly cuerpo: T;
}

async function pedir<T>(ruta: string, metodo: string, cuerpo?: unknown): Promise<T> {
  let peticion: RequestInit;
  if (cuerpo === undefined) {
    peticion = { method: metodo, credentials: 'same-origin', cache: 'no-store' };
  } else {
    peticion = {
      method: metodo,
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    };
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(ruta, peticion);
  } catch {
    // Un fallo de red no es un error de dominio: el mensaje en claro evita
    // que la vista muestre "Failed to fetch" al usuario.
    throw new ErrorDeApi('No se pudo conectar con el servidor.', 0);
  }

  const texto = await respuesta.text();
  let datos: unknown = null;
  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch {
      datos = null;
    }
  }

  if (!respuesta.ok) {
    const detalle = (datos as { detalle?: string; error?: string } | null) ?? {};
    const mensaje = detalle.detalle ?? detalle.error ?? 'Error inesperado del servidor.';
    throw new ErrorDeApi(mensaje, respuesta.status);
  }

  return datos as T;
}

export const clienteApi = {
  obtener: <T>(ruta: string): Promise<T> => pedir<T>(ruta, 'GET'),
  crear: <T>(ruta: string, cuerpo: unknown): Promise<T> => pedir<T>(ruta, 'POST', cuerpo),
  reemplazar: <T>(ruta: string, cuerpo: unknown): Promise<T> => pedir<T>(ruta, 'PUT', cuerpo),
  actualizar: <T>(ruta: string, cuerpo: unknown): Promise<T> => pedir<T>(ruta, 'PATCH', cuerpo),
  borrar: <T>(ruta: string): Promise<T> => pedir<T>(ruta, 'DELETE'),
};

/** Convierte un id de ruta en su forma escapada para la URL. */
export function segmento(id: string): string {
  return encodeURIComponent(id);
}
