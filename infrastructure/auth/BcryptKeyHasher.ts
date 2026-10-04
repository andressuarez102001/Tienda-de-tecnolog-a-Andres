import bcrypt from 'bcryptjs';
import type { VerificadorDeClaves } from '@/domain/auth/contracts';

/**
 * Verificador de contraseñas con bcrypt.
 *
 * Sustituye a la comparación en texto plano del adaptador en memoria. El
 * dominio no conoce bcrypt: depende del puerto `VerificadorDeClaves`.
 *
 * `generar` es async porque bcrypt tiene coste intencionado; una función
 * síncrona con hashing en línea bloquearía el event loop del servidor.
 */
export class BcryptKeyHasher implements VerificadorDeClaves {
  static readonly rondas = 10;

  async verificar(clave: string, hash: string): Promise<boolean> {
    if (!hash || !clave) {
      return false;
    }
    try {
      return await bcrypt.compare(clave, hash);
    } catch {
      // Un hash corrupto (por ejemplo de una versión anterior del formato)
      // no debe convertirse en un error 500 ni en un "sesión iniciada".
      return false;
    }
  }

  async generar(clave: string): Promise<string> {
    return bcrypt.hash(clave, BcryptKeyHasher.rondas);
  }
}