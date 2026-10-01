import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNoticiaPorSlug } from "@/backforge/noticias";
import { Comentarios } from "@/components/features/comentarios";
import { Badge, Tag } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

interface NoticiaPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: NoticiaPageProps): Promise<Metadata> {
  const noticia = await getNoticiaPorSlug(params.slug);
  if (!noticia) {
    return buildMetadata({
      title: "Notícia não encontrada",
      path: `/noticia/${params.slug}`,
    });
  }

  return buildMetadata({
    title: noticia.title,
    description: noticia.excerpt,
    path: `/noticia/${noticia.slug}`,
    image: noticia.image,
    type: "article",
  });
}

export default async function NoticiaPage({ params }: NoticiaPageProps) {
  const noticia = await getNoticiaPorSlug(params.slug);
  if (!noticia) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link href="/noticias" className="text-sm text-accent hover:underline">
        ← Voltar para notícias
      </Link>

      <article className="mt-4">
        <Badge>{noticia.category}</Badge>
        <h1 className="mt-3 font-display text-3xl leading-tight text-terra dark:text-cume md:text-4xl">
          {noticia.title}
        </h1>
        <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
          {noticia.author} • {formatDate(noticia.publishedAt)} • {noticia.readTime}
        </p>

        <figure className="mt-6 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
          <div className="relative h-72">
            <Image
              src={noticia.image}
              alt={noticia.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </figure>

        <p className="mt-6 text-lg leading-relaxed text-stone-700 dark:text-stone-300">
          {noticia.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {noticia.tags.map((tag) => (
            <Tag key={tag} tone="accent">
              {tag}
            </Tag>
          ))}
        </div>
      </article>

      <Comentarios slug={noticia.slug} />
    </div>
  );
}
