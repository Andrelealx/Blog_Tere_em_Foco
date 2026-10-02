import { z } from "zod";
import type { RowDataPacket } from "mysql2/promise";
import { getDb } from "@/backforge/db";
import {
  createSession,
  SESSION_COOKIE_NAME,
  verifyPassword,
} from "@/backforge/auth";
import { fail, ok, readJsonBody } from "@/backforge/http";
import bcrypt from "bcryptjs";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(1, "Senha obrigatória."),
});

interface UsuarioRow extends RowDataPacket {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
  papel: string;
}

/**
 * Hash dummy usado quando o e-mail não existe. Mantém o custo do bcrypt
 * constante, evitando que a diferença de tempo da resposta revele se um
 * e-mail está (ou não) cadastrado.
 */
const DUMMY_HASH = bcrypt.hashSync("senha-invalida-dummy", 10);

export async function POST(request: Request) {
  const payload = await readJsonBody(request);
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return fail("Dados inválidos.", 400, {
      fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    });
  }

  const { email, senha } = parsed.data;
  const db = await getDb();

  const [usuarios] = await db.query<UsuarioRow[]>(
    "SELECT id, nome, email, senha_hash, papel FROM usuarios WHERE email = ?",
    [email],
  );
  const usuario = usuarios[0];

  // Sempre executa a comparação (mesmo sem usuário) para equalizar o tempo
  // de resposta e não permitir enumeração de contas por timing.
  const senhaConfere = usuario
    ? verifyPassword(senha, usuario.senha_hash)
    : verifyPassword(senha, DUMMY_HASH);

  if (!usuario || !senhaConfere) {
    return fail("E-mail ou senha incorretos.", 401);
  }

  const { token, expiraEm } = await createSession(usuario.id);

  const response = ok({
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
    },
  });

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiraEm),
  });

  return response;
}
