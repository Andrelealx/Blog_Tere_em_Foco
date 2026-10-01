import { NextResponse } from "next/server";
import { listarOpcoesLazer, criarOpcaoLazer, opcaoLazerSchema } from "@/lib/lazer";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const categoria = searchParams.get("categoria")?.trim() || undefined;
  const q = searchParams.get("q")?.trim() || undefined;

  const paginaBruta = Number(searchParams.get("pagina"));
  const pagina = Number.isFinite(paginaBruta) && paginaBruta > 0 ? Math.floor(paginaBruta) : 1;

  const limiteBruto = Number(searchParams.get("limite"));
  const limite =
    Number.isFinite(limiteBruto) && limiteBruto > 0 ? Math.min(50, Math.floor(limiteBruto)) : 12;

  const resultado = await listarOpcoesLazer({ categoria, q, pagina, limite });

  return NextResponse.json({ ok: true, ...resultado });
}

export async function POST(request: Request) {
  const usuario = await getCurrentUser();
  if (!usuario) {
    return NextResponse.json(
      { ok: false, message: "Não autorizado." },
      { status: 401 },
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = opcaoLazerSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Dados inválidos.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const opcao = await criarOpcaoLazer(parsed.data);

  return NextResponse.json({ ok: true, opcao }, { status: 201 });
}
