"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";

// Dados dos slides (3 imagens de placeholder)
const HERO_SLIDES = [
  {
    id: 1,
    src: "/images/hero-serra.jpg",
    alt: "Serra dos Órgãos ao amanhecer",
  },
  {
    id: 2,
    src: "/images/hero-serra.jpg", // Usando mesma imagem por enquanto
    alt: "Teresópolis vista do pico",
  },
  {
    id: 3,
    src: "/images/hero-serra.jpg", // Usando mesma imagem por enquanto
    alt: "Trilhas e natureza",
  },
];

const AUTO_PLAY_INTERVAL = 4000; // 4 segundos

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  // Auto-play: troca de slide a cada 4 segundos
  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  // Pausa auto-play quando o usuário interage
  const handlePause = () => {
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), AUTO_PLAY_INTERVAL * 2);
  };

  // Navegar para slide anterior
  const goToPrev = () => {
    handlePause();
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    );
  };

  // Navegar para próximo slide
  const goToNext = () => {
    handlePause();
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  // Navegar para um slide específico
  const goToSlide = (index: number) => {
    handlePause();
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-[85vh] min-h-[560px] overflow-hidden">
      {/* Container dos slides com transição fade */}
      <div className="relative h-full w-full">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              pointerEvents: index === currentSlide ? "auto" : "none",
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-terra/30 via-terra/45 to-terra/85" />

      {/* Botões de navegação (setas) */}
      <button
        onClick={goToPrev}
        aria-label="Slide anterior"
        className="group absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:left-6"
      >
        <ChevronLeft className="h-5 w-5 text-white sm:h-6 sm:w-6" />
      </button>

      <button
        onClick={goToNext}
        aria-label="Próximo slide"
        className="group absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:right-6"
      >
        <ChevronRight className="h-5 w-5 text-white sm:h-6 sm:w-6" />
      </button>

      {/* Indicadores (bolinhas) */}
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
              backgroundColor: index === currentSlide ? "white" : "rgba(255, 255, 255, 0.5)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Conteúdo sobreposto (textos e botão) - com animações motion */}
      <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-end px-4 pb-20">
        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm uppercase tracking-[0.22em] text-[var(--color-bruma)]"
        >
          Jornalismo local e turismo consciente
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 max-w-4xl font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl"
        >
          Terê em Foco: a serra fluminense com olhar editorial
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-5 max-w-2xl text-base text-stone-200 sm:text-lg"
        >
          Notícias, roteiros e cultura de Teresópolis em uma experiência visual
          premium e acessível.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="mt-8"
        >
          <Link href="/categoria/turismo">
            <Button size="lg">Explorar reportagens</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
