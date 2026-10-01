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

async function loginAdminCookie() {
  const senha = process.env.ADMIN_SENHA_PADRAO ?? "tereemfoco123";
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@tereemfoco.com.br", senha }),
  });
  if (!res.ok) return null;
  const setCookie = res.headers.get("set-cookie") ?? "";
  return setCookie.split(";")[0] || null;
}

async function testarLazer() {
  try {
    // 1. Listagem
    const res = await fetch(`${BASE_URL}/api/lazer`);
    const data = await res.json();
    const valido =
      res.ok &&
      data.ok === true &&
      Array.isArray(data.opcoes) &&
      typeof data.total === "number" &&
      typeof data.pagina === "number" &&
      typeof data.limite === "number" &&
      typeof data.totalPaginas === "number" &&
      Array.isArray(data.categorias);
    log(valido, "GET /api/lazer (listagem)", valido ? `${data.total} opção(ões)` : "formato inesperado");
    if (!valido) return;

    // 2. Paginação
    const resPag = await fetch(`${BASE_URL}/api/lazer?pagina=1&limite=3`);
    const pag = await resPag.json();
    const pagValido =
      resPag.ok &&
      pag.ok === true &&
      Array.isArray(pag.opcoes) &&
      pag.opcoes.length <= 3 &&
      pag.limite === 3 &&
      pag.pagina === 1 &&
      pag.totalPaginas === Math.ceil(pag.total / 3);
    log(pagValido, "GET /api/lazer?pagina=1&limite=3 (paginação)");

    // 3. Filtro por categoria
    const categoria = data.categorias?.[0];
    if (categoria) {
      const resCat = await fetch(`${BASE_URL}/api/lazer?categoria=${encodeURIComponent(categoria)}`);
      const cat = await resCat.json();
      const catValido =
        resCat.ok &&
        cat.ok === true &&
        Array.isArray(cat.opcoes) &&
        cat.opcoes.length > 0 &&
        cat.opcoes.every((o) => o.category === categoria);
      log(catValido, `GET /api/lazer?categoria=${categoria} (filtro)`);
    } else {
      log(false, "GET /api/lazer?categoria=... (filtro)", "sem categorias disponíveis");
    }

    // 4. Busca
    const resBusca = await fetch(`${BASE_URL}/api/lazer?q=feirinha`);
    const busca = await resBusca.json();
    const buscaValido =
      resBusca.ok &&
      busca.ok === true &&
      Array.isArray(busca.opcoes) &&
      busca.opcoes.some((o) =>
        `${o.title} ${o.description} ${(o.tags ?? []).join(" ")}`.toLowerCase().includes("feirinha"),
      );
    log(buscaValido, "GET /api/lazer?q=feirinha (busca)");

    // 5. Detalhe e 404
    const slug = data.opcoes?.[0]?.slug;
    if (slug) {
      const resDet = await fetch(`${BASE_URL}/api/lazer/${slug}`);
      const det = await resDet.json();
      log(resDet.ok && det.ok === true && det.opcao?.slug === slug, `GET /api/lazer/${slug} (detalhe)`);

      const res404 = await fetch(`${BASE_URL}/api/lazer/slug-inexistente-xyz`);
      log(res404.status === 404, "GET /api/lazer/slug-inexistente-xyz (404)");
    } else {
      log(false, "GET /api/lazer/[slug] (detalhe)", "sem slug para testar");
    }

    // 6. CRUD (requer admin)
    const cookie = await loginAdminCookie();
    if (!cookie) {
      log(false, "Fluxo CRUD /api/lazer", "não foi possível autenticar como admin");
      return;
    }
    const jsonHeaders = { "Content-Type": "application/json" };
    const authHeaders = { ...jsonHeaders, cookie };

    // 6a. POST sem autenticação → 401
    const resSemAuth = await fetch(`${BASE_URL}/api/lazer`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ titulo: "x", categoria: "Teste", descricao: "y" }),
    });
    log(resSemAuth.status === 401, "POST /api/lazer sem autenticação (401)");

    // 6b. POST inválido → 400
    const resInvalido = await fetch(`${BASE_URL}/api/lazer`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ titulo: "", categoria: "", descricao: "" }),
    });
    log(resInvalido.status === 400, "POST /api/lazer inválido (400)");

    // 6c. POST válido → 201
    const tituloNovo = `Atração de teste ${Date.now()}`;
    const resCriar = await fetch(`${BASE_URL}/api/lazer`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        titulo: tituloNovo,
        categoria: "Teste Automatizado",
        descricao: "Atração criada pelo teste de API.",
        horario: "Todos os dias",
        localizacao: "Centro",
        tags: ["teste", "api"],
        imagens: ["/images/teste/1.jpg"],
      }),
    });
    const criado = await resCriar.json();
    const slugCriado = criado?.opcao?.slug;
    log(resCriar.status === 201 && criado.ok === true && !!slugCriado, "POST /api/lazer (criar)");

    if (!slugCriado) {
      log(false, "Fluxo CRUD /api/lazer", "criação não retornou slug");
      return;
    }

    // 6d. PUT → atualizar
    const resAtualizar = await fetch(`${BASE_URL}/api/lazer/${slugCriado}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ titulo: `${tituloNovo} (editado)` }),
    });
    const atualizado = await resAtualizar.json();
    log(
      resAtualizar.ok && atualizado.ok === true && atualizado.opcao?.title.includes("(editado)"),
      "PUT /api/lazer/[slug] (atualizar)",
    );

    // 6e. DELETE → excluir
    const resExcluir = await fetch(`${BASE_URL}/api/lazer/${slugCriado}`, {
      method: "DELETE",
      headers: { cookie },
    });
    const excluido = await resExcluir.json();
    log(resExcluir.ok && excluido.ok === true, "DELETE /api/lazer/[slug] (excluir)");

    // 6f. Confirmar exclusão → 404
    const resPosExclusao = await fetch(`${BASE_URL}/api/lazer/${slugCriado}`);
    log(resPosExclusao.status === 404, "GET /api/lazer/[slug] após excluir (404)");
  } catch (e) {
    log(false, "Fluxo de Lazer", e.message);
  }
}

async function main() {
  console.log(`\nTestando APIs em ${BASE_URL} ...\n`);

  await testarClima();

  const slugCultura = await testarCategoria("cultura");
  await testarArtigoPorSlug("cultura", slugCultura);

  const slugGastronomia = await testarCategoria("gastronomia");
  await testarArtigoPorSlug("gastronomia", slugGastronomia);

  await testarLazer();

  await testarAuth();

  console.log(`\nResultado: ${passou} passou(ram), ${falhou} falhou(aram).\n`);
  process.exit(falhou > 0 ? 1 : 0);
}

main();
