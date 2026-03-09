"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MapPinned, Sparkles } from "lucide-react";
import { Button, Card, Tag } from "@/components/ui";
import { Lightbox } from "@/components/features/lightbox";
import {
  tourismPoints,
  tourismTypes,
  type TourismPoint,
  type TourismType,
} from "@/lib/pontos-turisticos";

const TourismMap = dynamic(() => import("@/components/features/tourism-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full animate-pulse rounded-2xl bg-stone-200/70 dark:bg-white/10" />
  ),
});

function ObservedImage({
  point,
  onOpen,
}: {
  point: TourismPoint;
  onOpen: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: "120px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return (
    <div ref={setNode} className="masonry-item">
      <button
        type="button"
        onClick={onOpen}
        className="group relative block w-full overflow-hidden rounded-2xl border border-black/10 bg-white text-left shadow-soft transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
      >
        <div className="relative h-64">
          {isVisible ? (
            <Image
              src={point.image}
              alt={point.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full animate-pulse bg-stone-200 dark:bg-white/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <Tag tone="accent" className="border-none bg-[var(--color-accent)] text-white">
              {point.type}
            </Tag>
            <p className="mt-2 font-display text-2xl">{point.name}</p>
          </div>
        </div>
      </button>
    </div>
  );
}

export function ExploreClient() {
  const [activeType, setActiveType] = useState<TourismType | "Todos">("Todos");
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPoints = useMemo(
    () =>
      activeType === "Todos"
        ? tourismPoints
        : tourismPoints.filter((point) => point.type === activeType),
    [activeType],
  );

  const lightboxItem =
    lightboxIndex !== null && filteredPoints[lightboxIndex]
      ? {
          src: filteredPoints[lightboxIndex].image,
          alt: filteredPoints[lightboxIndex].name,
          title: filteredPoints[lightboxIndex].name,
        }
      : null;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = () =>
    setLightboxIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + filteredPoints.length) % filteredPoints.length;
    });
  const goNext = () =>
    setLightboxIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % filteredPoints.length;
    });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <section className="rounded-3xl border border-black/5 bg-mountain-glow p-6 shadow-soft dark:border-white/10 dark:bg-night-fog">
        <p className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)]">
          <Sparkles size={15} aria-hidden />
          Guia imersivo de pontos turísticos
        </p>
        <h1 className="mt-3 font-display text-4xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
          Explorar Teresópolis
        </h1>
        <p className="mt-2 max-w-2xl text-stone-700 dark:text-stone-300">
          Navegue pelo mapa, filtre por tipo de experiência e abra a galeria
          interativa para planejar sua rota.
        </p>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {tourismTypes.map((type) => (
            <Button
              key={type}
              size="sm"
              intent={type === activeType ? "primary" : "secondary"}
              onClick={() => setActiveType(type)}
            >
              {type}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="overflow-hidden p-3">
            <TourismMap
              points={tourismPoints}
              selectedPointId={selectedPointId}
              activeType={activeType}
            />
          </Card>

          <div className="space-y-4">
            {filteredPoints.map((point) => (
              <button
                type="button"
                key={point.id}
                onClick={() => setSelectedPointId(point.id)}
                className="flip-card block w-full text-left"
              >
                <div className="flip-card-inner">
                  <Card className="flip-card-front p-5">
                    <p className="inline-flex items-center gap-2 text-sm text-[var(--color-nevoa)]">
                      <MapPinned size={14} aria-hidden />
                      {point.type}
                    </p>
                    <h2 className="mt-2 font-display text-2xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
                      {point.name}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-stone-700 dark:text-stone-300">
                      {point.description}
                    </p>
                    <p className="mt-3 text-xs text-stone-600 dark:text-stone-400">
                      Clique para centralizar no mapa
                    </p>
                  </Card>

                  <Card className="flip-card-back flex items-center p-5">
                    <div>
                      <h3 className="font-display text-2xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
                        Endereço
                      </h3>
                      <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">
                        {point.address}
                      </p>
                      <p className="mt-3 text-sm text-[var(--color-accent)]">
                        Lat {point.lat.toFixed(4)} • Lng {point.lng.toFixed(4)}
                      </p>
                    </div>
                  </Card>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-3xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
          Galeria da Serra
        </h2>
        <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">
          Clique em qualquer imagem para abrir o lightbox com navegação por teclado.
        </p>

        <div className="masonry-gallery mt-6">
          {filteredPoints.map((point, index) => (
            <ObservedImage
              key={point.id}
              point={point}
              onOpen={() => openLightbox(index)}
            />
          ))}
        </div>
      </section>

      <Lightbox
        open={lightboxIndex !== null}
        item={lightboxItem}
        onClose={closeLightbox}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
}
