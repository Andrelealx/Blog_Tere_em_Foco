import { cookies } from "next/headers";
import { destroySession, SESSION_COOKIE_NAME } from "@/backforge/auth";
import { ok } from "@/backforge/http";

export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  await destroySession(token);

  const response = ok({ mensagem: "Sessão encerrada." });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
