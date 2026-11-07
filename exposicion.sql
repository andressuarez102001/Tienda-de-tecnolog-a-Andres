-- ============================================================================
-- exposicion.sql  ·  ShenzhenStock (tienda de tecnologia)
-- ----------------------------------------------------------------------------
-- Guion SQL para la sustentacion. Se abre en el Query Tool de pgAdmin 4:
-- seleccionar un bloque y ejecutarlo con F5 (pgAdmin ejecuta solo lo
-- seleccionado cuando hay texto marcado).
--
-- ORDEN RECOMENDADO DE EJECUCION (uno por uno):
--   Seccion 1  -> Tablas (3NF)                [crear el modelo]
--   Seccion 2  -> Funcion + trigger           [logica del motor, antes de sembrar]
--   Seccion 3  -> Semilla minima              [datos para vistas y CALL]
--   Seccion 4  -> 4 vistas                    [definicion + SELECT de prueba]
--   Seccion 5  -> 2 procedimientos            [definicion + CALL de prueba]
--   Seccion 6  -> Demostracion del trigger    [INSERT/UPDATE de prueba]
--
-- El script es IDEMPOTENTE: las tablas usan IF NOT EXISTS, las vistas y las
-- rutinas usan CREATE OR REPLACE, y la semilla usa ON CONFLICT DO NOTHING.
-- Se puede correr sobre una base vacia o sobre una que ya tenga datos.
-- ============================================================================


/* ============================================================================
   SECCION 0. MARCO TEORICO
   ----------------------------------------------------------------------------
   Como se aplican los principios ACID y el teorema CAP en este proyecto.
   (Solo lectura: este bloque no ejecuta ninguna sentencia.)
   ============================================================================

   ----------------------------------------------------------------------------
   0.1  ACID
   ----------------------------------------------------------------------------
   ACID describe las garantias de una transaccion. PostgreSQL las cumple y el
   proyecto las aprovecha en su parte mas sensible: la venta de un producto,
   que descuenta inventario.

   [A] Atomicidad (todo o nada)
       En este sistema una venta son DOS operaciones inseparables:
         1) INSERT del pedido             (procedimiento registrar_pedido)
         2) UPDATE del stock del producto (trigger trg_descontar_stock_en_pedido)
       Van dentro de la misma transaccion. Si el descuento dejara el stock en
       negativo, el CHECK chk_productos_stock_no_negativo falla y PostgreSQL
       revierte TODO: no queda un pedido sin su descuento de inventario.

   [C] Consistencia (de un estado valido a otro)
       El esquema declara las reglas que la base nunca puede violar:
         - Claves primarias:    productos(id), pedidos(id), usuarios(id), ...
         - Claves foraneas:     pedidos.producto_id -> productos(id),
                                credenciales.usuario_id -> usuarios(id)
         - UNIQUE:              usuarios.email, credenciales.email,
                                categorias.nombre
         - CHECK:               productos.precio >= 0, productos.stock >= 0,
                                pedidos.cantidad > 0
       Toda transaccion que commitea deja la base en un estado que cumple
       dichas reglas.

   [I] Aislamiento (las transacciones no se pisan)
       registrar_pedido lee el stock con SELECT ... FOR UPDATE. Eso bloquea la
       fila del producto hasta el COMMIT, de modo que dos compradores simulta-
       neos no lean el mismo stock y lo sobrevendan (condicion de carrera).
       El nivel por defecto de PostgreSQL es READ COMMITTED.

   [D] Durabilidad (lo confirmado sobrevive)
       PostgreSQL escribe el registro de la transaccion en el WAL (Write Ahead
       Log) antes de confirmar. Tras el COMMIT, la venta sobrevive a un reinicio
       o a una caida del servidor.

   ----------------------------------------------------------------------------
   0.2  Teorema CAP
   ----------------------------------------------------------------------------
   CAP afirma que un sistema distribuido no puede garantizar a la vez:
     C = Consistencia (todos ven el mismo dato)
     A = Disponibilidad (toda peticion recibe respuesta)
     P = Tolerancia a particiones (el sistema sigue funcionando si se parte la red)
   ...solo dos de las tres. PostgreSQL, en una sola instancia, se clasifica como
   sistema CP: ante una particion prioriza la CONSISTENCIA sobre la disponibi-
   lidad (prefiere rechazar una escritura antes que aceptarla de forma que no se
   pueda confirmar de forma consistente).

   En el negocio de la tienda conviven dos zonas con prioridades distintas:
     - Zona transaccional (pedidos + inventario): se comporta como CP. No se
       puede vender lo que no hay, aunque eso cueste disponibilidad temporal
       (el CALL de stock insuficiente falla a proposito).
     - Catalogo publico (consulta): tolera comportarse como AP. Puede servirse
       desde cache/CDN con segundos de desactualizacion; el stock "real" se
       valida igual al registrar el pedido.

   ============================================================================ */


