/**
 * @file backforge/comentarios.ts
 * @description Repositório de comentários de notícias (backforge).
 */

import type { RowDataPacket } from "mysql2/promise";
import { getDb } from "./db";
import type { ComentarioDTO } from "./tipos";

interface ComentarioRow extends RowDataPacket {
  id: number;
  noticia_id: number;
  autor: string;
  texto: string;
  criado_em: string;
}

function mapComentario(row: ComentarioRow): ComentarioDTO {
  return {
    id: row.id,
    noticiaId: row.noticia_id,
    autor: row.autor,
    texto: row.texto,
    criadoEm: row.criado_em,
  };
}

/** Lista comentários de uma notícia (mais recentes primeiro). */
export async function listarComentarios(noticiaId: number): Promise<ComentarioDTO[]> {
  const db = await getDb();
  const [rows] = await db.query<ComentarioRow[]>(
    "SELECT * FROM comentarios WHERE noticia_id = ? ORDER BY criado_em DESC, id DESC",
    [noticiaId],
  );
  return rows.map(mapComentario);
}

/** Cria um comentário para uma notícia. */
export async function criarComentario(
  noticiaId: number,
  data: { autor: string; texto: string },
): Promise<ComentarioDTO> {
  const db = await getDb();
  const [result] = await db.query(
    "INSERT INTO comentarios (noticia_id, autor, texto, criado_em) VALUES (?, ?, ?, ?)",
    [noticiaId, data.autor, data.texto, new Date()],
  ) as unknown as [{ insertId: number }];

  const [rows] = await db.query<ComentarioRow[]>(
    "SELECT * FROM comentarios WHERE id = ?",
    [result.insertId],
  );
  return mapComentario(rows[0]);
}
