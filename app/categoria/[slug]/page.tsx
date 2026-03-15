import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryFeed } from "@/components/features/category-feed";
import { WeatherSection } from "@/components/features/WeatherSection";
import {
  getAllArticles,
  getArticlesByCategory,
  getCategoryInfo,
} from "@/lib/mock-data";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const categories = new Set(getAllArticles().map((article) => article.category));
  return Array.from(categories).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryInfo(params.slug);
  if (!category) {
    return buildMetadata({ title: "Categoria não encontrada", path: `/categoria/${params.slug}` });
  }

  return buildMetadata({
    title: category.title,
    description: category.description,
    path: `/categoria/${category.slug}`,
  });
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryInfo(params.slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(category.slug);
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
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
