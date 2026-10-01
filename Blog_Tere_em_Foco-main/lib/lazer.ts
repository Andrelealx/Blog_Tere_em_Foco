/**
 * @file lib/lazer.ts
 * @description Camada de acesso às opções de lazer do Terê em Foco.
 *
 * Cada "opção de lazer" é uma atração/roteiro (parque, mirante, feira, etc.)
 * com título, categoria, descrição, horário de funcionamento, localização,
 * tags e galeria de imagens. Diferente dos artigos (conteúdo editorial),
 * que ficam na tabela `artigos`, as opções de lazer vivem na tabela
 * `opcoes_lazer`.
 *
 * Suporta listagem com filtro (categoria), busca (q) e paginação
 * (pagina/limite), além do CRUD completo usado pelas rotas /api/lazer.
 */

import type { Pool, RowDataPacket } from "mysql2/promise";
import { z } from "zod";
import { getDb } from "@/lib/db";

export interface OpcaoLazerDTO {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  schedule: string;
  location: string;
  tags: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface OpcaoLazerRow extends RowDataPacket {
  id: number;
  slug: string;
  titulo: string;
  categoria: string;
  descricao: string | null;
  horario: string | null;
  localizacao: string | null;
  tags: unknown;
  imagens: unknown;
  criado_em: string;
  atualizado_em: string;
}

export interface ListarOpcoesLazerParams {
  categoria?: string;
  q?: string;
  pagina: number;
  limite: number;
}

export interface ListarOpcoesLazerResult {
  opcoes: OpcaoLazerDTO[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
  categorias: string[];
}

/** Validação do corpo de criação (POST /api/lazer). */
export const opcaoLazerSchema = z.object({
  titulo: z.string().trim().min(1, "Título é obrigatório.").max(255),
  categoria: z.string().trim().min(1, "Categoria é obrigatória.").max(64),
  descricao: z.string().trim().min(1, "Descrição é obrigatória."),
  horario: z.string().trim().max(255).optional().default(""),
  localizacao: z.string().trim().max(255).optional().default(""),
  tags: z.array(z.string().trim().min(1)).max(20).optional().default([]),
  imagens: z.array(z.string().trim().min(1)).max(20).optional().default([]),
});

/** Validação do corpo de atualização (PUT /api/lazer/[slug]). Todos os campos são opcionais. */
export const opcaoLazerUpdateSchema = z.object({
  titulo: z.string().trim().min(1, "Título é obrigatório.").max(255).optional(),
  categoria: z.string().trim().min(1, "Categoria é obrigatória.").max(64).optional(),
  descricao: z.string().trim().min(1, "Descrição é obrigatória.").optional(),
  horario: z.string().trim().max(255).optional(),
  localizacao: z.string().trim().max(255).optional(),
  tags: z.array(z.string().trim().min(1)).max(20).optional(),
  imagens: z.array(z.string().trim().min(1)).max(20).optional(),
});

export type OpcaoLazerCreateInput = z.infer<typeof opcaoLazerSchema>;
export type OpcaoLazerUpdateInput = z.infer<typeof opcaoLazerUpdateSchema>;

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

function mapRow(row: OpcaoLazerRow): OpcaoLazerDTO {
  return {
    id: row.id,
    slug: row.slug,
    title: row.titulo,
    category: row.categoria,
    description: row.descricao ?? "",
    schedule: row.horario ?? "",
    location: row.localizacao ?? "",
    tags: parseJsonField<string[]>(row.tags, []),
    images: parseJsonField<string[]>(row.imagens, []),
    createdAt: row.criado_em,
    updatedAt: row.atualizado_em,
  };
}

/** Converte um título em slug (remove acentos, minúsculas, hífens). */
function slugify(texto: string): string {
  const slug = texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
  return slug || "opcao";
}

async function slugExiste(db: Pool, slug: string): Promise<boolean> {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id FROM opcoes_lazer WHERE slug = ? LIMIT 1",
    [slug],
  );
  return rows.length > 0;
}

/** Gera um slug único a partir do título (adiciona sufixo numérico se preciso). */
async function gerarSlugUnico(db: Pool, titulo: string): Promise<string> {
  const base = slugify(titulo);
  let slug = base;
  let sufixo = 2;
  while (await slugExiste(db, slug)) {
    slug = `${base}-${sufixo}`;
    sufixo += 1;
  }
  return slug;
}

/** Lista as categorias distintas cadastradas (para o filtro). */
export async function listarCategoriasLazer(): Promise<string[]> {
  const db = await getDb();
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT DISTINCT categoria FROM opcoes_lazer ORDER BY categoria",
  );
  return rows.map((row) => row.categoria as string);
}

