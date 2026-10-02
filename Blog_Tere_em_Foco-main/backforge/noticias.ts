/**
 * @file backforge/noticias.ts
 * @description Repositório de notícias (backforge).
 */

import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { z } from "zod";
import { getDb } from "./db";
import {
  noticiaStatusValues,
  type NoticiaStatus,
} from "./noticias-seed";
import type { ListaResult, NoticiaDTO } from "./tipos";

interface NoticiaRow extends RowDataPacket {
  id: number;
  slug: string;
  titulo: string;
  resumo: string | null;
  categoria: string;
  autor: string | null;
  publicado_em: string | null;
  imagem: string | null;
  tags: unknown;
  destaque: number | boolean;
  tempo_leitura: string | null;
  status: string | null;
}

/** Validação da mudança de status (PATCH /api/noticias/[slug]). */
export const noticiaStatusSchema = z.object({
  status: z.enum(noticiaStatusValues, {
    errorMap: () => ({ message: "Status inválido." }),
  }),
});

export type NoticiaStatusInput = z.infer<typeof noticiaStatusSchema>;

function normalizarStatus(valor: unknown): NoticiaStatus {
  return noticiaStatusValues.includes(valor as NoticiaStatus)
    ? (valor as NoticiaStatus)
    : "rascunho";
}

function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function mapNoticia(row: NoticiaRow): NoticiaDTO {
  return {
    id: row.id,
    slug: row.slug,
    title: row.titulo,
    excerpt: row.resumo ?? "",
    category: row.categoria,
    author: row.autor ?? "",
    publishedAt: row.publicado_em ?? "",
    image: row.imagem ?? "",
    tags: parseJsonField<string[]>(row.tags, []),
    featured: Boolean(row.destaque),
    readTime: row.tempo_leitura ?? "",
    status: normalizarStatus(row.status),
  };
}

export interface ListarNoticiasParams {
  categoria?: string;
  q?: string;
  pagina: number;
  limite: number;
}

/** Lista notícias com filtro (categoria), busca (q) e paginação. */
export async function listarNoticias(
  params: ListarNoticiasParams,
): Promise<ListaResult<NoticiaDTO>> {
  const db = await getDb();
  const { categoria, q, pagina, limite } = params;

  const condicoes: string[] = [];
  const valores: unknown[] = [];

  if (categoria) {
    condicoes.push("categoria = ?");
    valores.push(categoria);
  }
  if (q) {
    const termo = `%${q}%`;
    condicoes.push(
      "(titulo LIKE ? OR resumo LIKE ? OR LOWER(CAST(tags AS CHAR)) LIKE ?)",
    );
    valores.push(termo, termo, `%${q.toLowerCase()}%`);
  }

  const where = condicoes.length > 0 ? `WHERE ${condicoes.join(" AND ")}` : "";

  const [contagem] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM noticias ${where}`,
    valores,
  );
  const total = Number(contagem[0]?.total ?? 0);

  const offset = (pagina - 1) * limite;
  const [rows] = await db.query<NoticiaRow[]>(
    `SELECT * FROM noticias ${where} ORDER BY publicado_em DESC, id DESC LIMIT ? OFFSET ?`,
    [...valores, limite, offset],
  );

  const categorias = await listarCategoriasNoticias();

  return {
    items: rows.map(mapNoticia),
    total,
    pagina,
    limite,
    totalPaginas: Math.ceil(total / limite),
    filtros: { categorias },
  };
}

/** Busca uma notícia pelo slug (ou null). */
export async function getNoticiaPorSlug(slug: string): Promise<NoticiaDTO | null> {
  const db = await getDb();
  const [rows] = await db.query<NoticiaRow[]>(
    "SELECT * FROM noticias WHERE slug = ?",
    [slug],
  );
  return rows[0] ? mapNoticia(rows[0]) : null;
}

/** Lista categorias distintas de notícias. */
export async function listarCategoriasNoticias(): Promise<string[]> {
  const db = await getDb();
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT DISTINCT categoria FROM noticias ORDER BY categoria",
  );
  return rows.map((r) => r.categoria as string);
}

/** Notícias em destaque (para a home/hero da página de notícias). */
export async function getNoticiasDestaque(limite = 6): Promise<NoticiaDTO[]> {
  const db = await getDb();
  const [rows] = await db.query<NoticiaRow[]>(
    "SELECT * FROM noticias WHERE destaque = 1 ORDER BY publicado_em DESC LIMIT ?",
    [limite],
  );
  return rows.map(mapNoticia);
}

/**
 * Atualiza apenas o status editorial de uma notícia (movimento no Kanban).
 * Devolve o registro atualizado, ou null se a notícia não existir.
 */
export async function atualizarStatusNoticia(
  slug: string,
  status: NoticiaStatus,
): Promise<NoticiaDTO | null> {
  const db = await getDb();
  const [resultado] = await db.query<ResultSetHeader>(
    "UPDATE noticias SET status = ? WHERE slug = ?",
    [status, slug],
  );

  if (Number(resultado?.affectedRows ?? 0) === 0) {
    const existente = await getNoticiaPorSlug(slug);
    if (!existente) return null;
  }

  return getNoticiaPorSlug(slug);
}
