"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OpcaoLazerDTO } from "@/backforge/tipos";

const TODOS = "Todos";
const LIMITE = 9;

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  return (
    <div className="relative h-52 overflow-hidden bg-nevoa group/gal">
      <Image
        src={images[current]}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover/gal:scale-105 opacity-85 group-hover/gal:opacity-100"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrent((p) => (p - 1 + images.length) % images.length);
            }}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-accent text-white text-sm flex items-center justify-center opacity-0 group-hover/gal:opacity-100 transition-all"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrent((p) => (p + 1) % images.length);
            }}
            aria-label="Próxima foto"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-accent text-white text-sm flex items-center justify-center opacity-0 group-hover/gal:opacity-100 transition-all"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

export default function LazerPage() {
  const [itens, setItens] = useState<OpcaoLazerDTO[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [categoria, setCategoria] = useState(TODOS);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    const params = new URLSearchParams();
    params.set("pagina", String(pagina));
    params.set("limite", String(LIMITE));
    if (categoria !== TODOS) params.set("categoria", categoria);
    if (busca.trim()) params.set("q", busca.trim());

    try {
      const res = await fetch(`/api/lazer?${params.toString()}`);
      const json = await res.json();
      if (json.ok) {
        setItens(json.data.items);
        setTotal(json.data.total);
        setTotalPaginas(json.data.totalPaginas);
        setCategorias(json.data.filtros?.categorias ?? []);
      }
    } catch {
      /* mantém estado atual em caso de falha */
    } finally {
      setCarregando(false);
    }
  }, [pagina, categoria, busca]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function trocarCategoria(nova: string) {
    setCategoria(nova);
    setPagina(1);
  }

  function buscar(event: React.FormEvent) {
    event.preventDefault();
    setPagina(1);
  }

  const categoriasComTodos = [TODOS, ...categorias];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-terra py-14 px-4">
        <div className="section-container">
          <span className="block text-xs font-semibold uppercase tracking-widest text-bruma mb-3">
            Descubra Teresópolis
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-cume mb-3">
            Lazer & Entretenimento
          </h1>
          <p className="text-bruma text-base max-w-xl leading-relaxed mb-6">
            De trilhas desafiadoras a passeios culturais tranquilos em família. Explore as melhores atrações da Serra Fluminense.
          </p>
          <form onSubmit={buscar} className="relative max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-bruma/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar atração ou tag..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-cume placeholder-bruma/40 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </form>
        </div>
      </section>

      {/* Filtros */}
      <div className="sticky top-0 z-20 border-b border-black/5 bg-cume/95 backdrop-blur-md dark:border-white/10 dark:bg-ceu/80 shadow-sm">
        <div className="section-container py-2.5 flex gap-2 overflow-x-auto">
          {categoriasComTodos.map((cat) => (
            <button
              key={cat}
              onClick={() => trocarCategoria(cat)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all",
                categoria === cat
                  ? "bg-accent text-white shadow-sm"
                  : "text-terra dark:text-bruma hover:bg-nevoa/10",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="section-container py-10">
        {carregando ? (
          <p className="py-20 text-center text-stone-500 dark:text-stone-400">Carregando atrações...</p>
        ) : itens.length === 0 ? (
          <div className="py-20 text-center text-stone-500 dark:text-stone-400">
            <p>Nenhuma atração encontrada para &quot;{busca}&quot;.</p>
            <button
              onClick={() => {
                setBusca("");
                setCategoria(TODOS);
                setPagina(1);
              }}
              className="mt-3 text-sm text-accent underline"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-stone-500 dark:text-stone-400">
              {total} {total === 1 ? "atração encontrada" : "atrações encontradas"}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {itens.map((item) => (
                <Card key={item.id} className="group overflow-hidden p-0">
                  <ImageGallery images={item.images.length ? item.images : ["/images/hero-serra.jpg"]} title={item.title} />

                  <div className="px-5 pt-5 pb-4">
                    <Badge intent="accent" className="mb-3">{item.category}</Badge>
                    <h2 className="card-heading text-xl mb-2 group-hover:text-accent transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    <div className="space-y-1.5 mb-4 text-sm text-stone-500 dark:text-stone-400">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{item.schedule}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-black/5 dark:border-white/8">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 rounded-full bg-nevoa/10 text-nevoa dark:bg-nevoa/20 dark:text-bruma border border-nevoa/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  disabled={pagina === 1}
                  className="rounded-full border border-black/10 px-4 py-2 text-sm disabled:opacity-40 dark:border-white/10"
                >
                  Anterior
                </button>
                <span className="text-sm text-stone-500">
                  Página {pagina} de {totalPaginas}
                </span>
                <button
                  onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                  disabled={pagina === totalPaginas}
                  className="rounded-full border border-black/10 px-4 py-2 text-sm disabled:opacity-40 dark:border-white/10"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
