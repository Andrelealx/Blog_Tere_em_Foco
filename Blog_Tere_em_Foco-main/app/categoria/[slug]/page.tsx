import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryFeed } from "@/components/features/category-feed";
import { WeatherSection } from "@/components/features/WeatherSection";
import {
  getCategoriaPorSlug,
  listarArtigos,
  listarCategorias,
} from "@/backforge/artigos";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoriaPorSlug(params.slug);
  if (!category) {
    return buildMetadata({
      title: "Categoria não encontrada",
      path: `/categoria/${params.slug}`,
    });
  }

  return buildMetadata({
    title: category.title,
    description: category.description,
    path: `/categoria/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoriaPorSlug(params.slug);
  if (!category) notFound();

  const { items: articles } = await listarArtigos({
    categoria: category.slug,
    pagina: 1,
    limite: 50,
  });
  const categorias = await listarCategorias();
  const showWeatherSection = category.slug === "clima";

  const breadcrumb = breadcrumbJsonLd([
    { name: "Início", path: "/" },
    { name: "Categoria", path: "/categoria" },
    { name: category.title, path: `/categoria/${category.slug}` },
  ]);

  return (
    <>
      {showWeatherSection ? (
        <div className="section-container mt-8">
          <WeatherSection />
        </div>
      ) : null}
      <CategoryFeed
        slug={category.slug}
        title={category.title}
        description={category.description}
        articles={articles}
        categorias={categorias}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
