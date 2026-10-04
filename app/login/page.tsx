'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useServicios } from '@/presentation/ServiciosProvider';

/**
 * Formulario de acceso del panel.
 *
 * Se eliminó el `setTimeout(1500)`: simular latencia sin backend hacía creer
 * al usuario que había una petición de red, y además dejaba el botón en
 * estado de carga si el retorno nunca llegaba.
 *
 * Ahora la validación ocurre en el servidor (`bcrypt` + JWT) y la respuesta
 * llega en una cookie httpOnly: el navegador nunca ve el token ni lo guarda
 * en `localStorage`, así que un XSS no puede robar la sesión. La ruta de
 * destino se toma de `?siguiente=` para que el proxy pueda devolver al
 * usuario a la página que intentaba abrir.
 */
function FormularioLogin() {
  const router = useRouter();
  const parametros = useSearchParams();
  const siguiente = parametros.get('siguiente') ?? '/admin';
  const { sesion } = useServicios();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (evento: FormEvent<HTMLFormElement>): Promise<void> => {
    evento.preventDefault();
    setError('');
    setEnviando(true);

    try {
      const respuesta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!respuesta.ok) {
        const cuerpo = (await respuesta.json().catch(() => undefined)) as
          | { error?: string }
          | undefined;
        setError(cuerpo?.error ?? 'Credenciales incorrectas o cuenta sin permisos.');
        return;
      }

      // El servidor ya puso la cookie; se rehidrata de una vez para que el
      // Navbar pase a "Modo Admin" en el mismo render que la redirección,
      // aunque el destino no sea /admin.
      await sesion.hidratar().catch(() => undefined);

      router.replace(siguiente.startsWith('/') ? siguiente : '/admin');
      router.refresh();
    } catch {
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">TecnoStore Admin</h1>
          <p className="text-gray-400 text-sm">
            Ingresa tus credenciales para gestionar la tienda
          </p>
        </div>

        {error ? (
          <div className="bg-red-950/50 border border-red-800 text-red-400 p-3 rounded-xl text-sm mb-6 text-center">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="admin@tecnostore.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(evento) => setPassword(evento.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-all duration-300 text-white font-semibold py-3 px-4 rounded-xl shadow-lg"
          >
            {enviando ? 'Verificando…' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <p className="text-sm text-gray-500">Cargando…</p>
        </div>
      }
    >
      <FormularioLogin />
    </Suspense>
  );
}