import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/features/article-card";
import { ReadingProgress } from "@/components/features/reading-progress";
import { ShareButton } from "@/components/features/share-button";
import { TableOfContents } from "@/components/features/table-of-contents";
import { Avatar, Badge, Divider, Tag } from "@/components/ui";
import {
  getAllArticles,
  getArticleBySlug,
  getArticleReadingTime,
  getRelatedArticles,
} from "@/lib/mock-data";
import { buildMetadata, siteConfig } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return buildMetadata({
      title: "Artigo não encontrado",
      path: `/artigo/${params.slug}`,
    });
  }

  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/artigo/${params.slug}`,
    image: article.coverImage,
    type: "article",
  });
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const readingTime = getArticleReadingTime(article);
  const related = getRelatedArticles(article.slug, article.category);
  const articleUrl = `${siteConfig.url}/artigo/${article.slug}`;
  const tocItems = article.content.map((section) => ({
    id: section.id,
    title: section.heading,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [`${siteConfig.url}${article.coverImage}`],
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: articleUrl,
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8">
      <ReadingProgress />
      <article className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <header className="rounded-2xl border border-black/5 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
            <Badge>{article.category}</Badge>
            <h1 className="mt-3 font-display text-4xl leading-tight text-[var(--color-terra)] dark:text-[var(--color-cume)]">
              {article.title}
            </h1>
            <p className="mt-3 text-lg text-stone-700 dark:text-stone-300">
              {article.excerpt}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={article.author} />
                <div className="text-sm">
                  <p className="font-medium text-stone-800 dark:text-stone-100">
                    {article.author}
                  </p>
                  <p className="text-stone-600 dark:text-stone-300">
                    {formatDate(article.publishedAt)} • {readingTime} de leitura
                  </p>
                </div>
              </div>
              <ShareButton
                title={article.title}
                text={article.excerpt}
                url={articleUrl}
              />
            </div>
          </header>

          <figure className="mt-6 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
            <div className="relative h-[340px] sm:h-[460px]">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 70vw"
              />
            </div>
            <figcaption className="bg-black/80 px-4 py-2 text-xs text-stone-100">
              Foto: Acervo Terê em Foco • {article.location}
            </figcaption>
          </figure>

          <div className="prose mt-8 prose-stone dark:prose-invert lg:prose-lg">
            {article.content.map((section) => (
              <section id={section.id} key={section.id} className="scroll-mt-24">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          <Divider className="my-8" />

          <section>
            <h2 className="font-display text-3xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
              Artigos Relacionados
            </h2>
            <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} mode="compact" />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <TableOfContents items={tocItems} />
          <div className="rounded-2xl border border-black/5 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-300">
              Tags
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Tag key={tag} tone="accent">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
          <Link
            href={`/categoria/${article.category}`}
            className="block rounded-xl border border-black/10 px-4 py-3 text-sm text-stone-700 transition hover:border-[var(--color-nevoa)] hover:text-[var(--color-accent)] dark:border-white/10 dark:text-stone-300"
          >
            Ver mais em {article.category}
          </Link>
        </aside>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
