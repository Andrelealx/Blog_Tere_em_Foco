"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const lazerItems = [
  {
    id: 1,
    title: "Parque Nacional da Serra dos Órgãos (PARNASO)",
    category: "Ecoturismo & Aventura",
    description:
      "O terceiro parque nacional mais antigo do Brasil. Abriga o cartão-postal da cidade, o Dedo de Deus, além de diversas cachoeiras, piscinas naturais e a famosa Travessia Petrópolis-Teresópolis.",
    schedule: "Diariamente, das 8h às 17h.",
    location: "Avenida Rotariana, s/n - Soberbo",
    tags: ["Trilhas", "Cachoeiras", "Mirantes"],
    images: [
      "/images/lazer/parnaso/1.jpg",
      "/images/lazer/parnaso/2.jpg",
      "/images/lazer/parnaso/3.jpg",
    ],
  },
  {
    id: 2,
    title: "Feirinha do Alto",
    category: "Cultura & Compras",
    description:
      "Um dos pontos turísticos mais tradicionais da Serra Fluminense. São mais de 600 barracas oferecendo moda (especialmente tricô e couro), artesanato local e praça de alimentação.",
    schedule: "Sábados, Domingos e Feriados, das 10h às 18h.",
    location: "Praça Higino da Silveira - Bairro do Alto",
    tags: ["Artesanato", "Gastronomia", "Moda"],
    images: [
      "/images/lazer/feirinha/1.jpg",
      "/images/lazer/feirinha/2.jpg",
      "/images/lazer/feirinha/3.jpg",
    ],
  },
  {
    id: 3,
    title: "Mirante do Soberbo",
    category: "Contemplação",
    description:
      "A porta de entrada da cidade oferece uma das vistas mais espetaculares do estado. Em dias claros, é possível admirar o pico Dedo de Deus e a Baía de Guanabara.",
    schedule: "Acesso livre 24 horas. Melhor horário: pôr do sol.",
    location: "BR-116, km 89 - Entrada da Cidade",
    tags: ["Cartão-Postal", "Fotografia", "Gratuito"],
    images: [
      "/images/lazer/mirante/1.jpg",
      "/images/lazer/mirante/2.jpg",
      "/images/lazer/mirante/3.jpg",
    ],
  },
  {
    id: 4,
    title: "Vila St. Gallen",
    category: "Gastronomia & Lazer",
    description:
      "Um pedacinho da Alemanha em Teresópolis. A vila reproduz uma charmosa cidade bávara com gastronomia europeia e cervejas artesanais.",
    schedule: "Quarta a Domingo (horários variam por estabelecimento).",
    location: "Rua Augusto do Amaral Peixoto, 166 - Alto",
    tags: ["Cervejaria", "Restaurantes", "Arquitetura"],
    images: [
      "/images/lazer/vila/1.jpg",
      "/images/lazer/vila/2.jpg",
      "/images/lazer/vila/3.jpg",
    ],
  },
  {
    id: 5,
    title: "Lago da Granja Comary",
    category: "Passeio em Família",
    description:
      "Vista privilegiada para as montanhas e o Centro de Treinamento da Seleção Brasileira de Futebol (CBF). Ótimo para caminhadas e passeios tranquilos.",
    schedule: "Acesso diurno liberado para pedestres.",
    location: "Bairro Carlos Guinle",
    tags: ["Natureza", "Caminhada", "CBF"],
    images: [
      "/images/lazer/comary/1.jpg",
      "/images/lazer/comary/2.jpg",
      "/images/lazer/comary/3.jpg",
    ],
  },
  {
    id: 6,
    title: "Cachoeira dos Frades",
    category: "Cachoeiras & Banho",
    description:
      "Uma das cachoeiras mais encantadoras da região, com queda d'água de aproximadamente 15 metros e poço natural de águas cristalinas. Ideal para banho refrescante e piquenique em meio à Mata Atlântica preservada.",
    schedule: "Aberto diariamente, das 9h às 17h.",
    location: "Estrada da Varginha, s/n - Vargem Grande",
    tags: ["Cachoeira", "Banho Natural", "Piquenique"],
    images: [
      "/images/lazer/cachoeira/1.jpg",
      "/images/lazer/cachoeira/2.jpg",
      "/images/lazer/cachoeira/3.jpg",
    ],
  },
];

const ALL_CATEGORIES = ["Todos", ...Array.from(new Set(lazerItems.map((i) => i.category)))];

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  return (
    <div className="relative h-52 overflow-hidden bg-nevoa group/gal">
      <img
        src={images[current]}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover/gal:scale-105 opacity-85 group-hover/gal:opacity-100"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); setCurrent((p) => (p - 1 + images.length) % images.length); }}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-accent text-white text-sm flex items-center justify-center opacity-0 group-hover/gal:opacity-100 transition-all"
          >‹</button>
          <button
            onClick={(e) => { e.preventDefault(); setCurrent((p) => (p + 1) % images.length); }}
            aria-label="Próxima foto"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-accent text-white text-sm flex items-center justify-center opacity-0 group-hover/gal:opacity-100 transition-all"
          >›</button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                aria-label={`Foto ${i + 1}`}
                className={cn("h-1.5 rounded-full transition-all", i === current ? "w-5 bg-accent" : "w-1.5 bg-white/50")}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function LazerPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const filtered = lazerItems.filter((item) => {
    const matchCat = activeCategory === "Todos" || item.category === activeCategory;
    const matchSearch =
      search === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

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
          <div className="relative max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-bruma/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar atração ou tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-cume placeholder-bruma/40 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>
        </div>
      </section>

      {/* Filtros */}
      <div className="sticky top-0 z-20 border-b border-black/5 bg-cume/95 backdrop-blur-md dark:border-white/10 dark:bg-ceu/80 shadow-sm">
        <div className="section-container py-2.5 flex gap-2 overflow-x-auto">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all",
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

      {/* Grid */}
      <div className="section-container py-10">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-stone-500 dark:text-stone-400">
            <p>Nenhuma atração encontrada para "{search}".</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("Todos"); }}
              className="mt-3 text-sm text-accent underline"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-stone-500 dark:text-stone-400">
              {filtered.length} {filtered.length === 1 ? "atração encontrada" : "atrações encontradas"}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <Card key={item.id} className="group overflow-hidden p-0">
                  <ImageGallery images={item.images} title={item.title} />

                  {/* Categoria sobre a imagem */}
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
          </>
        )}
      </div>
    </main>
  );
}
