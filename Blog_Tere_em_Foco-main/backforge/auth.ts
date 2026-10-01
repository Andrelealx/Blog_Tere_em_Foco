/**
 * @file lib/auth.ts
 * @description Autenticação e gerenciamento de sessão do Terê em Foco.
 *
 * Fluxo:
 *   1. POST /api/auth/login → valida e-mail/senha, cria uma sessão na
 *      tabela `sessoes` e devolve o token num cookie httpOnly.
 *   2. O navegador envia esse cookie automaticamente nas próximas
 *      requisições.
 *   3. GET /api/auth/me lê o cookie e devolve o usuário logado (ou 401).
 *   4. POST /api/auth/logout apaga a sessão do banco e limpa o cookie.
 *
 * A senha nunca é guardada em texto puro — apenas o hash (bcrypt).
 */

import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import type { RowDataPacket } from "mysql2/promise";
import { getDb } from "./db";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "tere_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias

export interface SessionUser {
  id: number;
  nome: string;
  email: string;
  papel: string;
}

interface SessaoRow extends RowDataPacket {
  usuario_id: number;
  expira_em: string;
}

/** Compara a senha em texto puro enviada no login com o hash salvo no banco. */
export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

/** Cria uma nova sessão no banco para o usuário e devolve o token gerado. */
export async function createSession(
  userId: number,
): Promise<{ token: string; expiraEm: string }> {
  const db = await getDb();
  const token = randomUUID();
  const criadoEm = new Date();
  const expiraEm = new Date(Date.now() + SESSION_DURATION_MS);

  await db.query(
    `INSERT INTO sessoes (token, usuario_id, criado_em, expira_em)
     VALUES (?, ?, ?, ?)`,
    [token, userId, criadoEm, expiraEm],
  );

  return { token, expiraEm: expiraEm.toISOString() };
}

/**
 * Valida um token de sessão e devolve o usuário correspondente.
 * Sessões expiradas são removidas do banco automaticamente.
 */
export async function getSessionUser(
  token: string | undefined,
): Promise<SessionUser | null> {
  if (!token) return null;

  const db = await getDb();
  const [sessoes] = await db.query<SessaoRow[]>(
    "SELECT usuario_id, expira_em FROM sessoes WHERE token = ?",
    [token],
  );
  const sessao = sessoes[0];

  if (!sessao) return null;

  if (new Date(sessao.expira_em).getTime() < Date.now()) {
    await db.query("DELETE FROM sessoes WHERE token = ?", [token]);
    return null;
  }

  const [usuarios] = await db.query<(SessionUser & RowDataPacket)[]>(
    "SELECT id, nome, email, papel FROM usuarios WHERE id = ?",
    [sessao.usuario_id],
  );

  return usuarios[0] ?? null;
}

/** Remove a sessão do banco (usado no logout). */
export async function destroySession(token: string | undefined): Promise<void> {
  if (!token) return;
  const db = await getDb();
  await db.query("DELETE FROM sessoes WHERE token = ?", [token]);
}

/**
 * Lê o cookie de sessão da requisição atual e devolve o usuário logado,
 * ou null se não houver sessão válida. Usado para proteger rotas de escrita.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return getSessionUser(token);
}