/* ============================================================================
   SECCION 1. MODELO DE DATOS (3NF)
   ----------------------------------------------------------------------------
   7 tablas. La clave de negocio de la categoria es su nombre, por eso
   productos.categoria es TEXT y categorias.nombre es UNIQUE: ambas apuntan a
   la misma entidad sin duplicar informacion.
   ============================================================================ */

-- Productos del catalogo (identificador de negocio = TEXT).
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

-- Pedidos (ventas). producto_id es la relacion normalizada (3NF);
-- la columna producto (JSONB) es solo una instantanea historica de auditoria.
CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY,
  cliente TEXT NOT NULL,
  fecha TEXT NOT NULL,
  producto_id TEXT NOT NULL REFERENCES productos (id) ON DELETE RESTRICT,
  producto JSONB NOT NULL,
  cantidad INTEGER NOT NULL CONSTRAINT chk_pedidos_cantidad_positiva CHECK (cantidad > 0),
  metodo_pago TEXT NOT NULL,
  estado TEXT NOT NULL
);

-- Cuentas de la tienda.
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  rol TEXT NOT NULL,
  estado TEXT NOT NULL
);

-- Credenciales de acceso (1:1 con usuarios). Se guarda el HASH, nunca la clave.
CREATE TABLE IF NOT EXISTS credenciales (
  usuario_id INTEGER PRIMARY KEY REFERENCES usuarios (id),
  email TEXT NOT NULL UNIQUE,
  hash_clave TEXT NOT NULL,
  rol TEXT NOT NULL
);

-- Categorias. id SERIAL (int4) a proposito: node-postgres devuelve int8 como
-- string y la validacion del id fallaria si fuera BIGSERIAL.
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE
);

-- Reportes de periodos cerrados (datos analiticos).
CREATE TABLE IF NOT EXISTS reportes (
  periodo TEXT PRIMARY KEY,
  rango_fechas TEXT NOT NULL,
  total_pedidos INTEGER NOT NULL,
  ventas INTEGER NOT NULL,
  cerrado BOOLEAN NOT NULL DEFAULT TRUE
);

-- Configuracion unica de la tienda (una sola fila).
CREATE TABLE IF NOT EXISTS configuracion (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  nombre_tienda TEXT NOT NULL,
  costo_envio INTEGER NOT NULL,
  email_contacto TEXT NOT NULL
);


/* ============================================================================
   SECCION 2. FUNCION + TRIGGER DEL INVENTARIO (Lógica nativa del motor)
   ----------------------------------------------------------------------------
   Se registra junto al esquema, ANTES de sembrar, para que la semilla de la
   Seccion 3 reproduzca el mismo descuento de stock que la app al arrancar
   (BasePg aplica ESQUEMA_SQL y despues siembra).
   La DEMOSTRACION con datos va en la Seccion 6.
   ============================================================================ */

-- Funcion que descuenta el inventario del producto vendido.
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

