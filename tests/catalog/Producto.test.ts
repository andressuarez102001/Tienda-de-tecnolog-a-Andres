import { describe, expect, it } from 'vitest';
import { ProductoDigital } from '@/domain/catalog/ProductoDigital';
import { ProductoFisico, type PhysicalProductData } from '@/domain/catalog/ProductoFisico';
import type { ProductData } from '@/domain/catalog/Producto';
import { ProductoFabric } from '@/domain/catalog/ProductoFabric';
import type { ProductDraft } from '@/domain/catalog/ProductoDraft';
import { Dinero } from '@/domain/shared/Dinero';
import { ProductId } from '@/domain/shared/ProductId';
import {
  CatalogListing,
  ProductCollection,
  StockLevel,
  TipoProducto,
} from '@/domain/shared/enums';
import { COSTO_ENVIO_POR_KILO, UMBRAL_STOCK_CRITICO } from '@/domain/shared/constantes';

const BASE: ProductData = {
  id: new ProductId('funda-iphone-17'),
  nombre: 'Funda iPhone 17 Pro Max',
  descripcion: 'Funda con MagSafe.',
  categoria: 'iPhone 17',
  precio: Dinero.de(25000),
  stock: 10,
  imagen: '/FUNDA-IPHONE-17.jpg',
  tipo: TipoProducto.Fisico,
  coleccion: ProductCollection.Iphone,
  destacado: true,
  novedad: false,
  tendencia: true,
};

const fisico = (overrides: Partial<PhysicalProductData> = {}): ProductoFisico =>
  new ProductoFisico({ ...BASE, pesoGramos: 1000, ...overrides });

const digital = (overrides: Partial<ProductData> = {}): ProductoDigital =>
  new ProductoDigital({ ...BASE, tipo: TipoProducto.Digital, ...overrides });

describe('Producto (entidad base)', () => {
  it('rechaza datos incompletos en el constructor', () => {
    expect(() => new ProductoFisico({ ...BASE, nombre: '  ', pesoGramos: 10 })).toThrow();
    expect(() => new ProductoFisico({ ...BASE, stock: -1, pesoGramos: 10 })).toThrow();
    expect(() => new ProductoFisico({ ...BASE, pesoGramos: 0 })).toThrow();
  });

  it('es inmutable: cada operación devuelve una instancia nueva', () => {
    const original = fisico();
    const descontado = original.descontarStock(3);

    expect(original.stock).toBe(10);
    expect(descontado.stock).toBe(7);
    expect(descontado).not.toBe(original);
  });

  it('calcula el total sin envío de forma idéntica en ambas subclases', () => {
    // Esta es la garantía de LSP: antes `ProductoFisico` reescribía
    // `calculateTotal` para sumar el envío, así que `precio * cantidad`
    // significaba cosas distintas según el tipo.
    expect(fisico().totalPedido(2).valor).toBe(50000);
    expect(digital().totalPedido(2).valor).toBe(50000);
  });

  it('deriva el valor total del inventario del precio y el stock', () => {
    expect(fisico({ stock: 4 }).precioTotal().valor).toBe(100000);
  });

  it('impide descontar más stock del disponible', () => {
    expect(() => fisico({ stock: 3 }).descontarStock(5)).toThrow();
    expect(() => fisico({ stock: 3 }).descontarStock(0)).toThrow();
  });

  it('clasifica el stock con el enum, no con comparaciones sueltas en la vista', () => {
    expect(fisico({ stock: 0 }).nivelStock()).toBe(StockLevel.Agotado);
    expect(fisico({ stock: UMBRAL_STOCK_CRITICO }).nivelStock()).toBe(StockLevel.Bajo);
    expect(fisico({ stock: 50 }).nivelStock()).toBe(StockLevel.Disponible);
    expect(fisico({ stock: 0 }).necesitaReposicion()).toBe(true);
    expect(fisico({ stock: 50 }).necesitaReposicion()).toBe(false);
  });

  it('filtra por colección, categoría, búsqueda y listado', () => {
    const producto = fisico();
    expect(producto.cumpleFiltro({ coleccion: ProductCollection.Iphone })).toBe(true);
    expect(producto.cumpleFiltro({ coleccion: ProductCollection.Drone })).toBe(false);
    expect(producto.cumpleFiltro({ busqueda: 'magsafe' })).toBe(true);
    expect(producto.cumpleFiltro({ busqueda: 'drone' })).toBe(false);
    expect(producto.cumpleFiltro({ listado: CatalogListing.Destacados })).toBe(true);
    expect(producto.cumpleFiltro({ listado: CatalogListing.Novedades })).toBe(false);
  });

  it('respeta agotados: false', () => {
    expect(fisico({ stock: 0 }).cumpleFiltro({ agotados: false })).toBe(false);
    expect(fisico({ stock: 0 }).cumpleFiltro({ agotados: true })).toBe(true);
  });

  it('compara por identificador, no por contenido', () => {
    const uno = fisico();
    const otro = fisico({ nombre: 'Otro nombre completamente distinto' });
    expect(uno.esIgualA(otro)).toBe(true);
    expect(uno.tieneId(new ProductId('funda-iphone-17'))).toBe(true);
    expect(uno.tieneId(new ProductId('airpods'))).toBe(false);
  });

  it('ordena por nombre, precio y stock', () => {
    const barato = digital({ id: new ProductId('a'), precio: Dinero.de(1000) });
    const caro = digital({ id: new ProductId('b'), precio: Dinero.de(9000) });

    expect([caro, barato].sort((x, y) => x.compararCon(y, 'precio-asc'))[0]).toBe(barato);
    expect([barato, caro].sort((x, y) => x.compararCon(y, 'precio-desc'))[0]).toBe(caro);
  });
});

