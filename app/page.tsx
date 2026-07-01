import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16">

       <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">

  <div>

    <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
      Tecnología • Calidad • Garantía
    </span>

    <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
      Accesorios tecnológicos para llevar tu experiencia al siguiente nivel.
    </h1>

    <p className="text-xl text-gray-600 mb-10 leading-8">
      Encuentra cargadores, cables, fundas y accesorios cuidadosamente seleccionados para ofrecer calidad, diseño y el mejor precio.
    </p>

    <div className="flex gap-4 flex-wrap">

      <Link href="/fundas">
        <button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 text-white px-8 py-4 rounded-xl shadow-lg font-semibold">
          Ver Productos
        </button>
      </Link>

      <button className="border border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 px-8 py-4 rounded-xl font-semibold">
        Contáctanos
      </button>

    </div>

  </div>

  <div className="overflow-hidden rounded-3xl shadow-2xl">

    <Image
      src="/IMAGEN-IPHONE-PORTADA.jpg"
      alt="Accesorios tecnológicos TecnoStore"
      width={1200}
      height={800}
      className="w-full h-full object-cover"
    />

  </div>

</section>



      {/* Categorías */}

<section className="mb-20">

  <h2 className="text-4xl font-bold text-center text-gray-900 mb-3">
    Explora nuestras categorías
  </h2>

  <p className="text-center text-gray-500 mb-10">
    Encuentra rápidamente el accesorio que estás buscando.
  </p>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 text-center cursor-pointer">
      <div className="text-5xl mb-4">🔌</div>
      <h3 className="font-semibold">Cargadores</h3>
    </div>

    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 text-center cursor-pointer">
      <div className="text-5xl mb-4">🔋</div>
      <h3 className="font-semibold">Power Banks</h3>
    </div>

    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 text-center cursor-pointer">
      <div className="text-5xl mb-4">🔌</div>
      <h3 className="font-semibold">Cables</h3>
    </div>

    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 text-center cursor-pointer">
      <div className="text-5xl mb-4">📱</div>
      <h3 className="font-semibold">Fundas</h3>
    </div>

    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 text-center cursor-pointer">
      <div className="text-5xl mb-4">🎧</div>
      <h3 className="font-semibold">Audífonos</h3>
    </div>

    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 text-center cursor-pointer">
      <div className="text-5xl mb-4">🛡️</div>
      <h3 className="font-semibold">Vidrios Templados</h3>
    </div>

  </div>

</section>






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