/**
 * @file backforge/contato.ts
 * @description Repositório de mensagens de contato (backforge).
 */

import { getDb } from "./db";

export interface CriarContatoInput {
  nome: string;
  email: string;
  assunto?: string;
  mensagem: string;
}

/** Persiste uma mensagem de contato. */
export async function criarContato(data: CriarContatoInput): Promise<void> {
  const db = await getDb();
  await db.query(
    `INSERT INTO contato (nome, email, assunto, mensagem, criado_em) VALUES (?, ?, ?, ?, ?)`,
    [data.nome, data.email, data.assunto ?? "", data.mensagem, new Date()],
  );
}
