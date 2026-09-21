'use client';

import { useState } from 'react';
import { storeConfigService } from '@/application/admin/createAdminServices';

/**
 * Responsabilidad única: ajustes generales de la tienda.
 */
export default function AdminConfiguracionView() {
  const [initialState] = useState(() => storeConfigService.loadInitialState());
  const [config, setConfig] = useState(initialState.config);

  return (
    <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl max-w-2xl space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Ajustes de Tienda</h2>
        <p className="text-sm text-gray-400 mt-1">Parámetros generales de envíos y contacto</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Nombre Comercial</label>
          <input
            type="text"
            className="border border-white/10 bg-black/50 w-full p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
            value={config.nombreTienda}
            onChange={(e) => setConfig({ ...config, nombreTienda: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Costo Envío Nacional ($)</label>
          <input
            type="number"
            className="border border-white/10 bg-black/50 w-full p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
            value={config.costoEnvio}
            onChange={(e) => setConfig({ ...config, costoEnvio: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Email de Contacto</label>
          <input
            type="email"
            className="border border-white/10 bg-black/50 w-full p-3 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
            value={config.emailContacto}
            onChange={(e) => setConfig({ ...config, emailContacto: e.target.value })}
          />
        </div>

        <button
          onClick={() => alert('Configuración guardada exitosamente.')}
          className="bg-emerald-600 hover:bg-emerald-500 transition-all text-white font-bold py-3 px-8 rounded-full text-sm shadow-lg shadow-emerald-500/20"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}