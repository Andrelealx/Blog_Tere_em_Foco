import {
  getOpcaoLazerPorSlug,
  atualizarOpcaoLazer,
  excluirOpcaoLazer,
  opcaoLazerUpdateSchema,
} from "@/backforge/lazer";
import { getCurrentUser } from "@/backforge/auth";
import { fail, ok, readJsonBody } from "@/backforge/http";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const opcao = await getOpcaoLazerPorSlug(params.slug);
  if (!opcao) return fail("Opção de lazer não encontrada.", 404);
  return ok(opcao);
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const usuario = await getCurrentUser();
  if (!usuario) return fail("Não autorizado.", 401);

  const payload = await readJsonBody(request);
  const parsed = opcaoLazerUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Dados inválidos.", 400, {
      fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    });
  }

  const opcao = await atualizarOpcaoLazer(params.slug, parsed.data);
  if (!opcao) return fail("Opção de lazer não encontrada.", 404);
  return ok(opcao);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const usuario = await getCurrentUser();
  if (!usuario) return fail("Não autorizado.", 401);

  const removido = await excluirOpcaoLazer(params.slug);
  if (!removido) return fail("Opção de lazer não encontrada.", 404);
  return ok({ mensagem: "Opção de lazer excluída." });
}
