import { getCurrentUser } from "@/backforge/auth";
import {
  atualizarEstabelecimento,
  excluirEstabelecimento,
  estabelecimentoUpdateSchema,
  getEstabelecimentoPorId,
} from "@/backforge/estabelecimentos";
import { fail, ok, readJsonBody } from "@/backforge/http";

interface RouteContext {
  params: { id: string };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const estabelecimento = await getEstabelecimentoPorId(params.id);
  if (!estabelecimento) return fail("Estabelecimento não encontrado.", 404);
  return ok(estabelecimento);
}

export async function PUT(request: Request, { params }: RouteContext) {
  const usuario = await getCurrentUser();
  if (!usuario) return fail("Não autorizado.", 401);

  const payload = await readJsonBody(request);
  const parsed = estabelecimentoUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Dados inválidos.", 400, {
      fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    });
  }

  const estabelecimento = await atualizarEstabelecimento(
    params.id,
    parsed.data,
  );
  if (!estabelecimento) return fail("Estabelecimento não encontrado.", 404);
  return ok(estabelecimento);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const usuario = await getCurrentUser();
  if (!usuario) return fail("Não autorizado.", 401);

  const removido = await excluirEstabelecimento(params.id);
  if (!removido) return fail("Estabelecimento não encontrado.", 404);
  return ok({ mensagem: "Estabelecimento excluído." });
}
