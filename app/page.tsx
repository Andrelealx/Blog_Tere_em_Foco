import type { Metadata } from "next";
import { HomePage } from "@/components/features/home-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Início",
  description:
    "As principais notícias, roteiros e destaques culturais de Teresópolis em uma home editorial premium.",
  path: "/",
});

export default function Page() {
  return <HomePage />;
}
