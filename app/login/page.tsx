// app/login/page.tsx
'use client'; // Requerido porque usaremos interactividad (estados, efectos y enrutamiento)

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  
  // Estados profesionales para controlar el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // SIMULACIÓN DE PETICIÓN ASÍNCRONA A UNA API (Retraso de 1.5 segundos)
    setTimeout(() => {
      // Credenciales quemadas de forma temporal para pruebas locales
      if (email === 'admin@tecnostore.com' && password === 'admin123') {
        
        // Simulamos la creación de un Token de sesión en el navegador
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        
        // Redireccionamos al home o al futuro panel de administrador
        router.push('/');
        router.refresh(); 
      } else {
        setError('Credenciales incorrectas. Intenta con admin@tecnostore.com y admin123');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">TecnoStore Admin</h1>
          <p className="text-gray-400 text-sm">Ingresa tus credenciales para gestionar la tienda</p>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-800 text-red-400 p-3 rounded-xl text-sm mb-6 text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="admin@tecnostore.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:text-gray-400 transition-all duration-300 text-white font-semibold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                {/* Spinner de carga SVG elegante */}
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verificando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}