// 1. SECCIÓN DE IMPORTACIONES (HERRAMIENTAS)
import Image from "next/image";

// 2. ESTRUCTURA DE DATOS (NOVEDADES DEL MERCADO)
const NEW_ARRIVALS = [
  {
    id: "bateria-portatil-20000mah",
    name: "Batería Portátil 20000mAh",
    description: "Carga rápida y eficiente para mantener tu dispositivo energizado en todo momento.",
    price: 45000,
    imageSrc: "/BATERIA-SOLAR.jpg",
    isHot: true,
  },
  {
    id: "extensor-enchufe-inteligente",
    name: "Extensor de Enchufe Inteligente",
    description: "Controla tu hogar desde cualquier lugar con este extensor inteligente.",
    price: 80000,
    imageSrc: "/EXTENSOR-ENCHUFE-PARED.jpg",
    isHot: false,
  },
  {
    id: "gafas-realidad-virtual",
    name: "Gafas de Realidad Virtual 3D",
    description: "Inmersión total en entornos virtuales con alta resolución y latencia baja.",
    price: 120000,
    imageSrc: "/GAFAS-VR.jpg",
    isHot: false,
  },
  {
    id: "inflador-portatil-12v",
    name: "Inflador Portátil 12V",
    description: "Infla rápidamente los neumáticos de tu vehículo con este inflador portátil.",
    price: 30000,
    imageSrc: "/INFLADOR-PSI.jpg",
    isHot: false,
  },
  {
    id: "tripode-para-celular",
    name: "Tripode para Celular",
    description: "Estabiliza tu cámara y toma fotos perfectas con este tripode ajustable.",
    price: 25000,
    imageSrc: "/TRIPODE.jpg",
    isHot: false,
  }
];


// 3. COMPONENTE DE LA INTERFAZ (DISEÑO VISUAL)


export default function ProductosRecientesPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 bg-black min-h-screen relative overflow-hidden">
      
      {/* DECORACIÓN PREMIUM DE FONDO (Destello sutil estilo Apple) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* ENCABEZADO DE LA PÁGINA */}
      <div className="mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-4">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-medium text-blue-400 tracking-wider uppercase">
            Último Ingreso
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white tracking-tight leading-tight">
          Recién Llegados al Mercado
        </h1>
        <p className="text-gray-400 text-base md:text-lg font-light max-w-xl">
          Explora los últimos dispositivos y accesorios tecnológicos de gama alta que acaban de aterrizar en nuestra bodega.
        </p>
      </div>

      {/* GRILLA PREMIUM DE NOVEDADES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {NEW_ARRIVALS.map((product) => (
          <div 
            key={product.id} 
            className="bg-[#121212] border border-white/[0.02] rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:bg-[#1c1c1e] hover:scale-[1.02] group cursor-pointer"
          >
            <div>
              {/* Contenedor de la Imagen */}
              <div className="w-full h-64 relative overflow-hidden rounded-2xl mb-6 bg-[#f5f5f7] flex justify-center items-center transition-transform duration-500 group-hover:scale-[1.01]">
                <Image 
                  src={product.imageSrc}
                  alt={product.name}
                  width={400}        
                  height={400}
                  className="w-full h-full object-contain p-4 mix-blend-multiply" 
                />
                
                {/* Etiqueta flotante condicional (React evalúa si el producto es Tendencia) */}
                {product.isHot && (
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-lg">
                    Tendencia
                  </span>
                )}
              </div>

              {/* Marca sutil */}
              <span className="text-[11px] font-medium text-blue-500 tracking-wider uppercase block mb-1">
                Nuevo Lanzamiento
              </span>

              {/* Título y Descripción */}
              <h4 className="text-xl font-semibold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                {product.name}
              </h4>
              <p className="text-sm text-gray-400 mt-2 font-light leading-relaxed">
                {product.description}
              </p>
            </div>
            
            {/* Sección de Precio y Botón de Compra */}
            <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center justify-between">
              <span className="text-xl font-medium text-gray-200">
                {new Intl.NumberFormat('es-CO', { 
                  style: 'currency', 
                  currency: 'COP', 
                  maximumFractionDigits: 0 
                }).format(product.price)}
              </span>
              
              <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-2 px-5 rounded-full transition-colors tracking-wide shadow-md">
                Adquirir
              </button>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}