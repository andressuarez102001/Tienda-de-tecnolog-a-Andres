import type {
  ContenidoToken,
  CredencialesGateway,
  EmisorDeToken,
  MotivoRechazo,
  ResultadoAutenticacion,
  VerificadorDeClaves,
} from '@/domain/auth/contracts';
import type { UserRepository } from '@/domain/users/contracts';
import type { Usuario } from '@/domain/users/Usuario';
import { Email } from '@/domain/shared/Email';

/**
 * Autenticación del servidor.
 *
 * Depende de puertos del dominio (DIP): no sabe que el hash es bcrypt, que el
 * token es un JWT ni que la sesión se guarda en una cookie httpOnly. Eso lo
 * resuelven `BcryptKeyHasher`, `JwtTokenIssuer` y `CookieSesion` en
 * infraestructura.
 *
 * El resultado es un `ResultadoAutenticacion` discriminado, no un `boolean`:
 * la interfaz necesita distinguir "clave incorrecta" de "sin permisos" para
 * mostrar el mensaje correcto, y un `false` obligaba a inventar el motivo.
 *
 * No mantiene sesión en memoria: la cookie httpOnly es el estado, y cada
 * petición revalida el token contra el repositorio de usuarios. Así un usuario
 * desactivado pierde el acceso de inmediato, sin esperar a que expire el token.
 */
export class AutenticacionToken {
  constructor(
    private readonly credenciales: CredencialesGateway,
    private readonly claves: VerificadorDeClaves,
    private readonly tokens: EmisorDeToken,
    private readonly usuarios: UserRepository,
  ) {}

  /**
   * Verifica el hash con bcrypt, comprueba que la cuenta esté activa y con
   * permisos de administración, y solo entonces firma el token.
   */
  async autenticar(email: string, password: string): Promise<ResultadoAutenticacion> {
    const correo = new Email(email);
    const credencial = await this.credenciales.buscarPorEmail(correo.valor);
    if (!credencial) {
      return this.rechazar('credenciales');
    }
    if (!(await this.claves.verificar(password, credencial.hashClave))) {
      return this.rechazar('credenciales');
    }

    const usuario = await this.usuarios.obtenerPorId(credencial.usuarioId);
    if (!usuario) {
      return this.rechazar('credenciales');
    }
    if (!usuario.estaActivo) {
      return this.rechazar('inactivo');
    }
    if (!usuario.puedeAdministrar()) {
      return this.rechazar('sin-permisos');
    }

    const emitido = await this.tokens.emitir(this.contenidoDe(usuario));
    return { ok: true, token: emitido.valor, usuario };
  }

  /** Lee la identidad a partir del token de la cookie. */
  async usuarioDesdeToken(token: string): Promise<Usuario | undefined> {
    const contenido = await this.tokens.verificar(token);
    return contenido ? this.usuarios.obtenerPorId(contenido.usuarioId) : undefined;
  }

  /** Exige un administrador válido; devuelve `undefined` si el token no sirve. */
  async exigirAdministrador(token: string | undefined): Promise<Usuario | undefined> {
    if (!token) {
      return undefined;
    }
    const usuario = await this.usuarioDesdeToken(token);
    return usuario?.puedeAdministrar() ? usuario : undefined;
  }

  private contenidoDe(usuario: Usuario): ContenidoToken {
    return {
      usuarioId: usuario.id,
      email: usuario.email.valor,
      rol: usuario.rol,
    };
  }

  private rechazar(motivo: MotivoRechazo): ResultadoAutenticacion {
    return { ok: false, motivo };
  }
}
