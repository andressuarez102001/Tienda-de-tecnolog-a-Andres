import type { AuthenticationGateway, AuthSession } from '@/domain/auth/contracts';
import type { Usuario } from '@/domain/users/Usuario';
import { clienteApi, ErrorDeApi } from './ClienteApi';
import { usuarioDesdeJson } from './Deserializadores';

const EVENTO = 'shenzhenstock:sesion-cambio';

/**
 * Autenticación del navegador contra la API.
 *
 * No hay contraseña ni token en el cliente: se envían al servidor y la
 * respuesta es la cookie `httpOnly`. Este adaptador solo necesita saber si el
 * intento funcionó y quién es el usuario, que es justo lo que devuelve
 * `POST /api/auth/login`.
 *
 * El 401 es un resultado válido del contrato ("credenciales incorrectas"), no
 * un fallo, así que se traduce a `undefined` en vez de propagar el error.
 */
export class HttpAuthenticationGateway implements AuthenticationGateway {
  async autenticar(email: string, password: string): Promise<Usuario | undefined> {
    try {
      const cuerpo = await clienteApi.crear<{ usuario: unknown }>('/api/auth/login', {
        email,
        password,
      });
      return usuarioDesdeJson(cuerpo.usuario);
    } catch (fallo) {
      if (fallo instanceof ErrorDeApi && (fallo.estado === 401 || fallo.estado === 400)) {
        return undefined;
      }
      throw fallo;
    }
  }
}

/**
 * Sesión del navegador, respaldada por la cookie del servidor.
 *
 * Antes vivía en `localStorage`, lo que tenía dos consecuencias malas: la
 * sesión sobrevivía a cerrar el servidor (hasta que expiraba el token) y el
 * `AuthSession` tenía que guardar el rol en el cliente, donde cualquiera
 * podía editarlo. Ahora la cookie es la única fuente de verdad y este objeto
 * solo conserva la *entidad* `Usuario` en memoria para que los componentes
 * puedan leerla de forma síncrona.
 *
 * La consecuencia de que la fuente sea asíncrona es que `usuarioActual()` no
 * puede mentir: devuelve `undefined` hasta que `hidratar()` responde. Por eso
 * el guard de `/admin` tiene que esperar, en vez de decidir al primer render.
 */
export class SesionHttp implements AuthSession {
  private snapshot: Usuario | undefined;
  private hidratacionPendiente: Promise<Usuario | undefined> | undefined;

  readonly subscribe = (listener: () => void): (() => void) => {
    if (typeof window === 'undefined') {
      return () => undefined;
    }
    window.addEventListener(EVENTO, notificar);
    return () => {
      window.removeEventListener(EVENTO, notificar);
    };

    function notificar(): void {
      listener();
    }
  };

  readonly getSnapshot = (): Usuario | undefined => this.snapshot;

  usuarioActual(): Usuario | undefined {
    return this.snapshot;
  }

  estaAutenticado(): boolean {
    return this.snapshot !== undefined;
  }

  esAdministrador(): boolean {
    return this.snapshot?.puedeAdministrar() ?? false;
  }

  /**
   * Consulta al servidor quién es el usuario de la petición actual. Un 401
   * significa "no hay sesión", que es un estado normal, no un error.
   *
   * Las llamadas concurrentes comparten la misma petición: el guard de
   * `/admin` y el proveedor de servicios se lanzan el mismo render y, sin
   * esto, harían dos viajes al servidor con respuestas idénticas.
   */
  async hidratar(): Promise<Usuario | undefined> {
    if (this.hidratacionPendiente) {
      return this.hidratacionPendiente;
    }
    const peticion = this.consultarSesion().finally(() => {
      this.hidratacionPendiente = undefined;
    });
    this.hidratacionPendiente = peticion;
    return peticion;
  }

  private async consultarSesion(): Promise<Usuario | undefined> {
    try {
      const cuerpo = await clienteApi.obtener<{ usuario: unknown }>('/api/auth/sesion');
      this.establecer(usuarioDesdeJson(cuerpo.usuario));
      return this.snapshot;
    } catch (fallo) {
      if (fallo instanceof ErrorDeApi && fallo.estado === 401) {
        this.establecer(undefined);
        return undefined;
      }
      this.establecer(undefined);
      throw fallo;
    }
  }

  /**
   * Cierra sesión en el servidor y descarta la entidad local. El await es
   * obligatorio: si se limpiara antes de que el servidor borre la cookie, un
   * refresco de la página volvería a mostrar el panel.
   */
  async cerrar(): Promise<void> {
    await clienteApi.borrar('/api/auth/logout');
    this.establecer(undefined);
  }

  iniciar(usuario: Usuario): void {
    this.establecer(usuario);
  }

  cerrarSesion(): void {
    this.establecer(undefined);
  }

  private establecer(usuario: Usuario | undefined): void {
    const anterior = this.snapshot;
    if ((anterior === undefined && usuario === undefined) ||
        (anterior && usuario && anterior.esIgualA(usuario))) {
      return;
    }
    this.snapshot = usuario;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(EVENTO));
    }
  }
}
