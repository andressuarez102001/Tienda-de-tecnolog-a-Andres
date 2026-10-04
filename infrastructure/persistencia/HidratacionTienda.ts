import { ProductoFabric } from '@/domain/catalog/ProductoFabric';
import type { Product } from '@/domain/catalog/Producto';
import { Pedido, type PedidoPersistido } from '@/domain/orders/Pedido';
import { Usuario, type UsuarioPersistido } from '@/domain/users/Usuario';
import { Categoria } from '@/domain/tienda/Categoria';
import { ConfiguracionTienda } from '@/domain/tienda/ConfiguracionTienda';
import { ReportePeriodo } from '@/domain/tienda/ReportePeriodo';
import { Dinero } from '@/domain/shared/Dinero';
import { Email } from '@/domain/shared/Email';
import { UserRole } from '@/domain/shared/enums';
import type { CredencialPersistida } from '@/domain/auth/contracts';
import type {
  ConfiguracionPersistida,
  InstantaneaTienda,
  ReportePeriodoPersistido,
} from './InstantaneaTienda';

/** Colecciones de entidades, ya rehidratadas desde el archivo. */
export interface TiendaHidrata {
  productos: Product[];
  pedidos: Pedido[];
  usuarios: Usuario[];
  categorias: Categoria[];
  reportes: ReportePeriodo[];
  configuracion: ConfiguracionTienda;
  credenciales: CredencialPersistida[];
}

/** Genera la instantánea inicial (semilla) la primera vez que no hay archivo. */
export type GeneradorSemilla = () => Promise<InstantaneaTienda>;

export const VERSION_ACTUAL = 1;

/**
 * Convierte la instantánea de disco en entidades con invariantes.
 *
 * Vive en la frontera del almacén y no en cada repositorio: un solo punto de
 * rehidratación evita seis copias ligeramente distintas de la misma lógica.
 */
export function hidratar(datos: InstantaneaTienda): TiendaHidrata {
  return {
    productos: datos.productos.map((p) => ProductoFabric.desdeDatos(p)),
    pedidos: (datos.pedidos ?? []).map((p: PedidoPersistido) => Pedido.restaurar(p)),
    usuarios: (datos.usuarios ?? []).map((u: UsuarioPersistido) => Usuario.restaurar(u)),
    categorias: (datos.categorias ?? []).map((c) => Categoria.crear(c.id, c.nombre)),
    reportes: (datos.reportes ?? []).map((r: ReportePeriodoPersistido) =>
      ReportePeriodo.crear(r.periodo, r.rangoFechas, r.totalPedidos, r.ventas, r.cerrado),
    ),
    configuracion: new ConfiguracionTienda({
      nombreTienda: datos.configuracion.nombreTienda,
      costoEnvio: Dinero.de(datos.configuracion.costoEnvio),
      emailContacto: new Email(datos.configuracion.emailContacto),
    }),
    credenciales: (datos.credenciales ?? []).map((c) => ({
      ...c,
      rol: c.rol ?? UserRole.Cliente,
    })),
  };
}

/** Proyecta las entidades a la instantánea serializable. */
export function deshidratar(estado: TiendaHidrata): InstantaneaTienda {
  return {
    version: VERSION_ACTUAL,
    productos: estado.productos.map((p) => ProductoFabric.aPersisted(p)),
    pedidos: estado.pedidos.map((p) => p.aPersistido()),
    usuarios: estado.usuarios.map((u) => u.aPersistido()),
    credenciales: estado.credenciales,
    categorias: estado.categorias.map((c) => c.aDatos()),
    reportes: estado.reportes.map((r) => ({
      periodo: r.periodo,
      rangoFechas: r.rangoFechas,
      totalPedidos: r.totalPedidos,
      ventas: r.ventas.valor,
      cerrado: r.cerrado,
    })),
    configuracion: {
      nombreTienda: estado.configuracion.nombreTienda,
      costoEnvio: estado.configuracion.costoEnvio.valor,
      emailContacto: estado.configuracion.emailContacto.valor,
    } satisfies ConfiguracionPersistida,
  };
}