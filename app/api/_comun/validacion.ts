import type { ProductDraft } from '@/domain/catalog/ProductoDraft';
import {
  ProductCollection,
  TipoProducto,
} from '@/domain/shared/enums';
import { Email } from '@/domain/shared/Email';

/**
 * Lectura y validación del cuerpo de las peticiones.
 *
 * Traduce "JSON arbitrario" a los tipos del dominio. Se hace en la frontera
 * y no repartido por los casos de uso para que el dominio no tenga que
 * defenderse de `unknown`, y para que los errores de validación sean siempre
 * un 400 con un mensaje legible.
 */

export class ErrorDePeticion extends Error {}

/**
 * Lee el cuerpo JSON de la petición.
 *
 * Existe para que un JSON malformado sea un 400 y no un 500: `json()` lanza
 * `SyntaxError`, que no es un `ErrorDePeticion` y por tanto se escapaba al
 * manejador genérico de errores, haciendo que un cliente que manda basura
 * recibiera "Error interno". Un 400 además es lo correcto según HTTP, porque
 * el problema está en lo que envió el cliente, no en el servidor.
 */
export async function leerJson(peticion: Request): Promise<unknown> {
  try {
    return await peticion.json();
  } catch {
    throw new ErrorDePeticion('El cuerpo debe ser JSON válido.');
  }
}

export function cuerpoObjeto(cuerpo: unknown): Record<string, unknown> {
  if (typeof cuerpo !== 'object' || cuerpo === null || Array.isArray(cuerpo)) {
    throw new ErrorDePeticion('El cuerpo debe ser un objeto JSON.');
  }
  return cuerpo as Record<string, unknown>;
}

export function texto(
  datos: Record<string, unknown>,
  campo: string,
  { opcional = false }: { opcional?: boolean } = {},
): string {
  const valor = datos[campo];
  if (valor === undefined && opcional) {
    return '';
  }
  if (typeof valor !== 'string' || !valor.trim()) {
    throw new ErrorDePeticion(`El campo "${campo}" debe ser texto no vacío.`);
  }
  return valor;
}

export function entero(
  datos: Record<string, unknown>,
  campo: string,
  { minimo = Number.MIN_SAFE_INTEGER }: { minimo?: number } = {},
): number {
  const valor = datos[campo];
  const numero = typeof valor === 'string' ? Number(valor) : valor;
  if (typeof numero !== 'number' || !Number.isFinite(numero) || !Number.isInteger(numero)) {
    throw new ErrorDePeticion(`El campo "${campo}" debe ser un número entero.`);
  }
  if (numero < minimo) {
    throw new ErrorDePeticion(`El campo "${campo}" no puede ser menor que ${minimo}.`);
  }
  return numero;
}

export function numero(
  datos: Record<string, unknown>,
  campo: string,
  { minimo = Number.MIN_SAFE_INTEGER }: { minimo?: number } = {},
): number {
  const valor = datos[campo];
  const numero = typeof valor === 'string' ? Number(valor) : valor;
  if (typeof numero !== 'number' || !Number.isFinite(numero)) {
    throw new ErrorDePeticion(`El campo "${campo}" debe ser numérico.`);
  }
  if (numero < minimo) {
    throw new ErrorDePeticion(`El campo "${campo}" no puede ser menor que ${minimo}.`);
  }
  return numero;
}

export function bandera(datos: Record<string, unknown>, campo: string): boolean {
  const valor = datos[campo];
  if (typeof valor !== 'boolean') {
    throw new ErrorDePeticion(`El campo "${campo}" debe ser verdadero o falso.`);
  }
  return valor;
}

export function opcion<T extends string>(
  datos: Record<string, unknown>,
  campo: string,
  permitidos: ReadonlyArray<T>,
): T {
  const valor = datos[campo];
  if (typeof valor !== 'string' || !permitidos.includes(valor as T)) {
    throw new ErrorDePeticion(
      `El campo "${campo}" debe ser uno de: ${permitidos.join(', ')}.`,
    );
  }
  return valor as T;
}

/** Email: delega la validación en el value object para no duplicar la regla. */
export function correo(datos: Record<string, unknown>, campo: string): string {
  const valor = texto(datos, campo);
  try {
    return new Email(valor).valor;
  } catch {
    throw new ErrorDePeticion(`El campo "${campo}" no es un correo válido.`);
  }
}

export function borradorProducto(cuerpo: unknown): ProductDraft {
  const datos = cuerpoObjeto(cuerpo);
  return {
    nombre: texto(datos, 'nombre'),
    descripcion: texto(datos, 'descripcion'),
    categoria: texto(datos, 'categoria'),
    precio: numero(datos, 'precio', { minimo: 0 }),
    stock: entero(datos, 'stock', { minimo: 0 }),
    imagen: texto(datos, 'imagen'),
    tipo: opcion(datos, 'tipo', [TipoProducto.Fisico, TipoProducto.Digital]),
    coleccion: opcion(datos, 'coleccion', [
      ProductCollection.Iphone,
      ProductCollection.Ipad,
      ProductCollection.Drone,
      ProductCollection.Juguetes,
    ]),
    destacado: bandera(datos, 'destacado'),
    novedad: bandera(datos, 'novedad'),
    tendencia: bandera(datos, 'tendencia'),
  };
}
