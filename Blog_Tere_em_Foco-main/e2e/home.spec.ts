import { expect, test } from "@playwright/test";

test.describe("Página inicial", () => {
  test("carrega com título e cabeçalho do site", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Terê em Foco/);
    await expect(page.locator("header")).toContainText("Terê em Foco");
    await expect(page.locator("header")).toContainText("Guia da Cidade Serrana");
  });

  test("navegação principal está presente", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("main#conteudo-principal")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });
});
