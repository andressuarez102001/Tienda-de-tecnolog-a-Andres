'use client';

import { useCallback, useEffect, useState } from 'react';

export interface EstadoDatos<T> {
  readonly datos: T | undefined;
  readonly cargando: boolean;
  readonly error: string | undefined;
  readonly refrescar: () => void;
}

interface Resultado<T> {
  readonly clave: string;
  readonly datos: T | undefined;
  readonly error: string | undefined;
}

/**
 * Lee datos de un caso de uso y expone una función para refrescarlos.
 *
 * Sustituye al patrón `const [datos] = useState(() => servicio.cargar())`,
 * que congelaba los datos al montar el componente: como los casos de uso
 * ahora persisten a través del repositorio, la vista tiene que volver a
 * leer después de cada cambio o mostraría el valor anterior.
 *
 * A partir del backend los casos de uso son asíncronos, así que el hook
 * expone además `cargando` y `error`. Antes de la llamada los datos valen
 * `undefined`, que es lo que obliga a la vista a pintar un estado de carga en
 * lugar de asumir que un array siempre viene lleno.
 *
 * **Por qué no hay un `setCargando(true)` dentro del efecto.** El estado
 * "cargando" se *deriva* comparando la clave de la respuesta guardada con la
 * clave que se pidió. Cuando cambia una dependencia, las claves dejan de
 * coincidir y el hook ya sabe que está cargando, sin escribir estado durante
 * el efecto. Hacerlo al revés (`setCargando(true)` al principio del efecto)
 * provoca un render en cascada en cada recarga, que es justo lo que la regla
 * `react-hooks/set-state-in-effect` previene.
 *
 * La petición se descarta si el componente se desmonta antes de resolverse
 * (`ignorar`), porque escribir estado de un componente ya desmontado produce
 * un aviso en React 19 y una fuga de datos entre navegaciones.
 */
export function useDatos<T>(cargar: () => Promise<T>, dependencias: ReadonlyArray<unknown> = []): EstadoDatos<T> {
  const [version, setVersion] = useState(0);
  const [resultado, setResultado] = useState<Resultado<T>>({ clave: '', datos: undefined, error: undefined });

  // El identificador de la petición. Es un string, así que compararlo por
  // valor en la lista del efecto es correcto; no hace falta memorizarlo.
  const clave = `${dependencias.map((valor) => String(valor)).join('\u0000')}\u0001${version}`;

  useEffect(() => {
    let ignorar = false;

    cargar()
      .then((datos) => {
        if (!ignorar) {
          setResultado({ clave, datos, error: undefined });
        }
      })
      .catch((fallo: unknown) => {
        if (!ignorar) {
          setResultado({
            clave,
            datos: undefined,
            error: fallo instanceof Error ? fallo.message : 'No se pudieron cargar los datos.',
          });
        }
      });

    return () => {
      ignorar = true;
    };
    // `cargar` es una función nueva en cada render; depender de ella
    // dispararía el efecto en bucle. Lo que decide cuándo releer es la clave.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  const refrescar = useCallback(() => setVersion((actual) => actual + 1), []);

  const vigente = resultado.clave === clave;
  const datos = vigente ? resultado.datos : undefined;
  const error = vigente ? resultado.error : undefined;

  return { datos, error, refrescar, cargando: datos === undefined && error === undefined };
}