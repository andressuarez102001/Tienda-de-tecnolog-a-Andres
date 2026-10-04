import { describe, expect, it } from 'vitest';
import { Usuario } from '@/domain/users/Usuario';
import { Categoria } from '@/domain/tienda/Categoria';
import { ConfiguracionTienda } from '@/domain/tienda/ConfiguracionTienda';
import { ReportePeriodo } from '@/domain/tienda/ReportePeriodo';
import { UserRole, UserStatus } from '@/domain/shared/enums';

describe('Usuario', () => {
  it('crea con valores por defecto de cliente activo', () => {
    const usuario = Usuario.crear(1, 'Carlos Ramírez', 'carlos@correo.com');
    expect(usuario.rol).toBe(UserRole.Cliente);
    expect(usuario.estaActivo).toBe(true);
    expect(usuario.puedeAdministrar()).toBe(false);
  });

  it('solo administra un administrador activo', () => {
    const admin = Usuario.crear(1, 'Admin', 'admin@tecnostore.com', UserRole.Admin);
    expect(admin.puedeAdministrar()).toBe(true);
    expect(admin.alternarEstado().puedeAdministrar()).toBe(false);
  });

  it('rechaza emails inválidos en la construcción', () => {
    expect(() => Usuario.crear(1, 'X', '@')).toThrow();
  });

  it('es inmutable al cambiar rol o estado', () => {
    const original = Usuario.crear(1, 'Ana', 'ana@correo.com');
    const bloqueada = original.cambiarEstado(UserStatus.Bloqueado);

    expect(original.estaActivo).toBe(true);
    expect(bloqueada.estaActivo).toBe(false);
    expect(bloqueada).not.toBe(original);
  });

  it('sobrevive al viaje a JSON sin perder la identidad', () => {
    const original = Usuario.crear(3, 'Jorge Díaz', 'jorge@correo.com', UserRole.Admin);
    const restaurado = Usuario.restaurar(JSON.parse(JSON.stringify(original.aPersistido())));

    expect(restaurado.esIgualA(original)).toBe(true);
    expect(restaurado.email.valor).toBe(original.email.valor);
  });
});

describe('Categoria', () => {
  it('exige identificador y nombre', () => {
    expect(() => Categoria.crear(0, 'X')).toThrow();
    expect(() => Categoria.crear(1, '  ')).toThrow();
  });

  it('renombra sin cambiar el identificador', () => {
    const renombrada = Categoria.crear(3, 'Gaming').renombrar('Videojuegos');
    expect(renombrada.id).toBe(3);
    expect(renombrada.nombre).toBe('Videojuegos');
  });
});

describe('ConfiguracionTienda', () => {
  it('valida el correo como value object', () => {
    expect(() => ConfiguracionTienda.crear('Tienda', 1000, 'correo-malo')).toThrow();
  });

  it('devuelve instancias nuevas al cambiar', () => {
    const original = ConfiguracionTienda.crear('ShenzhenStock', 12000, 'a@b.co');
    const nuevo = original.cambiarCostoEnvio(15000);

    expect(original.costoEnvio.valor).toBe(12000);
    expect(nuevo.costoEnvio.valor).toBe(15000);
  });
});

describe('ReportePeriodo', () => {
  it('rechaza un total de pedidos negativo', () => {
    expect(() => ReportePeriodo.crear('Enero', '1 – 31', -1, 100)).toThrow();
  });

  it('usa un booleano para el estado, no una cadena libre', () => {
    const reporte = ReportePeriodo.crear('Enero 2026', '1 – 31 ene', 10, 500000, false);
    expect(reporte.cerrado).toBe(false);
  });
});