describe('ProductoFisico (polimorfismo de envío)', () => {
  it('cobra envío por peso redondeado al total', () => {
    expect(fisico({ pesoGramos: 1000 }).costoEnvio().valor).toBe(COSTO_ENVIO_POR_KILO);
    expect(fisico({ pesoGramos: 550 }).costoEnvio().valor).toBe(2750);
  });

  it('conserva el peso al reconstruirse', () => {
    const original = fisico({ pesoGramos: 800 });
    expect(original.descontarStock(1).costoEnvio().valor).toBe(original.costoEnvio().valor);
  });

  it('el precio con envío usa el envío de la subclase', () => {
    expect(fisico({ pesoGramos: 1000 }).cotizar(2).valor).toBe(50000 + COSTO_ENVIO_POR_KILO);
  });
});

describe('ProductoDigital (polimorfismo de envío)', () => {
  it('no cobra envío', () => {
    expect(digital().costoEnvio().esIgualA(Dinero.cero())).toBe(true);
    expect(digital().cotizar(3).valor).toBe(75000);
  });
});

describe('ProductoFabric (selección de subclase)', () => {
  const borrador = (tipo: TipoProducto): ProductDraft => ({
    nombre: 'Soporte Digital Premium',
    descripcion: 'Plan de soporte remoto.',
    categoria: 'Servicios Digitales',
    precio: 45000,
    stock: 5,
    imagen: '/globe.svg',
    tipo,
    coleccion: ProductCollection.Iphone,
    destacado: false,
    novedad: true,
    tendencia: false,
  });

  it('construye la subclase que corresponde al tipo declarado', () => {
    const id = new ProductId('soporte');
    expect(ProductoFabric.crear(id, borrador(TipoProducto.Digital))).toBeInstanceOf(ProductoDigital);
    expect(ProductoFabric.crear(id, borrador(TipoProducto.Fisico))).toBeInstanceOf(ProductoFisico);
  });

  it('rehidrata desde datos serializados sin cambiar el tipo', () => {
    const creado = ProductoFabric.crear(new ProductId('soporte'), borrador(TipoProducto.Fisico));
    const rehidratado = ProductoFabric.desdeDatos(ProductoFabric.aPersisted(creado));

    expect(rehidratado).toBeInstanceOf(ProductoFisico);
    expect(rehidratado.tipo).toBe(TipoProducto.Fisico);
    expect(rehidratado.esIgualA(creado)).toBe(true);
  });

  it('un producto digital serializado no gana peso al rehidratarse', () => {
    const creado = ProductoFabric.crear(new ProductId('soporte'), borrador(TipoProducto.Digital));
    expect(ProductoFabric.aPersisted(creado).pesoGramos).toBeUndefined();
    expect(ProductoFabric.desdeDatos(ProductoFabric.aPersisted(creado))).toBeInstanceOf(
      ProductoDigital,
    );
  });
});