import { expect, test, type Page } from "@playwright/test";
import { login } from "./utils";

async function getKanban(page: Page) {
  const kanban = page.getByRole("region", { name: "Quadro editorial Kanban" });
  await expect(kanban).toBeVisible();
  return kanban;
}

test.describe("Quadro Kanban editorial", () => {
  test("carrega as quatro colunas após o login", async ({ page }) => {
    await login(page);

    const kanban = await getKanban(page);

    await expect(kanban.getByText("Rascunho", { exact: true })).toBeVisible();
    await expect(kanban.getByText("Em revisão", { exact: true })).toBeVisible();
    await expect(kanban.getByText("Agendado", { exact: true })).toBeVisible();
    await expect(kanban.getByText("Publicado", { exact: true })).toBeVisible();
    await expect(kanban.getByText("notícia(s) no quadro")).toBeVisible();
  });

  test("move uma notícia entre colunas pelo seletor acessível", async ({
    page,
  }) => {
    await login(page);

    const kanban = await getKanban(page);

    // Aguarda os cards carregarem.
    const primeiroSelect = kanban.locator("article select").first();
    await expect(primeiroSelect).toBeVisible();

    const card = kanban.locator("article").first();
    const titulo = (await card.locator("p").first().innerText()).trim();
    expect(titulo).toBeTruthy();

    const atual = await primeiroSelect.inputValue();
    const destino = atual === "publicado" ? "rascunho" : "publicado";

    await primeiroSelect.selectOption(destino);

    // Feedback otimista + persistência via PATCH.
    await expect(page.getByText("movida para")).toBeVisible();

    // Restaura o status original para não sujar o banco de desenvolvimento.
    const cardMovido = kanban.locator("article").filter({ hasText: titulo });
    await cardMovido.locator("select").selectOption(atual);
    await expect(page.getByText("movida para")).toBeVisible();
  });
});
