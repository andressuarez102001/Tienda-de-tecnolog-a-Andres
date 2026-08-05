// src/app/home-drone/page.tsx
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
    id: "drone-1",
    name: "Drone ALPHA 4K Pro",
    description: "Drone profesional con cámara 4K Ultra HD y estabilización gimbal",
    price: 105000,
    imageSrc: "/DRONE-1.jpg",
    category: "Drones 4K",
  },
  {
    id: "drone-2",
    name: "Drone ALPHA 2K Auto-Return",
    description: "Drone de alta precisión con GPS y función de retorno automático",
    price: 89000,
    imageSrc: "/DRONE-2.jpg",
    category: "Drones 2K",
  },
  {
    id: "control-drone",
    name: "Controlador de Drone Pro",
    description: "Controlador ergonómico con soporte para smartphone y transmisión HD",
    price: 45000,
    imageSrc: "/CONTROL-DRONE.jpg",
    category: "Periféricos",
  },
];

const MI_TELEFONO = "573003256891";

export default function HomeDronePage() {
  const getWhatsAppLink = (productName: string, productPrice: number) => {
    const precioFormateado = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(productPrice);

    const mensaje = encodeURIComponent(
      `Hola ShenzhenStock! Quisiera información y disponibilidad sobre el equipo de Drones: ${productName} (${precioFormateado}).`
    );
    return `https://wa.me/${MI_TELEFONO}?text=${mensaje}`;
  };

  return (
    <main className="relative min-h-screen bg-[#08080a] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-purple-500 selection:text-white overflow-hidden">
      {/* 🌌 AMBIENT GLOW PURPLE / NEÓN */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-purple-600/15 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ENCABEZADO Y NAVEGACIÓN */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-purple-400 transition-colors mb-6 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
          >
            ← Volver al Inicio
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                Tecnología Aérea & Filming
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-3">
                Drones & Accesorios de Grabación
              </h1>
              <p className="text-gray-400 text-sm sm:text-base font-normal max-w-xl mt-2">
                Equipos de alta resolución, sensores de vuelo seguro y controladores de precisión con garantía y soporte técnico local.
              </p>
            </div>

            <div className="text-xs text-gray-400 bg-white/[0.02] border border-white/[0.06] px-4 py-2.5 rounded-xl self-start md:self-auto">
              Soporte y Garantía: <span className="text-white font-bold">Incluidos</span>
            </div>
          </div>
        </div>

        {/* GRILLA PREMIUM DE PRODUCTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-purple-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl group"
            >
              <div>
                {/* Contenedor de Imagen */}
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

                {/* Badge Disponibilidad */}
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 tracking-wider uppercase mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Disponible
                </span>

                {/* Textos */}
                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-purple-400 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1.5 font-normal leading-relaxed line-clamp-2">
                  {product.description}
                </p>
              </div>

              {/* Precio y Botones de Acción */}
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

                <a
                  href={getWhatsAppLink(product.name, product.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold py-2.5 px-4 rounded-full transition-all duration-300 shadow-md shadow-purple-500/20 hover:scale-105 flex items-center gap-1.5"
                >
                  <span>Pedir</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}