'use client';

/**
 * Estados de carga y error compartidos por las vistas.
 *
 * Existían como `alert()` sueltos o ni siquiera existían: con el backend las
 * peticiones son asíncronas, así que "cargando" y "falló" son estados reales
 * de la interfaz, no detalles opcionales.
 */
export function EstadoCarga({ mensaje = 'Cargando…' }: { readonly mensaje?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="text-center text-sm text-gray-500 border border-dashed border-white/10 rounded-2xl py-16"
    >
      <span className="inline-block animate-pulse">{mensaje}</span>
    </div>
  );
}

export function EstadoError({
  mensaje,
  onReintentar,
}: {
  readonly mensaje: string;
  readonly onReintentar?: () => void;
}) {
  return (
    <div
      role="alert"
      className="text-center border border-red-500/20 bg-red-500/5 rounded-2xl py-10 px-6"
    >
      <p className="text-sm text-red-300">{mensaje}</p>
      {onReintentar ? (
        <button
          onClick={onReintentar}
          className="mt-4 text-xs font-bold text-red-200 border border-red-500/30 rounded-full px-4 py-2 hover:bg-red-500/10 transition-colors"
        >
          Reintentar
        </button>
      ) : null}
    </div>
  );
}

/** Esqueleto de tarjetas para que la grilla no salte al cargar. */
export function EsqueletoGrilla({ cantidad = 8 }: { readonly cantidad?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: cantidad }, (_, indice) => (
        <div
          key={indice}
          className="h-72 rounded-3xl border border-white/5 bg-white/[0.02] animate-pulse"
        />
      ))}
    </div>
  );
}