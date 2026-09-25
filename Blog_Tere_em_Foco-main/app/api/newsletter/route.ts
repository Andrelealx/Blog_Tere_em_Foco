import { NextResponse } from "next/server";

interface NewsletterPayload {
  email?: string;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as NewsletterPayload;

  if (!payload.email || !payload.email.includes("@")) {
    return NextResponse.json(
      { ok: false, message: "E-mail inválido." },
      { status: 400 },
    );
  }

  // Ponto de integração com provedor real de email marketing.
  return NextResponse.json({
    ok: true,
    message: "Inscrição concluída.",
    createdAt: new Date().toISOString(),
  });
}
