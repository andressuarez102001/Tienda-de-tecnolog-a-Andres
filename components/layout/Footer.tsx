// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    // SOLUCIÓN: Agregamos bg-black text-white de forma obligatoria y un borde gris muy sutil
    <footer className="border-t border-white/5 bg-black text-white/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-8 text-center text-xs font-light tracking-wide">
        <p>
          © 2026 ShenzhenStock — Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}