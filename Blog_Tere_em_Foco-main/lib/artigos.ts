/**
 * @file lib/artigos.ts
 * @description Acesso aos artigos armazenados no banco de dados MySQL.
 *
 * Usado pelas rotas /api/cultura, /api/gastronomia e /api/lazer.
 * Centraliza aqui evita repetir a mesma query e o mesmo mapeamento
 * de linha do banco → formato usado pelo front-end (mesmo shape do
 * `Article` de lib/mock-data.ts, para facilitar a integração futura).
 */

import type { RowDataPacket } from "mysql2/promise";
import { getDb } from "@/lib/db";

interface ArtigoRow extends RowDataPacket {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  autor: string;
  categoria: string;
  subcategoria: string;
  imagem_capa: string;
  publicado_em: string;
  localizacao: string;
  tags: string[] | string | null;
  conteudo: unknown | string | null;
}

export interface ArtigoSecao {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface ArtigoDTO {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  subcategory: string;
  coverImage: string;
  publishedAt: string;
  location: string;
  tags: string[];
  content: ArtigoSecao[];
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

function mapRow(row: ArtigoRow): ArtigoDTO {
  return {
    id: row.id,
    slug: row.slug,
    title: row.titulo,
    excerpt: row.resumo,
    author: row.autor,
    category: row.categoria,
    subcategory: row.subcategoria,
    coverImage: row.imagem_capa,
    publishedAt: row.publicado_em,
    location: row.localizacao,
    tags: parseJsonField<string[]>(row.tags, []),
    content: parseJsonField<ArtigoSecao[]>(row.conteudo, []),
  };
}

/** Retorna todos os artigos de uma categoria, mais recentes primeiro. */
export async function getArtigosPorCategoria(categoria: string): Promise<ArtigoDTO[]> {
  const db = await getDb();
  const [rows] = await db.query<ArtigoRow[]>(
    "SELECT * FROM artigos WHERE categoria = ? ORDER BY publicado_em DESC",
    [categoria],
  );

  return rows.map(mapRow);
}

/** Retorna um único artigo pelo slug, ou null se não existir. */
export async function getArtigoPorSlug(slug: string): Promise<ArtigoDTO | null> {
  const db = await getDb();
  const [rows] = await db.query<ArtigoRow[]>(
    "SELECT * FROM artigos WHERE slug = ?",
    [slug],
  );

  return rows[0] ? mapRow(rows[0]) : null;
}
