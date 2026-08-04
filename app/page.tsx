// app/page.tsx
import Image from "next/image";
import Link from "next/link";

interface CategoryItem {
  emoji: string;
  name: string;
}

const CATEGORIES: CategoryItem[] = [
  { emoji: "🔌", name: "Cargadores" },
  { emoji: "🔋", name: "Power Banks" },
  { emoji: "🔌", name: "Cables" },
  { emoji: "📱", name: "Fundas" },
  { emoji: "🎧", name: "Audífonos" },
  { emoji: "🛡️", name: "Vidrios Templados" },
];

// 📲 Configuración de tu WhatsApp
const MI_TELEFONO = "573003256891"; // <-- ¡CAMBIA ESTE NÚMERO POR EL TUYO REAL!

// Enlaces dinámicos con mensajes predeterminados para WhatsApp
const MENSAJE_CONTACTO = encodeURIComponent("Hola ShenzhenStock! Quisiera recibir más información sobre el catálogo de accesorios y envíos.");
const URL_WHATSAPP_CONTACTO = `https://wa.me/${MI_TELEFONO}?text=${MENSAJE_CONTACTO}`;

const MENSAJE_IPHONE = encodeURIComponent("Hola ShenzhenStock! Quisiera más información y disponibilidad de los accesorios para el iPhone 17 Pro Max.");
const URL_WHATSAPP_IPHONE = `https://wa.me/${MI_TELEFONO}?text=${MENSAJE_IPHONE}`;

export default function Home() {
  return (
<main className="max-w-7xl mx-auto px-6 py-16">

      {/* SECTION: HERO (ESTILO APPLE WWDC) */}
      <section className="flex flex-col items-center text-center pt-12 pb-20 max-w-4xl mx-auto">
        
        {/* Etiqueta superior minimalista */}
        <span className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-medium text-gray-400 uppercase tracking-widest shadow-sm mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          Tecnología • Calidad • Garantía
        </span>

        {/* Título de alto impacto */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] max-w-3xl">
          Accesorios tecnológicos para llevar tu experiencia al siguiente nivel.
        </h1>

        {/* Descripción fluida */}
        <p className="text-xl md:text-2xl text-gray-400 font-light mb-10 max-w-2xl leading-relaxed">
          Encuentra cargadores, cables, fundas y accesorios cuidadosamente seleccionados para ofrecer calidad, diseño y el mejor precio.
        </p>

        {/* Botones simétricos estilo Apple Store */}
        <div className="flex gap-4 flex-wrap justify-center mb-16">
          <Link 
            href="/productos-top" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-102 text-base min-w-[160px]"
          >
            Productos TOP
          </Link>

          {/* 💬 BOTÓN DIRECTO A WHATSAPP (CONTÁCTANOS) */}
          <a 
            href={URL_WHATSAPP_CONTACTO}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba5a] text-black font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-102 text-base min-w-[160px] flex items-center justify-center gap-2 shadow-lg"
          >
            <span>💬 WhatsApp</span>
          </a>
        
          <Link 
            href="/productos-nuevos" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-102 text-base min-w-[160px]"
          >
            Productos Nuevos!
          </Link>
        </div>

        {/* 📱 BLOQUE 1: IPHONE 17 PRO MAX */}
        <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-2 shadow-2xl block transition-all duration-300 hover:border-white/20 group mb-8">
          
          {/* Enlace al hacer clic en Título o Imagen para ir a los detalles */}
          <Link href="/home-iphone" className="block cursor-pointer">
            <h1 className="text-2xl md:text-3xl font-semibold text-center text-white tracking-tight mb-2 mt-6 group-hover:text-blue-400 transition-colors">
              Accesorios para iPhone 17 Pro Max
            </h1>
            <p className="text-center text-sm text-gray-400 font-light mb-4">
              Explora nuestra selección de fundas, cargadores y más.
            </p>
            <div className="overflow-hidden rounded-2xl relative">
              <Image
                src="/IMAGEN-IPHONE-PORTADA.jpg"
                alt="Accesorios tecnológicos TecnoStore"
                width={1200}
                height={675}
                className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                priority 
              />
            </div>
          </Link>

          {/* Botón directo para pedir por WhatsApp */}
          <div className="py-4 text-center">
            <a 
              href={URL_WHATSAPP_IPHONE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#25D366] hover:bg-[#20ba5a] text-black font-semibold text-xs px-6 py-2.5 rounded-full transition-all duration-200"
            >
              Pedir iPhone Kit por WhatsApp
            </a>
          </div>

        </div>

        {/* 🍏 BLOQUE 2: IPAD PRO */}
        <Link 
          href="/home-ipad" 
          className="w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-2 shadow-2xl block transition-all duration-300 hover:border-white/20 group cursor-pointer mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-white tracking-tight mb-2 mt-6">
            Accesorios para tu iPad Pro
          </h1>
          <p className="text-center text-sm text-gray-400 font-light mb-4">
            Explora nuestra selección de accesorios para tu iPad Pro, fundas, cargadores y más.
          </p>
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/IPAD-PORTADA.jpg"
              alt="Accesorios tecnológicos TecnoStore"
              width={1200}
              height={675}
              className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 ease-out group-hover:scale-[1.12]"
              priority 
            />
          </div>
        </Link>

        {/* 🛸 BLOQUE 3: DRONE */}
        <Link 
          href="/home-drone" 
          className="w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-2 shadow-2xl block transition-all duration-300 hover:border-white/20 group cursor-pointer"
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-white tracking-tight mb-2 mt-6">
            Compra tu Drone con nosotros!
          </h1>
          <p className="text-center text-sm text-gray-400 font-light mb-4">
            Explora nuestra selección de drones y ordena ahora mismo, con garantía y soporte técnico.
          </p>
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/DRONE-PORTADA.jpg"
              alt="Accesorios tecnológicos TecnoStore"
              width={1200}
              height={675}
              className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 ease-out group-hover:scale-[1.12]"
              priority 
            />
          </div>
        </Link>




     {/* 🍏 BLOQUE 4:Juguetes */}
        <Link 
          href="/home-juguetes" 
          className="w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-2 shadow-2xl block transition-all duration-300 hover:border-white/20 group cursor-pointer mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-white tracking-tight mb-2 mt-6">
            Diversion y Juguetes para todas las edades
          </h1>
          <p className="text-center text-sm text-gray-400 font-light mb-4">
            juguetes y accesorios para todas las edades, desde los más pequeños hasta los más grandes.
          </p>
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/JUGUETES2.jpg"
              alt="Accesorios tecnológicos TecnoStore"
              width={1200}
              height={675}
              className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 ease-out group-hover:scale-[1.12]"
              priority 
            />
          </div>
        </Link>























      </section>

      {/* SECTION: CATEGORÍAS (ESTILO APPLE STORE) */}
      <section className="mb-24 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-white tracking-tight mb-2">
          Explora nuestras categorías
        </h2>
        <p className="text-center text-sm text-gray-400 font-light mb-12">
          Encuentra rápidamente el accesorio que estás buscando.
        </p>

        {/* Grilla con tarjetas estilizadas y compactas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((category) => (
            <div 
              key={category.name} 
              className="bg-[#121212] hover:bg-[#1c1c1e] rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 hover:scale-105 group border border-white/[0.02]"
            >
              <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110" role="img" aria-label={category.name}>
                {category.emoji}
              </div>
              <h3 className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors tracking-wide">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}