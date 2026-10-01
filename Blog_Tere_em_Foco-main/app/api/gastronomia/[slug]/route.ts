import { getArtigoPorSlug } from "@/backforge/artigos";
import { fail, ok } from "@/backforge/http";

const CATEGORIA = "gastronomia";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const artigo = await getArtigoPorSlug(params.slug);
  if (!artigo || artigo.category !== CATEGORIA) {
    return fail("Artigo de Gastronomia não encontrado.", 404);
  }
  return ok(artigo);
}
