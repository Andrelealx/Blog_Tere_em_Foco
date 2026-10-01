import type { Metadata } from "next";
import { HomePage } from "@/components/features/home-page";
import { listarArtigos } from "@/backforge/artigos";
import { categoryHighlights } from "@/lib/config";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Início",
  description:
    "As principais notícias, roteiros e destaques culturais de Teresópolis em uma home editorial premium.",
  path: "/",
});

export default async function Page() {
  const [featured, latest] = await Promise.all([
    listarArtigos({ pagina: 1, limite: 3 }),
    listarArtigos({ pagina: 1, limite: 6 }),
  ]);

  return (
    <HomePage
      featured={featured.items}
      latest={latest.items}
      highlights={categoryHighlights}
    />
  );
}
