import { NextResponse } from "next/server";

interface ContactPayload {
  nome?: string;
  email?: string;
  mensagem?: string;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ContactPayload;

  if (!payload.nome || !payload.email || !payload.mensagem) {
    return NextResponse.json(
      { ok: false, message: "Campos obrigatórios ausentes." },
      { status: 400 },
    );
  }

  // Ponto de integração: Resend/Formspree.
  return NextResponse.json({
    ok: true,
    message: "Mensagem registrada com sucesso.",
    receivedAt: new Date().toISOString(),
  });
}
