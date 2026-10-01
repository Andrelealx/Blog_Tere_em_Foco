import { criarContato } from "@/backforge/contato";
import { fail, ok, readJsonBody } from "@/backforge/http";

interface ContactPayload {
  nome?: string;
  email?: string;
  assunto?: string;
  mensagem?: string;
}

export async function POST(request: Request) {
  const payload = await readJsonBody<ContactPayload>(request);

  if (!payload || !payload.nome || !payload.email || !payload.mensagem) {
    return fail("Campos obrigatórios ausentes.", 400);
  }

  await criarContato({
    nome: payload.nome,
    email: payload.email,
    assunto: payload.assunto,
    mensagem: payload.mensagem,
  });

  return ok({ mensagem: "Mensagem registrada com sucesso." }, 201);
}
