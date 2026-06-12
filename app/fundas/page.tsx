// src/app/fundas/page.tsx
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function FundasPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Fundas para Celular
        </h1>
        <p className="text-gray-600 mb-12">
          Protección con estilo para tu dispositivo.
        </p>

        {/* Aquí puedes armar otra rejilla para tus fundas cuando quieras */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <p className="text-sm text-gray-400 italic">Próximamente más modelos...</p>
        </div>
      </main>
      <Footer />
    </>
  );
}