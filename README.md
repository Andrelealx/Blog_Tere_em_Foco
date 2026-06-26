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

```bash
npm install
npm run dev
```

App padrão em `http://localhost:3000`.

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
