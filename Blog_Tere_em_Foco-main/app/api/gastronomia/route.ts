import { NextResponse } from "next/server";
import { getArtigosPorCategoria, getArtigoPorSlug } from "@/lib/artigos";

const CATEGORIA = "gastronomia";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const artigo = await getArtigoPorSlug(slug);

    if (!artigo || artigo.category !== CATEGORIA) {
      return NextResponse.json(
        { ok: false, message: "Artigo de Gastronomia não encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, artigo });
  }

  const artigos = await getArtigosPorCategoria(CATEGORIA);
  return NextResponse.json({ ok: true, total: artigos.length, artigos });
}
