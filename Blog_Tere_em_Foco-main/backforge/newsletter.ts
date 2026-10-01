/**
 * @file backforge/newsletter.ts
 * @description Repositório de assinantes da newsletter (backforge).
 */

import type { RowDataPacket } from "mysql2/promise";
import { getDb } from "./db";

/** Inscreve um e-mail na newsletter. Devolve se já estava cadastrado. */
export async function inscreverNewsletter(
  email: string,
): Promise<{ jaCadastrado: boolean }> {
  const db = await getDb();

  const [existentes] = await db.query<RowDataPacket[]>(
    "SELECT id FROM newsletter WHERE email = ? LIMIT 1",
    [email],
  );
  if (existentes.length > 0) {
    return { jaCadastrado: true };
  }

  await db.query("INSERT INTO newsletter (email, criado_em) VALUES (?, ?)", [
    email,
    new Date(),
  ]);
  return { jaCadastrado: false };
}