-- Trigger AFTER INSERT sobre pedidos: cada venta descuenta stock en la misma
-- transaccion. Si el stock quedara negativo, el CHECK de productos aborta todo.
DROP TRIGGER IF EXISTS trg_descontar_stock_en_pedido ON pedidos;
CREATE TRIGGER trg_descontar_stock_en_pedido
  AFTER INSERT ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION descontar_stock_producto();


/* ============================================================================
   SECCION 3. SEMILLA MINIMA
   ----------------------------------------------------------------------------
   Datos de demostracion para que las vistas y los CALL tengan contenido.
   Usa ON CONFLICT DO NOTHING, asi que es seguro re-ejecutarla y no pisa datos
   reales. Al insertar los pedidos, el trigger de la Seccion 2 descuenta stock.
   ============================================================================ */

-- 3.1 Productos (9, repartidos en 8 categorias y 3 colecciones). Los stocks son
--     los del catalogo real; el trigger los ajustara al insertar los pedidos.
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock, imagen,
                       tipo, coleccion, destacado, novedad, tendencia, peso_gramos)
VALUES
  ('funda-iphone-17', 'Funda iPhone 17 Pro Max', 'Funda Premium con tecnología MagSafe y bordes reforzados anti-impacto.', 'iPhone 17', 25000, 10, '/FUNDA-IPHONE-17.jpg', 'Físico', 'iPhone', TRUE, FALSE, TRUE, 55),
  ('cargador-iphone', 'Adaptador de Corriente USB-C de 20W', 'Carga ultrarrápida que lleva tu iPhone del 0 al 50% en solo 30 minutos.', 'Energía', 45000, 120, '/CARGADOR-IPHONE.jpg', 'Físico', 'iPhone', TRUE, FALSE, FALSE, 95),
  ('airpods', 'AirPods Pro 2', 'Audífonos inalámbricos con cancelación activa de ruido y audio espacial.', 'Audio', 105000, 18, '/AIRPODS.jpg', 'Físico', 'iPhone', TRUE, TRUE, TRUE, 60),
  ('drone-1', 'Drone ALPHA 4K Pro', 'Drone profesional con cámara 4K Ultra HD y estabilización gimbal de 3 ejes.', 'Drones 4K', 105000, 1, '/DRONE-1.jpg', 'Físico', 'Drone', FALSE, FALSE, TRUE, 950),
  ('drone-2', 'Drone ALPHA 2K Auto-Return', 'Drone de alta precisión con GPS y función de retorno automático.', 'Drones 2K', 89000, 1, '/DRONE-2.jpg', 'Físico', 'Drone', FALSE, FALSE, TRUE, 880),
  ('control-drone', 'Controlador de Drone Pro', 'Controlador ergonómico con soporte para smartphone y transmisión HD a 2.4GHz.', 'Periféricos', 45000, 2, '/CONTROL-DRONE.jpg', 'Físico', 'Drone', FALSE, FALSE, FALSE, 320),
  ('lego', 'Set de Ladrillos LEGO CITY', 'Set de ladrillos para construir tu propio universo de diversión y creatividad.', 'Juguetes', 43000, 8, '/LEGO.jpg', 'Físico', 'Juguetes', FALSE, FALSE, FALSE, 850),
  ('dinosaurio', 'Dinosaurio de peluche', 'Un adorable dinosaurio de peluche para que tus hijos lo tengan siempre cerca.', 'Juguetes', 15000, 24, '/dinosaurio.jpg', 'Físico', 'Juguetes', FALSE, FALSE, FALSE, 260),
  ('binoculares', 'Binoculares 10x42', 'Binoculares de alta definición con lentes multicapa para observación detallada.', 'Óptica', 55000, 11, '/BINOCULARES.jpg', 'Físico', 'Drone', TRUE, FALSE, FALSE, 640)
ON CONFLICT (id) DO NOTHING;

-- 3.2 Categorias derivadas del catalogo (ninguna queda huerfana).
INSERT INTO categorias (nombre)
SELECT DISTINCT categoria FROM productos
ON CONFLICT (nombre) DO NOTHING;

