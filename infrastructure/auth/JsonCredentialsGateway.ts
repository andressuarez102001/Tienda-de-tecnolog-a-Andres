import type { CredencialAlmacenada, CredencialesGateway } from '@/domain/auth/contracts';
import { Email } from '@/domain/shared/Email';
import type { EstadoServidor } from '@/infrastructure/persistencia/EstadoServidor';

/**
 * Credenciales respaldadas por el archivo JSON.
 *
 * Solo guarda el **hash** bcrypt de la contraseña. La contraseña en claro no
 * existe en ningún punto del sistema después de la siembra: ni en el código,
 * ni en el JSON, ni en los logs.
 *
 * Las credenciales se siembran junto con la instantánea y no se editan desde
 * el panel, así que el puerto solo expone la búsqueda por correo.
 */
export class JsonCredentialsGateway implements CredencialesGateway {
  constructor(private readonly estado: EstadoServidor) {}

  async buscarPorEmail(email: string): Promise<CredencialAlmacenada | undefined> {
    const { credenciales } = await this.estado.estado();
    const correo = new Email(email).valor;
    return credenciales.find((c) => c.email === correo);
  }
}