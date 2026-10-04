import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
  ContenidoToken,
  EmisorDeToken,
  TokenEmitido,
} from '@/domain/auth/contracts';
import { UserRole } from '@/domain/shared/enums';

/**
 * Emisor de tokens JWT con firma HMAC-SHA256.
 *
 * Implementado con `node:crypto` y no con una librería de terceros para dejar
 * explícitos los tres puntos que importan: qué se firma (solo el payload),
 * con qué secreto (HMAC) y cómo se compara la firma (`timingSafeEqual`,
 * que no filtra información por tiempo).
 *
 * Formato: `base64url(header).base64url(payload).base64url(firma)`.
 */
export interface JwtOptions {
  readonly secreto: string;
  readonly expiraEnMilisegundos: number;
  readonly ahora?: () => number;
}

interface CabeceraJwt {
  readonly alg: 'HS256';
  readonly typ: 'JWT';
}

interface PayloadJwt {
  readonly sub: number;
  readonly email: string;
  readonly rol: UserRole;
  readonly iat: number;
  readonly exp: number;
}

export class JwtTokenIssuer implements EmisorDeToken {
  private readonly secreto: string;
  private readonly expiraEnMilisegundos: number;
  private readonly ahora: () => number;

  constructor(opciones: JwtOptions) {
    if (!opciones.secreto || opciones.secreto.length < 16) {
      throw new Error(
        'JWT_SECRET debe tener al menos 16 caracteres. Configúralo en .env (ver .env.example).',
      );
    }
    this.secreto = opciones.secreto;
    this.expiraEnMilisegundos = opciones.expiraEnMilisegundos;
    this.ahora = opciones.ahora ?? (() => Date.now());
  }

  async emitir(contenido: ContenidoToken): Promise<TokenEmitido> {
    const issuedAt = Math.floor(this.ahora() / 1000);
    const cabecera: CabeceraJwt = { alg: 'HS256', typ: 'JWT' };
    const payload: PayloadJwt = {
      sub: contenido.usuarioId,
      email: contenido.email,
      rol: contenido.rol,
      iat: issuedAt,
      exp: issuedAt + Math.floor(this.expiraEnMilisegundos / 1000),
    };

    const cuerpo = `${this.base64url(cabecera)}.${this.base64url(payload)}`;
    return {
      valor: `${cuerpo}.${this.firma(cuerpo)}`,
      expiraEnMilisegundos: this.expiraEnMilisegundos,
    };
  }

  /**
   * Verifica firma y expiración. Devuelve `undefined` en cualquier fallo: un
   * token manipulado, de otra versión del secreto o caducado es
   * indistinguible para quien lo presenta, y todas esas rutas se tratan igual.
   */
  async verificar(token: string): Promise<ContenidoToken | undefined> {
    const partes = token.split('.');
    if (partes.length !== 3) {
      return undefined;
    }
    // El cuerpo firmado es `header.payload`: los dos primeros segmentos. La
    // firma es el tercero. Desestructurar `[cuerpo, firma]` compararía la
    // cabecera con la firma y rechazaría todos los tokens válidos.
    const [cabecera, payload, firma] = partes;
    const cuerpo = `${cabecera}.${payload}`;

    const esperada = Buffer.from(this.firma(cuerpo), 'base64url');
    const recibida = Buffer.from(firma, 'base64url');

    if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) {
      return undefined;
    }

    try {
      const contenido = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as PayloadJwt;
      if (typeof contenido.exp !== 'number' || contenido.exp * 1000 <= this.ahora()) {
        return undefined;
      }
      if (typeof contenido.sub !== 'number' || typeof contenido.email !== 'string') {
        return undefined;
      }
      return {
        usuarioId: contenido.sub,
        email: contenido.email,
        rol: contenido.rol,
      };
    } catch {
      return undefined;
    }
  }

  private firma(cuerpo: string): string {
    return createHmac('sha256', this.secreto).update(cuerpo).digest('base64url');
  }

  private base64url(valor: unknown): string {
    return Buffer.from(JSON.stringify(valor), 'utf8').toString('base64url');
  }
}
