import type { ProductPersisted } from '@/domain/catalog/ProductoFabric';
import type { PedidoPersistido } from '@/domain/orders/Pedido';
import type { UsuarioPersistido } from '@/domain/users/Usuario';
import type { CategoryData } from '@/domain/tienda/Categoria';
import type { PeriodReportData } from '@/domain/tienda/ReportePeriodo';
import type { CredencialPersistida } from '@/domain/auth/contracts';

/**
 * Instantánea completa de la tienda en disco.
 *
 * Este es el **único** formato que cruza la frontera de la aplicación: JSON
 * plano y revisable. Al leerlo, cada agregado vuelve a convertirse en
 * entidades con sus invariantes (`Pedido.restaurar`, `Usuario.restaurar`,
 * `ProductoFabric.desdeDatos`), de modo que un archivo editado a mano con un
 * precio negativo falla al cargar en vez de propagar el dato inválido.
 */
export interface InstantaneaTienda {
  readonly version: number;
  readonly productos: ProductPersisted[];
  readonly pedidos: PedidoPersistido[];
  readonly usuarios: UsuarioPersistido[];
  readonly credenciales: CredencialPersistida[];
  readonly categorias: CategoryData[];
  readonly reportes: ReportePeriodoPersistido[];
  readonly configuracion: ConfiguracionPersistida;
}

/** `PeriodReportData` trae `ventas: Dinero`; en disco es un número. */
export interface ReportePeriodoPersistido extends Omit<PeriodReportData, 'ventas'> {
  readonly ventas: number;
}

export interface ConfiguracionPersistida {
  readonly nombreTienda: string;
  readonly costoEnvio: number;
  readonly emailContacto: string;
}
