import type { UserRole } from '@/domain/shared/enums';
import type { Usuario } from '@/domain/users/Usuario';

/**
 * Puertos de autenticación.
 *
 * El dominio no sabe si la credencial se compara contra un archivo, una base
 * de datos o una API: solo define el contrato (DIP). Por eso la
 * verificación de la contraseña y la emisión del token son puertos
 * separados, y no un `if` dentro del caso de uso.
 */
export interface AuthenticationGateway {
  autenticar(email: string, password: string): Promise<Usuario | undefined>;
}

/**
 * Ciclo de vida de la sesión.
 *
 * `iniciar` recibe la entidad `Usuario` completa, no un rol suelto, para
 * que la identidad (correo incluido) no se pierda al guardarla.
 *
 * `cerrar` es asíncrono porque cerrar sesión significa borrar la cookie del
 * servidor: si se limpiara el estado local antes de que el servidor acuse,
 * un refresco de la página traería la sesión de vuelta. La única razón por la
 * que antes podía ser síncrono es que la sesión vivía en `localStorage`.
 *
 * En el navegador la implementa `SesionHttp`; en el servidor no se usa, porque
 * allí la sesión vive en la cookie y se resuelve leyendo la petición.
 */
export interface AuthSession {
  iniciar(usuario: Usuario): void;
  cerrar(): Promise<void>;
  usuarioActual(): Usuario | undefined;
}

/**
 * Credencial almacenada: a qué usuario pertenece y cuál es su hash de
 * contraseña. El dominio nunca ve la contraseña en claro.
 */
export interface CredencialAlmacenada {
  readonly usuarioId: number;
  readonly hashClave: string;
  readonly rol: UserRole;
}

/**
 * Fuente de credenciales. Nota la diferencia con `AuthenticationGateway`:
 * este puerto solo *busca*; comprobar la clave es trabajo de
 * `VerificadorDeClaves`, porque el algoritmo (bcrypt) es infraestructura.
 *
 * No expone `guardar`/`listar`: las cuentas se siembran junto con la
 * instantánea (o la fila en la base de datos) y la autenticación solo
 * necesita leer el hash del correo. Quitar los métodos de escritura evita que
 * un adaptador tenga que inventar una semántica de "reemplazar credenciales".
 */
export interface CredencialesGateway {
  buscarPorEmail(email: string): Promise<CredencialAlmacenada | undefined>;
}

export interface CredencialPersistida extends CredencialAlmacenada {
  readonly email: string;
}

/**
 * Verificación de contraseñas. Implementaciones: bcrypt en el servidor.
 */
export interface VerificadorDeClaves {
  verificar(clave: string, hash: string): Promise<boolean>;
  generar(clave: string): Promise<string>;
}

/** Datos que viajan dentro del token. */
export interface ContenidoToken {
  readonly usuarioId: number;
  readonly email: string;
  readonly rol: UserRole;
}

/** Token firmado que representa una sesión autenticada. */
export interface TokenEmitido {
  readonly valor: string;
  readonly expiraEnMilisegundos: number;
}

/** Emisor y verificador de tokens. En el servidor es JWT HMAC-SHA256. */
export interface EmisorDeToken {
  emitir(contenido: ContenidoToken): Promise<TokenEmitido>;
  verificar(token: string): Promise<ContenidoToken | undefined>;
}

/** Resultado de un intento de autenticación, ya listo para la respuesta HTTP. */
export type ResultadoAutenticacion =
  | { readonly ok: true; readonly token: string; readonly usuario: Usuario }
  | { readonly ok: false; readonly motivo: MotivoRechazo };

export type MotivoRechazo = 'credenciales' | 'sin-permisos' | 'inactivo';