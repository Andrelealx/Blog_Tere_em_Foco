import { listarOpcoesLazer, criarOpcaoLazer, opcaoLazerSchema } from "@/backforge/lazer";
import { getCurrentUser } from "@/backforge/auth";
import {
  fail,
  ok,
  parseCategoria,
  parsePagination,
  parseSearch,
  readJsonBody,
} from "@/backforge/http";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { pagina, limite } = parsePagination(searchParams);
  const categoria = parseCategoria(searchParams);
  const q = parseSearch(searchParams);

  const resultado = await listarOpcoesLazer({ categoria, q, pagina, limite });
  return ok(resultado);
}

export async function POST(request: Request) {
  const usuario = await getCurrentUser();
  if (!usuario) return fail("Não autorizado.", 401);

  const payload = await readJsonBody(request);
  const parsed = opcaoLazerSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Dados inválidos.", 400, {
      fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    });
  }

  const opcao = await criarOpcaoLazer(parsed.data);
  return ok(opcao, 201);
}
