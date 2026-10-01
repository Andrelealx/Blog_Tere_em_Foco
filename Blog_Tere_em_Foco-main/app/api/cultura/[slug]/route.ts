import { getArtigoPorSlug } from "@/backforge/artigos";
import { fail, ok } from "@/backforge/http";

const CATEGORIA = "cultura";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const artigo = await getArtigoPorSlug(params.slug);
  if (!artigo || artigo.category !== CATEGORIA) {
    return fail("Artigo de Cultura não encontrado.", 404);
  }
  return ok(artigo);
}
