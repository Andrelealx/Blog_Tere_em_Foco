import type { Metadata } from "next";
import { HomePage } from "@/components/features/home-page";
import { buildMetadata } from "@/lib/seo";
import dynamic from "next/dynamic"; // ← ADD

// Carrega só no navegador, evita o erro de hydration
const WeatherSection = dynamic(
  () => import("@/components/features/WeatherSection").then(m => m.WeatherSection),
  { ssr: false }
);

export const metadata: Metadata = buildMetadata({
  title: "Início",
  description:
    "As principais notícias, roteiros e destaques culturais de Teresópolis em uma home editorial premium.",
  path: "/",
});

export default function Page() {
  return (
    <>
      <HomePage />

      {/* ── Seção de Clima ──────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 py-10">
        <WeatherSection />
      </section>
    </>
  );
}