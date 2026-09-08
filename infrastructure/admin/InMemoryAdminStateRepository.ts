import type { AdminState, AdminStateRepository } from '@/domain/admin/contracts';
import { Category, Order, PeriodReport, Product, User } from '@/domain/admin/entities';

/** Implementación intercambiable. Una API o base de datos puede reemplazarla sin cambiar la UI. */
export class InMemoryAdminStateRepository implements AdminStateRepository {
  load(): AdminState {
    return {
      productos: [
        [1, 'Funda iPhone 17 Pro Max', 'Fundas', 9500, 8], [2, 'Funda iPhone 14 Roja', 'Fundas', 8500, 5], [3, 'Funda iPhone 14 Transparente', 'Fundas', 8500, 6], [4, 'Cargador iPhone 20W', 'Cargadores', 20000, 10], [5, 'Funda iPhone 14 Normal', 'Fundas', 8000, 4], [6, 'Funda iPhone 16 Rosada', 'Fundas', 8000, 5], [7, 'Funda iPad Pro', 'Fundas', 18000, 4], [8, 'Funda iPad Pro Negra', 'Fundas', 17000, 3], [9, 'Funda iPad Pro V2', 'Fundas', 18000, 2], [10, 'Cargador iPad Pro 30W', 'Cargadores', 21000, 5], [11, 'Funda iPad Pro V3', 'Fundas', 18000, 2], [12, 'Drone ALPHA 4K', 'Drones', 52000, 1], [13, 'Drone ALPHA 2K', 'Drones', 45000, 1], [14, 'Control de Drone', 'Drones', 25000, 2], [15, 'Batería Portátil 10000mAh', 'Gadgets', 20000, 3], [16, 'Extensor de Enchufe Smart', 'Gadgets', 15000, 2], [17, 'Gafas VR 3D Lite', 'Gadgets', 22000, 2], [18, 'Inflador Portátil 12V', 'Gadgets', 19000, 2], [19, 'Trípode para Celular', 'Gadgets', 11000, 0],
      ].map(([id, nombre, categoria, precio, stock]) => new Product(id as number, nombre as string, categoria as string, precio as number, stock as number)),
      pedidos: [
        new Order(101, 'Andres Suarez', '2026-08-01', 35000, 'Nequi/Bancolombia', 'Entregado'),
        new Order(102, 'Carlos Mendoza', '2026-08-02', 20000, 'PSE', 'Enviado'),
        new Order(103, 'Maria Fernanda', '2026-08-04', 72000, 'Efectivo/Contraentrega', 'Pendiente'),
      ],
      usuarios: [new User(1, 'Andres Elian Diaz Suarez', 'admin@shenzhenstock.com', 'Admin', 'Activo'), new User(2, 'Cliente Prueba 1', 'cliente@gmail.com', 'Cliente', 'Activo')],
      categorias: [new Category(1, 'Fundas'), new Category(2, 'Cargadores'), new Category(3, 'Drones'), new Category(4, 'Gadgets')],
      reportesPeriodos: [new PeriodReport('Semana 1', '01 Jun - 07 Jun 2026', 1, 35000, 'Cerrada / Facturada'), new PeriodReport('Semana 2', '08 Jun - 14 Jun 2026', 1, 20000, 'Cerrada / Facturada'), new PeriodReport('Semana 3', '15 Jun - 21 Jun 2026', 1, 72000, 'Cerrada / Facturada'), new PeriodReport('Semana 4', '22 Jun - 30 Jun 2026', 0, 0, 'Programada')],
      config: { nombreTienda: 'ShenzhenStock', costoEnvio: 12000, emailContacto: 'soporte@shenzhenstock.com' },
    };
  }
}
