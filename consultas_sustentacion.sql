-- ============================================================================
-- consultas_sustentacion.sql
-- Consultas complejas para la sustentación de la tienda (ShenzhenStock).
--
-- Modelo de datos (3NF):
--   productos (id PK)  <- pedidos.producto_id FK
--   categorias (id PK) <- productos.categoria (clave de negocio)
--   usuarios (id PK)   <- credenciales.usuario_id FK
-- ---------------------------------------------------------------
-- Archivo de consultas y ejemplos: NO modifica datos salvo los
-- bloques `CALL` que están comentados al final.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. INNER JOIN que une 5 tablas
--    Pedidos con su producto, la categoría del producto y la cuenta del
--    cliente que compró (se enlaza por el nombre, la clave de negocio que
--    comparten pedidos y usuarios en la semilla).
-- ----------------------------------------------------------------------------
SELECT p.id                    AS pedido,
       p.cliente               AS cliente,
       c.email                 AS email_cuenta,
       pr.nombre               AS producto,
       cat.nombre              AS categoria,
       p.cantidad              AS unidades,
       (pr.precio * p.cantidad) AS total_linea,
       p.estado                AS estado
FROM pedidos p
INNER JOIN usuarios u      ON u.nombre = p.cliente
INNER JOIN credenciales c  ON c.usuario_id = u.id
INNER JOIN productos pr    ON pr.id = p.producto_id
INNER JOIN categorias cat  ON cat.nombre = pr.categoria
ORDER BY p.id;


-- ----------------------------------------------------------------------------
-- 2. LEFT JOIN
--    Catálogo completo del lado izquierdo: cada producto, y cuántas veces se
--    vendió. Los productos que nunca se vendieron aparecen con 0, lo que un
--    INNER JOIN ocultaría.
-- ----------------------------------------------------------------------------
SELECT pr.id                     AS producto_id,
       pr.nombre                 AS producto,
       pr.categoria              AS categoria,
       pr.stock                  AS stock_actual,
       COUNT(p.id)               AS veces_vendido,
       COALESCE(SUM(p.cantidad), 0) AS unidades_vendidas
FROM productos pr
LEFT JOIN pedidos p ON p.producto_id = pr.id
GROUP BY pr.id, pr.nombre, pr.categoria, pr.stock
ORDER BY veces_vendido DESC, pr.nombre;


-- ----------------------------------------------------------------------------
-- 3. GROUP BY + HAVING
--    Ventas consolidadas por categoría, dejando solamente las categorías que
--    realmente tienen al menos un pedido registrado.
-- ----------------------------------------------------------------------------
SELECT pr.categoria                       AS categoria,
       COUNT(p.id)                        AS pedidos,
       COALESCE(SUM(p.cantidad), 0)       AS unidades_vendidas,
       COALESCE(SUM(pr.precio * p.cantidad), 0) AS ingresos_cop
FROM productos pr
LEFT JOIN pedidos p ON p.producto_id = pr.id
GROUP BY pr.categoria
HAVING COUNT(p.id) >= 1
ORDER BY ingresos_cop DESC;


-- ----------------------------------------------------------------------------
-- 4. Ejemplos para presentar la lógica nativa del motor (OPCIONALES).
--    Descomenta una línea en pgAdmin4 y ejecútala solo cuando quieras
--    demostrar cómo el procedimiento valida inventario y el trigger descuenta
--    el stock automáticamente.
-- ----------------------------------------------------------------------------
-- Registrar una compra con stock suficiente (dinosaurio tiene 24 unidades):
--   CALL registrar_pedido(5, 'Laura Méndez', '2026-03-05', 'dinosaurio', 2, 'Nequi/Bancolombia');
--
-- Registrar una compra que NO descuenta stock porque no alcanza el inventario
-- (drone-1 queda en 0 tras la siembra; el error aborta todo el pedido):
--   CALL registrar_pedido(6, 'Laura Méndez', '2026-03-05', 'drone-1', 1, 'Nequi/Bancolombia');
--
-- Consulta para comprobar que el trigger descontó el stock (esperado: 16):
--   SELECT id, nombre, stock FROM productos WHERE id = 'airpods';