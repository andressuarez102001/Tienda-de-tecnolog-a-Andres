/**
 * Parámetros de negocio del dominio.
 *
 * Vivir aquí (y no en los componentes) evita que la interfaz repita
 * números mágicos: `AdminProductosView` comparaba `item.stock <= 2`
 *copiando la regla de `Product.necesitaReposicion`.
 */

/** Por debajo o igual a este valor, un producto entra en modo "reposición". */
export const UMBRAL_STOCK_CRITICO = 2;

/** Costo del envío calculado por kilogramo, en COP. */
export const COSTO_ENVIO_POR_KILO = 5000;

/**
 * Peso asignado a un producto físico creado desde el panel, donde el peso
 * real todavía no se conoce. Evita que `ProductoFisico` exija un dato que el
 * formulario no pide.
 */
export const PESO_GRAMOS_POR_DEFECTO = 100;

/** Número máximo de productos por página en el catálogo público. */
export const MAXIMO_PRODUCTOS_POR_PAGINA = 50;

/** Rol con permisos para entrar al panel de administración. */
export const EMAIL_ADMIN_POR_DEFECTO = 'admin@tecnostore.com';
