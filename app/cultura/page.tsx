"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';

const culturaItems = [
  {
    id: 1,
    title: "Teresa Cristina: o patrimônio cultural preservado",
    category: "História",
    description:
      "Um dos cenários mais icônicos da região, oferecendo uma vista espetacular das montanhas e um pôr do sol inesquecível.",
    location: "Soberbo, Teresópolis - RJ",
    image: "/images/cultura/teresa_cristina.jpg",
    tags: ["História", "Mirante", "Pôr do sol"],
  },
  {
    id: 2,
    title: "Fonte Judite: a arte que decora a cidade serrana",
    description:
      "Charmosa fonte histórica adornada com azulejos clássicos, ideal para fotos e para apreciar a tradição local.",
    category: "Turismo",
    location: "Várzea, Teresópolis - RJ",
    image: "/images/cultura/fonte-judite.jpeg",
    tags: ["História", "Turismo"],
  },
  {
    id: 3,
    title: "Casa do Arthur Dalmasso: casarão histórico",
    description:
      "Um verdadeiro tesouro histórico, com arquitetura marcante e importância cultural para a história de Teresópolis.",
    category: "Turismo",
    location: "Várzea, Teresópolis - RJ",
    image: "/images/cultura/casa-artur.jpeg",
    tags: ["História", "Museu", "Arquitetura"],
  },
  {
    id: 4,
    title: "Casa de Teresa Cristina: um marco da arquitetura histórica de Terê",
    description:
      "Construção histórica que remete ao período imperial, preservando a memória e o charme arquitetônico da cidade.",
    category: "História",
    location: "Várzea, Teresópolis - RJ",
    image: "/images/cultura/casa-teresa.jpg",
    tags: ["Arquitetura", "História"],
  },
  {
    id: 5,
    title: "Casa de Cultura Adolpho Bloch: espaço de arte e memória",
    description:
      "Importante ponto cultural de Teresópolis, com exposições, eventos artísticos e um ambiente ideal para apreciar a produção cultural local.",
    category: "Turismo",
    location: "Araras, Teresópolis - RJ",
    image: "/images/cultura/cultura.jpeg",
    tags: ["Museu", "Arquitetura"],
  },
  {
    id: 6,
    title: "Festival de Teresa: leva cultura e gastronomia italiana a Terê",
    description:
      "Um dos eventos mais tradicionais da cidade, com música, danças típicas e uma atmosfera cultural vibrante que encanta moradores e visitantes.",
    category: "Cultura",
    location: "Alto, Teresópolis - RJ",
    image: "/images/cultura/festival-di-teresa.webp",
    tags: ["Cultura", "Eventos"],
  },
];

const ALL_TAGS = ["Todas", "História", "Turismo", "Cultura", "Eventos", "Museu", "Arquitetura"];

export default function CulturaPage() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("Todas");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    return culturaItems.filter((item) => {
      const tagMatch = activeTag === "Todas" || item.tags.includes(activeTag);
      const searchMatch =
        search.trim() === "" ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return tagMatch && searchMatch;
    });
  }, [search, activeTag]);

  return (
    <main className="min-h-screen py-16 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-12 border-b border-gray-800 pb-10">
        <span className="text-orange-600 font-semibold tracking-wider uppercase text-sm mb-3 block">
          Descubra Teresópolis
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
          Cultura e Patrimônio
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">
          História, artesanato, memória e agenda cultural de Terê. Descubra os
          lugares e eventos que moldam a identidade cultural da cidade serrana.
        </p>
      </div>

      {/* Filtros e busca */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Filtro por tag */}
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  activeTag === tag
                    ? "border-orange-600 bg-orange-600/20 text-orange-500"
                    : "border-gray-700 text-stone-300 hover:border-orange-600/50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Grade / Lista */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`rounded px-3 py-1.5 text-sm transition ${
                viewMode === "grid"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-800 text-stone-300 hover:bg-gray-700"
              }`}
            >
              Grade
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded px-3 py-1.5 text-sm transition ${
                viewMode === "list"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-800 text-stone-300 hover:bg-gray-700"
              }`}
            >
              Lista
            </button>
          </div>
        </div>

        {/* Busca */}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título, descrição ou tag"
          className="w-full rounded-xl border border-gray-800 bg-[#111] px-4 py-3 text-sm text-stone-300 placeholder-stone-600 outline-none focus:border-gray-600 transition"
        />

        <p className="text-sm text-stone-500">{filtered.length} local(is) encontrado(s)</p>
      </div>

      {/* Grid / Lista de cards */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            : "flex flex-col gap-6"
        }
      >
        {filtered.map((item) => (
          <article
            key={item.id}
            className={`group flex bg-[#111] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors duration-300 shadow-lg ${
              viewMode === "list" ? "flex-row" : "flex-col"
            }`}
          >
            {/* Imagem */}
            <div
              className={`relative overflow-hidden bg-gray-900 ${
                viewMode === "list" ? "w-[260px] shrink-0 h-auto min-h-[180px]" : "h-56"
              }`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                sizes={
                  viewMode === "list"
                    ? "(max-width: 768px) 100vw, 260px"
                    : "(max-width: 1280px) 50vw, 33vw"
                }
              />
              {/* Badge de categoria */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700 z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-serif text-gray-100 mb-3 group-hover:text-orange-400 transition-colors leading-snug">
                {item.title}
              </h2>

              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Localização */}
              <div className="flex items-start gap-3 text-gray-300 text-sm mt-auto mb-6">
                <svg
                  className="w-5 h-5 text-orange-600 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{item.location}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-5 border-t border-gray-800">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-gray-800/50 text-gray-300 border border-gray-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
