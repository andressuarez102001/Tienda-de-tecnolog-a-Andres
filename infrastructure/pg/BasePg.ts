import { Pool } from 'pg';
import type { QueryResultRow } from 'pg';
import type { GeneradorSemilla } from '@/infrastructure/persistencia/HidratacionTienda';
import type { ProductPersisted } from '@/domain/catalog/ProductoFabric';
import { ESQUEMA_SQL } from './Esquema';

/**
 * Fila que devuelve PostgreSQL: un objeto plano con los alias `camelCase`
 * que cada consulta pide en el `SELECT`.
 */
export type FilaPg = QueryResultRow;

/**
 * Base de datos PostgreSQL.
 *
 * Es la contraparte de `EstadoServidor` para el archivo JSON: un único punto
 * de conexión por proceso que aplica el esquema y siembra la tienda la
 * primera vez que la base está vacía, imitando el arranque del JSON (donde
 * un archivo inexistente genera la semilla).
 *
 * La siembra comparte una sola promesa, igual que la carga del archivo: si
 * varias peticiones llegan antes de que termine, ninguna intenta sembrar dos
 * veces. La decisión de sembrar se toma dentro de una transacción para que
 * un fallo a mitad de camino no deje la base a medias.
 *
 * `consulta` es el único punto de entrada de los repositorios: nunca contacta
 * con la base hasta que el esquema está aplicado y la semilla lista.
 */
export class BasePg {
  private readonly pool: Pool;
  private listo: Promise<void>;

  constructor(generarSemilla: GeneradorSemilla, pool?: Pool) {
    this.pool = pool ?? this.crearPool();
    this.pool.on('error', (error) => {
      console.error('Error en el pool de conexiones de PostgreSQL.', error);
    });
    this.listo = this.levantar(generarSemilla);
  }

  private crearPool(): Pool {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
    });
  }

  async consulta(texto: string, parametros?: ReadonlyArray<unknown>): Promise<FilaPg[]> {
    const { filas } = await this.ejecutar(texto, parametros);
    return filas;
  }

  /** Ejecuta una sentencia y devuelve las filas y el número de filas afectadas. */
  async ejecutar(
    texto: string,
    parametros?: ReadonlyArray<unknown>,
  ): Promise<{ filas: FilaPg[]; afectadas: number }> {
    await this.listo;
    const resultado = await this.pool.query(texto, parametros as unknown[]);
    return { filas: resultado.rows, afectadas: resultado.rowCount ?? 0 };
  }

  private async levantar(generarSemilla: GeneradorSemilla): Promise<void> {
    await this.pool.query(ESQUEMA_SQL);
    await this.sembrarSiVacia(generarSemilla);
  }

  private async sembrarSiVacia(generarSemilla: GeneradorSemilla): Promise<void> {
    const { rows } = await this.pool.query('SELECT COUNT(*)::int AS total FROM configuracion');
    if (Number(rows[0]?.total) > 0) {
      return;
    }

    const instantanea = await generarSemilla();
    const cliente = await this.pool.connect();
    try {
      await cliente.query('BEGIN');
      await cliente.query(
        `INSERT INTO configuracion (id, nombre_tienda, costo_envio, email_contacto)
         VALUES (1, $1, $2, $3)`,
        [
          instantanea.configuracion.nombreTienda,
          instantanea.configuracion.costoEnvio,
          instantanea.configuracion.emailContacto,
        ],
      );
      for (const usuario of instantanea.usuarios) {
        await cliente.query(
          `INSERT INTO usuarios (id, nombre, email, rol, estado) VALUES ($1, $2, $3, $4, $5)`,
          [usuario.id, usuario.nombre, usuario.email, usuario.rol, usuario.estado],
        );
      }
      for (const credencial of instantanea.credenciales) {
        await cliente.query(
          `INSERT INTO credenciales (usuario_id, email, hash_clave, rol) VALUES ($1, $2, $3, $4)`,
          [
            credencial.usuarioId,
            credencial.email,
            credencial.hashClave,
            credencial.rol,
          ],
        );
      }
      for (const categoria of instantanea.categorias) {
        await cliente.query(`INSERT INTO categorias (nombre) VALUES ($1)`, [categoria.nombre]);
      }
      for (const reporte of instantanea.reportes) {
        await cliente.query(
          `INSERT INTO reportes (periodo, rango_fechas, total_pedidos, ventas, cerrado)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            reporte.periodo,
            reporte.rangoFechas,
            reporte.totalPedidos,
            reporte.ventas,
            reporte.cerrado,
          ],
        );
      }
      for (const producto of instantanea.productos) {
        await cliente.query(
          `INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock, imagen,
             tipo, coleccion, destacado, novedad, tendencia, peso_gramos)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [
            producto.id,
            producto.nombre,
            producto.descripcion,
            producto.categoria,
            producto.precio,
            producto.stock,
            producto.imagen,
            producto.tipo,
            producto.coleccion,
            producto.destacado,
            producto.novedad,
            producto.tendencia,
            producto.pesoGramos ?? null,
          ],
        );
      }
      for (const pedido of instantanea.pedidos) {
        await cliente.query(
          `INSERT INTO pedidos (id, cliente, fecha, producto_id, producto, cantidad, metodo_pago, estado)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            pedido.id,
            pedido.cliente,
            pedido.fecha,
            idProductoDe(pedido.producto),
            pedido.producto,
            pedido.cantidad,
            pedido.metodoPago,
            pedido.estado,
          ],
        );
      }
      await cliente.query('COMMIT');
    } catch (error) {
      await cliente.query('ROLLBACK');
      throw error;
    } finally {
      cliente.release();
    }
  }
}

/** El id persistido puede llegar como texto o como `{ id, valor }` heredado. */
function idProductoDe(instancia: ProductPersisted): string {
  const id = instancia.id;
  return typeof id === 'string' ? id : (id.valor ?? id.id);
}