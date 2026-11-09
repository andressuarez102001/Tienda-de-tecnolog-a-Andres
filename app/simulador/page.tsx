import type { Metadata } from 'next';
import CalculadoraImportacion from '@/components/CalculadoraImportacion';

export const metadata: Metadata = {
  title: 'Simulador de Importación B2B | ShenChen Store',
  description:
    'Calcula en tiempo real los costos logísticos de importar productos desde China a Colombia.',
};

export default function SimuladorPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] px-4 pb-24 pt-32 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-300">
            Herramienta de comercio internacional
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Simulador de Importación B2B - ShenChen Store
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
            Calcula los costos logísticos de importar productos desde China a Colombia.
            Ajusta el volumen de compra y compara el flete marítimo con el aéreo para
            conocer el costo total antes de negociar.
          </p>
        </header>

        <CalculadoraImportacion />
      </div>
    </main>
  );
}
