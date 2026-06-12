import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16">

        <h2 className="text-5xl font-bold mb-6">
          Bienvenido a TecnoStore
        </h2>

        <p className="text-xl text-gray-600 mb-10">
          Encuentra cargadores, cables, fundas, audífonos y accesorios tecnológicos al mejor precio.
        </p>



        <Link href="/fundas">
  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
    Ver Productos
  </button>
</Link>



        {/* Banner de Portada */}
        <div className="w-full overflow-hidden rounded-2xl shadow-lg mt-6 mb-12">
          <Image 
            src="/IMAGEN-IPHONE-PORTADA.jpg"
            alt="Accesorios tecnológicos TecnoStore"
            width={1200}
            height={500}
            className="w-full h-auto object-cover"
          />
        </div>

        <h3 className="text-3xl font-bold mb-8 text-gray-800">
          Productos Destacados
        </h3>

        {/* LA REJILLA (GRID) SE ABRE AQUÍ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          
          {/* PRODUCTO 1: Ahora está ADENTRO de la rejilla */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            
            {/* Contenedor de la foto */}
            <div className="w-full h-48 relative overflow-hidden rounded-lg mb-4 bg-gray-100 flex justify-center items-center">
              <Image 
                src="/CARGADOR-20W.jpg"
                alt="Cargador Tipo C 20W"
                width={300}        
                height={300}
                className="w-full h-full object-contain p-2" 
              />
            </div>

            {/* Información del producto debajo de la foto */}
            <h4 className="font-semibold text-lg text-gray-800">Cargador Tipo C 20W</h4>
            <p className="text-sm text-gray-500 mb-2">Carga rápida para iPhone y Android</p>
            <span className="text-xl font-bold text-blue-600">$45.000</span>

          </div>

          {/* Si quieres poner más productos en el futuro, los pegas justo AQUÍ abajo, antes de cerrar el div de la rejilla */}

        </div> {/* LA REJILLA SE CIERRA AQUÍ */}

      </main>

      <Footer />
    </>
  );
}