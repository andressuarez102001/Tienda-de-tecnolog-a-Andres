import type { ReactNode } from 'react';

/**
 * Envoltura visual compartida por todas las páginas de catálogo.
 *
 * Solo define el fondo y el resplandor ambiental. La cabecera y la grilla
 * las aporta cada página como contenido, de modo que el layout no conoce
 * entidades ni casos de uso.
 */
export function PaginaCatalogo({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen bg-[#08080a] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="max-w-7xl mx-auto relative z-10">{children}</div>
    </main>
  );
}