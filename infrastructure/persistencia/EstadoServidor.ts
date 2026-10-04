import { promises as fs } from 'node:fs';
import path from 'node:path';
import { AlmacenJsonArchivo, directorioDeDatos } from './AlmacenJson';
import { deshidratar, hidratar, VERSION_ACTUAL, type GeneradorSemilla, type TiendaHidrata } from './HidratacionTienda';
import type { InstantaneaTienda } from './InstantaneaTienda';

/**
 * Estado de la tienda en el servidor, con respaldo en un archivo JSON.
 *
 * Reemplaza a la `TiendaEstado` en memoria, que perdía las ediciones del panel
 * al recargar la página.
 *
 * Hay dos decisiones que no son obvias:
 *
 *  1. **Carga perezosa con promesa compartida.** Varias peticiones pueden
 *     llegar antes de que el archivo esté leído. Se comparte una única
 *     promesa de carga, así que el archivo se lee una vez y no se rehidrata
 *     N veces en paralelo (lo que además crearía listas distintas).
 *
 *  2. **Cola de escrituras.** Los repositorios leen, modifican y guardan la
 *     colección completa. Sin serializar, dos peticiones concurrentes
 *     partirían de la misma versión del archivo y la segunda escritura
 *     pisaría a la primera (lost update). `transact` encadena las
 *     operaciones para que eso no ocurra.
 */
export class EstadoServidor {
  private readonly almacen: AlmacenJsonArchivo<InstantaneaTienda>;
  private readonly crearSemilla: GeneradorSemilla;
  private cacheada: TiendaHidrata | undefined;
  private cargaEnCurso: Promise<TiendaHidrata> | undefined;
  private cola: Promise<unknown> = Promise.resolve();

  constructor(crearSemilla: GeneradorSemilla, rutaArchivo?: string) {
    this.crearSemilla = crearSemilla;
    this.almacen = new AlmacenJsonArchivo<InstantaneaTienda>(
      rutaArchivo ?? path.join(directorioDeDatos(), 'tienda.json'),
    );
  }

  /** Estado hydrated, leído del disco (o sembrado) una sola vez. */
  async estado(): Promise<TiendaHidrata> {
    if (this.cacheada) {
      return this.cacheada;
    }
    this.cargaEnCurso ??= this.cargarOcrearSemilla();
    this.cacheada = await this.cargaEnCurso;
    return this.cacheada;
  }

  /**
   * Ejecuta una operación de lectura-modificación-escritura de forma
   * exclusiva y persiste el resultado.
   *
   * `mutar` devuelve el valor a persistir o `undefined` si la operación fue
   * solo de lectura y no hace falta escribir el archivo.
   */
  async transact<T>(
    mutar: (estado: TiendaHidrata) => Promise<{ valor: T; persistir: boolean }> | { valor: T; persistir: boolean },
  ): Promise<T> {
    const siguiente = this.cola.then(async () => {
      const estado = await this.estado();
      const { valor, persistir } = await mutar(estado);
      if (persistir) {
        this.cacheada = estado;
        await this.almacen.escribir(deshidratar(estado));
      }
      return valor;
    });
    this.cola = siguiente.catch(() => undefined);
    return siguiente;
  }

  /** Ruta del archivo, para mensajes de diagnóstico. */
  get ruta(): string {
    return this.almacen.rutaArchivo;
  }

  /** Vacía la caché y la cola; lo usan las pruebas. */
  async olvidar(): Promise<void> {
    this.cacheada = undefined;
    this.cargaEnCurso = undefined;
    this.cola = Promise.resolve();
  }

  private async cargarOcrearSemilla(): Promise<TiendaHidrata> {
    const enDisco = await this.almacen.leer();
    if (enDisco) {
      if (typeof enDisco.version !== 'number') {
        throw new Error(
          `El archivo de datos no tiene "version". Bórralo (${this.ruta}) para regenerarlo.`,
        );
      }
      if (enDisco.version > VERSION_ACTUAL) {
        throw new Error(
          `El archivo de datos es de una versión más nueva (${enDisco.version}). Actualiza la aplicación.`,
        );
      }
      return hidratar(enDisco);
    }

    const semilla = await this.crearSemilla();
    await fs.mkdir(path.dirname(this.ruta), { recursive: true });
    await this.almacen.escribir(semilla);
    return hidratar(semilla);
  }
}
