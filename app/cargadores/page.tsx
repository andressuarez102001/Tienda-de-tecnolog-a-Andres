// src/app/cargadores/page.tsx
import Image from "next/image";

export default function CargadoresPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6 text-white">
        Cargadores
      </h1>
      <p className="text-gray-400 mb-12">
        Carga rápida y eficiente para tus dispositivos.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <p className="text-sm text-gray-500 italic">Próximamente más modelos...</p>
      </div>
    </main>
  );
}