import { ProductoFabric, type ProductPersisted } from '@/domain/catalog/ProductoFabric';
import { Pedido, type PedidoPersistido } from '@/domain/orders/Pedido';
import { Usuario, type UsuarioPersistido } from '@/domain/users/Usuario';
import { Categoria } from '@/domain/tienda/Categoria';
import { ReportePeriodo } from '@/domain/tienda/ReportePeriodo';
import { ConfiguracionTienda } from '@/domain/tienda/ConfiguracionTienda';
import type { Product } from '@/domain/catalog/Producto';
import { Pedido as EntidadPedido } from '@/domain/orders/Pedido';
import { Usuario as EntidadUsuario } from '@/domain/users/Usuario';

/**
 * Reconstrucción de entidades a partir de las respuestas de la API.
 *
 * El servidor devuelve proyecciones planas (`precio: number`), no entidades:
 * `Dinero`, `Email` y `ProductId` son clases, y un `JSON.parse` a secas
 * devolvería objetos sin métodos. Por eso cada agregado tiene su forma
 * persistida y usa el `restaurar`/`crear` de su entidad, que es quien sabe
 * revalidar los invariantes. Ningún adapter debe inventar un objeto plano y
 * colarlo en el dominio.
 */

type Json = Record<string, unknown>;

function texto(datos: Json, campo: string): string {
  const valor = datos[campo];
  return typeof valor === 'string' ? valor : '';
}

function numero(datos: Json, campo: string): number {
  const valor = datos[campo];
  return typeof valor === 'number' ? valor : 0;
}

function booleano(datos: Json, campo: string): boolean {
  return datos[campo] === true;
}

/** El servidor añade campos derivados (`costoEnvio`, `nivelStock`); se ignoran. */
function productoPersistidoDesdeJson(datos: unknown): ProductPersisted {
  const crudo = (datos ?? {}) as Json;
  return {
    id: String(crudo.id ?? ''),
    nombre: texto(crudo, 'nombre'),
    descripcion: texto(crudo, 'descripcion'),
    categoria: texto(crudo, 'categoria'),
    precio: numero(crudo, 'precio'),
    stock: numero(crudo, 'stock'),
    imagen: texto(crudo, 'imagen'),
    tipo: texto(crudo, 'tipo') as ProductPersisted['tipo'],
    coleccion: texto(crudo, 'coleccion') as ProductPersisted['coleccion'],
    destacado: booleano(crudo, 'destacado'),
    novedad: booleano(crudo, 'novedad'),
    tendencia: booleano(crudo, 'tendencia'),
    ...(typeof crudo.pesoGramos === 'number' ? { pesoGramos: crudo.pesoGramos } : {}),
  };
}

export function productoDesdeJson(datos: unknown): Product {
  return ProductoFabric.desdeDatos(productoPersistidoDesdeJson(datos));
}

export function pedidoDesdeJson(datos: unknown): EntidadPedido {
  const crudo = datos as Json;
  const persistido: PedidoPersistido = {
    id: numero(crudo, 'id'),
    cliente: texto(crudo, 'cliente'),
    fecha: texto(crudo, 'fecha'),
    producto: productoPersistidoDesdeJson(crudo.producto),
    cantidad: numero(crudo, 'cantidad'),
    metodoPago: texto(crudo, 'metodoPago') as PedidoPersistido['metodoPago'],
    estado: texto(crudo, 'estado') as PedidoPersistido['estado'],
  };
  return Pedido.restaurar(persistido);
}

export function usuarioDesdeJson(datos: unknown): EntidadUsuario {
  const crudo = datos as Json;
  const persistido: UsuarioPersistido = {
    id: numero(crudo, 'id'),
    nombre: texto(crudo, 'nombre'),
    email: texto(crudo, 'email'),
    rol: texto(crudo, 'rol') as UsuarioPersistido['rol'],
    estado: texto(crudo, 'estado') as UsuarioPersistido['estado'],
  };
  return Usuario.restaurar(persistido);
}

export function categoriaDesdeJson(datos: unknown): Categoria {
  const crudo = datos as Json;
  return new Categoria({ id: numero(crudo, 'id'), nombre: texto(crudo, 'nombre') });
}

export function reporteDesdeJson(datos: unknown): ReportePeriodo {
  const crudo = datos as Json;
  return ReportePeriodo.crear(
    texto(crudo, 'periodo'),
    texto(crudo, 'rangoFechas'),
    numero(crudo, 'totalPedidos'),
    numero(crudo, 'ventas'),
    crudo.cerrado !== false,
  );
}

export function configuracionDesdeJson(datos: unknown): ConfiguracionTienda {
  const crudo = datos as Json;
  return ConfiguracionTienda.crear(
    texto(crudo, 'nombreTienda'),
    numero(crudo, 'costoEnvio'),
    texto(crudo, 'emailContacto'),
  );
}
