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

## Back-End (AV1)

O projeto passou a ter um back-end real, rodando 100% local, sem depender de nenhum serviço externo pago.

### Banco de dados

- **MySQL 8**, rodando localmente via Docker (`docker-compose.yml`).
- Schema em `lib/db.ts`: tabelas `categorias`, `artigos`, `usuarios` e `sessoes`.
- Na primeira execução (`npm run dev`), o banco é criado e populado automaticamente com os dados que já existiam em `lib/mock-data.ts` — nenhum dado foi perdido, só migrado para um banco de verdade.
- Dados do MySQL ficam num volume Docker (`tere_mysql_data`), persistente entre reinícios do container.

#### Subindo o MySQL

```bash
docker compose up -d
```

Isso sobe um container `tere_mysql` (MySQL 8) na porta `3306`, já com o banco `tere_em_foco` e o usuário `tere_app` criados (ver `.env.example` / `docker-compose.yml` para credenciais). Não é necessário instalar MySQL na máquina.

Se preferir um MySQL já instalado localmente (sem Docker), basta criar um banco vazio e apontar as variáveis `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` no `.env.local` — o app cria as tabelas e os dados iniciais sozinho na primeira execução.

### Autenticação e sessão

- `POST /api/auth/login` — recebe `{ email, senha }`, valida contra o hash salvo no banco (bcrypt) e devolve um cookie de sessão `httpOnly`.
- `GET /api/auth/me` — devolve o usuário logado (a partir do cookie) ou `401`.
- `POST /api/auth/logout` — encerra a sessão.
- Um usuário administrador é criado automaticamente na primeira execução:
  - **E-mail:** `admin@tereemfoco.com.br`
  - **Senha:** `tereemfoco123` (ou o valor de `ADMIN_SENHA_PADRAO` no `.env.local`, se definido)

### Painel administrativo

- Acesse **`/admin`** (também tem um atalho "Área administrativa" no rodapé do site).
- Sem sessão ativa, mostra o formulário de login (usa `/api/auth/login`).
- Logado, mostra um painel com a contagem de artigos por categoria (lida ao vivo do MySQL) e um botão de sair (`/api/auth/logout`).

### APIs de conteúdo

- `GET /api/cultura` — lista os artigos da categoria Cultura.
- `GET /api/gastronomia` — lista os artigos da categoria Gastronomia.
- `GET /api/lazer` — lista os artigos da categoria Lazer.
- Todas aceitam `?slug=algum-slug` para devolver um único artigo.
- Todas leem direto do banco (`lib/artigos.ts`), não mais de dados fixos no código.

### Clima — correção de integração

- `GET /api/weather` foi **reescrita**: a versão anterior devolvia um formato diferente do que o resto do app espera (`hooks/useWeather.ts`), o que quebrava a página de Clima em produção.
- Agora a rota sempre devolve o mesmo formato usado pelo mock (`WeatherData`, padrão OpenWeather One Call API 3.0):
  - Sem `OPENWEATHER_API_KEY` configurada → usa o mock (`lib/weather-mock.ts`).
  - Com a chave configurada → consulta a OpenWeather de verdade, convertendo a velocidade do vento de m/s para km/h (unidade usada nos cálculos de risco).
  - Se a chamada externa falhar → cai no mock automaticamente, sem quebrar a página.

### Testando tudo de uma vez

Com o servidor rodando (`npm run dev`), em outro terminal:

```bash
npm run test:api
```

O script (`scripts/test-endpoints.mjs`) chama todas as rotas acima e imprime PASSOU/FALHOU para cada uma.

### O que ainda falta (previsto para a AV2)

- Notícias, Fale-Conosco e Newsletter migrarem do formulário validado para persistência real no banco.
- Cache e otimização de performance.
- Trocar os `fetch` de mock no front-end pelas APIs novas (hoje as páginas ainda leem `lib/mock-data.ts` diretamente; as rotas já existem e estão testadas, faltando só o front-end consumir).
