"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

// ── Dados ──────────────────────────────────────────────────────────────────
const todasNoticias = [
  { id: 1, slug: "prefeitura-amplia-transporte", title: "Prefeitura amplia linhas de transporte público em Teresópolis", excerpt: "Novas rotas serão implementadas a partir de julho, atendendo bairros como Várzea e Granja Comary com maior frequência nos horários de pico.", category: "Mobilidade", author: "Redação Terê em Foco", publishedAt: "2026-06-18T08:00:00-03:00", readTime: "3 min", image: "/images/natureza.jpg", tags: ["Transporte", "Prefeitura", "Mobilidade"], featured: true },
  { id: 2, slug: "alerta-chuvas-serra", title: "Defesa Civil emite alerta para chuvas fortes na Serra Fluminense", excerpt: "Sistema de baixa pressão previsto para o fim de semana pode trazer precipitações acima de 80mm/h. Moradores de áreas de risco devem ficar atentos.", category: "Clima", author: "Redação Terê em Foco", publishedAt: "2026-06-17T14:30:00-03:00", readTime: "4 min", image: "/images/hero-serra.jpg", tags: ["Clima", "Defesa Civil", "Chuvas"], featured: true },
  { id: 3, slug: "festival-gastronomico-julho", title: "Festival Gastronômico de Verão acontece em julho", excerpt: "Evento reúne mais de 40 restaurantes locais e chefs convidados durante três fins de semana no centro histórico da cidade.", category: "Eventos", author: "Redação Terê em Foco", publishedAt: "2026-06-16T10:00:00-03:00", readTime: "2 min", image: "/images/gastronomia.jpg", tags: ["Gastronomia", "Eventos", "Turismo"], featured: false },
  { id: 4, slug: "obras-av-rotariana", title: "Obras na Avenida Rotariana causam interdições temporárias", excerpt: "Trabalhos de recapeamento e melhoria do sistema de drenagem pluvial previstos para durar 45 dias. Vias alternativas indicadas pela SETRAN.", category: "Obras & Infraestrutura", author: "Redação Terê em Foco", publishedAt: "2026-06-15T09:15:00-03:00", readTime: "3 min", image: "/images/historia.jpg", tags: ["Obras", "Trânsito", "Infraestrutura"], featured: false },
  { id: 5, slug: "parnaso-premio-ambiental", title: "PARNASO recebe prêmio nacional de conservação ambiental", excerpt: "O Parque Nacional da Serra dos Órgãos foi reconhecido pelo Ministério do Meio Ambiente por suas iniciativas de ecoturismo sustentável.", category: "Meio Ambiente", author: "Redação Terê em Foco", publishedAt: "2026-06-14T11:00:00-03:00", readTime: "5 min", image: "/images/parnaso.jpg", tags: ["PARNASO", "Meio Ambiente", "Prêmio"], featured: false },
  { id: 6, slug: "projeto-leitura-escolas", title: "Escolas municipais lançam projeto de incentivo à leitura", excerpt: "Programa 'Ler para Crescer' distribui livros e cria bibliotecas comunitárias em 12 unidades escolares, beneficiando mais de 5 mil alunos.", category: "Educação", author: "Redação Terê em Foco", publishedAt: "2026-06-13T08:30:00-03:00", readTime: "4 min", image: "/images/cultura.jpg", tags: ["Educação", "Leitura", "Escolas"], featured: false },
  { id: 7, slug: "feira-artesanato-agosto", title: "Feira de Artesanato Serra tem edição especial em agosto", excerpt: "Edição especial de inverno promete reunir mais de 200 expositores de toda a região serrana.", category: "Eventos", author: "Redação Terê em Foco", publishedAt: "2026-06-12T07:00:00-03:00", readTime: "2 min", image: "/images/natureza.jpg", tags: ["Artesanato", "Cultura", "Eventos"], featured: false },
  { id: 8, slug: "nova-upa-bairro-alto", title: "Nova UPA do Bairro Alto inicia atendimentos", excerpt: "Unidade de Pronto Atendimento amplia a capacidade de saúde pública com 80 leitos e atendimento 24 horas.", category: "Saúde", author: "Redação Terê em Foco", publishedAt: "2026-06-11T10:00:00-03:00", readTime: "3 min", image: "/images/historia.jpg", tags: ["Saúde", "UPA", "Prefeitura"], featured: false },
];

