const SEGUNDO = 1000;
const MINUTO = 60 * SEGUNDO;
const HORA = 60 * MINUTO;
const DIA = 24 * HORA;

/** Siete días, el valor por defecto de `JWT_EXPIRES_IN`. */
export const DURACION_POR_DEFECTO_MS = 7 * DIA;

const FACTORES = { s: SEGUNDO, m: MINUTO, h: HORA, d: DIA } as const;
const CON_SUFIJO = /^(\d+)\s*(s|m|h|d)$/;
const SOLO_NUMERO = /^\d+$/;

/**
 * Convierte `JWT_EXPIRES_IN` en milisegundos.
 *
 * Acepta un número desnudo (interpretado como segundos, para no tener que
 * escribir `3600s`) o un número con sufijo `s`, `m`, `h` o `d`.
 *
 * Ojo con el parser: `Number.parseInt('7d', 10)` devuelve `7`, no `NaN`.
 * Si se usara esa comprobación para decidir si la entrada "es un número",
 * `7d` caería en la rama de segundos y el token viviría 7 milisegundos: la
 * cookie expiraba al instante y el proxy rechazaba al usuario como si
 * hubiera manipulado el token. Por eso solo se acepta como número cuando
 * la cadena entera es numérica.
 *
 * Cualquier valor no reconocido cae en `DURACION_POR_DEFECTO_MS` en lugar de
 * romper el arranque del servidor.
 */
export function leerDuracionDeToken(crudo: string | undefined): number {
  const valor = (crudo ?? '7d').trim();

  if (SOLO_NUMERO.test(valor)) {
    return Number(valor) * SEGUNDO;
  }

  const coincidencia = CON_SUFIJO.exec(valor);
  if (!coincidencia) {
    return DURACION_POR_DEFECTO_MS;
  }

  const unidad = coincidencia[2] as keyof typeof FACTORES;
  return Number(coincidencia[1]) * FACTORES[unidad];
}
