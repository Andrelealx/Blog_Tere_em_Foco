import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const usuario = await getSessionUser(token);

  if (!usuario) {
    return NextResponse.json({ ok: false, usuario: null }, { status: 401 });
  }

  return NextResponse.json({ ok: true, usuario });
}
