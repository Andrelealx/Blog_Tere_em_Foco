/**
 * @file scripts/test-endpoints.mjs
 * @description Teste de integração das APIs do backforge.
 *
 * Como usar:
 *   1. Rode o servidor em um terminal:   npm run dev
 *   2. Rode este teste em outro:         npm run test:api
 *
 * O script chama cada rota e confere status HTTP + formato básico
 * da resposta (envelope { ok, data } / { ok, error }).
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
    const json = await res.json();
    const data = json.data;
    const valido =
      res.ok &&
      json.ok === true &&
      typeof data?.current?.temp === "number" &&
      Array.isArray(data?.hourly) &&
      Array.isArray(data?.daily);
    log(valido, "GET /api/weather", valido ? "" : "formato inesperado");
  } catch (e) {
    log(false, "GET /api/weather", e.message);
  }
}

async function testarCategoria(categoria) {
  try {
    const res = await fetch(`${BASE_URL}/api/${categoria}`);
    const json = await res.json();
    const data = json.data;
    const valido = res.ok && json.ok === true && Array.isArray(data?.items) && typeof data?.total === "number";
    log(valido, `GET /api/${categoria}`, valido ? `${data.total} artigo(s)` : "formato inesperado");
    return valido ? data.items[0]?.slug : null;
  } catch (e) {
    log(false, `GET /api/${categoria}`, e.message);
    return null;
  }
}

async function testarEstabelecimentosGastronomicos() {
  try {
    const res = await fetch(`${BASE_URL}/api/gastronomia/estabelecimentos`);
    const json = await res.json();
    const estabelecimentos = json.data;
    const valido =
      res.ok &&
      json.ok === true &&
      Array.isArray(estabelecimentos) &&
      estabelecimentos.length > 0 &&
      estabelecimentos.every(
        (item) =>
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          item.type === "Gastronomia" &&
          typeof item.address === "string" &&
          typeof item.lat === "number" &&
          typeof item.lng === "number",
      );
    log(
      valido,
      "GET /api/gastronomia/estabelecimentos",
      valido ? `${estabelecimentos.length} estabelecimento(s)` : "formato inesperado",
    );
  } catch (e) {
    log(false, "GET /api/gastronomia/estabelecimentos", e.message);
  }
}

async function testarArtigoPorSlug(categoria, slug) {
  if (!slug) {
    log(false, `GET /api/${categoria}/[slug]`, "sem slug para testar");
    return;
  }
  try {
    const res = await fetch(`${BASE_URL}/api/${categoria}/${slug}`);
    const json = await res.json();
    const valido = res.ok && json.ok === true && json.data?.slug === slug;
    log(valido, `GET /api/${categoria}/${slug}`);
  } catch (e) {
    log(false, `GET /api/${categoria}/${slug}`, e.message);
  }
}

async function testarAuth() {
  try {
    const loginErrado = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "naoexiste@teste.com", senha: "errada" }),
    });
    log(loginErrado.status === 401, "POST /api/auth/login (credenciais inválidas)");

    const senha = process.env.ADMIN_SENHA_PADRAO ?? "tereemfoco123";
    const loginCerto = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@tereemfoco.com.br", senha }),
    });
    const loginData = await loginCerto.json();
    const cookie = loginCerto.headers.get("set-cookie");
    log(
      loginCerto.ok && loginData.ok && loginData.data?.usuario?.email === "admin@tereemfoco.com.br",
      "POST /api/auth/login (admin padrão)",
    );

    if (cookie) {
      const cookieLimpo = cookie.split(";")[0];
      const me = await fetch(`${BASE_URL}/api/auth/me`, { headers: { cookie: cookieLimpo } });
      const meData = await me.json();
      log(me.ok && meData.data?.usuario?.email === "admin@tereemfoco.com.br", "GET /api/auth/me");

      const logout = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: { cookie: cookieLimpo },
      });
      const logoutData = await logout.json();
      log(logout.ok && logoutData.ok === true, "POST /api/auth/logout");
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
    const json = await res.json();
    const data = json.data;
    const valido =
      res.ok &&
      json.ok === true &&
      Array.isArray(data?.items) &&
      typeof data?.total === "number" &&
      typeof data?.pagina === "number" &&
      typeof data?.limite === "number" &&
      typeof data?.totalPaginas === "number" &&
      Array.isArray(data?.filtros?.categorias);
    log(valido, "GET /api/lazer (listagem)", valido ? `${data.total} opção(ões)` : "formato inesperado");
    if (!valido) return;

    // 2. Paginação
    const resPag = await fetch(`${BASE_URL}/api/lazer?pagina=1&limite=3`);
    const pag = await resPag.json();
    const pagData = pag.data;
    const pagValido =
      resPag.ok &&
      pag.ok === true &&
      Array.isArray(pagData?.items) &&
      pagData.items.length <= 3 &&
      pagData.limite === 3 &&
      pagData.pagina === 1 &&
      pagData.totalPaginas === Math.ceil(pagData.total / 3);
    log(pagValido, "GET /api/lazer?pagina=1&limite=3 (paginação)");

    // 3. Filtro por categoria
    const categoria = data.filtros?.categorias?.[0];
    if (categoria) {
      const resCat = await fetch(`${BASE_URL}/api/lazer?categoria=${encodeURIComponent(categoria)}`);
      const cat = await resCat.json();
      const catData = cat.data;
      const catValido =
        resCat.ok &&
        cat.ok === true &&
        Array.isArray(catData?.items) &&
        catData.items.length > 0 &&
        catData.items.every((o) => o.category === categoria);
      log(catValido, `GET /api/lazer?categoria=${categoria} (filtro)`);
    } else {
      log(false, "GET /api/lazer?categoria=... (filtro)", "sem categorias disponíveis");
    }

    // 4. Busca
    const resBusca = await fetch(`${BASE_URL}/api/lazer?q=feirinha`);
    const busca = await resBusca.json();
    const buscaData = busca.data;
    const buscaValido =
      resBusca.ok &&
      busca.ok === true &&
      Array.isArray(buscaData?.items) &&
      buscaData.items.some((o) =>
        `${o.title} ${o.description} ${(o.tags ?? []).join(" ")}`.toLowerCase().includes("feirinha"),
      );
    log(buscaValido, "GET /api/lazer?q=feirinha (busca)");

    // 5. Detalhe e 404
    const slug = data.items?.[0]?.slug;
    if (slug) {
      const resDet = await fetch(`${BASE_URL}/api/lazer/${slug}`);
      const det = await resDet.json();
      log(resDet.ok && det.ok === true && det.data?.slug === slug, `GET /api/lazer/${slug} (detalhe)`);

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
    const slugCriado = criado.data?.slug;
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
      resAtualizar.ok && atualizado.ok === true && atualizado.data?.title.includes("(editado)"),
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

async function testarNoticias() {
  try {
    const res = await fetch(`${BASE_URL}/api/noticias`);
    const json = await res.json();
    const data = json.data;
    const valido =
      res.ok &&
      json.ok === true &&
      Array.isArray(data?.items) &&
      typeof data?.total === "number" &&
      Array.isArray(data?.filtros?.categorias);
    log(valido, "GET /api/noticias (listagem)", valido ? `${data.total} notícia(s)` : "formato inesperado");
    if (!valido) return;

    const slug = data.items?.[0]?.slug;
    if (slug) {
      const resDet = await fetch(`${BASE_URL}/api/noticias/${slug}`);
      const det = await resDet.json();
      log(resDet.ok && det.ok === true && det.data?.slug === slug, `GET /api/noticias/${slug} (detalhe)`);

      const res404 = await fetch(`${BASE_URL}/api/noticias/slug-inexistente-xyz`);
      log(res404.status === 404, "GET /api/noticias/slug-inexistente-xyz (404)");

      const resCom = await fetch(`${BASE_URL}/api/noticias/${slug}/comentarios`);
      const com = await resCom.json();
      log(resCom.ok && com.ok === true && Array.isArray(com.data?.items), `GET /api/noticias/${slug}/comentarios (listar)`);

      const resPostCom = await fetch(`${BASE_URL}/api/noticias/${slug}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autor: "Testador", texto: `Comentário de teste ${Date.now()}` }),
      });
      const postCom = await resPostCom.json();
      log(resPostCom.status === 201 && postCom.ok === true && !!postCom.data?.id, "POST /api/noticias/[slug]/comentarios (criar)");
    } else {
      log(false, "GET /api/noticias/[slug] (detalhe)", "sem slug");
    }

    // Kanban: PATCH de status (requer admin)
    await testarKanbanStatus();
  } catch (e) {
    log(false, "Fluxo de Notícias", e.message);
  }
}

async function testarKanbanStatus() {
  const alvo = (
    await (await fetch(`${BASE_URL}/api/noticias?limite=1`)).json()
  ).data?.items?.[0];
  if (!alvo?.slug) {
    log(false, "PATCH /api/noticias/[slug] (Kanban)", "sem notícia para testar");
    return;
  }

  const jsonHeaders = { "Content-Type": "application/json" };
  const destino = alvo.status === "revisao" ? "rascunho" : "revisao";

  // 1. Sem autenticação → 401
  const semAuth = await fetch(`${BASE_URL}/api/noticias/${alvo.slug}`, {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify({ status: destino }),
  });
  log(semAuth.status === 401, "PATCH /api/noticias/[slug] sem autenticação (401)");

  const cookie = await loginAdminCookie();
  if (!cookie) {
    log(false, "PATCH /api/noticias/[slug] (Kanban)", "não foi possível autenticar como admin");
    return;
  }
  const authHeaders = { ...jsonHeaders, cookie };

  // 2. Status inválido → 400
  const invalido = await fetch(`${BASE_URL}/api/noticias/${alvo.slug}`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({ status: "status-inexistente" }),
  });
  log(invalido.status === 400, "PATCH /api/noticias/[slug] status inválido (400)");

  // 3. Slug inexistente → 404
  const naoExiste = await fetch(`${BASE_URL}/api/noticias/nao-existe-xyz`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({ status: destino }),
  });
  log(naoExiste.status === 404, "PATCH /api/noticias/[slug] inexistente (404)");

  // 4. Mover de coluna → 200 com o novo status
  const mover = await fetch(`${BASE_URL}/api/noticias/${alvo.slug}`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({ status: destino }),
  });
  const movido = await mover.json();
  log(
    mover.ok && movido.ok === true && movido.data?.status === destino,
    "PATCH /api/noticias/[slug] (mover no Kanban)",
  );

  // 5. Restaura o status original
  await fetch(`${BASE_URL}/api/noticias/${alvo.slug}`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({ status: alvo.status }),
  });
}

async function testarFormularios() {
  try {
    const contato = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: "Teste",
        email: `teste${Date.now()}@example.com`,
        assunto: "duvida",
        mensagem: "Mensagem de teste do script de API.",
      }),
    });
    log(contato.status === 201, "POST /api/contact (persistir)");

    const contatoInvalido = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    log(contatoInvalido.status === 400, "POST /api/contact inválido (400)");

    const newsletter = await fetch(`${BASE_URL}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: `news${Date.now()}@example.com` }),
    });
    log(newsletter.status === 201, "POST /api/newsletter (persistir)");

    const newsletterInvalido = await fetch(`${BASE_URL}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nao-email" }),
    });
    log(newsletterInvalido.status === 400, "POST /api/newsletter inválido (400)");
  } catch (e) {
    log(false, "Fluxo de Formulários", e.message);
  }
}

async function main() {
  console.log(`\nTestando APIs em ${BASE_URL} ...\n`);

  await testarClima();

  const slugCultura = await testarCategoria("cultura");
  await testarArtigoPorSlug("cultura", slugCultura);

  const slugGastronomia = await testarCategoria("gastronomia");
  await testarArtigoPorSlug("gastronomia", slugGastronomia);
  await testarEstabelecimentosGastronomicos();

  await testarLazer();

  await testarNoticias();

  await testarFormularios();

  await testarAuth();

  console.log(`\nResultado: ${passou} passou(ram), ${falhou} falhou(aram).\n`);
  process.exit(falhou > 0 ? 1 : 0);
}

main();
