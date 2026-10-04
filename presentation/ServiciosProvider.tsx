'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import {
  authenticationService,
  catalogoService,
  categoriaAdminService,
  configuracionTiendaService,
  dashboardService,
  pedidoAdminService,
  presentacion,
  productoAdminService,
  reporteService,
  sesion,
  usuarioAdminService,
} from '@/application/compositionRoot';
import type { AuthSession } from '@/domain/auth/contracts';
import type { Usuario } from '@/domain/users/Usuario';

/**
 * Lo que la presentación necesita de la sesión.
 *
 * `AuthSession` es el puerto del dominio y va síncrono, porque el dominio no
 * sabe que existe React. Lo que le sobra a una vista (`subscribe` y
 * `getSnapshot`, que existen para `useSyncExternalStore`) y lo que le falta
 * (`hidratar`, porque con cookie la identidad llega del servidor) se declara
 * aquí como contrato estructural, en vez de apuntar al adaptador concreto.
 *
 * Así se puede sustituir `SesionHttp` por un doble de prueba sin tocar la
 * vista.
 */
export interface SesionObservada extends AuthSession {
  readonly subscribe: (oyente: () => void) => () => void;
  readonly getSnapshot: () => Usuario | undefined;
  hidratar(): Promise<Usuario | undefined>;
  readonly estaAutenticado: () => boolean;
  readonly esAdministrador: () => boolean;
}

/**
 * Inyección de dependencias para la capa de presentación.
 *
 * Antes cada componente importaba directamente un singleton
 * (`import { productAdminService } from '.../createAdminServices'`), lo que
 * ataba la vista a una implementación concreta y hacía imposible
 * renderizarla con dobles de prueba. Con este contexto, la vista pide
 * "necesito el caso de uso de catálogo" y no sabe si detrás hay un
 * repositorio en memoria, un JSON o una API (DIP).
 *
 * El proveedor vive en el layout, así que solo se construye una vez.
 */
export interface AppServices {
  readonly catalogo: typeof catalogoService;
  readonly productos: typeof productoAdminService;
  readonly pedidos: typeof pedidoAdminService;
  readonly usuarios: typeof usuarioAdminService;
  readonly categorias: typeof categoriaAdminService;
  readonly reportes: typeof reporteService;
  readonly configuracion: typeof configuracionTiendaService;
  readonly dashboard: typeof dashboardService;
  readonly autenticacion: typeof authenticationService;
  readonly priceFormatter: typeof presentacion.priceFormatter;
  readonly whatsapp: typeof presentacion.whatsappLinkBuilder;
  readonly sesion: SesionObservada;
}

const ServiciosContext = createContext<AppServices | null>(null);

export function ServiciosProvider({ children }: { children: ReactNode }) {
  const servicios: AppServices = {
    catalogo: catalogoService,
    productos: productoAdminService,
    pedidos: pedidoAdminService,
    usuarios: usuarioAdminService,
    categorias: categoriaAdminService,
    reportes: reporteService,
    configuracion: configuracionTiendaService,
    dashboard: dashboardService,
    autenticacion: authenticationService,
    priceFormatter: presentacion.priceFormatter,
    whatsapp: presentacion.whatsappLinkBuilder,
    sesion,
  };

  // Al montar, consulta una vez al servidor quién es el usuario de la cookie.
  // Así el Navbar ya muestra "Modo Admin" (o el enlace de acceso) tras
  // recargar cualquier página, sin depender de que el guard de /admin haya
  // pasado por aquí. `hidratar` comparte la petición si el guard la lanzó
  // primero; un 401 solo significa "aún no ha iniciado sesión".
  useEffect(() => {
    void sesion.hidratar().catch(() => undefined);
  }, [sesion]);

  return <ServiciosContext.Provider value={servicios}>{children}</ServiciosContext.Provider>;
}

/**
 * Lanza un error explicativo si se usa fuera del proveedor. Es preferible a
 * devolver `null` y dejar que el fallo aparezca como `undefined is not a
 * function` en un punto mucho más lejano y sin contexto.
 */
export function useServicios(): AppServices {
  const servicios = useContext(ServiciosContext);
  if (!servicios) {
    throw new Error(
      'useServicios debe usarse dentro de <ServiciosProvider>. ' +
        'Verifica que app/layout.tsx lo envuelva.',
    );
  }
  return servicios;
}