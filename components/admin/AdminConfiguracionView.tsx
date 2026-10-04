'use client';

import { useState } from 'react';
import { useServicios } from '@/presentation/ServiciosProvider';
import { useDatos } from '@/presentation/useDatos';

/**
 * Ajustes generales de la tienda.
 *
 * Antes los tres campos eran `<dd>` de solo lectura y el botón "Guardar"
 * ejecutaba un `alert`: no se editaba ni se guardaba nada. Ahora el formulario
 * escribe sobre la entidad `ConfiguracionTienda`, que valida el correo como
 * `Email` y el envío como `Dinero`; la vista solo pide el guardado.
 *
 * El formulario es no controlado (`defaultValue` + `FormData`) a propósito:
 * evita el `useEffect` que resincronizaba los campos con cada lectura de la
 * configuración, que provocaba un render en cascada.
 */
export default function AdminConfiguracionView() {
  const { configuracion: servicioConfiguracion } = useServicios();
  const { datos: config, cargando, error: errorDeCarga, refrescar } = useDatos(() =>
    servicioConfiguracion.obtener(),
  );
  const [error, setError] = useState('');
  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const enviar = async (evento: React.FormEvent<HTMLFormElement>): Promise<void> => {
    evento.preventDefault();
    setGuardado(false);
    setError('');
    setGuardando(true);

    const formulario = new FormData(evento.currentTarget);
    try {
      await servicioConfiguracion.guardar({
        nombreTienda: String(formulario.get('nombreTienda') ?? ''),
        costoEnvio: Number(formulario.get('costoEnvio')),
        emailContacto: String(formulario.get('emailContacto') ?? ''),
      });
      refrescar();
      setGuardado(true);
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : 'No se pudo guardar.');
    } finally {
      setGuardando(false);
    }
  };

  const campo =
    'w-full text-white text-sm bg-black/40 border border-white/5 p-3 rounded-xl';

  if (cargando && !config) {
    return (
      <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl max-w-2xl">
        <p className="text-sm text-gray-500">Cargando configuración…</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl max-w-2xl">
        <p className="text-sm text-red-400">{errorDeCarga ?? 'No se pudo cargar la configuración.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl max-w-2xl space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Ajustes de Tienda</h2>
        <p className="text-sm text-gray-400 mt-1">
          Parámetros generales de envíos y contacto
        </p>
      </div>

      <form key={config.nombreTienda + config.costoEnvio.valor + config.emailContacto.valor} onSubmit={enviar} className="space-y-4">
        <label className="block">
          <span className="block text-xs font-bold uppercase text-gray-400 mb-2">
            Nombre Comercial
          </span>
          <input name="nombreTienda" defaultValue={config.nombreTienda} className={campo} />
        </label>

        <label className="block">
          <span className="block text-xs font-bold uppercase text-gray-400 mb-2">
            Costo de Envío Nacional (COP)
          </span>
          <input
            name="costoEnvio"
            type="number"
            min={0}
            defaultValue={config.costoEnvio.valor}
            className={campo}
          />
        </label>

        <label className="block">
          <span className="block text-xs font-bold uppercase text-gray-400 mb-2">
            Email de Contacto
          </span>
          <input
            name="emailContacto"
            type="email"
            defaultValue={config.emailContacto.valor}
            className={campo}
          />
        </label>

        <button
          type="submit"
          disabled={guardando}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all text-white font-bold py-3 px-8 rounded-full text-sm shadow-lg shadow-emerald-500/20"
        >
          {guardando ? 'Guardando…' : 'Guardar Cambios'}
        </button>
      </form>

      {guardado ? (
        <p className="text-xs text-emerald-400">Cambios aplicados y persistidos.</p>
      ) : null}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}