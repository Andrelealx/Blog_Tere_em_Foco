# Credenciais e Setup — Terê em Foco

Documento único com tudo que é preciso para rodar o projeto num ambiente
novo (outro computador, outra máquina virtual, etc.). Estas são credenciais
de **desenvolvimento local**, não de produção — servem só para o trabalho
acadêmico rodar de forma consistente entre os integrantes.

---

## 1. Rodando em um ambiente novo (recomendado)

Pré-requisitos: **Node.js 18+** e **Docker Desktop** instalados e abertos.

```bash
npm run setup
```

Esse comando faz tudo sozinho:
1. Confere se o Docker está rodando.
2. Cria o `.env.local` (copiando de `.env.example`) se ainda não existir.
3. Sobe o container do MySQL (`docker compose up -d`) e espera ele ficar saudável.
4. Roda `npm install`.
5. Sobe o servidor por alguns segundos só para o banco criar as tabelas e os
   dados iniciais automaticamente, confirma que funcionou, e encerra esse
   servidor temporário.

No final, é só rodar:

```bash
npm run dev
```

E acessar `http://localhost:3000`.

> **Clima (OpenWeather):** o `.env.example` já vem com
> `NEXT_PUBLIC_USE_WEATHER_MOCK=false` (usa a API real). Para ativar a previsão
> do tempo real, cole a sua chave da OpenWeather em `OPENWEATHER_API_KEY` no
> `.env.local` depois do `npm run setup`. Sem chave, o app usa dados de exemplo
> (mock) automaticamente — não quebra.

> Se a máquina não tiver Docker, dá pra usar um MySQL já instalado: crie um
> banco vazio e ajuste as variáveis `DB_*` no `.env.local` (seção 3). O app
> cria o schema e os dados sozinho na primeira execução, não precisa rodar
> nenhum `.sql` manualmente.

---

## 2. Painel administrativo

- **URL:** `http://localhost:3000/admin` (também tem um link "Área administrativa" no rodapé do site)
- **E-mail:** `admin@tereemfoco.com.br`
- **Senha:** `tereemfoco123`

Esse usuário é criado automaticamente na primeira vez que o app conecta no
banco (ver `lib/db.ts`). Se quiser uma senha diferente, defina
`ADMIN_SENHA_PADRAO` no `.env.local` **antes** de rodar o setup pela primeira
vez (depois que o usuário já existe no banco, mudar a variável não tem
efeito — teria que trocar direto no banco ou apagar o volume do Docker).

---

## 3. Banco de dados (MySQL)

Credenciais usadas pelo `docker-compose.yml` e pelo app (`lib/db.ts`),
definidas em `.env.local` (copiado de `.env.example`):

| Variável           | Valor padrão       | Uso                                             |
|--------------------|---------------------|--------------------------------------------------|
| `DB_HOST`          | `127.0.0.1`          | Host do MySQL                                    |
| `DB_PORT`          | `3306`               | Porta do MySQL                                   |
| `DB_NAME`          | `tere_em_foco`       | Banco usado pela aplicação                       |
| `DB_USER`          | `tere_app`           | Usuário da aplicação (leitura/escrita no banco)  |
| `DB_PASSWORD`      | `tereemfoco123`      | Senha do usuário acima                           |
| `DB_ROOT_PASSWORD` | `tereemfoco_root`    | Senha do `root`, usada só para criar o container |

Acesso direto ao banco (útil para debug), com o container rodando:

```bash
docker exec -it tere_mysql mysql -u tere_app -ptereemfoco123 tere_em_foco
```

Ou como root:

```bash
docker exec -it tere_mysql mysql -u root -ptereemfoco_root
```

Tabelas: `categorias`, `artigos`, `usuarios`, `sessoes` (schema completo em `lib/db.ts`).

Os dados ficam no volume Docker `tere_mysql_data` — sobrevivem a
`docker compose down` (recriar o container) e só somem com
`docker compose down -v` (apaga o volume) ou `docker volume rm`.

---

## 4. Comandos úteis

```bash
docker compose up -d       # sobe o MySQL
docker compose ps          # status do container
docker compose logs mysql  # logs do banco
docker compose down        # para o container (mantém os dados)

npm run dev                # app em modo desenvolvimento (porta 3000)
npm run build && npm start # build de produção + start
npm run test:api           # testa todas as rotas de API (precisa do dev rodando)
npm run typecheck          # checa tipos TypeScript
npm run lint               # checa lint
```

---

## 5. Resetar tudo do zero

Se quiser apagar o banco e recomeçar (por exemplo, para testar o setup
"limpo" de novo):

```bash
docker compose down -v
npm run setup
```

---

## ⚠️ Importante

Essas credenciais são propositalmente simples porque o projeto roda 100%
local, sem exposição pública. **Nunca reutilize essas senhas em um ambiente
com acesso pela internet** (ex.: deploy no Railway) sem trocá-las antes por
valores fortes e mantidos fora do repositório.
