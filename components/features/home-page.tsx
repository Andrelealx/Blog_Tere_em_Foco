"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/features/article-card";
import { HeroSlider } from "@/components/features/hero-slider";
import { NewsTicker } from "@/components/features/news-ticker";
import { WeatherWidget } from "@/components/features/weather-widget";
import { Button, Card, RelativeTime } from "@/components/ui";
import {
  categoryHighlights,
  getFeaturedArticles,
  getLatestArticles,
} from "@/lib/mock-data";

export function HomePage() {
  const featured = getFeaturedArticles();
  const latest = getLatestArticles(6);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      <HeroSlider />

      <div className="mx-auto mt-6 w-full max-w-7xl px-4">
        <NewsTicker />
      </div>

      <section className="mx-auto mt-10 grid w-full max-w-7xl gap-6 px-4 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="mb-4 font-display text-3xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
            Destaques da Semana
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {featured.map((article, index) => (
              <div key={article.id} className={index === 0 ? "sm:col-span-2" : ""}>
                <ArticleCard
                  article={article}
                  priority={index === 0}
                  mode={index === 0 ? "default" : "compact"}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <WeatherWidget />
          <Card className="p-5">
            <h3 className="font-display text-2xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
              Últimas Notícias
            </h3>
            <ul className="mt-4 space-y-4">
              {latest.slice(0, 5).map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/artigo/${article.slug}`}
                    className="group block rounded-xl border border-black/5 p-3 transition hover:border-nevoa hover:bg-nevoa/5 dark:border-white/10 dark:hover:bg-white/5"
                  >
                    <p className="font-medium text-stone-800 group-hover:text-[var(--color-accent)] dark:text-stone-100">
                      {article.title}
                    </p>
                    <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">
                      <RelativeTime date={article.publishedAt} />
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-7xl px-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
              Explore Teresópolis
            </h2>
            <p className="mt-2 max-w-2xl text-stone-700 dark:text-stone-300">
              Categorias editoriais com guias práticos para planejar sua experiência
              na serra.
            </p>
          </div>
          <Link href="/explorar" className="hidden sm:block">
            <Button intent="secondary">Ver mapa interativo</Button>
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {categoryHighlights.map((item, index) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <Link href={`/categoria/${item.slug}`}>
                <Card className="group relative overflow-hidden p-0">
                  <div className="relative h-52">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 p-5 text-white">
                      <p className="font-display text-2xl">{item.title}</p>
                      <p className="mt-1 text-sm text-stone-100">{item.description}</p>
                      <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-bruma)]">
                        Abrir categoria <ArrowRight size={15} />
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
