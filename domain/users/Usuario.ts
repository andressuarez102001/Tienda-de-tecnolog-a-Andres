import { Email } from '@/domain/shared/Email';
import { UserRole, UserStatus } from '@/domain/shared/enums';

/** Forma serializable de `Usuario` (JSON, localStorage, base de datos). */
export interface UsuarioPersistido {
  readonly id: number;
  readonly nombre: string;
  readonly email: string;
  readonly rol: UserRole;
  readonly estado: UserStatus;
}

export interface UserData {
  readonly id: number;
  readonly nombre: string;
  readonly email: Email;
  readonly rol: UserRole;
  readonly estado: UserStatus;
}

/**
 * Entidad Usuario.
 *
 * El correo es un `Email` (value object), no un `string`: antes la
 * validación era `email.includes('@')`, que acepta `"@"`.
 *
 * Inmutable: cambiar rol o estado devuelve una instancia nueva.
 */
export class Usuario {
  private readonly userId: number;
  private readonly userName: string;
  private readonly userEmail: Email;
  private readonly userRole: UserRole;
  private readonly userStatus: UserStatus;

  constructor(datos: UserData) {
    if (!Number.isInteger(datos.id) || datos.id < 1) {
      throw new Error('El identificador del usuario no es válido.');
    }
    if (!datos.nombre.trim()) {
      throw new Error('El usuario debe tener nombre.');
    }
    this.userId = datos.id;
    this.userName = datos.nombre.trim();
    this.userEmail = datos.email;
    this.userRole = datos.rol;
    this.userStatus = datos.estado;
  }

  static crear(
    id: number,
    nombre: string,
    email: string,
    rol: UserRole = UserRole.Cliente,
    estado: UserStatus = UserStatus.Activo,
  ): Usuario {
    return new Usuario({ id, nombre, email: new Email(email), rol, estado });
  }

  /**
   * Rehidratación: reconstruye la entidad desde datos que venue del
   * almacenamiento. Existe porque la sesión se guarda como JSON en el
   * navegador, y un `string` suelto no vuelve a ser un `Email` válido por
   * sí solo.
   */
  static restaurar(datos: UsuarioPersistido): Usuario {
    return new Usuario({
      id: datos.id,
      nombre: datos.nombre,
      email: new Email(datos.email),
      rol: datos.rol,
      estado: datos.estado,
    });
  }

  /** Proyección plana y serializable de la entidad. */
  aPersistido(): UsuarioPersistido {
    return Object.freeze({
      id: this.userId,
      nombre: this.userName,
      email: this.userEmail.valor,
      rol: this.userRole,
      estado: this.userStatus,
    });
  }

  get id(): number {
    return this.userId;
  }
  get nombre(): string {
    return this.userName;
  }
  get email(): Email {
    return this.userEmail;
  }
  get rol(): UserRole {
    return this.userRole;
  }
  get estado(): UserStatus {
    return this.userStatus;
  }

  get estaActivo(): boolean {
    return this.userStatus === UserStatus.Activo;
  }

  puedeAdministrar(): boolean {
    return this.userRole === UserRole.Admin && this.estaActivo;
  }

  cambiarRol(rol: UserRole): Usuario {
    return new Usuario({ ...this.aDatos(), rol });
  }

  cambiarEstado(estado: UserStatus): Usuario {
    return new Usuario({ ...this.aDatos(), estado });
  }

  alternarEstado(): Usuario {
    return this.cambiarEstado(
      this.estaActivo ? UserStatus.Bloqueado : UserStatus.Activo,
    );
  }

  esIgualA(otro: Usuario): boolean {
    return otro instanceof Usuario && this.userId === otro.id;
  }

  aDatos(): UserData {
    return Object.freeze({
      id: this.userId,
      nombre: this.userName,
      email: this.userEmail,
      rol: this.userRole,
      estado: this.userStatus,
    });
  }
}
