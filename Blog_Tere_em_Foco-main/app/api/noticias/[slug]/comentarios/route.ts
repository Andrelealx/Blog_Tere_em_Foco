import { getNoticiaPorSlug } from "@/backforge/noticias";
import { criarComentario, listarComentarios } from "@/backforge/comentarios";
import { fail, ok, readJsonBody } from "@/backforge/http";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const noticia = await getNoticiaPorSlug(params.slug);
  if (!noticia) return fail("Notícia não encontrada.", 404);

  const comentarios = await listarComentarios(noticia.id);
  return ok({ items: comentarios });
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const noticia = await getNoticiaPorSlug(params.slug);
  if (!noticia) return fail("Notícia não encontrada.", 404);

  const payload = await readJsonBody<{ autor?: string; texto?: string }>(request);
  if (!payload || !payload.autor?.trim() || !payload.texto?.trim()) {
    return fail("Autor e texto são obrigatórios.", 400);
  }

  const comentario = await criarComentario(noticia.id, {
    autor: payload.autor.trim(),
    texto: payload.texto.trim(),
  });
  return ok(comentario, 201);
}