-- 3.3 Usuarios (Admin + 3 clientes de la semilla real).
INSERT INTO usuarios (id, nombre, email, rol, estado)
VALUES
  (1, 'Administrador', 'admin@tecnostore.com', 'Admin', 'Activo'),
  (2, 'Carlos Ramírez', 'carlos.ramirez@correo.com', 'Cliente', 'Activo'),
  (3, 'Ana Torres', 'ana.torres@correo.com', 'Cliente', 'Bloqueado'),
  (4, 'Jorge Díaz', 'jorge.diaz@correo.com', 'Cliente', 'Activo')
ON CONFLICT DO NOTHING;

-- 3.4 Credenciales (1:1). El hash es de relleno: en la app lo genera bcrypt.
INSERT INTO credenciales (usuario_id, email, hash_clave, rol)
VALUES
  (1, 'admin@tecnostore.com', '$2b$10$DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEM', 'Admin'),
  (2, 'carlos.ramirez@correo.com', '$2b$10$DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEM', 'Cliente'),
  (3, 'ana.torres@correo.com', '$2b$10$DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEM', 'Cliente'),
  (4, 'jorge.diaz@correo.com', '$2b$10$DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEM', 'Cliente')
ON CONFLICT DO NOTHING;

-- 3.5 Pedidos. La instantanea (producto JSONB) se toma con to_jsonb(p).
--     Al insertarse, el trigger descuenta stock:
--       drone-1         1 - 1 = 0   (queda Agotado)
--       airpods        18 - 2 = 16
--       funda-iphone-17 10 - 1 = 9
--       lego            8 - 3 = 5
INSERT INTO pedidos (id, cliente, fecha, producto_id, producto, cantidad, metodo_pago, estado)
SELECT v.id, v.cliente, v.fecha, p.id, to_jsonb(p), v.cantidad, v.metodo_pago, v.estado
FROM (VALUES
  (1, 'Carlos Ramírez', '2026-01-05', 'drone-1',         1, 'Nequi/Bancolombia',      'Entregado'),
  (2, 'Ana Torres',     '2026-01-12', 'airpods',         2, 'Efectivo/Contraentrega', 'Enviado'),
  (3, 'Jorge Díaz',     '2026-02-02', 'funda-iphone-17', 1, 'PSE',                    'Entregado'),
  (4, 'Laura Méndez',   '2026-02-18', 'lego',            3, 'Efectivo/Contraentrega', 'Pendiente')
) AS v(id, cliente, fecha, producto_id, cantidad, metodo_pago, estado)
JOIN productos p ON p.id = v.producto_id
ON CONFLICT (id) DO NOTHING;

-- 3.6 Configuracion unica de la tienda.
INSERT INTO configuracion (id, nombre_tienda, costo_envio, email_contacto)
VALUES (1, 'ShenzhenStock', 12000, 'contacto@shenzhenstock.co')
ON CONFLICT (id) DO NOTHING;

-- 3.7 Reportes de periodos cerrados.
INSERT INTO reportes (periodo, rango_fechas, total_pedidos, ventas, cerrado)
VALUES
  ('Enero 2026', '1 – 31 ene 2026', 128, 18450000, TRUE),
  ('Diciembre 2025', '1 – 31 dic 2025', 214, 31780000, TRUE)
ON CONFLICT (periodo) DO NOTHING;


/* ============================================================================
   SECCION 4. VISTAS (4)
   ----------------------------------------------------------------------------
   Encapsulan consultas de negocio dentro del motor. CREATE OR REPLACE las
   mantiene idempotentes. Debajo de cada una, el SELECT de prueba.
   ============================================================================ */

