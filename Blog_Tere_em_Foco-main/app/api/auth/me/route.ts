import { cookies } from "next/headers";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/backforge/auth";
import { fail, ok } from "@/backforge/http";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const usuario = await getSessionUser(token);

  if (!usuario) return fail("Não autorizado.", 401);
  return ok({ usuario });
}
