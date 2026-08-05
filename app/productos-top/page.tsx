// src/app/productos-top/page.tsx
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
    description: "Funda Premium con tecnología MagSafe",
    price: 25000,
    imageSrc: "/FUNDA-IPHONE-17.jpg",
    category: "Fundas & Protección",
  },
  {
    id: "funda-ipad-pro",
    name: "Funda iPad Pro",
    description: "Funda Premium con tecnología MagSafe y soporte magnético",
    price: 30000,
    imageSrc: "/FUNDA-IPAD-PRO.jpg",
    category: "Accesorios iPad",
  },
  {
    id: "airpods",
    name: "AirPods Pro 2",
    description: "Audífonos inalámbricos con cancelación activa de ruido",
    price: 105000,
    imageSrc: "/AIRPODS.jpg",
    category: "Audio",
  },
  {
    id: "binoculares",
    name: "Binoculares 10x42",
    description: "Binoculares de alta definición para observación detallada",
    price: 55000,
    imageSrc: "/BINOCULARES.jpg",
    category: "Óptica",
  },
  {
    id: "camara-gopro",
    name: "Cámara GoPro Hero 11",
    description: "Cámara de acción de alta gama para aventuras y deportes",
    price: 180000,
    imageSrc: "/CAMARA-GO-PRO.jpg",
    category: "Video & Acción",
  },
  {
    id: "diadema-gamer-1",
    name: "Diadema Gamer Pro 1",
    description: "Headset gamer con micrófono aislante y sonido envolvente 7.1",
    price: 40000,
    imageSrc: "/DIADEMA-GAMER-1.jpg",
    category: "Gaming",
  },
  {
    id: "herramienta-celular",
    name: "Herramienta de Precisión",
    description: "Herramienta multifuncional para reparación de microelectrónica",
    price: 32000,
    imageSrc: "/HERRAMIENTA-CELULAR.jpg",
    category: "Herramientas",
  },
  {
    id: "diadema-gamer-2",
    name: "Diadema Gamer Pro 2",
    description: "Diadema de juego con iluminación RGB y audio inmersivo",
    price: 45000,
    imageSrc: "/DIADEMA-GAMER-2.jpg",
    category: "Gaming",
  },
  {
    id: "intercomunicador-1",
    name: "Intercomunicador R1",
    description: "Intercomunicador Bluetooth de alta calidad para casco",
    price: 45000,
    imageSrc: "/INTERCOMUNICADOR-1.jpg",
    category: "Comunicación",
  },
  {
    id: "kit-herramientas",
    name: "Kit de Herramientas Master",
    description: "Set completo de precisión para desarme y reparación de dispositivos",
    price: 70000,
    imageSrc: "/KIT-HERRAMIENTA.jpg",
    category: "Herramientas",
  },
  {
    id: "intercomunicador-2",
    name: "Intercomunicador R2 Pro",
    description: "Intercomunicador con cancelación de ruido de viento",
    price: 55000,
    imageSrc: "/INTERCOMUNICADOR-2.jpg",
    category: "Comunicación",
  },
  {
    id: "mause-gamer-1",
    name: "Mouse Gamer Ultra",
    description: "Mouse ergonómico con sensor óptico de alta precisión",
    price: 32000,
    imageSrc: "/MAUSE.jpg",
    category: "Gaming",
  },
  {
    id: "teclado-gamer-1",
    name: "Teclado Mecánico Gamer",
    description: "Teclado mecánico con switches de rápida respuesta e iluminación",
    price: 65000,
    imageSrc: "/TECLADO.jpg",
    category: "Gaming",
  },
  {
    id: "trimmer",
    name: "Trimmer Eléctrico Pro",
    description: "Corta pelo y patillero de alta potencia para corte preciso",
    price: 67000,
    imageSrc: "/TRIMMER.jpg",
    category: "Cuidado Personal",
  },
];

const MI_TELEFONO = "573003256891";

export default function ProductosTopPage() {
  // Función helper para generar el link de WhatsApp dinámico según el producto
  const getWhatsAppLink = (productName: string, productPrice: number) => {
    const precioFormateado = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(productPrice);

    const mensaje = encodeURIComponent(
      `Hola ShenzhenStock! Me interesa comprar el producto: ${productName} por valor de ${precioFormateado}. ¿Tienen disponibilidad para envío inmediato?`
    );
    return `https://wa.me/${MI_TELEFONO}?text=${mensaje}`;
  };

  return (
    <main className="relative min-h-screen bg-[#08080a] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white overflow-hidden">
      {/* 🌌 AMBIENT GLOW BACKGROUND */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* NAVEGACIÓN DE REGRESO Y HEADING */}
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
                Selección Exclusiva
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-3">
                Productos TOP Destacados
              </h1>
              <p className="text-gray-400 text-sm sm:text-base font-normal max-w-xl mt-2">
                Los accesorios y dispositivos más solicitados con garantía, tecnología avanzada y entrega inmediata.
              </p>
            </div>

            <div className="text-xs text-gray-400 bg-white/[0.02] border border-white/[0.06] px-4 py-2.5 rounded-xl self-start md:self-auto">
              Mostrando <span className="text-white font-bold">{FEATURED_PRODUCTS.length}</span> ítems disponibles
            </div>
          </div>
        </div>

        {/* GRILLA PREMIUM DE PRODUCTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-blue-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl group"
            >
              <div>
                {/* Contenedor de Imagen Optimizado con fondo neutro oscuro */}
                <div className="w-full h-56 relative overflow-hidden rounded-2xl mb-4 bg-gradient-to-b from-gray-900/60 to-black/80 border border-white/5 flex justify-center items-center">
                  <Image
                    src={product.imageSrc}
                    alt={product.name}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Badge de Categoría sobre la foto */}
                  {product.category && (
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-gray-300 text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Status Disponibilidad */}
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 tracking-wider uppercase mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Disponible
                </span>

                {/* Título y Descripción */}
                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1.5 font-normal leading-relaxed line-clamp-2">
                  {product.description}
                </p>
              </div>

              {/* Precio y Botón de Compra Directo a WhatsApp */}
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Precio Final</span>
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
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold py-2.5 px-4 rounded-full transition-all duration-300 shadow-md shadow-blue-500/20 hover:scale-105 flex items-center gap-1.5"
                >
                  <span>Comprar</span>
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