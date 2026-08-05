// src/app/home-iphone/page.tsx
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageSrc: string;
  category?: string;
}

const FEATURED_PRODUCTS: Product[] = [
  {
    id: "funda-iphone-17",
    name: "Funda iPhone 17 Pro Max",
    description: "Funda Premium con tecnología MagSafe y bordes reforzados",
    price: 23000,
    imageSrc: "/FUNDA-IPHONE-17.jpg",
    category: "iPhone 17",
  },
  {
    id: "funda-iphone-14-roja",
    name: "Funda iPhone 14 Roja",
    description: "Funda Premium Silicona Soft Touch con MagSafe",
    price: 20000,
    imageSrc: "/FUNDA-IPHONE-14-ROJA.jpg",
    category: "iPhone 14",
  },
  {
    id: "funda-iphone-14-transparente",
    name: "Funda iPhone 14 Transparente",
    description: "Case cristalino de alta resistencia anti-amarillamiento",
    price: 19000,
    imageSrc: "/FUNDA-IPHONE-14-TRANSPARENTE.jpg",
    category: "iPhone 14",
  },
  {
    id: "cargador-iphone",
    name: "Cargador Rápido iPhone",
    description: "Adaptador de corriente USB-C de carga ultra rápida 20W",
    price: 45000,
    imageSrc: "/CARGADOR-IPHONE.jpg",
    category: "Energía",
  },
  {
    id: "funda-iphone-14-normal",
    name: "Funda iPhone 14 Black",
    description: "Funda Premium mate con agarre antideslizante",
    price: 20000,
    imageSrc: "/FUNDA-IPHONE-14.jpg",
    category: "iPhone 14",
  },
  {
    id: "funda-iphone-16-rosada",
    name: "Funda iPhone 16 Rosada",
    description: "Funda Premium con tecnología MagSafe edición pastel",
    price: 21000,
    imageSrc: "/FUNDA-IPHONE-16-ROSA.jpg",
    category: "iPhone 16",
  },
];

export default function HomeIphonePage() {
  return (
    <main className="relative min-h-screen bg-[#08080a] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white overflow-hidden">
      {/* 🌌 FONDO AMBIENTAL CON GLOW AZUL/MANZANA */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* NAVEGACIÓN Y ENCABEZADO */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-blue-400 transition-colors mb-6 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
          >
            ← Volver al Inicio
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Ecosistema Apple
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-3">
                Accesorios para iPhone
              </h1>
              <p className="text-gray-400 text-sm sm:text-base font-normal max-w-xl mt-2">
                Fundas MagSafe, cargadores ultra rápidos y accesorios diseñados exclusivamente para proteger y potenciar tu dispositivo.
              </p>
            </div>

            <div className="text-xs text-gray-400 bg-white/[0.02] border border-white/[0.06] px-4 py-2.5 rounded-xl self-start md:self-auto">
              Modelos compatibles: <span className="text-white font-bold">iPhone 14 / 16 / 17 Pro Max</span>
            </div>
          </div>
        </div>

        {/* GRILLA PREMIUM DE PRODUCTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-blue-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl group"
            >
              <Link href={`/producto/${product.id}`} className="flex flex-col flex-1 cursor-pointer">
                <div>
                  {/* Contenedor de Imagen con gradiente oscuro en lugar de blanco */}
                  <div className="w-full h-60 relative overflow-hidden rounded-2xl mb-4 bg-gradient-to-b from-gray-900/60 to-black/80 border border-white/5 flex justify-center items-center">
                    <Image
                      src={product.imageSrc}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.category && (
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-gray-300 text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
                        {product.category}
                      </span>
                    )}
                  </div>

                  {/* Badge de Disponibilidad */}
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 tracking-wider uppercase mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    En Stock
                  </span>

                  {/* Título y Descripción */}
                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1.5 font-normal leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </Link>

              {/* Precio y Botón de Acción */}
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Precio</span>
                  <span className="text-base font-bold text-white tracking-tight">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    }).format(product.price)}
                  </span>
                </div>

                <Link
                  href={`/producto/${product.id}`}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold py-2.5 px-5 rounded-full transition-all duration-300 shadow-md shadow-blue-500/20 hover:scale-105 flex items-center gap-1.5"
                >
                  <span>Ver Detalle</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}