-- 4.1 v_pedidos_detalle
--     Reconcilia cada pedido con su cuenta y con el producto/categoria
--     (INNER JOIN de 5 tablas). Nota: el pedido de "Laura Méndez" no aparece
--     porque no tiene cuenta en usuarios; el INNER JOIN lo excluye a proposito.
CREATE OR REPLACE VIEW v_pedidos_detalle AS
SELECT p.id                        AS pedido,
       p.cliente                   AS cliente,
       c.email                     AS email_cuenta,
       pr.nombre                   AS producto,
       cat.nombre                  AS categoria,
       p.cantidad                  AS unidades,
       (pr.precio * p.cantidad)    AS total_linea,
       p.estado                    AS estado
FROM pedidos p
INNER JOIN usuarios u      ON u.nombre = p.cliente
INNER JOIN credenciales c  ON c.usuario_id = u.id
INNER JOIN productos pr    ON pr.id = p.producto_id
INNER JOIN categorias cat  ON cat.nombre = pr.categoria;

-- [PRUEBA 4.1]
SELECT * FROM v_pedidos_detalle ORDER BY pedido;


-- 4.2 v_ventas_por_categoria
--     Consolidado por categoria (GROUP BY + HAVING): solo categorias con al
--     menos un pedido.
CREATE OR REPLACE VIEW v_ventas_por_categoria AS
SELECT pr.categoria                            AS categoria,
       COUNT(p.id)                             AS pedidos,
       COALESCE(SUM(p.cantidad), 0)            AS unidades_vendidas,
       COALESCE(SUM(pr.precio * p.cantidad), 0) AS ingresos_cop
FROM productos pr
LEFT JOIN pedidos p ON p.producto_id = pr.id
GROUP BY pr.categoria
HAVING COUNT(p.id) >= 1;

-- [PRUEBA 4.2]
SELECT * FROM v_ventas_por_categoria ORDER BY ingresos_cop DESC;


-- 4.3 v_inventario_critico
--     Productos agotados (stock 0) o con stock bajo (<= 2). Traduce el estado
--     del dominio (Agotado/Bajo) a SQL y ordena primero lo mas urgente.
CREATE OR REPLACE VIEW v_inventario_critico AS
SELECT pr.id                     AS producto_id,
       pr.nombre                 AS producto,
       pr.categoria              AS categoria,
       pr.stock                  AS stock_actual,
       CASE
         WHEN pr.stock = 0 THEN 'Agotado'
         ELSE 'Bajo'
       END                       AS estado_inventario
FROM productos pr
WHERE pr.stock <= 2
ORDER BY pr.stock ASC, pr.nombre;

-- [PRUEBA 4.3]
SELECT * FROM v_inventario_critico;


-- 4.4 v_ventas_por_cliente
--     Cuantos pedidos, cuantas unidades y cuanto dinero dejo cada cliente.
CREATE OR REPLACE VIEW v_ventas_por_cliente AS
SELECT p.cliente                          AS cliente,
       COUNT(p.id)                        AS pedidos,
       COALESCE(SUM(p.cantidad), 0)       AS unidades,
       COALESCE(SUM(pr.precio * p.cantidad), 0) AS ingresos_cop
FROM pedidos p
INNER JOIN productos pr ON pr.id = p.producto_id
GROUP BY p.cliente
ORDER BY ingresos_cop DESC;

-- [PRUEBA 4.4]
SELECT * FROM v_ventas_por_cliente;


/* ============================================================================
   SECCION 5. PROCEDIMIENTOS ALMACENADOS (2)
   ----------------------------------------------------------------------------
   Debajo de cada definicion va el CALL con datos de ejemplo.
   ============================================================================ */

-- 5.1 registrar_pedido
--     Da de alta una compra validando inventario. Bloquea la fila con
--     FOR UPDATE para cerrar la condicion de carrera y arma la instantanea del
--     producto. El trigger hace el descuento en la misma transaccion.
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

-- [PRUEBA 5.1 · caso valido] dinosaurio tiene 24 unidades -> venta registrada.
-- El trigger descuenta 2 y lo deja en 22.
CALL registrar_pedido(5, 'Laura Méndez', '2026-03-05', 'dinosaurio', 2, 'Nequi/Bancolombia');