const RECOMENDACOES: Record<string, number[]> = {
  Clima: [4, 5, 2], Mobilidade: [4, 8, 3], Eventos: [3, 7, 1],
  "Obras & Infraestrutura": [1, 8, 4], "Meio Ambiente": [2, 5, 3],
  Educação: [6, 3, 7], Saúde: [8, 6, 1],
};

const ALL_CATEGORIES = ["Todas", ...Array.from(new Set(todasNoticias.map((n) => n.category)))];

// ── Sub-componentes ────────────────────────────────────────────────────────
function CategoryBadge({ category }: { category: string }) {
  const intentMap: Record<string, "accent" | "primary" | "neutral"> = {
    Mobilidade: "accent", Clima: "accent", "Meio Ambiente": "accent", Saúde: "accent",
  };
  return (
    <Badge intent={intentMap[category] ?? "neutral"} className="text-[10px]">
      {category}
    </Badge>
  );
}

function SectionLabel({ children, color = "accent" }: { children: React.ReactNode; color?: "accent" | "nevoa" }) {
  return (
    <h2 className="section-heading mb-6 flex items-center gap-3 text-2xl">
      <span className={cn("inline-block h-6 w-1 rounded-full", color === "accent" ? "bg-accent" : "bg-nevoa")} />
      {children}
    </h2>
  );
}

