// src/app/productos-top/page.tsx
import Image from "next/image";

const FEATURED_PRODUCTS = [
  {
    id: "funda-ipad-pro",
    name: "funda iPad Pro",
    description: "Funda Premium con tecnología MagSafe",
    price: 35000,
    imageSrc: "/FUNDA-IPAD-PRO.jpg",
  },
  {
    id: "funda-ipad-pro-negra",
    name: "Funda iPad Pro Negra",
    description: "Funda Premium con tecnología MagSafe",
    price: 85000,
    imageSrc: "/FUNDA-IPAD-1.jpg",
  },


  {
    id: "funda-ipad-pro",
    name: "Funda iPad Pro",
    description: "Funda Premium con tecnología MagSafe",
    price: 85000,
    imageSrc: "/FUNDA-IPAD-2.jpg",
  },

{
    id: "cargador-ipad-pro",
    name: "Cargador iPad Pro",
    description: "Cargador rápido con tecnología MagSafe",
    price: 15000,
    imageSrc: "/CARGADOR-IPAD-PRO.jpg",
  },


{
    id: "funda-ipad-pro",
    name: "Funda iPad Pro",
    description: "Funda Premium con tecnología MagSafe",
    price: 85000,
    imageSrc: "/FUNDA-IPAD-3.jpg",
  },












];

export default function ProductosTopPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 bg-black min-h-screen">
      
      {/* ENCABEZADO ESTILO APPLE */}
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white tracking-tight leading-tight">
          Catálogo de Productos Exclusivos para tus Dispositivos iPad!
        </h1>
        <p className="text-gray-400 text-base md:text-lg font-light max-w-xl">
          Equipamiento premium seleccionado para tus dispositivos.
        </p>
      </div>

      {/* GRILLA PREMIUM DE PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURED_PRODUCTS.map((product) => (
          <div 
            key={product.id} 
            className="bg-[#121212] border border-white/[0.02] rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:bg-[#1c1c1e] hover:scale-[1.02] group cursor-pointer"
          >
            <div>
              {/* Contenedor de Imagen: Ahora se integra de forma fluida y elegante */}
              <div className="w-full h-64 relative overflow-hidden rounded-2xl mb-6 bg-[#f5f5f7] flex justify-center items-center transition-transform duration-500 group-hover:scale-[1.01]">
                <Image 
                  src={product.imageSrc}
                  alt={product.name}
                  width={400}        
                  height={400}
                  className="w-full h-full object-contain p-4 mix-blend-multiply" 
                />
              </div>

              {/* Etiqueta sutil superior opcional (Estilo "Nuevo") */}
              <span className="text-[11px] font-medium text-blue-500 tracking-wider uppercase block mb-1">
                Disponible
              </span>

              {/* Textos del Producto */}
              <h4 className="text-xl font-semibold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                {product.name}
              </h4>
              <p className="text-sm text-gray-400 mt-2 font-light leading-relaxed">
                {product.description}
              </p>
            </div>
            
            {/* Precio y Botón de Acción Estilo Apple */}
            <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center justify-between">
              <span className="text-xl font-medium text-gray-200">
                {new Intl.NumberFormat('es-CO', { 
                  style: 'currency', 
                  currency: 'COP', 
                  maximumFractionDigits: 0 
                }).format(product.price)}
              </span>
              
              <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-2 px-4 rounded-full transition-colors tracking-wide">
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}