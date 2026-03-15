"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";

const HERO_SLIDES = [
  {
    id: 1,
    src: "/images/slider/slider1.jpg",
    alt: "Serra dos Órgãos ao amanhecer",
    eyebrow: "Bem-vindo a Teresópolis",
    title: "A cidade que vive entre montanhas e névoa",
    description:
      "Encravada na Serra dos Órgãos, Teresópolis reúne natureza, cultura e gastronomia em um cenário único da Serra Fluminense.",
    href: "",
    cta: "",
  },
  {
    id: 2,
    src: "/images/slider/slider2.jpg",
    alt: "Trilhas e natureza de Teresópolis",
    eyebrow: "Turismo & Natureza",
    title: "Trilhas, picos e o Parque Nacional da Serra",
    description:
      "Do Dedo de Deus ao Nariz do Frade: as melhores trilhas e mirantes para explorar a natureza serrana.",
    href: "/categoria/turismo",
    cta: "Ver roteiros de turismo",
  },
  {
    id: 3,
    src: "/images/slider/slider3.jpg",
    alt: "Gastronomia serrana",
    eyebrow: "Gastronomia",
    title: "Sabores artesanais da montanha",
    description:
      "De queijos e geleias de altitude a cafés especiais — um guia completo para comer bem em Teresópolis.",
    href: "/categoria/gastronomia",
    cta: "Explorar gastronomia",
  },
  {
    id: 4,
    src: "/images/slider/slider4.jpg",
    alt: "Cultura e eventos em Teresópolis",
    eyebrow: "Cultura Local",
    title: "Arte, tradição e identidade serrana",
    description:
      "Festivais, artesanato, música ao vivo e patrimônio histórico: a vida cultural de Teresópolis além das trilhas.",
    href: "/categoria/cultura",
    cta: "Ver agenda cultural",
  },
  {
    id: 5,
    src: "/images/slider/slider5.jpg",
    alt: "Opções de lazer na cidade",
    eyebrow: "Lazer",
    title: "O que fazer nos fins de semana na serra",
    description:
      "Parques, cachoeiras, esportes de aventura e muito mais para quem busca atividades ao ar livre na região serrana.",
    href: "/categoria/lazer",
    cta: "Explorar opções de lazer",
  },
  {
    id: 6,
    src: "/images/slider/slider6.jpg",
    alt: "Notícias de Teresópolis",
    eyebrow: "Notícias",
    title: "Fique por dentro do que acontece na Serra",
    description:
      "Cobertura jornalística local: política, infraestrutura, saúde e tudo que impacta a vida de quem mora ou visita Teresópolis.",
    href: "/categoria/noticias",
    cta: "Ler as notícias",
  },
];

const AUTO_PLAY_INTERVAL = 5000;

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const handlePause = () => {
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), AUTO_PLAY_INTERVAL * 2);
  };

  const goToPrev = () => {
    handlePause();
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goToNext = () => {
    handlePause();
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const goToSlide = (index: number) => {
    handlePause();
    setCurrentSlide(index);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative h-[85vh] min-h-[560px] overflow-hidden">

      {/* Imagens com fade */}
      <div className="absolute inset-0">
        {HERO_SLIDES.map((s, index) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              pointerEvents: index === currentSlide ? "auto" : "none",
            }}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80" />

      {/* Setas de navegação */}
      <button
        onClick={goToPrev}
        aria-label="Slide anterior"
        className="group absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:left-6"
      >
        <ChevronLeft className="h-5 w-5 text-white sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={goToNext}
        aria-label="Próximo slide"
        className="group absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:right-6"
      >
        <ChevronRight className="h-5 w-5 text-white sm:h-6 sm:w-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-8">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
            className="rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{
              width: index === currentSlide ? "32px" : "8px",
              height: "8px",
              backgroundColor: index === currentSlide ? "white" : "rgba(255,255,255,0.45)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Conteúdo por slide — AnimatePresence re-anima a cada troca */}
      <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-end px-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <p className="text-sm uppercase tracking-[0.22em] text-bruma">
              {slide.eyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base text-stone-200 sm:text-lg">
              {slide.description}
            </p>
            {slide.href && (
              <div className="mt-8">
                <Link href={slide.href}>
                  <Button size="lg">{slide.cta}</Button>
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </section>
  );
}
