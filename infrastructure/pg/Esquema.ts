/**
 * Esquema de PostgreSQL, en formato SQL.
 *
 * Vive aquí (y no en un `.sql` aparte) a propósito: el build standalone copia
 * el código pero no los archivos sueltos, así que leer el DDL del disco en
 * runtime se rompería en producción. `CREATE TABLE IF NOT EXISTS` hace que
 * aplicar el esquema en cada arranque sea idempotente.
 *
 * Las columnas se nombran en `snake_case`; cada consulta las devuelve con
 * alias en `camelCase` para alimentar directamente a los restauradores de
 * entidades del dominio.
 *
 * Además del modelo 3NF (claves primarias y foráneas), el esquema incluye
 * lógica nativa del motor:
 *  - `registrar_pedido`: procedimiento PL/pgSQL que da de alta una compra
 *    validando primero el inventario.
 *  - `descontar_stock_producto`: función lanzada por el trigger
 *    `trg_descontar_stock_en_pedido` (AFTER INSERT sobre `pedidos`) que
 *    descuenta el stock del producto vendido. Si el descuento dejara el
 *    stock negativo, el `CHECK` de `productos` aborta la operación completa:
 *    la venta no existe si no se puede descontar el inventario.
 */
export const ESQUEMA_SQL = `
CREATE TABLE IF NOT EXISTS productos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  categoria TEXT NOT NULL,
  precio INTEGER NOT NULL CONSTRAINT chk_productos_precio_no_negativo CHECK (precio >= 0),
  stock INTEGER NOT NULL CONSTRAINT chk_productos_stock_no_negativo CHECK (stock >= 0),
  imagen TEXT NOT NULL,
  tipo TEXT NOT NULL,
  coleccion TEXT NOT NULL,
  destacado BOOLEAN NOT NULL DEFAULT FALSE,
  novedad BOOLEAN NOT NULL DEFAULT FALSE,
  tendencia BOOLEAN NOT NULL DEFAULT FALSE,
  peso_gramos INTEGER
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY,
  cliente TEXT NOT NULL,
  fecha TEXT NOT NULL,
  -- Clave foránea normalizada (3NF): el pedido apunta al producto que compra.
  producto_id TEXT NOT NULL REFERENCES productos (id) ON DELETE RESTRICT,
  -- Instantánea histórica del producto al momento de la venta (auditoría);
  -- la relación funcional vive en "producto_id", no en el JSON.
  producto JSONB NOT NULL,
  cantidad INTEGER NOT NULL CONSTRAINT chk_pedidos_cantidad_positiva CHECK (cantidad > 0),
  metodo_pago TEXT NOT NULL,
  estado TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  rol TEXT NOT NULL,
  estado TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS credenciales (
  usuario_id INTEGER PRIMARY KEY REFERENCES usuarios (id),
  email TEXT NOT NULL UNIQUE,
  hash_clave TEXT NOT NULL,
  rol TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS reportes (
  periodo TEXT PRIMARY KEY,
  rango_fechas TEXT NOT NULL,
  total_pedidos INTEGER NOT NULL,
  ventas INTEGER NOT NULL,
  cerrado BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS configuracion (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  nombre_tienda TEXT NOT NULL,
  costo_envio INTEGER NOT NULL,
  email_contacto TEXT NOT NULL
);

-- --------------------------------------------------------------------------
-- Lógica nativa del motor: trigger de stock.
-- --------------------------------------------------------------------------

-- Descuenta el inventario del producto con cada venta. Se dispara después de
-- insertar el pedido; si el stock quedara negativo, el CHECK de "productos"
-- lanza un error y toda la transacción (venta + descuento) se revierte.
CREATE OR REPLACE FUNCTION descontar_stock_producto()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $fn$
BEGIN
  UPDATE productos
     SET stock = stock - NEW.cantidad
   WHERE id = NEW.producto_id;
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS trg_descontar_stock_en_pedido ON pedidos;
CREATE TRIGGER trg_descontar_stock_en_pedido
  AFTER INSERT ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION descontar_stock_producto();

-- --------------------------------------------------------------------------
-- Lógica nativa del motor: procedimiento de registro de compras.
-- --------------------------------------------------------------------------

-- Da de alta una compra. Valida que el producto exista y tenga stock antes de
-- insertar (con "FOR UPDATE" para cerrar la ventana de concurrencia) y hace
-- la instantánea histórica del producto. El trigger se encarga del descuento
-- en la misma transacción.
CREATE OR REPLACE PROCEDURE registrar_pedido(
  p_id INTEGER,
  p_cliente TEXT,
  p_fecha TEXT,
  p_producto_id TEXT,
  p_cantidad INTEGER,
  p_metodo_pago TEXT
)
LANGUAGE plpgsql
AS $proc$
DECLARE
  v_stock INTEGER;
BEGIN
  SELECT stock
    INTO v_stock
    FROM productos
   WHERE id = p_producto_id
     FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'El producto "%" no existe.', p_producto_id;
  END IF;

  IF v_stock < p_cantidad THEN
    RAISE EXCEPTION 'Stock insuficiente del producto "%": hay %, se pidieron %.',
      p_producto_id, v_stock, p_cantidad;
  END IF;

  INSERT INTO pedidos (id, cliente, fecha, producto_id, producto, cantidad, metodo_pago, estado)
  SELECT p_id,
         p_cliente,
         p_fecha,
         p.id,
         jsonb_build_object(
           'id', p.id,
           'nombre', p.nombre,
           'descripcion', p.descripcion,
           'categoria', p.categoria,
           'precio', p.precio,
           'stock', p.stock,
           'imagen', p.imagen,
           'tipo', p.tipo,
           'coleccion', p.coleccion,
           'destacado', p.destacado,
           'novedad', p.novedad,
           'tendencia', p.tendencia,
           'pesoGramos', p.peso_gramos
         ),
         p_cantidad,
         p_metodo_pago,
         'Pendiente'
    FROM productos p
   WHERE p.id = p_producto_id;
END;
$proc$;
`;