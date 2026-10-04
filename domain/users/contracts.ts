import type { Usuario } from './Usuario';

/**
 * Puerto estrecho para cuentas de usuario.
 *
 * El panel solo alterna el estado de la cuenta (habilitar/bloquear); no crea
 * usuarios ni les cambia el rol ahí. Por eso el puerto expone lectura y
 * `actualizar`, y ni `crear` ni `eliminar`.
 */
export interface UserRepository {
  listar(): Promise<ReadonlyArray<Usuario>>;
  obtenerPorId(id: number): Promise<Usuario | undefined>;
  actualizar(id: number, usuario: Usuario): Promise<Usuario>;
}