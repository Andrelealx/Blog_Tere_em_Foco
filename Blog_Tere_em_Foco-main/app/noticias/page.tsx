"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { NoticiaDTO } from "@/backforge/tipos";

const TODAS = "Todas";

function CategoryBadge({ category }: { category: string }) {
  const intentMap: Record<string, "accent" | "primary" | "neutral"> = {
    Mobilidade: "accent",
    Clima: "accent",
    "Meio Ambiente": "accent",
    Saúde: "accent",
  };
  return (
    <Badge intent={intentMap[category] ?? "neutral"} className="text-[10px]">
      {category}
    </Badge>
  );
}

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<NoticiaDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [activeCategory, setActiveCategory] = useState(TODAS);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelado = false;
    (async () => {
      try {
        const res = await fetch("/api/noticias?limite=50");
        const json = await res.json();
        if (!cancelado && json.ok) setNoticias(json.data.items);
      } catch {
        /* mantém vazio em caso de falha */
      } finally {
        if (!cancelado) setCarregando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  const categorias = useMemo(
    () => [TODAS, ...Array.from(new Set(noticias.map((n) => n.category)))],
    [noticias],
  );

  const filtradas = useMemo(
    () =>
      noticias.filter((n) => {
        const matchCat = activeCategory === TODAS || n.category === activeCategory;
        const matchSearch =
          search.trim() === "" ||
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.excerpt.toLowerCase().includes(search.toLowerCase()) ||
          n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        return matchCat && matchSearch;
      }),
    [noticias, activeCategory, search],
  );

  const destaques = noticias.filter((n) => n.featured);
  const mostrarDestaques = activeCategory === TODAS && search.trim() === "";

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-terra py-14 px-4">
        <div className="section-container">
          <span className="block text-xs font-semibold uppercase tracking-widest text-bruma mb-2">
            Cidade Serrana
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-cume mb-3">
            Notícias de Teresópolis
          </h1>
          <p className="text-bruma text-base max-w-xl leading-relaxed mb-6">
            Fique por dentro do que acontece na cidade: mobilidade, clima, eventos, obras e muito mais.
          </p>
          <div className="relative max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-bruma/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar notícia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-cume placeholder-bruma/40 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>
        </div>
      </section>

      {/* Filtros por categoria */}
      <div className="sticky top-0 z-20 border-b border-black/5 bg-cume/95 backdrop-blur-md dark:border-white/10 dark:bg-ceu/80 shadow-sm">
        <div className="section-container py-2.5 flex gap-2 overflow-x-auto">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
                activeCategory === cat
                  ? "bg-accent text-white shadow-sm"
                  : "text-terra dark:text-bruma hover:bg-nevoa/10",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="section-container py-10">
        {carregando ? (
          <p className="py-20 text-center text-stone-500">Carregando notícias...</p>
        ) : (
          <>
            {/* Destaques */}
            {mostrarDestaques && destaques.length > 0 && (
              <section className="mb-12">
                <h2 className="section-heading mb-6 flex items-center gap-3 text-2xl">
                  <span className="inline-block h-6 w-1 rounded-full bg-accent" />
                  Destaques
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {destaques.map((n) => (
                    <Link key={n.id} href={`/noticia/${n.slug}`}>
                      <article className="group relative h-72 overflow-hidden rounded-2xl border border-white/10 bg-terra transition-all duration-300 hover:-translate-y-1 hover:shadow-soft cursor-pointer">
                        <Image
                          src={n.image}
                          alt={n.title}
                          fill
                          className="object-cover opacity-40 transition-all duration-500 group-hover:scale-105 group-hover:opacity-55"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-terra via-terra/60 to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                          <CategoryBadge category={n.category} />
                          <h3 className="font-display text-xl text-cume mt-2 mb-2 leading-snug">{n.title}</h3>
                          <p className="line-clamp-2 text-sm text-bruma/80">{n.excerpt}</p>
                          <div className="mt-3 flex items-center gap-2 text-xs text-bruma/60">
                            <span>{formatDate(n.publishedAt)}</span>
                            <span>·</span>
                            <span>{n.readTime} de leitura</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Lista */}
            <section>
              {!mostrarDestaques && (
                <p className="mb-6 text-sm text-stone-500 dark:text-stone-400">
                  {filtradas.length} {filtradas.length === 1 ? "resultado" : "resultados"} encontrados
                </p>
              )}

              {filtradas.length === 0 ? (
                <div className="py-20 text-center text-stone-500">
                  <p>Nenhuma notícia encontrada.</p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setActiveCategory(TODAS);
                    }}
                    className="mt-3 text-sm text-accent underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-black/5 dark:divide-white/8">
                  {filtradas.map((n) => (
                    <Link key={n.id} href={`/noticia/${n.slug}`}>
                      <article className="group -mx-4 cursor-pointer rounded-xl px-4 py-5 transition-colors hover:bg-nevoa/5">
                        <div className="flex gap-5">
                          <div className="hidden h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl sm:block">
                            <Image
                              src={n.image}
                              alt={n.title}
                              width={112}
                              height={80}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <CategoryBadge category={n.category} />
                              <span className="text-xs text-stone-400">{formatDate(n.publishedAt)}</span>
                              <span className="text-xs text-stone-400">· {n.readTime}</span>
                            </div>
                            <CardTitle className="mb-1 text-lg leading-snug group-hover:text-accent transition-colors">
                              {n.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">{n.excerpt}</CardDescription>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {n.tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-nevoa/10 px-2 py-0.5 text-xs text-nevoa dark:text-bruma">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
