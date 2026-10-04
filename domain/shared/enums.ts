/**
 * Enumeraciones del dominio.
 *
* Antes cada concepto era un `string` suelto o una unión de literales
 * (`'Admin' | 'Cliente'`, `estado: string`). Eso:
 *
 *   1. Noxia el autocompletado y el chequeo de tipos en la vista.
 *   2. Imposibilita llamar `Object.values(...)` para generar formularios.
 *   3. Obliga a usar casts `as` al leer valores del DOM (AdminPedidosView).
 *
 * Un `enum` de TypeScript es un objeto en tiempo de ejecución, por lo que
 * habilita los tres beneficios sin librerías externas.
 */

/** Ciclo de vida de un pedido. Ver `domain/orders/EstadoPedido.ts`. */
export enum OrderStatus {
  Pendiente = 'Pendiente',
  Enviado = 'Enviado',
  Entregado = 'Entregado',
  Cancelado = 'Cancelado',
}

/** Rol de una cuenta. Fuente única de verdad (antes duplicada con minúsculas). */
export enum UserRole {
  Admin = 'Admin',
  Cliente = 'Cliente',
}

/** Estado de habilitación de una cuenta. */
export enum UserStatus {
  Activo = 'Activo',
  Bloqueado = 'Bloqueado',
}

/** Medio de pago aceptado por la tienda. */
export enum PaymentMethod {
  PSE = 'PSE',
  Contraentrega = 'Efectivo/Contraentrega',
  Digital = 'Nequi/Bancolombia',
}

/**
 * Nivel de inventario. Modelarlo como enum (en vez de calcular
 * `stock === 0` y `stock <= 2` en la vista) permite que la interfaz
 * use un `Record<StockLevel, string>` y que el mapeo de estilos viva
 * en un solo lugar.
 */
export enum StockLevel {
  Agotado = 'Agotado',
  Bajo = 'Bajo',
  Disponible = 'Disponible',
}

/**
 * Colección o línea de negocio a la que pertenece un producto.
 * Determina en qué vitrina del catálogo se muestra.
 */
export enum ProductCollection {
  Iphone = 'iPhone',
  Ipad = 'iPad',
  Drone = 'Drone',
  Juguetes = 'Juguetes',
}

/** Listado editorial del catálogo. */
export enum CatalogListing {
  Destacados = 'Destacados',
  Novedades = 'Novedades',
}

/**
 * Tipo de producto. Determina qué subclase se instancia y, con ella, cómo
 * se cobra el envío. El panel lo declara explícitamente en vez de deducirlo
 * del peso, para que "digital" sea una decisión y no una conjetura.
 */
export enum TipoProducto {
  Fisico = 'Físico',
  Digital = 'Digital',
}

/** Criterios de ordenamiento del catálogo. */
export type ProductSort = 'nombre' | 'precio-asc' | 'precio-desc' | 'stock';

