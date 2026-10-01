import { listarNoticias } from "@/backforge/noticias";
import { ok, parseCategoria, parsePagination, parseSearch } from "@/backforge/http";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { pagina, limite } = parsePagination(searchParams);
  const categoria = parseCategoria(searchParams);
  const q = parseSearch(searchParams);

  const resultado = await listarNoticias({ categoria, q, pagina, limite });
  return ok(resultado);
}
