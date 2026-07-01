// src/app/contactanos/page.tsx
import Image from "next/image";

export default function ContactanosPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 pt-28 pb-20 bg-black min-h-[85vh] flex flex-col items-center text-center">
      
      {/* 1. SECCIÓN HERO: Título y Subtítulo minimalistas */}
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight max-w-2xl">
        Nuestro Equipo de Soporte está Aquí para Ayudarte
      </h1>
      
      <p className="text-gray-400 text-base md:text-lg font-light mb-16 max-w-xl leading-relaxed">
        ¿Tienes dudas sobre un producto, garantía o tu pedido? Elige el canal de atención directa que prefieras.
      </p>

      {/* 2. GRILLA INTERACTIVA: Tarjetas en gris Ecosystem de Apple */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        
        {/* Opción Canales: WhatsApp */}
        <a 
          href="https://wa.me/tu-numero" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#121212] border border-white/[0.04] p-8 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:bg-[#1c1c1e] hover:scale-[1.02] group"
        >
          <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">
            📱
          </div>
          <h3 className="text-sm font-semibold text-white tracking-tight">
            WhatsApp Business
          </h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Respuesta inmediata y directa
          </p>
          <span className="text-xs text-blue-500 font-medium group-hover:underline">
            Chat directo →
          </span>
        </a>

        {/* Opción Canales: Correo */}
        <a 
          href="mailto:soporte@tecnostore.com"
          className="bg-[#121212] border border-white/[0.04] p-8 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:bg-[#1c1c1e] hover:scale-[1.02] group"
        >
          <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">
            ✉️
          </div>
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Correo Electrónico
          </h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Para dudas de garantías y ventas
          </p>
          <span className="text-xs text-blue-500 font-medium group-hover:underline">
            Enviar mensaje →
          </span>
        </a>

      </div>

      {/* 3. FOOTER DE PÁGINA: Horarios y aclaraciones sutiles */}
      <p className="text-[11px] text-gray-600 mt-16 font-light tracking-wide uppercase">
        Horario de atención: Lunes a Sábado • 8:00 a.m. a 6:00 p.m.
      </p>

    </main>
  );
}