import { expect, type Page } from "@playwright/test";

export const ADMIN_EMAIL = "admin@tereemfoco.com.br";
export const ADMIN_SENHA =
  process.env.ADMIN_SENHA_PADRAO ?? "tereemfoco123";

/** Faz login no painel admin e aguarda o dashboard aparecer. */
export async function login(page: Page): Promise<void> {
  await page.goto("/admin");
  await page.fill("#email", ADMIN_EMAIL);
  await page.fill("#senha", ADMIN_SENHA);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(
    page.getByRole("heading", { name: "Painel administrativo" }),
  ).toBeVisible();
}
