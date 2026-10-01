/**
 * @file backforge/http.ts
 * @description Helpers de HTTP do backforge — envelope padrão de resposta,
 * parse de paginação/busca e leitura segura do corpo JSON.
 *
 * Todas as rotas `/api/*` devem devolver:
 *   - Sucesso: `{ ok: true, data: <payload> }`
 *   - Erro:    `{ ok: false, error: { message, code?, fields? } }`
 */

import { NextResponse } from "next/server";

export interface ApiErrorBody {
  message: string;
  code?: string;
  fields?: Record<string, string[]>;
}

/** Resposta de sucesso no envelope padrão. */
export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ ok: true, data }, { status });
}

/** Resposta de erro no envelope padrão. */
export function fail(
  message: string,
  status = 400,
  options: { code?: string; fields?: Record<string, string[]> } = {},
): NextResponse {
  const error: ApiErrorBody = { message };
  if (options.code) error.code = options.code;
  if (options.fields) error.fields = options.fields;
  return NextResponse.json({ ok: false, error }, { status });
}

/** Lê o corpo JSON com segurança (nunca estoura em JSON malformado). */
export async function readJsonBody<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

/** Lê `pagina` e `limite` da query string com valores saneados. */
export function parsePagination(searchParams: URLSearchParams): {
  pagina: number;
  limite: number;
} {
  const paginaBruta = Number(searchParams.get("pagina"));
  const pagina =
    Number.isFinite(paginaBruta) && paginaBruta > 0 ? Math.floor(paginaBruta) : 1;

  const limiteBruto = Number(searchParams.get("limite"));
  const limite =
    Number.isFinite(limiteBruto) && limiteBruto > 0
      ? Math.min(50, Math.floor(limiteBruto))
      : 12;

  return { pagina, limite };
}

/** Lê o termo de busca `q` (opcional). */
export function parseSearch(searchParams: URLSearchParams): string | undefined {
  return searchParams.get("q")?.trim() || undefined;
}

/** Lê o filtro `categoria` (opcional). */
export function parseCategoria(searchParams: URLSearchParams): string | undefined {
  return searchParams.get("categoria")?.trim() || undefined;
}

/** Lê o filtro `subcategoria` (opcional). */
export function parseSubcategoria(searchParams: URLSearchParams): string | undefined {
  return searchParams.get("subcategoria")?.trim() || undefined;
}
