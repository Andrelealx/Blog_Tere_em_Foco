import { expect, test } from "@playwright/test";
import { ADMIN_EMAIL, login } from "./utils";

test.describe("Autenticação e sessão (painel admin)", () => {
  test("exibe o formulário de login quando deslogado", async ({ page }) => {
    await page.goto("/admin");

    await expect(
      page.getByRole("heading", { name: "Entrar no admin" }),
    ).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#senha")).toBeVisible();
  });

  test("rejeita credenciais inválidas", async ({ page }) => {
    await page.goto("/admin");
    await page.fill("#email", "naoexiste@teste.com");
    await page.fill("#senha", "senha-errada");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("E-mail ou senha incorretos.")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Entrar no admin" }),
    ).toBeVisible();
  });

  test("faz login, exibe o dashboard e encerra a sessão", async ({ page }) => {
    await login(page);

    await expect(
      page.getByRole("heading", { name: "Painel administrativo" }),
    ).toBeVisible();
    await expect(page.getByText("Logado como")).toBeVisible();
    await expect(page.getByText(ADMIN_EMAIL)).toBeVisible();

    await page.getByRole("button", { name: "Sair" }).click();

    await expect(
      page.getByRole("heading", { name: "Entrar no admin" }),
    ).toBeVisible();
  });

  test("a sessão persiste entre recargas da página", async ({ page }) => {
    await login(page);

    await page.reload();

    await expect(
      page.getByRole("heading", { name: "Painel administrativo" }),
    ).toBeVisible();
  });
});
