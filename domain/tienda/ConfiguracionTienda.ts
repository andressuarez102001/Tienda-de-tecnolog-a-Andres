import { Dinero } from '@/domain/shared/Dinero';
import { Email } from '@/domain/shared/Email';

export interface StoreSettingsData {
  readonly nombreTienda: string;
  readonly costoEnvio: Dinero;
  readonly emailContacto: Email;
}

/** Parámetros generales de la tienda. Entidad con invariantes propias. */
export class ConfiguracionTienda {
  private readonly shopName: string;
  private readonly shippingCost: Dinero;
  private readonly contactEmail: Email;

  constructor(datos: StoreSettingsData) {
    if (!datos.nombreTienda.trim()) {
      throw new Error('La tienda debe tener nombre comercial.');
    }
    this.shopName = datos.nombreTienda.trim();
    this.shippingCost = datos.costoEnvio;
    this.contactEmail = datos.emailContacto;
  }

  static crear(
    nombreTienda: string,
    costoEnvio: number,
    emailContacto: string,
  ): ConfiguracionTienda {
    return new ConfiguracionTienda({
      nombreTienda,
      costoEnvio: Dinero.de(costoEnvio),
      emailContacto: new Email(emailContacto),
    });
  }

  get nombreTienda(): string {
    return this.shopName;
  }
  get costoEnvio(): Dinero {
    return this.shippingCost;
  }
  get emailContacto(): Email {
    return this.contactEmail;
  }

  cambiarNombre(nombre: string): ConfiguracionTienda {
    return new ConfiguracionTienda({ ...this.aDatos(), nombreTienda: nombre });
  }

  cambiarCostoEnvio(costo: number): ConfiguracionTienda {
    return new ConfiguracionTienda({ ...this.aDatos(), costoEnvio: Dinero.de(costo) });
  }

  cambiarEmailContacto(email: string): ConfiguracionTienda {
    return new ConfiguracionTienda({
      ...this.aDatos(),
      emailContacto: new Email(email),
    });
  }

  esIgualA(otro: ConfiguracionTienda): boolean {
    return (
      otro instanceof ConfiguracionTienda &&
      this.shopName === otro.nombreTienda &&
      this.contactEmail.esIgualA(otro.emailContacto)
    );
  }

  aDatos(): StoreSettingsData {
    return Object.freeze({
      nombreTienda: this.shopName,
      costoEnvio: this.shippingCost,
      emailContacto: this.contactEmail,
    });
  }
}
