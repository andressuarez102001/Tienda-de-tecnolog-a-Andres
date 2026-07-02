'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  // Verifica si el administrador ya inició sesión en este navegador
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');
    if (auth === 'true' && role === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  // Función para borrar la sesión simulada
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setIsAdmin(false);
    router.push('/');
    router.refresh();
  };

  return (
    // SOLUCIÓN: Cambiamos bg-black/70 por bg-black sólido para que ningún navegador móvil altere el fondo oscuro
    <nav className="border-b border-white/10 bg-black text-white sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
        
        {/* LOGO: Más pequeño, minimalista y con tracking cerrado */}
        <Link href="/" className="text-sm font-semibold text-white tracking-tight hover:opacity-80 transition-opacity">
          Shenzhen<span className="text-blue-500 font-medium">Stock</span>
        </Link>

        {/* ENLACES DE NAVEGACIÓN Y ACCIONES */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/" className="text-xs font-normal text-white/80 hover:text-white transition-colors">
            Inicio
          </Link>
          <Link href="/productos-top" className="text-xs font-normal text-white/80 hover:text-white transition-colors">
            Productos TOP
          </Link>
          
          {/* NUEVO ENLACE: Conexión directa a tu página de Novedades recién creada */}
          <Link href="/recientes" className="text-xs font-normal text-white/80 hover:text-white transition-colors">
            Novedades
          </Link>

          {/* RENDERIZADO CONDICIONAL: Botones modo píldora sutiles */}
          {isAdmin ? (
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium">
                Modo Admin
              </span>
              <button 
                onClick={handleLogout}
                className="text-[11px] bg-white text-black hover:bg-white/90 px-3 py-1 rounded-full font-medium transition-all duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="text-[11px] border border-white/20 text-white hover:bg-white hover:text-black px-3 py-1 rounded-full font-medium transition-all duration-200"
            >
              Admin Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}