/** Lista opções de lazer com filtro, busca e paginação. */
export async function listarOpcoesLazer(
  params: ListarOpcoesLazerParams,
): Promise<ListarOpcoesLazerResult> {
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
      "(titulo LIKE ? OR descricao LIKE ? OR localizacao LIKE ? OR LOWER(CAST(tags AS CHAR)) LIKE ?)",
    );
    valores.push(termo, termo, termo, `%${q.toLowerCase()}%`);
  }

  const where = condicoes.length > 0 ? `WHERE ${condicoes.join(" AND ")}` : "";

  const [contagem] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM opcoes_lazer ${where}`,
    valores,
  );
  const total = Number(contagem[0]?.total ?? 0);

  const offset = (pagina - 1) * limite;
  const [rows] = await db.query<OpcaoLazerRow[]>(
    `SELECT * FROM opcoes_lazer ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...valores, limite, offset],
  );

  const categorias = await listarCategoriasLazer();

  return {
    opcoes: rows.map(mapRow),
    total,
    pagina,
    limite,
    totalPaginas: Math.ceil(total / limite),
    categorias,
  };
}

/** Busca uma opção de lazer pelo slug (ou null). */
export async function getOpcaoLazerPorSlug(slug: string): Promise<OpcaoLazerDTO | null> {
  const db = await getDb();
  const [rows] = await db.query<OpcaoLazerRow[]>(
    "SELECT * FROM opcoes_lazer WHERE slug = ?",
    [slug],
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

/** Cria uma opção de lazer e devolve o registro persistido. */
export async function criarOpcaoLazer(data: OpcaoLazerCreateInput): Promise<OpcaoLazerDTO> {
  const db = await getDb();
  const slug = await gerarSlugUnico(db, data.titulo);
  const agora = new Date();

  await db.query(
    `INSERT INTO opcoes_lazer
      (slug, titulo, categoria, descricao, horario, localizacao, tags, imagens, criado_em, atualizado_em)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      slug,
      data.titulo,
      data.categoria,
      data.descricao,
      data.horario ?? "",
      data.localizacao ?? "",
      JSON.stringify(data.tags ?? []),
      JSON.stringify(data.imagens ?? []),
      agora,
      agora,
    ],
  );

  const opcao = await getOpcaoLazerPorSlug(slug);
  if (!opcao) {
    throw new Error("Falha ao recuperar a opção de lazer recém-criada.");
  }
  return opcao;
}

/** Atualiza uma opção de lazer pelo slug (apenas os campos enviados). Devolve null se não existir. */
export async function atualizarOpcaoLazer(
  slug: string,
  data: OpcaoLazerUpdateInput,
): Promise<OpcaoLazerDTO | null> {
  const db = await getDb();
  const existente = await getOpcaoLazerPorSlug(slug);
  if (!existente) return null;

  const campos: string[] = [];
  const valores: unknown[] = [];

  if (data.titulo !== undefined) {
    campos.push("titulo = ?");
    valores.push(data.titulo);
  }
  if (data.categoria !== undefined) {
    campos.push("categoria = ?");
    valores.push(data.categoria);
  }
  if (data.descricao !== undefined) {
    campos.push("descricao = ?");
    valores.push(data.descricao);
  }
  if (data.horario !== undefined) {
    campos.push("horario = ?");
    valores.push(data.horario);
  }
  if (data.localizacao !== undefined) {
    campos.push("localizacao = ?");
    valores.push(data.localizacao);
  }
  if (data.tags !== undefined) {
    campos.push("tags = ?");
    valores.push(JSON.stringify(data.tags));
  }
  if (data.imagens !== undefined) {
    campos.push("imagens = ?");
    valores.push(JSON.stringify(data.imagens));
  }

  if (campos.length > 0) {
    campos.push("atualizado_em = ?");
    valores.push(new Date());
    valores.push(slug);
    await db.query(`UPDATE opcoes_lazer SET ${campos.join(", ")} WHERE slug = ?`, valores);
  }

  return getOpcaoLazerPorSlug(slug);
}

/** Exclui uma opção de lazer pelo slug. Devolve true se algo foi removido. */
export async function excluirOpcaoLazer(slug: string): Promise<boolean> {
  const db = await getDb();
  const existente = await getOpcaoLazerPorSlug(slug);
  if (!existente) return false;

  await db.query("DELETE FROM opcoes_lazer WHERE slug = ?", [slug]);
  return true;
}
