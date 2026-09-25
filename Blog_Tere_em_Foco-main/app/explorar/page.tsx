import type { Metadata } from "next";
import { ExploreClient } from "@/components/features/explore-client";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Explorar",
  description:
    "Mapa interativo e galeria dos principais pontos turísticos de Teresópolis.",
  path: "/explorar",
});

export default function ExplorarPage() {
  return <ExploreClient />;
}
