import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import { NOTICIAS, buscarNoticia } from '../noticias';

type Props = {
  readonly params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return NOTICIAS.map((noticia) => ({ id: noticia.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const noticia = buscarNoticia(id);

  if (!noticia) {
    return { title: 'Noticia no encontrada | ShenzhenStock' };
  }

  return {
    title: `${noticia.titulo} | ShenzhenStock`,
    description: noticia.descripcion,
  };
}

export default async function NoticiaPage({ params }: Props) {
  const { id } = await params;
  const noticia = buscarNoticia(id);

  if (!noticia) {
    notFound();
  }

  const relacionadas = NOTICIAS.filter((otra) => otra.id !== noticia.id).slice(0, 3);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] px-4 pb-24 pt-24 text-white sm:px-6 sm:pt-32 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[1000px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[160px]" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl">
        <Link
          href="/novedades"
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 transition-colors hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Volver a novedades
        </Link>

        <div
          className={`relative mt-6 h-64 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br shadow-2xl sm:h-80 ${noticia.degradado}`}
        >
          <Image
            src={noticia.imagenes[0].src}
            alt={noticia.imagenes[0].alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
          <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
            {noticia.categoria}
          </span>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
            <span className="max-w-md text-[11px] font-semibold leading-relaxed text-white/75">
              {noticia.imagenes[0].pie}
            </span>
            <span className="shrink-0 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white/60 backdrop-blur-md">
              Imagen editorial
            </span>
          </div>
        </div>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <time
              dateTime={noticia.fechaISO}
              className="text-[11px] font-bold uppercase tracking-widest text-gray-500"
            >
              {noticia.fecha}
            </time>
            <span className="h-1 w-1 rounded-full bg-gray-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-300">
              {noticia.categoria}
            </span>
            <span className="h-1 w-1 rounded-full bg-gray-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
              {noticia.minutosLectura} min de lectura
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {noticia.titulo}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-gray-400 sm:text-lg">
            {noticia.descripcion}
          </p>
        </header>

        <aside
          aria-labelledby="claves"
          className="mt-8 rounded-3xl border border-blue-500/20 bg-blue-500/[0.04] p-5 sm:p-6"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            <h2
              id="claves"
              className="text-[11px] font-bold uppercase tracking-widest text-blue-300"
            >
              Claves para entender la noticia
            </h2>
          </div>
          <ul className="mt-4 space-y-3">
            {noticia.puntosClave.map((punto) => (
              <li key={punto} className="flex gap-3 text-sm leading-6 text-gray-300">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400/80"
                />
                <span>{punto}</span>
              </li>
            ))}
          </ul>
        </aside>

        <article className="mt-10 space-y-5 border-t border-white/10 pt-8 text-sm leading-8 text-gray-300 sm:text-base">
          {noticia.contenido.map((parrafo, indice) => (
            <Fragment key={indice}>
              <p>{parrafo}</p>
              {(indice === 1 || indice === 3) && (
                <figure className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
                  <div
                    className={`relative aspect-[16/9] w-full bg-gradient-to-br ${noticia.degradado}`}
                  >
                    <Image
                      src={noticia.imagenes[indice === 1 ? 1 : 2].src}
                      alt={noticia.imagenes[indice === 1 ? 1 : 2].alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 896px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                  <figcaption className="flex items-start gap-2.5 px-4 py-3 text-[11px] leading-relaxed text-gray-400">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400/80"
                    />
                    <span>
                      <span className="font-bold uppercase tracking-widest text-blue-300">
                        Ilustración editorial ·{' '}
                      </span>
                      {noticia.imagenes[indice === 1 ? 1 : 2].pie}
                    </span>
                  </figcaption>
                </figure>
              )}
            </Fragment>
          ))}
        </article>

        <figure className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 sm:p-8">
          <span
            aria-hidden="true"
            className="block text-4xl font-black leading-none text-blue-400/40"
          >
            “
          </span>
          <blockquote className="mt-2 text-lg font-medium leading-relaxed text-gray-200 sm:text-xl">
            {noticia.cita.texto}
          </blockquote>
          <figcaption className="mt-4 text-[11px] font-bold uppercase tracking-widest text-blue-300">
            — {noticia.cita.autor}
          </figcaption>
        </figure>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-widest text-gray-500">
              Sigue explorando
            </span>
            <p className="mt-1 text-sm text-gray-300">
              Hay más noticias de tecnología esperando por ti.
            </p>
          </div>
          <Link
            href="/novedades"
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2.5 text-xs font-bold text-blue-300 transition-all hover:border-blue-400/50 hover:bg-blue-500/20 hover:text-blue-200"
          >
            Ver todas las novedades
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <section aria-labelledby="relacionadas" className="relative mx-auto mt-16 max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-300">
              También te puede interesar
            </span>
            <h2 id="relacionadas" className="mt-2 text-2xl font-extrabold tracking-tight text-white">
              Más novedades
            </h2>
          </div>
          <Link
            href="/novedades"
            className="text-xs font-semibold text-gray-400 transition-colors hover:text-white"
          >
            Ver todas →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {relacionadas.map((otra) => (
            <Link
              key={otra.id}
              href={`/novedades/${otra.id}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_18px_50px_-20px_rgba(59,130,246,0.45)]"
            >
              <div className={`relative h-28 overflow-hidden bg-gradient-to-br ${otra.degradado}`}>
                <Image
                  src={otra.imagenes[0].src}
                  alt={otra.imagenes[0].alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                  {otra.categoria}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <time dateTime={otra.fechaISO} className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {otra.fecha}
                  </time>
                  <span className="h-0.5 w-0.5 rounded-full bg-gray-700" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                    {otra.minutosLectura} min
                  </span>
                </div>
                <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-white transition-colors group-hover:text-blue-200">
                  {otra.titulo}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
