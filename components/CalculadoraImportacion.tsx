'use client';

import { useId, useState } from 'react';

export type ModalidadFlete = 'maritimo' | 'aereo';

const COSTO_FOB_UNITARIO = 85_000;
const FLETE_MARITIMO_UNITARIO = 3_500;
const FLETE_AEREO_UNITARIO = 12_000;
const TASA_ARANCEL = 0.1;
const TASA_IVA = 0.19;
const UNIDADES_MINIMAS = 10;
const UNIDADES_MAXIMAS = 500;

const formateadorCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

function formatearCOP(valor: number): string {
  return formateadorCOP.format(valor);
}

export interface ResultadoImportacion {
  readonly unidades: number;
  readonly costoFob: number;
  readonly fleteMaritimo: number;
  readonly fleteAereo: number;
  readonly flete: number;
  readonly arancel: number;
  readonly iva: number;
  readonly total: number;
}

/**
 * Calcula el costo de una compra según la forma de envío elegida.
 *
 * El impuesto de importación (10 %) y el IVA (19 %) se calculan sobre el
 * valor de los productos más el envío. El IVA también incluye el impuesto
 * de importación, tal como ocurre en una compra comercial en Colombia.
 */
export function calcularImportacion(
  unidades: number,
  modalidad: ModalidadFlete,
): ResultadoImportacion {
  const costoFob = unidades * COSTO_FOB_UNITARIO;
  const fleteMaritimo = unidades * FLETE_MARITIMO_UNITARIO;
  const fleteAereo = unidades * FLETE_AEREO_UNITARIO;
  const flete = modalidad === 'maritimo' ? fleteMaritimo : fleteAereo;
  const baseArancel = costoFob + flete;
  const arancel = Math.round(baseArancel * TASA_ARANCEL);
  const iva = Math.round((baseArancel + arancel) * TASA_IVA);
  const total = costoFob + flete + arancel + iva;

  return {
    unidades,
    costoFob,
    fleteMaritimo,
    fleteAereo,
    flete,
    arancel,
    iva,
    total,
  };
}

function TarjetaResultado({
  etiqueta,
  valor,
  descripcion,
  destacada = false,
}: {
  etiqueta: string;
  valor: string;
  descripcion: string;
  destacada?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        destacada
          ? 'border-blue-500/30 bg-blue-500/10'
          : 'border-white/10 bg-white/[0.02]'
      }`}
    >
      <span className="block text-[11px] font-bold uppercase tracking-widest text-gray-500">
        {etiqueta}
      </span>
      <span
        className={`mt-2 block text-lg font-bold tracking-tight ${
          destacada ? 'text-blue-300' : 'text-white'
        }`}
      >
        {valor}
      </span>
      <span className="mt-1 block text-[11px] leading-relaxed text-gray-500">
        {descripcion}
      </span>
    </div>
  );
}

export default function CalculadoraImportacion() {
  const idUnidades = useId();
  const [unidades, setUnidades] = useState(120);
  const [modalidad, setModalidad] = useState<ModalidadFlete>('maritimo');

  const resultado = calcularImportacion(unidades, modalidad);
  const esMaritimo = modalidad === 'maritimo';

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#08080a] p-5 shadow-2xl sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="space-y-7">
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
                  Cantidad de productos
                </span>
                <h2 className="mt-1 text-xl font-bold text-white">
                  ¿Cuántas unidades quieres traer?
                </h2>
              </div>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-right">
                <span className="block text-2xl font-extrabold leading-none text-white">
                  {unidades}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
                  unidades
                </span>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor={idUnidades} className="sr-only">
                Cantidad de productos que quieres traer
              </label>
              <input
                id={idUnidades}
                type="range"
                min={UNIDADES_MINIMAS}
                max={UNIDADES_MAXIMAS}
                step={10}
                value={unidades}
                onChange={(evento) => setUnidades(Number(evento.target.value))}
                className="w-full cursor-pointer accent-[#0071e3]"
                aria-valuetext={`${unidades} unidades`}
              />
              <div className="mt-2 flex justify-between text-[11px] font-medium text-gray-500">
                <span>{UNIDADES_MINIMAS} unidades</span>
                <span>{UNIDADES_MAXIMAS} unidades</span>
              </div>
            </div>

            <div className="mt-6">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Forma de envío
              </span>
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/40 p-1">
                <button
                  type="button"
                  onClick={() => setModalidad('maritimo')}
                  aria-pressed={esMaritimo}
                  className={`rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                    esMaritimo
                      ? 'bg-white text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Barco
                </button>
                <button
                  type="button"
                  onClick={() => setModalidad('aereo')}
                  aria-pressed={!esMaritimo}
                  className={`rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                    !esMaritimo
                      ? 'bg-white text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Avión
                </button>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
                Por barco: {formatearCOP(resultado.fleteMaritimo)} · Por avión:{' '}
                {formatearCOP(resultado.fleteAereo)} para esta cantidad. El barco tarda más,
                pero cuesta menos; el avión llega más rápido, pero cuesta más.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
              Detalle de lo que pagarías
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <TarjetaResultado
                etiqueta="Valor de los productos"
                valor={formatearCOP(resultado.costoFob)}
                descripcion="Lo que cuestan los productos antes de pagar el envío internacional."
              />
              <TarjetaResultado
                etiqueta="Envío internacional"
                valor={formatearCOP(resultado.flete)}
                descripcion={
                  esMaritimo
                    ? 'Lo que cuesta transportar tu compra por barco desde China hasta Colombia.'
                    : 'Lo que cuesta transportar tu compra por avión desde China hasta Colombia.'
                }
              />
              <TarjetaResultado
                etiqueta="Impuesto de importación (10%)"
                valor={formatearCOP(resultado.arancel)}
                descripcion="Un impuesto que cobra la aduana por ingresar los productos al país."
              />
              <TarjetaResultado
                etiqueta="IVA (19%)"
                valor={formatearCOP(resultado.iva)}
                descripcion="Otro impuesto que se calcula sobre el valor de los productos y el impuesto de importación."
              />
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-28">
          <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-transparent p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-300">
              Valor aproximado
            </span>
            <h2 className="mt-5 text-sm font-bold uppercase tracking-widest text-blue-100/70">
              Cuánto pagarías en total
            </h2>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {formatearCOP(resultado.total)}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-gray-400">
              Para {resultado.unidades} unidades enviadas por{' '}
              {esMaritimo ? 'barco' : 'avión'} desde China a Colombia.
            </p>

            <dl className="mt-7 space-y-3 border-t border-white/10 pt-5 text-xs">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-gray-400">Productos</dt>
                <dd className="font-semibold text-white">{formatearCOP(resultado.costoFob)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-gray-400">Envío</dt>
                <dd className="font-semibold text-white">{formatearCOP(resultado.flete)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-gray-400">Impuesto de importación</dt>
                <dd className="font-semibold text-white">{formatearCOP(resultado.arancel)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-gray-400">IVA</dt>
                <dd className="font-semibold text-white">{formatearCOP(resultado.iva)}</dd>
              </div>
            </dl>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-[11px] leading-relaxed text-gray-500">
              Tomamos un valor de referencia de {formatearCOP(COSTO_FOB_UNITARIO)} por
              producto. Este resultado es solo un cálculo aproximado: no incluye seguro,
              trámites de aduana, transporte dentro de Colombia ni otros cobros.
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
