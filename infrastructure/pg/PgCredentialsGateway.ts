import type { CredencialAlmacenada, CredencialesGateway } from '@/domain/auth/contracts';
import { Email } from '@/domain/shared/Email';
import type { BasePg } from './BasePg';
import { credencialDesdeFila } from './Filas';

/**
 * Credenciales en PostgreSQL.
 *
 * Solo guarda el **hash** bcrypt de la contraseña. La contraseña en claro no
 * existe en ningún punto del sistema después de la siembra: ni en el código,
 * ni en la base, ni en los logs.
 */
export class PgCredentialsGateway implements CredencialesGateway {
  constructor(private readonly base: BasePg) {}

  async buscarPorEmail(email: string): Promise<CredencialAlmacenada | undefined> {
    const filas = await this.base.consulta(
      `SELECT usuario_id AS "usuarioId", email, hash_clave AS "hashClave", rol
       FROM credenciales WHERE email = $1`,
      [new Email(email).valor],
    );
    return filas.length > 0 ? credencialDesdeFila(filas[0]) : undefined;
  }
}