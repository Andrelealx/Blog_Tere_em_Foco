/**
 * @file scripts/setup.mjs
 * @description Setup automatizado do Terê em Foco para um ambiente novo.
 *
 * Faz tudo que é preciso pra rodar o projeto do zero, numa máquina que
 * nunca viu este repositório:
 *   1. Confere se o Docker está instalado e rodando.
 *   2. Cria o `.env.local` (copiando de `.env.example`) se não existir.
 *   3. Sobe o MySQL via `docker compose up -d` e espera ficar saudável.
 *   4. Roda `npm install`.
 *   5. Sobe o servidor Next.js por alguns segundos só para o banco criar
 *      o schema e os dados iniciais (isso acontece sozinho, ver lib/db.ts),
 *      confirma que funcionou e encerra esse servidor temporário.
 *
 * Uso:
 *   npm run setup
 */

import { execSync, spawn } from "node:child_process";
import { existsSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IS_WIN = process.platform === "win32";
const PORT = 3000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function step(msg) {
  console.log(`\n=== ${msg} ===`);
}

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: ROOT });
}

function commandExists(cmd) {
  try {
    execSync(IS_WIN ? `where ${cmd}` : `which ${cmd}`, { stdio: "ignore", cwd: ROOT });
    return true;
  } catch {
    return false;
  }
}

/** Prefere o binário standalone `docker-compose`; senão usa o plugin `docker compose`. */
function composeBin() {
  return commandExists("docker-compose") ? "docker-compose" : "docker compose";
}

function killTree(child) {
  if (!child.pid) return;
  if (IS_WIN) {
    try {
      execSync(`taskkill /PID ${child.pid} /T /F`, { stdio: "ignore" });
    } catch {
      /* processo já pode ter encerrado sozinho */
    }
  } else {
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      /* processo já pode ter encerrado sozinho */
    }
  }
}

async function waitForServer(url, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      /* servidor ainda não subiu, tenta de novo */
    }
    await sleep(1000);
  }
  return false;
}

async function main() {
  console.log("Terê em Foco — setup automatizado\n");

  step("1/5 — Verificando Docker");
  if (!commandExists("docker")) {
    console.error(
      "Docker não encontrado no PATH.\n" +
        "Instale o Docker Desktop (https://www.docker.com/products/docker-desktop) e rode `npm run setup` de novo.\n" +
        "Alternativa sem Docker: instale um MySQL local e configure DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME no .env.local.",
    );
    process.exit(1);
  }
  try {
    execSync("docker info", { stdio: "ignore", cwd: ROOT });
  } catch {
    console.error("O Docker está instalado, mas não parece estar rodando. Abra o Docker Desktop e tente de novo.");
    process.exit(1);
  }
  console.log("Docker OK.");

  step("2/5 — Configurando variáveis de ambiente");
  const envLocal = path.join(ROOT, ".env.local");
  const envExample = path.join(ROOT, ".env.example");
  if (!existsSync(envLocal)) {
    copyFileSync(envExample, envLocal);
    console.log(".env.local criado a partir de .env.example.");
  } else {
    console.log(".env.local já existe — mantendo como está.");
  }

  step("3/5 — Subindo o MySQL (Docker Compose)");
  run(`${composeBin()} up -d`);

  console.log("Aguardando o container do MySQL ficar saudável...");
  const dbStart = Date.now();
  let healthy = false;
  while (Date.now() - dbStart < 90_000) {
    try {
      const status = execSync('docker inspect --format "{{.State.Health.Status}}" tere_mysql', {
        cwd: ROOT,
      })
        .toString()
        .trim();
      if (status === "healthy") {
        healthy = true;
        break;
      }
    } catch {
      /* container ainda subindo */
    }
    await sleep(2000);
  }
  if (!healthy) {
    console.error(
      "O MySQL não ficou saudável a tempo. Rode `docker compose logs mysql` para investigar.",
    );
    process.exit(1);
  }
  console.log("MySQL saudável e pronto para conexões.");

  step("4/5 — Instalando dependências do Node");
  run("npm install");

  step("5/5 — Criando o schema e os dados iniciais do banco");
  const child = IS_WIN
    ? spawn("npm run dev", { cwd: ROOT, stdio: "ignore", shell: true })
    : spawn("npm", ["run", "dev"], { cwd: ROOT, stdio: "ignore", detached: true });
  child.on("error", (err) => {
    console.error("Falha ao iniciar o servidor temporário:", err.message);
  });

  const ready = await waitForServer(`http://localhost:${PORT}/api/cultura`, 60_000);
  killTree(child);

  if (!ready) {
    console.error(
      "Não consegui confirmar a inicialização do banco automaticamente.\n" +
        "Rode `npm run dev` manualmente e veja os logs no terminal.",
    );
    process.exit(1);
  }

  console.log("Banco inicializado: tabelas criadas, artigos de exemplo e usuário admin prontos.");

  console.log(`
=== Tudo pronto! ===

Para rodar o projeto agora:
  npm run dev

App em:      http://localhost:3000
Painel admin: http://localhost:3000/admin

Credenciais do admin e do MySQL: ver CREDENCIAIS.md na raiz do projeto.
`);
}

main().catch((err) => {
  console.error("\nSetup falhou:", err);
  process.exit(1);
});
