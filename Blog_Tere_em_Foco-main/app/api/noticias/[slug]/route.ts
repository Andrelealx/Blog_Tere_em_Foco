import {
  getNoticiaPorSlug,
  atualizarStatusNoticia,
  noticiaStatusSchema,
} from "@/backforge/noticias";
import { getCurrentUser } from "@/backforge/auth";
import { fail, ok, readJsonBody } from "@/backforge/http";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const noticia = await getNoticiaPorSlug(params.slug);
  if (!noticia) return fail("Notícia não encontrada.", 404);
  return ok(noticia);
}

/**
 * Move uma notícia entre as colunas do Kanban editorial.
 * Exige sessão autenticada e um status válido.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const usuario = await getCurrentUser();
  if (!usuario) return fail("Não autorizado.", 401);

  const payload = await readJsonBody(request);
  const parsed = noticiaStatusSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Dados inválidos.", 400, {
      fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    });
  }

  const noticia = await atualizarStatusNoticia(params.slug, parsed.data.status);
  if (!noticia) return fail("Notícia não encontrada.", 404);
  return ok(noticia);
}
