import { describe, expect, it } from 'vitest';
import { CATALOGO_SEMILLA } from '@/infrastructure/catalog/CatalogoSemilla';
import { catalogoTrasVentasSemilla } from '@/infrastructure/catalog/DatosSemilla';

describe('catálogo semilla después de las ventas demo', () => {
  it('descuenta el stock de los pedidos sembrados, igual que el trigger de PostgreSQL', () => {
    const catalogo = catalogoTrasVentasSemilla();
    const porId = new Map(catalogo.map((producto) => [producto.id.valor, producto]));

    expect(catalogo).toHaveLength(CATALOGO_SEMILLA.length);
    expect(porId.get('drone-1')?.stock).toBe(0);
    expect(porId.get('airpods')?.stock).toBe(16);
    expect(porId.get('funda-iphone-17')?.stock).toBe(9);
    expect(porId.get('lego')?.stock).toBe(5);
  });

  it('deja 34 productos visibles en el catálogo público', () => {
    const visibles = catalogoTrasVentasSemilla().filter((producto) => !producto.esAgotado());

    expect(visibles).toHaveLength(CATALOGO_SEMILLA.length - 1);
  });
});
