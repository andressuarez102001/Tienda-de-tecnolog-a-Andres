import { describe, expect, it } from 'vitest';
import { Pedido } from '@/domain/orders/Pedido';
import { estadoDe, estadosDisponibles } from '@/domain/orders/EstadoPedido';
import { ProductoDigital } from '@/domain/catalog/ProductoDigital';
import { ProductoFisico } from '@/domain/catalog/ProductoFisico';
import { Dinero } from '@/domain/shared/Dinero';
import { ProductId } from '@/domain/shared/ProductId';
import { OrderStatus, PaymentMethod, ProductCollection, TipoProducto } from '@/domain/shared/enums';

const productoDigital = new ProductoDigital({
  id: new ProductId('soporte-digital-premium'),
  nombre: 'Soporte Digital Premium',
  descripcion: 'Plan de soporte remoto.',
  categoria: 'Servicios Digitales',
  precio: Dinero.de(45000),
  stock: 99,
  imagen: '/globe.svg',
  tipo: TipoProducto.Digital,
  coleccion: ProductCollection.Iphone,
  destacado: false,
  novedad: true,
  tendencia: false,
});

const productoFisico = new ProductoFisico({
  id: new ProductId('drone-1'),
  nombre: 'Drone ALPHA 4K Pro',
  descripcion: 'Drone con cámara 4K.',
  categoria: 'Drones 4K',
  precio: Dinero.de(105000),
  stock: 1,
  imagen: '/DRONE-1.jpg',
  tipo: TipoProducto.Fisico,
  coleccion: ProductCollection.Drone,
  destacado: false,
  novedad: false,
  tendencia: true,
  pesoGramos: 1000,
});

const nuevoPedido = () =>
  Pedido.crear(7, 'Carlos Ramírez', '2026-03-01', productoDigital, 2, PaymentMethod.Digital);

describe('Pedido (entidad)', () => {
  it('crea en estado Pendiente y deriva el total del producto', () => {
    const pedido = nuevoPedido();
    expect(pedido.nombreEstado).toBe(OrderStatus.Pendiente);
    expect(pedido.total.valor).toBe(90000);
  });

  it('deriva el código público de seguimiento del id', () => {
    expect(nuevoPedido().codigo).toBe('SHZ-0007');
  });

  it('rechaza cantidades que superan el stock', () => {
    expect(() => Pedido.crear(1, 'Ana', '2026-03-01', productoFisico, 5, PaymentMethod.PSE)).toThrow();
  });

  it('rechaza datos inválidos en el constructor', () => {
    const datos = nuevoPedido().aDatos();
    expect(() => Pedido.desde({ ...datos, id: 0 })).toThrow();
    expect(() => Pedido.desde({ ...datos, cliente: '  ' })).toThrow();
    expect(() => Pedido.desde({ ...datos, fecha: 'no-es-fecha' })).toThrow();
    expect(() => Pedido.desde({ ...datos, cantidad: 0 })).toThrow();
  });

  it('es inmutable al cambiar de estado', () => {
    const original = nuevoPedido();
    const enviado = original.cambiarEstado(OrderStatus.Enviado);

    expect(original.nombreEstado).toBe(OrderStatus.Pendiente);
    expect(enviado.nombreEstado).toBe(OrderStatus.Enviado);
    expect(enviado).not.toBe(original);
    expect(enviado.id).toBe(original.id);
  });

  it('el total incluye el envío según el tipo de producto', () => {
    const pedidoDigital = nuevoPedido();
    const pedidoFisico = Pedido.crear(
      8,
      'Ana Torres',
      '2026-03-02',
      productoFisico,
      1,
      PaymentMethod.Contraentrega,
    );
    expect(pedidoDigital.total.valor).toBe(90000);
    expect(pedidoFisico.total.valor).toBe(105000 + productoFisico.costoEnvio().valor);
  });
});

describe('Pedido + patrón State', () => {
  it('permite la cadena Pendiente → Enviado → Entregado', () => {
    const entregado = nuevoPedido()
      .cambiarEstado(OrderStatus.Enviado)
      .cambiarEstado(OrderStatus.Entregado);

    expect(entregado.nombreEstado).toBe(OrderStatus.Entregado);
    expect(entregado.esFinalizado).toBe(true);
  });

  // Antes `changeStatus` aceptaba cualquier valor sin preguntar nada.
  it('rechaza retroceder de Pendiente a Entregado', () => {
    expect(() => nuevoPedido().cambiarEstado(OrderStatus.Entregado)).toThrow();
  });

  it('rechaza reabrir un pedido ya entregado', () => {
    const entregado = nuevoPedido()
      .cambiarEstado(OrderStatus.Enviado)
      .cambiarEstado(OrderStatus.Entregado);
    expect(() => entregado.cambiarEstado(OrderStatus.Pendiente)).toThrow();
  });

  it('permite cancelar desde Pendiente y desde Enviado, pero no desde Entregado', () => {
    expect(() => nuevoPedido().cambiarEstado(OrderStatus.Cancelado)).not.toThrow();
    const entregado = nuevoPedido()
      .cambiarEstado(OrderStatus.Enviado)
      .cambiarEstado(OrderStatus.Entregado);
    expect(() => entregado.cambiarEstado(OrderStatus.Cancelado)).toThrow();
  });

  it('expone las transiciones válidas para la interfaz', () => {
    const pedido = nuevoPedido();
    expect(pedido.puedeCambiarA(OrderStatus.Enviado)).toBe(true);
    expect(pedido.puedeCambiarA(OrderStatus.Entregado)).toBe(false);
  });

  it('expone solo los destinos permitidos, para el <select> del panel', () => {
    expect(nuevoPedido().cambiosDisponibles).toEqual([
      OrderStatus.Enviado,
      OrderStatus.Cancelado,
    ]);

    const entregado = nuevoPedido()
      .cambiarEstado(OrderStatus.Enviado)
      .cambiarEstado(OrderStatus.Entregado);
    expect(entregado.cambiosDisponibles).toHaveLength(0);
  });

  it('los estados del registro son instancias únicas e inmutables', () => {
    expect(estadoDe(OrderStatus.Pendiente)).toBe(estadoDe(OrderStatus.Pendiente));
    expect(estadoDe(OrderStatus.Entregado).esTerminal).toBe(true);
    expect(estadoDe(OrderStatus.Pendiente).esTerminal).toBe(false);
  });

  it('registra todos los estados del enum', () => {
    expect([...estadosDisponibles()].sort()).toEqual([...Object.values(OrderStatus)].sort());
  });
});