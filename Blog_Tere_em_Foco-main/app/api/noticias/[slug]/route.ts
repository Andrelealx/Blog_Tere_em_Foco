import { getNoticiaPorSlug } from "@/backforge/noticias";
import { fail, ok } from "@/backforge/http";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const noticia = await getNoticiaPorSlug(params.slug);
  if (!noticia) return fail("Notícia não encontrada.", 404);
  return ok(noticia);
}