// ── Página principal ───────────────────────────────────────────────────────
export default function NoticiasPage() {
  const [categoriasAtivas, setCategoriasAtivas] = useState<string[]>([]);
  const [showPersonalizar, setShowPersonalizar] = useState(false);
  const [historico, setHistorico] = useState<number[]>([]);
  const [recomendadas, setRecomendadas] = useState<typeof todasNoticias>([]);
  const [alertas, setAlertas] = useState([
    { id: "a1", texto: "⚡ Alerta: Chuvas fortes previstas para Teresópolis neste fim de semana.", lido: false },
    { id: "a2", texto: "🚧 Atenção: Interdição na Av. Rotariana até domingo.", lido: false },
  ]);
  const [comentariosAbertos, setComentariosAbertos] = useState<number | null>(null);
  const [comentarios, setComentarios] = useState<Record<number, { autor: string; texto: string; data: string }[]>>({
    1: [{ autor: "Maria S.", texto: "Ótima notícia! Muito necessário para o bairro.", data: "18/06/2026" }],
    2: [{ autor: "João P.", texto: "Fiquem em casa se não for necessário sair!", data: "17/06/2026" }],
  });
  const [novoComentario, setNovoComentario] = useState({ autor: "", texto: "" });
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (historico.length === 0) { setRecomendadas([]); return; }
    const ultima = todasNoticias.find((n) => n.id === historico[historico.length - 1]);
    if (!ultima) return;
    const sugeridas = (RECOMENDACOES[ultima.category] ?? [])
      .map((id) => todasNoticias.find((n) => n.id === id))
      .filter((n): n is typeof todasNoticias[0] => !!n && !historico.includes(n.id))
      .slice(0, 3);
    setRecomendadas(sugeridas);
  }, [historico]);

  function marcarLido(id: number) {
    if (!historico.includes(id)) setHistorico((h) => [...h, id]);
  }

  function toggleCategoria(cat: string) {
    setCategoriasAtivas((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  }

  function enviarComentario(noticiaId: number) {
    if (!novoComentario.autor.trim() || !novoComentario.texto.trim()) return;
    setComentarios((prev) => ({
      ...prev,
      [noticiaId]: [...(prev[noticiaId] ?? []), { ...novoComentario, data: new Date().toLocaleDateString("pt-BR") }],
    }));
    setNovoComentario({ autor: "", texto: "" });
  }

  const alertasAtivos = alertas.filter((a) => !a.lido);
  const filtradas = todasNoticias.filter((n) => {
    const matchPersonal = categoriasAtivas.length === 0 || categoriasAtivas.includes(n.category);
    const matchCat = activeCategory === "Todas" || n.category === activeCategory;
    const matchSearch = search === "" ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchPersonal && matchCat && matchSearch;
  });

  const featured = todasNoticias.filter((n) => n.featured);
  const showFeatured = activeCategory === "Todas" && search === "" && categoriasAtivas.length === 0;

  return (
    <main className="min-h-screen">

      {/* ── ALERTAS DE ÚLTIMA HORA ── */}
      {alertasAtivos.length > 0 && (
        <div className="border-b border-amber-200 bg-amber-50 dark:border-amber-700/40 dark:bg-amber-900/20">
          {alertasAtivos.map((alerta) => (
            <div key={alerta.id} className="section-container flex items-center justify-between gap-4 py-2.5">
              <p className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-300">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>
                {alerta.texto}
              </p>
              <button
                onClick={() => setAlertas((a) => a.map((al) => al.id === alerta.id ? { ...al, lido: true } : al))}
                aria-label="Dispensar alerta"
                className="flex-shrink-0 text-lg leading-none text-amber-600 hover:text-amber-800 dark:text-amber-400"
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
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
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-bruma/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar notícia..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-cume placeholder-bruma/40 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>
            <button
              onClick={() => setShowPersonalizar((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-bruma transition-colors hover:bg-white/15"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Personalizar feed
              {categoriasAtivas.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {categoriasAtivas.length}
                </span>
              )}
            </button>
          </div>

          {showPersonalizar && (
            <div className="mt-4 max-w-lg rounded-xl border border-white/20 bg-white/10 p-4">
              <p className="mb-3 text-sm font-semibold text-cume">Escolha as categorias que prefere ver:</p>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.filter((c) => c !== "Todas").map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategoria(cat)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm font-medium transition-all",
                      categoriasAtivas.includes(cat)
                        ? "bg-accent text-white"
                        : "bg-white/10 text-bruma hover:bg-white/20"
                    )}
                  >
                    {categoriasAtivas.includes(cat) ? "✓ " : ""}{cat}
                  </button>
                ))}
              </div>
              {categoriasAtivas.length > 0 && (
                <button onClick={() => setCategoriasAtivas([])} className="mt-3 text-xs text-bruma/70 underline hover:text-bruma">
                  Limpar preferências
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── FILTROS POR CATEGORIA ── */}
      <div className="sticky top-0 z-20 border-b border-black/5 bg-cume/95 backdrop-blur-md dark:border-white/10 dark:bg-ceu/80 shadow-sm">
        <div className="section-container py-2.5 flex gap-2 overflow-x-auto">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
                activeCategory === cat
                  ? "bg-accent text-white shadow-sm"
                  : "text-terra dark:text-bruma hover:bg-nevoa/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="section-container py-10">

        {/* ── RECOMENDAÇÕES (Algoritmo de Sugestão) ── */}
        {recomendadas.length > 0 && (
          <section className="mb-10 rounded-2xl border border-nevoa/20 bg-nevoa/8 p-5 dark:bg-nevoa/10">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg text-terra dark:text-cume">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Recomendado para você
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {recomendadas.map((n) => (
                <Link key={n.id} href={`/artigo/${n.slug}`} onClick={() => marcarLido(n.id)}>
                  <Card className="group flex gap-3 p-3 hover:border-nevoa transition-all cursor-pointer">
                    <img src={n.image} alt={n.title} className="h-14 w-16 flex-shrink-0 rounded-lg object-cover" />
                    <div>
                      <CategoryBadge category={n.category} />
                      <p className="mt-1 text-sm font-medium leading-snug text-terra dark:text-cume line-clamp-2 group-hover:text-accent transition-colors">
                        {n.title}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── DESTAQUES ── */}
        {showFeatured && (
          <section className="mb-12">
            <SectionLabel color="accent">Destaques</SectionLabel>
            <div className="grid gap-6 md:grid-cols-2">
              {featured.map((n) => (
                <Link key={n.id} href={`/artigo/${n.slug}`} onClick={() => marcarLido(n.id)}>
                  <article className="group relative h-72 overflow-hidden rounded-2xl border border-white/10 bg-terra transition-all duration-300 hover:-translate-y-1 hover:shadow-soft cursor-pointer">
                    <img src={n.image} alt={n.title} className="absolute inset-0 h-full w-full object-cover opacity-40 transition-all duration-500 group-hover:scale-105 group-hover:opacity-55" />
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

        {/* ── LISTA DE NOTÍCIAS ── */}
        <section>
          {showFeatured && <SectionLabel color="nevoa">Últimas Notícias</SectionLabel>}
          {!showFeatured && (
            <p className="mb-6 text-sm text-stone-500 dark:text-stone-400">
              {filtradas.length} {filtradas.length === 1 ? "resultado" : "resultados"} encontrados
            </p>
          )}

          {filtradas.length === 0 ? (
            <div className="py-20 text-center text-stone-500">
              <p>Nenhuma notícia encontrada.</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("Todas"); setCategoriasAtivas([]); }}
                className="mt-3 text-sm text-accent underline"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="divide-y divide-black/5 dark:divide-white/8">
              {filtradas.map((n) => (
                <div key={n.id}>
                  <Link href={`/artigo/${n.slug}`} onClick={() => marcarLido(n.id)}>
                    <article className="group -mx-4 cursor-pointer rounded-xl px-4 py-5 transition-colors hover:bg-nevoa/5">
                      <div className="flex gap-5">
                        <div className="hidden h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl sm:block">
                          <img src={n.image} alt={n.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <CategoryBadge category={n.category} />
                            <span className="text-xs text-stone-400">{formatDate(n.publishedAt)}</span>
                            <span className="text-xs text-stone-400">· {n.readTime}</span>
                            {historico.includes(n.id) && (
                              <span className="text-xs font-medium text-nevoa">✓ Lida</span>
                            )}
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

                  {/* ── COMENTÁRIOS E DISCUSSÕES ── */}
                  <div className="mb-3 ml-4">
                    <button
                      onClick={() => setComentariosAbertos(comentariosAbertos === n.id ? null : n.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-nevoa transition-colors hover:text-accent"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {comentarios[n.id]?.length ?? 0} {(comentarios[n.id]?.length ?? 0) === 1 ? "comentário" : "comentários"}
                      {" · "}{comentariosAbertos === n.id ? "Fechar" : "Ver discussão"}
                    </button>

                    {comentariosAbertos === n.id && (
                      <div className="mt-3 space-y-3 border-l-2 border-nevoa/20 pl-4">
                        {(comentarios[n.id] ?? []).map((c, i) => (
                          <Card key={i} className="p-3">
                            <div className="mb-1 flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-nevoa text-[10px] font-bold text-white">
                                {c.autor[0]}
                              </span>
                              <span className="text-sm font-medium text-terra dark:text-cume">{c.autor}</span>
                              <span className="text-xs text-stone-400">{c.data}</span>
                            </div>
                            <p className="text-sm text-stone-600 dark:text-stone-400">{c.texto}</p>
                          </Card>
                        ))}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Seu nome"
                            value={novoComentario.autor}
                            onChange={(e) => setNovoComentario({ ...novoComentario, autor: e.target.value })}
                            className="form-input w-28 py-2 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Escreva um comentário..."
                            value={novoComentario.texto}
                            onChange={(e) => setNovoComentario({ ...novoComentario, texto: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && enviarComentario(n.id)}
                            className="form-input flex-1 py-2 text-sm"
                          />
                          <button
                            onClick={() => enviarComentario(n.id)}
                            className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                          >
                            Enviar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
