/**
 * @file backforge/artigos.ts
 * @description Repositório de artigos e categorias (backforge).
 *
 * Centraliza o acesso às tabelas `artigos` e `categorias` do MySQL,
 * com listagem paginada, filtro (categoria/subcategoria), busca e detalhe.
 */

import type { RowDataPacket } from "mysql2/promise";
import { getDb } from "./db";
import type { ArtigoDTO, ArtigoSecao, CategoriaDTO, ListaResult } from "./tipos";

interface ArtigoRow extends RowDataPacket {
  id: string;
  slug: string;
  titulo: string;
  resumo: string | null;
  autor: string | null;
  categoria: string;
  subcategoria: string | null;
  imagem_capa: string | null;
  publicado_em: string | null;
  localizacao: string | null;
  tags: unknown;
  conteudo: unknown;
}

interface CategoriaRow extends RowDataPacket {
  slug: string;
  titulo: string;
  icone: string | null;
  descricao: string | null;
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

function mapArtigo(row: ArtigoRow): ArtigoDTO {
  return {
    id: row.id,
    slug: row.slug,
    title: row.titulo,
    excerpt: row.resumo ?? "",
    author: row.autor ?? "",
    category: row.categoria,
    subcategory: row.subcategoria ?? "",
    coverImage: row.imagem_capa ?? "",
    publishedAt: row.publicado_em ?? "",
    location: row.localizacao ?? "",
    tags: parseJsonField<string[]>(row.tags, []),
    content: parseJsonField<ArtigoSecao[]>(row.conteudo, []),
  };
}

function mapCategoria(row: CategoriaRow): CategoriaDTO {
  return {
    slug: row.slug,
    title: row.titulo,
    icon: row.icone ?? "",
    description: row.descricao ?? "",
  };
}

export interface ListarArtigosParams {
  categoria?: string;
  subcategoria?: string;
  q?: string;
  pagina: number;
  limite: number;
}

/** Lista artigos com filtro, busca e paginação. */
export async function listarArtigos(
  params: ListarArtigosParams,
): Promise<ListaResult<ArtigoDTO>> {
  const db = await getDb();
  const { categoria, subcategoria, q, pagina, limite } = params;

  const condicoes: string[] = [];
  const valores: unknown[] = [];

  if (categoria) {
    condicoes.push("categoria = ?");
    valores.push(categoria);
  }
  if (subcategoria) {
    condicoes.push("subcategoria = ?");
    valores.push(subcategoria);
  }
  if (q) {
    const termo = `%${q}%`;
    condicoes.push(
      "(titulo LIKE ? OR resumo LIKE ? OR autor LIKE ? OR localizacao LIKE ? OR LOWER(CAST(tags AS CHAR)) LIKE ?)",
    );
    valores.push(termo, termo, termo, termo, `%${q.toLowerCase()}%`);
  }

  const where = condicoes.length > 0 ? `WHERE ${condicoes.join(" AND ")}` : "";

  const [contagem] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM artigos ${where}`,
    valores,
  );
  const total = Number(contagem[0]?.total ?? 0);

  const offset = (pagina - 1) * limite;
  const [rows] = await db.query<ArtigoRow[]>(
    `SELECT * FROM artigos ${where} ORDER BY publicado_em DESC, slug ASC LIMIT ? OFFSET ?`,
    [...valores, limite, offset],
  );

  const subcategorias = await listarSubcategorias(categoria);

  return {
    items: rows.map(mapArtigo),
    total,
    pagina,
    limite,
    totalPaginas: Math.ceil(total / limite),
    filtros: { subcategorias },
  };
}

/** Busca um artigo pelo slug (ou null). */
export async function getArtigoPorSlug(slug: string): Promise<ArtigoDTO | null> {
  const db = await getDb();
  const [rows] = await db.query<ArtigoRow[]>(
    "SELECT * FROM artigos WHERE slug = ?",
    [slug],
  );
  return rows[0] ? mapArtigo(rows[0]) : null;
}

/** Lista todas as categorias editoriais. */
export async function listarCategorias(): Promise<CategoriaDTO[]> {
  const db = await getDb();
  const [rows] = await db.query<CategoriaRow[]>(
    "SELECT * FROM categorias ORDER BY titulo",
  );
  return rows.map(mapCategoria);
}

/** Busca uma categoria pelo slug (ou null). */
export async function getCategoriaPorSlug(slug: string): Promise<CategoriaDTO | null> {
  const db = await getDb();
  const [rows] = await db.query<CategoriaRow[]>(
    "SELECT * FROM categorias WHERE slug = ?",
    [slug],
  );
  return rows[0] ? mapCategoria(rows[0]) : null;
}

/** Lista subcategorias distintas (de uma categoria, se informada). */
export async function listarSubcategorias(categoria?: string): Promise<string[]> {
  const db = await getDb();
  if (categoria) {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT DISTINCT subcategoria FROM artigos WHERE categoria = ? AND subcategoria IS NOT NULL ORDER BY subcategoria",
      [categoria],
    );
    return rows.map((r) => r.subcategoria as string);
  }
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT DISTINCT subcategoria FROM artigos WHERE subcategoria IS NOT NULL ORDER BY subcategoria",
  );
  return rows.map((r) => r.subcategoria as string);
}

/** Artigos relacionados da mesma categoria (exclui o próprio). */
export async function getArtigosRelacionados(
  slug: string,
  categoria: string,
  limite = 3,
): Promise<ArtigoDTO[]> {
  const db = await getDb();
  const [rows] = await db.query<ArtigoRow[]>(
    `SELECT * FROM artigos WHERE categoria = ? AND slug != ? ORDER BY publicado_em DESC, slug ASC LIMIT ?`,
    [categoria, slug, limite],
  );
  return rows.map(mapArtigo);
}
