import { NextResponse } from "next/server";
import { z } from "zod";
import type { RowDataPacket } from "mysql2/promise";
import { getDb } from "@/lib/db";
import { verifyPassword, createSession, SESSION_COOKIE_NAME } from "@/lib/auth";

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

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Dados inválidos.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { email, senha } = parsed.data;
  const db = await getDb();

  const [usuarios] = await db.query<UsuarioRow[]>(
    "SELECT id, nome, email, senha_hash, papel FROM usuarios WHERE email = ?",
    [email],
  );
  const usuario = usuarios[0];

  if (!usuario || !verifyPassword(senha, usuario.senha_hash)) {
    return NextResponse.json(
      { ok: false, message: "E-mail ou senha incorretos." },
      { status: 401 },
    );
  }

  const { token, expiraEm } = await createSession(usuario.id);

  const response = NextResponse.json({
    ok: true,
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
    path: "/",
    expires: new Date(expiraEm),
  });

  return response;
}
