import type { AuthenticationGateway, AuthSession } from '@/domain/auth/contracts';
import type { Usuario } from '@/domain/users/Usuario';

/**
 * Autenticación del navegador.
 *
 * Antes esta lógica vivía en `AuthenticationService`, junto con la emisión de
 * JWT del servidor. Mezclar ambos clientes obligaba al composition root del
 * navegador a construir bcrypt, un emisor de tokens y un repositorio de
 * usuarios que no usaba, y al del servidor a inventar un `AuthenticationGateway`
 * que no existe. Son dos casos de uso distintos, así que son dos clases.
 *
 * Aquí la sesión vive en la cookie del servidor: este caso de uso solo le
 * pregunta al gateway si las credenciales son válidas y el adaptador se
 * encarga de conservar la entidad `Usuario` en memoria para la vista.
 */
export class AutenticacionSesion {
  constructor(
    private readonly gateway: AuthenticationGateway,
    private readonly sesion: AuthSession,
  ) {}

  /**
   * Inicia sesión y devuelve `true` solo si el usuario existe y puede
   * administrar. El rol se valida en el dominio, no comparando cadenas aquí.
   */
  async iniciarSesion(email: string, password: string): Promise<boolean> {
    const usuario = await this.gateway.autenticar(email, password);
    if (!usuario || !usuario.puedeAdministrar()) {
      return false;
    }
    this.sesion.iniciar(usuario);
    return true;
  }

  /**
   * Cierra sesión. Es asíncrono porque el adaptador tiene que avisar al
   * servidor para que borre la cookie; hacer el borrado local y saltar la
   * petición dejaría la sesión viva en el siguiente refresco.
   */
  async cerrarSesion(): Promise<void> {
    await this.sesion.cerrar();
  }

  usuarioActual(): Usuario | undefined {
    return this.sesion.usuarioActual();
  }

  esAdministrador(): boolean {
    return this.sesion.usuarioActual()?.puedeAdministrar() ?? false;
  }
}
