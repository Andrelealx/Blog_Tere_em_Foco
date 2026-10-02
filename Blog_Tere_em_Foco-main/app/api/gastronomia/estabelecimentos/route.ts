import { getCurrentUser } from "@/backforge/auth";
import {
  criarEstabelecimento,
  estabelecimentoSchema,
  listarEstabelecimentos,
} from "@/backforge/estabelecimentos";
import { fail, ok, readJsonBody } from "@/backforge/http";

export async function GET() {
  const estabelecimentos = await listarEstabelecimentos();
  return ok(estabelecimentos);
}

export async function POST(request: Request) {
  const usuario = await getCurrentUser();
  if (!usuario) return fail("Não autorizado.", 401);

  const payload = await readJsonBody(request);
  const parsed = estabelecimentoSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Dados inválidos.", 400, {
      fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    });
  }

  const estabelecimento = await criarEstabelecimento(parsed.data);
  return ok(estabelecimento, 201);
}
