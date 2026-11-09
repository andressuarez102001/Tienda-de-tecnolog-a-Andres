import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { NOTICIAS } from './noticias';

export const metadata: Metadata = {
  title: 'Novedades de tecnología | ShenzhenStock',
  description:
    'Noticias, filtraciones y tendencias sobre gaming, inteligencia artificial, hardware y consolas.',
};

export default function NovedadesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] px-4 pb-24 pt-24 text-white sm:px-6 sm:pt-32 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[1000px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[160px]" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-12 max-w-3xl sm:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-300">
            Actualidad tecnológica
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Novedades que marcan el{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">
              futuro
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
            Filtraciones, lanzamientos y movimientos clave en gaming, inteligencia
            artificial, hardware y consolas. Una selección editorial para estar un paso
            adelante.
          </p>
        </header>

        <section
          aria-label="Últimas noticias de tecnología"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {NOTICIAS.map((noticia) => (
            <article
              key={noticia.id}
              id={noticia.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/40 hover:shadow-[0_24px_70px_-20px_rgba(59,130,246,0.45)]"
            >
              <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${noticia.degradado}`}>
                <Image
                  src={noticia.imagenes[0].src}
                  alt={noticia.imagenes[0].alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/15" />
                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                  {noticia.categoria}
                </span>
                <span className="absolute bottom-3 right-3 rounded-full border border-white/15 bg-black/35 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white/60 backdrop-blur-md">
                  Imagen editorial
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <time
                    dateTime={noticia.fechaISO}
                    className="text-[11px] font-semibold uppercase tracking-widest text-gray-500"
                  >
                    {noticia.fecha}
                  </time>
                  <span className="h-0.5 w-0.5 rounded-full bg-gray-700" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">
                    {noticia.minutosLectura} min
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-bold leading-snug text-white transition-colors group-hover:text-blue-200">
                  {noticia.titulo}
                </h2>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-400">
                  {noticia.descripcion}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  <Link
                    href={`/novedades/${noticia.id}`}
                    aria-label={`Leer artículo: ${noticia.titulo}`}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-300 transition-all duration-300 hover:border-blue-400/50 hover:bg-blue-500/20 hover:text-blue-200"
                  >
                    Leer artículo
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                    ShenzhenStock
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
