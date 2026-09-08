import type { Category, Order, PeriodReport, Product, StoreSettings, User } from './entities';

export interface AdminState {
  productos: Product[];
  pedidos: Order[];
  usuarios: User[];
  categorias: Category[];
  reportesPeriodos: PeriodReport[];
  config: StoreSettings;
}

/** Contrato estable: la aplicación no conoce cómo se obtienen los datos iniciales. */
export interface AdminStateRepository {
  load(): AdminState;
}
