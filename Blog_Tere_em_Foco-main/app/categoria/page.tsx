import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui";
import { categories } from "@/lib/mock-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Categorias",
  description: "Navegue pelas categorias editoriais do Terê em Foco.",
  path: "/categoria",
});

export default function CategoriesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
        Categorias
      </h1>
      <p className="mt-2 text-stone-700 dark:text-stone-300">
        Selecione uma editoria para ver os artigos disponíveis.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link href={`/categoria/${category.slug}`} key={category.slug}>
            <Card className="h-full p-5 transition hover:-translate-y-1">
              <h2 className="font-display text-2xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
                {category.title}
              </h2>
              <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">
                {category.description}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--color-accent)]">
                Abrir categoria <ArrowRight size={14} />
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
