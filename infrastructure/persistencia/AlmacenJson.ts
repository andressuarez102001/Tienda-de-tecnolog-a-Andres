import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Almacén JSON sobre el sistema de archivos.
 *
 * Es el adaptador de persistencia de la fase de backend. Sustituye a la
 * `TiendaEstado` en memoria, cuyas ediciones se perdían al recargar.
 *
 * Dos detalles que no son obvios:
 *
 *  1. **Escritura atómica**: se escribe primero en `<archivo>.tmp` y luego se
 *     renombra. Si el proceso muere a mitad de una escritura, el archivo
 *     anterior queda intacto en vez de quedar truncado.
 *  2. **Serialización encadenada**: dos peticiones concurrentes podrían
 *     intercalar sus escrituras sobre el mismo archivo. La promesa en
 *     curso se reutiliza, de modo que la segunda escritura espera a que
 *     termine la primera.
 */
export interface AlmacenJson<T> {
  leer(): Promise<T | undefined>;
  escribir(valor: T): Promise<void>;
  existe(): Promise<boolean>;
}

export class AlmacenJsonArchivo<T> implements AlmacenJson<T> {
  private readonly archivo: string;
  private escrituraEnCurso: Promise<void> = Promise.resolve();

  constructor(rutaArchivo: string) {
    this.archivo = rutaArchivo;
  }

  get rutaArchivo(): string {
    return this.archivo;
  }

  async existe(): Promise<boolean> {
    try {
      await fs.access(this.archivo);
      return true;
    } catch {
      return false;
    }
  }

  async leer(): Promise<T | undefined> {
    try {
      const crudo = await fs.readFile(this.archivo, 'utf8');
      return JSON.parse(crudo) as T;
    } catch (fallo) {
      if (esFaltaDeArchivo(fallo)) {
        return undefined;
      }
      throw new Error(
        `No se pudo leer "${this.archivo}". Si el archivo está corrupto, bórralo para regenerarlo desde la semilla.`,
      );
    }
  }

  async escribir(valor: T): Promise<void> {
    const pendiente = this.escrituraEnCurso.then(() => this.escribirAtomicamente(valor));
    // La promesa se encadena incluso si esta escritura falla, para no dejar
    // la cadena envenenada y bloquear todas las escrituras siguientes.
    this.escrituraEnCurso = pendiente.catch(() => undefined);
    return pendiente;
  }

  private async escribirAtomicamente(valor: T): Promise<void> {
    await fs.mkdir(path.dirname(this.archivo), { recursive: true });
    const temporal = `${this.archivo}.tmp`;
    await fs.writeFile(temporal, `${JSON.stringify(valor, null, 2)}\n`, 'utf8');
    await fs.rename(temporal, this.archivo);
  }
}

function esFaltaDeArchivo(fallo: unknown): boolean {
  return (fallo as NodeJS.ErrnoException | undefined)?.code === 'ENOENT';
}

/** Directorio de datos, configurable con `DATA_DIR`. */
export function directorioDeDatos(base: string = process.cwd()): string {
  return path.resolve(base, process.env.DATA_DIR ?? '.data');
}
