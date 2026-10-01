import { NextResponse } from "next/server";
import {
  getOpcaoLazerPorSlug,
  atualizarOpcaoLazer,
  excluirOpcaoLazer,
  opcaoLazerUpdateSchema,
} from "@/lib/lazer";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const opcao = await getOpcaoLazerPorSlug(params.slug);

  if (!opcao) {
    return NextResponse.json(
      { ok: false, message: "Opção de lazer não encontrada." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, opcao });
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const usuario = await getCurrentUser();
  if (!usuario) {
    return NextResponse.json(
      { ok: false, message: "Não autorizado." },
      { status: 401 },
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = opcaoLazerUpdateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Dados inválidos.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const opcao = await atualizarOpcaoLazer(params.slug, parsed.data);

  if (!opcao) {
    return NextResponse.json(
      { ok: false, message: "Opção de lazer não encontrada." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, opcao });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const usuario = await getCurrentUser();
  if (!usuario) {
    return NextResponse.json(
      { ok: false, message: "Não autorizado." },
      { status: 401 },
    );
  }

  const removido = await excluirOpcaoLazer(params.slug);

  if (!removido) {
    return NextResponse.json(
      { ok: false, message: "Opção de lazer não encontrada." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, message: "Opção de lazer excluída." });
}
