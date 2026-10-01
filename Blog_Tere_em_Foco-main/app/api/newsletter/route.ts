import { inscreverNewsletter } from "@/backforge/newsletter";
import { fail, ok, readJsonBody } from "@/backforge/http";

interface NewsletterPayload {
  email?: string;
}

export async function POST(request: Request) {
  const payload = await readJsonBody<NewsletterPayload>(request);

  if (!payload || !payload.email || !payload.email.includes("@")) {
    return fail("E-mail inválido.", 400);
  }

  const { jaCadastrado } = await inscreverNewsletter(payload.email);

  return ok(
    { mensagem: jaCadastrado ? "E-mail já cadastrado." : "Inscrição concluída." },
    201,
  );
}
