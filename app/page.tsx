// app/page.tsx
import Image from "next/image";
import Link from "next/link";

interface CategoryItem {
  emoji: string;
  name: string;
  slug: string;
}

const CATEGORIES: CategoryItem[] = [
  { emoji: "🔌", name: "Cargadores", slug: "/cargadores" },
  { emoji: "🔋", name: "Power Banks", slug: "/productos-top" },
  { emoji: "🔌", name: "Cables", slug: "/cargadores" },
  { emoji: "📱", name: "Fundas", slug: "/home-iphone" },
  { emoji: "🎧", name: "Audífonos", slug: "/productos-top" },
  { emoji: "🛡️", name: "Vidrios Templados", slug: "/home-iphone" },
];

const MI_TELEFONO = "573003256891";

const MENSAJE_CONTACTO = encodeURIComponent(
  "Hola ShenzhenStock! Quisiera recibir más información sobre el catálogo de accesorios y envíos."
);
const URL_WHATSAPP_CONTACTO = `https://wa.me/${MI_TELEFONO}?text=${MENSAJE_CONTACTO}`;

const MENSAJE_IPHONE = encodeURIComponent(
  "Hola ShenzhenStock! Quisiera más información y disponibilidad de los accesorios para el iPhone 17 Pro Max."
);
const URL_WHATSAPP_IPHONE = `https://wa.me/${MI_TELEFONO}?text=${MENSAJE_IPHONE}`;

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#08080a] text-white overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* 🌌 FONDO CON EFECTO AMBIENT GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* 🚀 HERO SECTION REDISEÑADA */}
        <section className="flex flex-col items-center text-center pt-8 pb-16 max-w-4xl mx-auto">
          {/* Badge Neón Minimalista */}
          <div className="inline-flex items-center gap-2.5 bg-white/[0.03] backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-xs font-medium text-blue-400 tracking-wider uppercase mb-8 shadow-2xl hover:border-blue-500/40 transition-all">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Tecnología Premium • Envíos Nacionales
          </div>

          {/* Título Principal Tipografía Impacto */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-500 mb-6 leading-[1.08]">
            El estándar superior para tus dispositivos.
          </h1>

          {/* Subtítulo fluido */}
          <p className="text-lg md:text-xl text-gray-400 font-normal mb-10 max-w-2xl leading-relaxed">
            Equipamiento de alta gama, cargadores, fundas exclusivas y accesorios seleccionados para maximizar tu experiencia.
          </p>

          {/* Botones de Acción con Jerarquía Clara */}
          <div className="flex gap-4 flex-wrap justify-center items-center">
            <Link
              href="/productos-top"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              Explorar Catálogo TOP
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <a
              href={URL_WHATSAPP_CONTACTO}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 text-white font-medium px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2.5"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]"></span>
              Chat WhatsApp
            </a>
          </div>
        </section>

        {/* 🛡️ BARRA DE BENEFICIOS (TRUST BADGES) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 text-2xl">🚚</div>
            <div>
              <h4 className="text-sm font-semibold text-white">Envíos Garantizados</h4>
              <p className="text-xs text-gray-400">Despachos rápidos a todo el país</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start border-y md:border-y-0 md:border-x border-white/5 py-4 md:py-0 md:px-6">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 text-2xl">🛡️</div>
            <div>
              <h4 className="text-sm font-semibold text-white">Garantía Directa</h4>
              <p className="text-xs text-gray-400">Calidad probada en cada producto</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 text-2xl">⚡</div>
            <div>
              <h4 className="text-sm font-semibold text-white">Atención Inmediata</h4>
              <p className="text-xs text-gray-400">Asesoría directa por WhatsApp</p>
            </div>
          </div>
        </section>

        {/* 🏷️ NAVEGACIÓN RÁPIDA POR CATEGORÍAS */}
        <section className="mb-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Categorías Destacadas</h2>
              <p className="text-sm text-gray-400 mt-1">Selecciona la línea de accesorios que buscas</p>
            </div>
            <Link href="/productos-nuevos" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors mt-2 sm:mt-0 flex items-center gap-1">
              Ver novedades →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                href={category.slug}
                className="group relative overflow-hidden bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-blue-500/40 rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-125">
                  {category.emoji}
                </div>
                <h3 className="text-xs font-medium text-gray-300 group-hover:text-white tracking-wide">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* 🍱 BENTO GRID DE DESTACADOS (LAYOUT ASIMÉTRICO PREMIUM) */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Colecciones Exclusivas</h2>
            <p className="text-sm text-gray-400 mt-1">Explora nuestros universos tecnológicos más populares</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* BLOQUE PRINCIPAL (GRANDE): IPHONE 17 PRO MAX */}
            <div className="md:col-span-8 group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900/90 to-black p-6 sm:p-8 flex flex-col justify-between hover:border-blue-500/50 transition-all duration-500 shadow-2xl">
              <div className="z-10 mb-6">
                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/20">
                  Lanzamiento Top
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 group-hover:text-blue-400 transition-colors">
                  iPhone
                </h3>
                <p className="text-sm text-gray-400 mt-2 max-w-md">
                  Protección de grado militar, estuches MagSafe y cargadores rápidos diseñados a la medida.
                </p>
              </div>

              <Link href="/home-iphone" className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl block mb-4">
                <Image
                  src="/IMAGEN-IPHONE-PORTADA.jpg"
                  alt="Accesorios iPhone"
                  fill
                  className="object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
              </Link>

              <div className="flex flex-wrap items-center justify-between gap-4 z-10 pt-2 border-t border-white/5">
                <Link
                  href="/home-iphone"
                  className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  Ver todos los accesorios →
                </Link>
                <a
                  href={URL_WHATSAPP_IPHONE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-black font-semibold text-xs px-5 py-2.5 rounded-full transition-all duration-200 shadow-md"
                >
                  Pedir Kit por WhatsApp
                </a>
              </div>
            </div>

            {/* BLOQUE SECUNDARIO: IPAD PRO */}
            <div className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900/90 to-black p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-500 shadow-2xl">
              <div>
                <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-500/20">
                  Productividad
                </span>
                <h3 className="text-2xl font-bold text-white mt-3 group-hover:text-indigo-400 transition-colors">
                  iPad
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Fundas inteligentes y periféricos para potenciar tu trabajo.
                </p>
              </div>

              <Link href="/home-ipad" className="relative h-48 w-full overflow-hidden rounded-2xl my-4 block">
                <Image
                  src="/IPAD-PORTADA.jpg"
                  alt="iPad Pro"
                  fill
                  className="object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
              </Link>

              <Link
                href="/home-ipad"
                className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors flex items-center justify-between pt-2 border-t border-white/5"
              >
                <span>Explorar línea iPad</span>
                <span>→</span>
              </Link>
            </div>

            {/* BLOQUE INFERIOR IZQUIERDO: DRONES */}
            <div className="md:col-span-6 group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900/90 to-black p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-500 shadow-2xl">
              <div>
                <span className="bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-purple-500/20">
                  Tecnología Aérea
                </span>
                <h3 className="text-2xl font-bold text-white mt-3 group-hover:text-purple-400 transition-colors">
                  Drones
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Equipos de captura con garantía y soporte técnico local.
                </p>
              </div>

              <Link href="/home-drone" className="relative h-52 w-full overflow-hidden rounded-2xl my-4 block">
                <Image
                  src="/DRONE-PORTADA.jpg"
                  alt="Drones"
                  fill
                  className="object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
              </Link>

              <Link
                href="/home-drone"
                className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors flex items-center justify-between pt-2 border-t border-white/5"
              >
                <span>Ver catálogo de Drones</span>
                <span>→</span>
              </Link>
            </div>

            {/* BLOQUE INFERIOR DERECHO: JUGUETES Y DIVERSIÓN */}
            <div className="md:col-span-6 group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900/90 to-black p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-500 shadow-2xl">
              <div>
                <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/20">
                  Lifestyle & Fun
                </span>
                <h3 className="text-2xl font-bold text-white mt-3 group-hover:text-amber-400 transition-colors">
                  Juguetes
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Juguetes interactivos y accesorios para todas las edades.
                </p>
              </div>

              <Link href="/home-juguetes" className="relative h-52 w-full overflow-hidden rounded-2xl my-4 block">
                <Image
                  src="/JUGUETES2.jpg"
                  alt="Juguetes y Gadgets"
                  fill
                  className="object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
              </Link>

              <Link
                href="/home-juguetes"
                className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors flex items-center justify-between pt-2 border-t border-white/5"
              >
                <span>Descubrir Gadgets</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}