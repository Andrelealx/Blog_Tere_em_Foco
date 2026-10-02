import type { TourismPoint } from "@/lib/pontos-turisticos";

export type EstabelecimentoGastronomico = Omit<TourismPoint, "type"> & {
  type: "Gastronomia";
};

export type EstabelecimentoInput = Omit<
  EstabelecimentoGastronomico,
  "id" | "type"
>;

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const result = (await response.json()) as {
    ok: boolean;
    data?: T;
    error?: { message?: string };
  };

  if (!response.ok || !result.ok || result.data === undefined) {
    throw new Error(
      result.error?.message ?? "Não foi possível concluir a operação.",
    );
  }
  return result.data;
}

const collectionPath = "/api/gastronomia/estabelecimentos";

export function listarEstabelecimentos(): Promise<
  EstabelecimentoGastronomico[]
> {
  return request<EstabelecimentoGastronomico[]>(collectionPath);
}

export function criarEstabelecimento(
  estabelecimento: EstabelecimentoInput,
): Promise<EstabelecimentoGastronomico> {
  return request<EstabelecimentoGastronomico>(collectionPath, {
    method: "POST",
    body: JSON.stringify(estabelecimento),
  });
}

export function atualizarEstabelecimento(
  id: string,
  estabelecimento: Partial<EstabelecimentoInput>,
): Promise<EstabelecimentoGastronomico> {
  return request<EstabelecimentoGastronomico>(
    `${collectionPath}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(estabelecimento),
    },
  );
}

export function excluirEstabelecimento(id: string): Promise<{ mensagem: string }> {
  return request<{ mensagem: string }>(
    `${collectionPath}/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}
