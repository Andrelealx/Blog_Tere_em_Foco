"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories, type Article, type CategorySlug } from "@/lib/mock-data";
import { Badge, Button, Card, Skeleton, Tag } from "@/components/ui";
import { formatDate } from "@/lib/utils";

interface CategoryFeedProps {
  slug: CategorySlug;
  title: string;
  description: string;
  articles: Article[];
}

type ViewMode = "grid" | "list";

export function CategoryFeed({
  slug,
  title,
  description,
  articles,
}: CategoryFeedProps) {
  const shouldReduceMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");

  const activeFilter = searchParams.get("categoria") ?? "todas";
  const subcategories = useMemo(
    () => ["todas", ...new Set(articles.map((article) => article.subcategory))],
    [articles],
  );

  const filtered = useMemo(() => {
    return articles.filter((article) => {
      const filterMatch =
        activeFilter === "todas" || article.subcategory === activeFilter;
      const queryMatch =
        query.trim().length === 0 ||
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
      return filterMatch && queryMatch;
    });
  }, [activeFilter, articles, query]);

  const visibleArticles = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    setVisibleCount(6);
  }, [activeFilter, query]);

  useEffect(() => {
    if (!hasMore || !loadMoreRef.current) return;

    const target = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || isLoadingMore) return;
        setIsLoadingMore(true);
        window.setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + 3, filtered.length));
          setIsLoadingMore(false);
        }, 450);
      },
      { rootMargin: "120px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [filtered.length, hasMore, isLoadingMore]);

  const updateFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "todas") {
      params.delete("categoria");
    } else {
      params.set("categoria", value);
    }
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
  };

  return (
    <div className="mx-auto mt-8 grid w-full max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_290px]">
      <div>
        <section className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
          <Badge intent="accent">{title}</Badge>
          <h1 className="mt-3 font-display text-4xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
            Categoria: {title}
          </h1>
          <p className="mt-2 max-w-2xl text-stone-700 dark:text-stone-300">{description}</p>
          <p className="mt-3 text-sm text-stone-600 dark:text-stone-300">
            {filtered.length} artigo(s) encontrados
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {subcategories.map((subcategory) => {
                const isActive = activeFilter === subcategory;
                return (
                  <button
                    type="button"
                    key={subcategory}
                    onClick={() => updateFilter(subcategory)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      isActive
                        ? "border-[var(--color-nevoa)] bg-[var(--color-nevoa)]/20 text-[var(--color-nevoa)]"
                        : "border-black/10 text-stone-700 hover:border-[var(--color-nevoa)]/50 dark:border-white/10 dark:text-stone-300"
                    }`}
                  >
                    {subcategory}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <Button
                intent={viewMode === "grid" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grade
              </Button>
              <Button
                intent={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                Lista
              </Button>
            </div>
          </div>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por título, resumo ou tag"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none ring-[var(--color-accent)] transition focus:ring-2 dark:border-white/10 dark:bg-white/5"
          />
        </section>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFilter}-${viewMode}-${query}`}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -16 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={
              viewMode === "grid"
                ? "mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                : "mt-6 space-y-4"
            }
            layout
          >
            {visibleArticles.map((article) => (
              <motion.article layout key={article.id}>
                <Card className="overflow-hidden p-0">
                  <Link href={`/artigo/${article.slug}`} className="block">
                    <div className={viewMode === "list" ? "sm:flex" : ""}>
                      <div
                        className={
                          viewMode === "list"
                            ? "relative h-48 sm:h-auto sm:min-h-[170px] sm:w-[260px]"
                            : "relative h-44"
                        }
                      >
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes={
                            viewMode === "list"
                              ? "(max-width: 768px) 100vw, 260px"
                              : "(max-width: 1280px) 50vw, 33vw"
                          }
                        />
                      </div>
                      <div className="space-y-2 p-5">
                        <Badge>{article.subcategory}</Badge>
                        <h2 className="font-display text-2xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
                          {article.title}
                        </h2>
                        <p className="line-clamp-2 text-sm text-stone-700 dark:text-stone-300">
                          {article.excerpt}
                        </p>
                        <p className="text-xs text-stone-600 dark:text-stone-400">
                          {formatDate(article.publishedAt)}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {isLoadingMore && (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-48" />
            ))}
          </div>
        )}

        {hasMore && <div ref={loadMoreRef} className="h-12" aria-hidden />}
      </div>

      <aside className="space-y-5">
        <Card className="p-5">
          <h3 className="font-display text-2xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
            Categorias Populares
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {categories
              .filter((category) => category.slug !== slug)
              .slice(0, 4)
              .map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categoria/${category.slug}`}
                    className="inline-flex items-center gap-2 text-stone-700 transition hover:text-[var(--color-accent)] dark:text-stone-300"
                  >
                    <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                    {category.title}
                  </Link>
                </li>
              ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-2xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
            Tags em alta
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from(new Set(articles.flatMap((article) => article.tags)))
              .slice(0, 10)
              .map((tag) => (
                <Tag key={tag} tone="accent">
                  {tag}
                </Tag>
              ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}
