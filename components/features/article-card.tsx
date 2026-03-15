import Image from "next/image";
import Link from "next/link";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Tag } from "@/components/ui";
import type { Article } from "@/lib/mock-data";
import { formatDate, formatRelativeTime } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
  mode?: "compact" | "default";
}

export function ArticleCard({
  article,
  priority = false,
  mode = "default",
}: ArticleCardProps) {
  const compact = mode === "compact";

  return (
    <Card className="group overflow-hidden p-0">
      <Link href={`/artigo/${article.slug}`} className="block">
        <div className={compact ? "relative h-44" : "relative h-56"}>
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority={priority}
            sizes={compact ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 1280px) 100vw, 33vw"}
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            <Badge intent="accent">{article.category}</Badge>
            <Tag tone="subtle" className="border-white/20 bg-black/35 text-white">
              {formatRelativeTime(article.publishedAt)}
            </Tag>
          </div>
        </div>
        <CardHeader className="px-5 pt-5">
          <CardTitle className="line-clamp-2">{article.title}</CardTitle>
          <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-0 text-sm text-stone-600 dark:text-stone-300">
          <p>{article.author}</p>
          <p>{formatDate(article.publishedAt)}</p>
        </CardContent>
      </Link>
    </Card>
  );
}