-- [PRUEBA 5.1 · caso que falla] drone-1 quedo en 0 tras la semilla: el
-- procedimiento aborta con "Stock insuficiente". El pedido NO se crea.
CALL registrar_pedido(6, 'Laura Méndez', '2026-03-05', 'drone-1', 1, 'Nequi/Bancolombia');

-- [COMPROBACION 5.1] el trigger descontó el stock del dinosaurio (24 -> 22).
SELECT id, nombre, stock FROM productos WHERE id = 'dinosaurio';


-- 5.2 reponer_stock
--     Operacion complementaria: incrementa inventario validando la cantidad y
--     que el producto exista. (Nota: por el trigger, airpods esta en 16 tras la
--     semilla, no en 18.)
CREATE OR REPLACE PROCEDURE reponer_stock(
  p_producto_id TEXT,
  p_cantidad INTEGER
)
LANGUAGE plpgsql
AS $proc$
BEGIN
  IF p_cantidad <= 0 THEN
    RAISE EXCEPTION 'La cantidad a reponer debe ser mayor que cero.';
  END IF;

  UPDATE productos
     SET stock = stock + p_cantidad
   WHERE id = p_producto_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'El producto "%" no existe.', p_producto_id;
  END IF;
END;
$proc$;

-- [PRUEBA 5.2 · caso valido] airpods 16 -> 21.
CALL reponer_stock('airpods', 5);

-- [COMPROBACION 5.2]
SELECT id, nombre, stock FROM productos WHERE id = 'airpods';

-- [PRUEBA 5.2 · caso que falla] cantidad invalida -> excepcion controlada.
CALL reponer_stock('airpods', -5);


/* ============================================================================
   SECCION 6. DEMOSTRACION DEL TRIGGER
   ----------------------------------------------------------------------------
   El trigger trg_descontar_stock_en_pedido se dispara solo con INSERT sobre
   pedidos. Primero mostramos el stock antes y despues del INSERT.
   ============================================================================ */

-- 6.1 Stock ANTES (dinosaurio quedo en 22 tras la prueba 5.1).
SELECT id, nombre, stock AS stock_antes FROM productos WHERE id = 'dinosaurio';

-- 6.2 INSERT de prueba: inserta el pedido id 7 y el trigger descuenta 3
--     unidades de inmediato (22 -> 19), sin escribir ningun UPDATE a mano.
INSERT INTO pedidos (id, cliente, fecha, producto_id, producto, cantidad, metodo_pago, estado)
SELECT 7, 'Ana Torres', '2026-03-10', p.id, to_jsonb(p), 3, 'PSE', 'Pendiente'
FROM productos p
WHERE p.id = 'dinosaurio';

-- 6.3 Stock DESPUES: la diferencia 22 -> 19 demuestra el disparo automatico.
SELECT id, nombre, stock AS stock_despues FROM productos WHERE id = 'dinosaurio';

-- 6.4 Caso que revierte todo: control-drone tiene 2 unidades y se piden 5. El
--     trigger intenta dejarlo en -3, el CHECK chk_productos_stock_no_negativo
--     falla y PostgreSQL revierte el INSERT completo (el pedido no existe).
INSERT INTO pedidos (id, cliente, fecha, producto_id, producto, cantidad, metodo_pago, estado)
SELECT 8, 'Jorge Díaz', '2026-03-11', p.id, to_jsonb(p), 5, 'PSE', 'Pendiente'
FROM productos p
WHERE p.id = 'control-drone';

-- [COMPROBACION 6.4] control-drone sigue en 2 y el pedido 8 no se creo.
SELECT id, nombre, stock FROM productos WHERE id = 'control-drone';
SELECT COUNT(*) AS pedido_8_existe FROM pedidos WHERE id = 8;


-- ============================================================================
-- FIN DE exposicion.sql
-- ============================================================================
