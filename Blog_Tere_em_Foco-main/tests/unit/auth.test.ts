import { beforeAll, describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import {
  SESSION_COOKIE_NAME,
  createSession,
  destroySession,
  getSessionUser,
  verifyPassword,
} from "@/backforge/auth";
import { getDb } from "@/backforge/db";

/**
 * Testes unitários do módulo de autenticação (`backforge/auth.ts`).
 *
 * Para manter os testes isolados e determinísticos, apontamos o banco para
 * uma porta sem MySQL. O `getDb()` detecta a falha de conexão e cai no pool
 * em memória (mesmo fallback de produção quando o MySQL está fora).
 */
beforeAll(() => {
  process.env.DB_HOST = "127.0.0.1";
  process.env.DB_PORT = "3399";
  delete process.env.ADMIN_SENHA_PADRAO;
});

describe("SESSION_COOKIE_NAME", () => {
  it("usa o nome esperado pelo fluxo de sessão", () => {
    expect(SESSION_COOKIE_NAME).toBe("tere_session");
  });
});

describe("verifyPassword", () => {
  it("aceita a senha correta", () => {
    const hash = bcrypt.hashSync("senha-secreta", 10);
    expect(verifyPassword("senha-secreta", hash)).toBe(true);
  });

  it("rejeita a senha incorreta", () => {
    const hash = bcrypt.hashSync("senha-secreta", 10);
    expect(verifyPassword("senha-errada", hash)).toBe(false);
  });
});

describe("sessões", () => {
  it("cria uma sessão e recupera o usuário correspondente", async () => {
    const { token, expiraEm } = await createSession(1);

    expect(token).toBeTruthy();
    expect(expiraEm).toBeTruthy();

    const usuario = await getSessionUser(token);
    expect(usuario).not.toBeNull();
    expect(usuario?.id).toBe(1);
    expect(usuario?.email).toBe("admin@tereemfoco.com.br");
    expect(usuario?.papel).toBe("admin");
  });

  it("retorna null para token inexistente", async () => {
    const usuario = await getSessionUser("token-que-nao-existe");
    expect(usuario).toBeNull();
  });

  it("retorna null quando o token é undefined", async () => {
    const usuario = await getSessionUser(undefined);
    expect(usuario).toBeNull();
  });

  it("rejeita e remove uma sessão expirada", async () => {
    const db = await getDb();
    const token = `sessao-expirada-${Date.now()}`;

    await db.query(
      "INSERT INTO sessoes (token, usuario_id, criado_em, expira_em) VALUES (?, ?, ?, ?)",
      [token, 1, new Date(), new Date(Date.now() - 1000)],
    );

    const usuario = await getSessionUser(token);
    expect(usuario).toBeNull();

    // A sessão expirada deve ter sido apagada automaticamente.
    const [restantes] = (await db.query(
      "SELECT token FROM sessoes WHERE token = ?",
      [token],
    )) as unknown as [Array<{ token: string }>];
    expect(restantes).toHaveLength(0);
  });

  it("destroySession remove a sessão do banco", async () => {
    const { token } = await createSession(1);

    await destroySession(token);

    const usuario = await getSessionUser(token);
    expect(usuario).toBeNull();
  });

  it("destroySession não lança erro para token vazio", async () => {
    await expect(destroySession(undefined)).resolves.toBeUndefined();
  });
});
