import { listarArtigos } from "@/backforge/artigos";
import { ok, parsePagination, parseSearch, parseSubcategoria } from "@/backforge/http";

const CATEGORIA = "gastronomia";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { pagina, limite } = parsePagination(searchParams);
  const q = parseSearch(searchParams);
  const subcategoria = parseSubcategoria(searchParams);

  const resultado = await listarArtigos({
    categoria: CATEGORIA,
    subcategoria,
    q,
    pagina,
    limite,
  });

  return ok(resultado);
}
