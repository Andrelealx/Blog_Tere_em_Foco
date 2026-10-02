# Blog Terê em Foco

Projeto completo em **Next.js 14 + TypeScript + Tailwind CSS + Framer Motion** baseado no documento mestre do projeto.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (+ `@tailwindcss/typography`)
- Framer Motion
- React Hook Form + Zod
- next-themes (dark mode)
- Leaflet (mapa)
- Lucide React (ícones)

## Estrutura principal
- `app/` rotas e páginas (`/`, `/artigo/[slug]`, `/categoria/[slug]`, `/newsletter`, `/explorar`)
- `components/ui/` design system base (`Button`, `Card`, `Badge`, `Tag`, `Avatar`, `Skeleton`, `Divider`)
- `components/features/` recursos de página (ticker, progresso de leitura, TOC, lightbox, mapa, etc.)
- `components/forms/` formulários validados
- `lib/` dados mockados, utilitários, SEO e pontos turísticos
- `public/images/` imagens do projeto

## Rodando localmente

Num ambiente novo (primeira vez na máquina), rode o setup automatizado —
sobe o MySQL via Docker, instala as dependências e prepara o banco sozinho:

```bash
npm run setup
npm run dev
```

Ou manualmente:

```bash
docker compose up -d   # sobe o MySQL local (porta 3306)
npm install
npm run dev
```

App padrão em `http://localhost:3000`.

**Credenciais (banco e painel admin), comandos úteis e como resetar tudo:
ver [`CREDENCIAIS.md`](./CREDENCIAIS.md).**

## Qualidade

```bash
npm run typecheck
npm run lint
npm run build
```

## Variáveis de ambiente
Copie `.env.example` para `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
OPENWEATHER_API_KEY=coloque_sua_chave_aqui
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=tere_app
DB_PASSWORD=tereemfoco123
DB_NAME=tere_em_foco
```

Se `OPENWEATHER_API_KEY` não estiver definida, o widget de clima usa fallback mockado.

## Deploy no Railway

O projeto já está preparado com `railway.toml`.

1. Suba este repositório para GitHub.
2. No Railway, clique em **New Project** > **Deploy from GitHub Repo**.
3. Selecione o repositório.
4. No serviço criado, configure variáveis:
   - `NEXT_PUBLIC_SITE_URL` (URL pública final do app)
   - `OPENWEATHER_API_KEY` (opcional, mas recomendado)
5. Railway vai executar build (`npm run build`) e start (`npm run start`) automaticamente.
6. Após deploy, abra o domínio gerado em **Settings > Domains**.

## Observações
- Conteúdo atual está com dados mockados em `lib/mock-data.ts`.
- Endpoints de formulário (`/api/contact`, `/api/newsletter`) já estão preparados para integração com Resend/Formspree.

## Back-End (backforge)

O back-end vive no módulo **`backforge/`**, separado do front-end ("Blog Terê em Foco"). Roda 100% local, sem depender de serviço externo pago.

### Estrutura do backforge

- `backforge/db.ts` — pool MySQL + criação do schema + seed (idempotente).
- `backforge/http.ts` — envelope padrão `{ ok, data }` / `{ ok, error }` e helpers.
- `backforge/tipos.ts` — DTOs compartilhados (artigos, categorias, lazer, notícias, comentários).
- `backforge/auth.ts` — autenticação e sessão (bcrypt + cookie httpOnly).
- `backforge/artigos.ts` — artigos/categorias com filtro, busca e paginação.
- `backforge/lazer.ts` — CRUD de opções de lazer.
- `backforge/noticias.ts`, `contato.ts`, `newsletter.ts`, `comentarios.ts` — persistência real.

### Banco de dados (MySQL 8)

Tabelas: `categorias`, `artigos`, `opcoes_lazer`, `noticias`, `usuarios`, `sessoes`, `contato`, `newsletter` e `comentarios`. Na primeira execução o schema é criado e populado automaticamente; os dados ficam num volume Docker (`tere_mysql_data`).

```bash
docker-compose up -d   # ou `docker compose up -d`, conforme o instalado
```

### APIs (envelope padrão)

Todas as respostas seguem `{ ok: true, data }` (sucesso) ou `{ ok: false, error: { message } }` (erro).

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/cultura`, `/api/gastronomia` | artigos (filtro/busca/paginação) |
| GET | `/api/cultura/[slug]`, `/api/gastronomia/[slug]` | detalhe de artigo |
| GET/POST | `/api/gastronomia/estabelecimentos` | lista/cria estabelecimentos gastronómicos |
| GET/PUT/DELETE | `/api/gastronomia/estabelecimentos/[id]` | detalhe/atualiza/exclui estabelecimento gastronómico |
| GET/POST | `/api/lazer` | lista/cria opções de lazer |
| GET/PUT/DELETE | `/api/lazer/[slug]` | detalhe/atualiza/exclui opção de lazer |
| GET | `/api/noticias` | notícias (filtro/busca/paginação) |
| GET | `/api/noticias/[slug]` | detalhe de notícia |
| PATCH | `/api/noticias/[slug]` | atualiza o status editorial (coluna do Kanban) |
| GET/POST | `/api/noticias/[slug]/comentarios` | comentários |
| POST | `/api/contact`, `/api/newsletter` | persistência de contato/assinatura |
| GET | `/api/weather` | clima (OpenWeather com fallback para mock) |
| GET | `/api/clima` | clima (service OpenWeather + cache em memória TTL 10 min) |
| POST/GET | `/api/auth/login`, `/api/auth/me`, `/api/auth/logout` | sessão |

As operações POST, PUT e DELETE de estabelecimentos exigem uma sessão autenticada.
A listagem dos estabelecimentos é apresentada na categoria Gastronomia.

### Fluxo editorial (Kanban)

O painel administrativo (`/admin`) inclui um **quadro Kanban** para gerenciar o
fluxo editorial das notícias. Cada notícia tem um `status` (`rascunho`,
`revisao`, `agendado` ou `publicado`) que corresponde a uma coluna do quadro.
Os cards podem ser arrastados entre colunas (ou movidos pelo seletor acessível),
e a mudança é persistida via `PATCH /api/noticias/[slug]` — operação que exige
sessão autenticada.

### Autenticação

- Admin padrão: `admin@tereemfoco.com.br` / `tereemfoco123`.
- Operações de escrita (POST/PUT/DELETE de lazer) exigem sessão de admin.

### Testes

```bash
npm run test:api   # 30+ verificações de integração
```
