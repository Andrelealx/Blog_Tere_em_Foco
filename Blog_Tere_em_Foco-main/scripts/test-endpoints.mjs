/**
 * @file scripts/test-endpoints.mjs
 * @description Teste de integração das APIs do Back-End (AV1).
 *
 * Como usar:
 *   1. Rode o servidor em um terminal:   npm run dev
 *   2. Rode este teste em outro:         npm run test:api
 *
 * O script chama cada rota e confere status HTTP + formato básico
 * da resposta, imprimindo PASSOU/FALHOU para cada uma.
 */

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000";

let passou = 0;
let falhou = 0;

function log(ok, nome, detalhe = "") {
  const marca = ok ? "✅ PASSOU" : "❌ FALHOU";
  console.log(`${marca} — ${nome}${detalhe ? `: ${detalhe}` : ""}`);
  ok ? passou++ : falhou++;
}

async function testarClima() {
  try {
    const res = await fetch(`${BASE_URL}/api/weather`);
    const data = await res.json();
    const valido =
      res.ok &&
      typeof data.current?.temp === "number" &&
      Array.isArray(data.hourly) &&
      Array.isArray(data.daily);
    log(valido, "GET /api/weather", valido ? "" : "formato inesperado");
  } catch (e) {
    log(false, "GET /api/weather", e.message);
  }
}

async function testarCategoria(categoria) {
  try {
    const res = await fetch(`${BASE_URL}/api/${categoria}`);
    const data = await res.json();
    const valido = res.ok && data.ok === true && Array.isArray(data.artigos);
    log(
      valido,
      `GET /api/${categoria}`,
      valido ? `${data.artigos.length} artigo(s)` : "formato inesperado",
    );
    return valido ? data.artigos[0]?.slug : null;
  } catch (e) {
    log(false, `GET /api/${categoria}`, e.message);
    return null;
  }
}

async function testarArtigoPorSlug(categoria, slug) {
  if (!slug) {
    log(false, `GET /api/${categoria}?slug=...`, "sem slug para testar");
    return;
  }
  try {
    const res = await fetch(`${BASE_URL}/api/${categoria}?slug=${slug}`);
    const data = await res.json();
    const valido = res.ok && data.ok === true && data.artigo?.slug === slug;
    log(valido, `GET /api/${categoria}?slug=${slug}`);
  } catch (e) {
    log(false, `GET /api/${categoria}?slug=${slug}`, e.message);
  }
}

async function testarAuth() {
  try {
    // login com credenciais erradas → deve falhar com 401
    const loginErrado = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "naoexiste@teste.com", senha: "errada" }),
    });
    log(loginErrado.status === 401, "POST /api/auth/login (credenciais inválidas)");

    // login com o admin padrão (ver README) → deve funcionar
    const senha = process.env.ADMIN_SENHA_PADRAO ?? "tereemfoco123";
    const loginCerto = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@tereemfoco.com.br", senha }),
    });
    const loginData = await loginCerto.json();
    const cookie = loginCerto.headers.get("set-cookie");
    log(loginCerto.ok && loginData.ok, "POST /api/auth/login (admin padrão)");

    if (cookie) {
      const me = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { cookie },
      });
      const meData = await me.json();
      log(me.ok && meData.usuario?.email === "admin@tereemfoco.com.br", "GET /api/auth/me");

      const logout = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: { cookie },
      });
      log(logout.ok, "POST /api/auth/logout");
    } else {
      log(false, "GET /api/auth/me", "cookie de sessão não recebido no login");
    }
  } catch (e) {
    log(false, "Fluxo de autenticação", e.message);
  }
}

async function main() {
  console.log(`\nTestando APIs em ${BASE_URL} ...\n`);

  await testarClima();

  const slugCultura = await testarCategoria("cultura");
  await testarArtigoPorSlug("cultura", slugCultura);

  const slugGastronomia = await testarCategoria("gastronomia");
  await testarArtigoPorSlug("gastronomia", slugGastronomia);

  const slugLazer = await testarCategoria("lazer");
  await testarArtigoPorSlug("lazer", slugLazer);

  await testarAuth();

  console.log(`\nResultado: ${passou} passou(ram), ${falhou} falhou(aram).\n`);
  process.exit(falhou > 0 ? 1 : 0);
}

main();
