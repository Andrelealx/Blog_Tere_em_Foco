/**
 * @file lib/db.ts
 * @description Camada de acesso ao banco de dados MySQL do Terê em Foco.
 *
 * ─── Banco de dados ─────────────────────────────────────────────────────────
 * MySQL 8, rodando localmente via Docker (ver `docker-compose.yml`).
 * Schema: tabelas `categorias`, `artigos`, `usuarios` e `sessoes`.
 *
 * ─── Ciclo de vida ──────────────────────────────────────────────────────────
 * Na primeira execução (`npm run dev`), este módulo:
 *   1. Cria um pool de conexões com o MySQL (variáveis DB_* do `.env.local`).
 *   2. Cria as tabelas, se ainda não existirem.
 *   3. Popula categorias e artigos a partir de `lib/mock-data.ts`.
 *   4. Cria um usuário administrador padrão (ver credenciais no README).
 *
 * Nas execuções seguintes, como as tabelas já existem e já têm dados,
 * nada é recriado — o banco persiste entre reinícios do servidor.
 */

import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";
import bcrypt from "bcryptjs";
import { articles, categories } from "@/lib/mock-data";
import { lazerSeedItems } from "./lazer-seed";
import { noticiasSeedItems } from "./noticias-seed";

interface CountRow extends RowDataPacket {
  total: number;
}

let pool: Pool | null = null;
let initPromise: Promise<void> | null = null;

function createPool(): Pool {
  return mysql.createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "tere_app",
    password: process.env.DB_PASSWORD ?? "tereemfoco123",
    database: process.env.DB_NAME ?? "tere_em_foco",
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: true,
  });
}

async function createSchema(db: Pool): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS categorias (
      slug        VARCHAR(64) PRIMARY KEY,
      titulo      VARCHAR(255) NOT NULL,
      icone       VARCHAR(64),
      descricao   TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS artigos (
      id            VARCHAR(64) PRIMARY KEY,
      slug          VARCHAR(255) UNIQUE NOT NULL,
      titulo        VARCHAR(255) NOT NULL,
      resumo        TEXT,
      autor         VARCHAR(255),
      categoria     VARCHAR(64) NOT NULL,
      subcategoria  VARCHAR(64),
      imagem_capa   VARCHAR(512),
      publicado_em  VARCHAR(64),
      localizacao   VARCHAR(255),
      tags          JSON,
      conteudo      JSON,
      INDEX idx_artigos_categoria (categoria),
      CONSTRAINT fk_artigos_categoria FOREIGN KEY (categoria)
        REFERENCES categorias (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      nome        VARCHAR(255) NOT NULL,
      email       VARCHAR(255) UNIQUE NOT NULL,
      senha_hash  VARCHAR(255) NOT NULL,
      papel       VARCHAR(32) NOT NULL DEFAULT 'admin',
      criado_em   DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS sessoes (
      token       VARCHAR(36) PRIMARY KEY,
      usuario_id  INT NOT NULL,
      criado_em   DATETIME NOT NULL,
      expira_em   DATETIME NOT NULL,
      CONSTRAINT fk_sessoes_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS opcoes_lazer (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      slug          VARCHAR(255) UNIQUE NOT NULL,
      titulo        VARCHAR(255) NOT NULL,
      categoria     VARCHAR(64) NOT NULL,
      descricao     TEXT,
      horario       VARCHAR(255),
      localizacao   VARCHAR(255),
      tags          JSON,
      imagens       JSON,
      criado_em     DATETIME NOT NULL,
      atualizado_em DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS noticias (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      slug          VARCHAR(255) UNIQUE NOT NULL,
      titulo        VARCHAR(255) NOT NULL,
      resumo        TEXT,
      categoria     VARCHAR(64) NOT NULL,
      autor         VARCHAR(255),
      publicado_em  VARCHAR(64),
      imagem        VARCHAR(512),
      tags          JSON,
      destaque      TINYINT(1) NOT NULL DEFAULT 0,
      tempo_leitura VARCHAR(32)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS contato (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      nome       VARCHAR(255) NOT NULL,
      email      VARCHAR(255) NOT NULL,
      assunto    VARCHAR(64),
      mensagem   TEXT NOT NULL,
      criado_em  DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS newsletter (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      email      VARCHAR(255) UNIQUE NOT NULL,
      criado_em  DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS comentarios (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      noticia_id  INT NOT NULL,
      autor       VARCHAR(255) NOT NULL,
      texto       TEXT NOT NULL,
      criado_em   DATETIME NOT NULL,
      CONSTRAINT fk_comentarios_noticia FOREIGN KEY (noticia_id)
        REFERENCES noticias (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

async function seedCategoriasSeVazio(db: Pool): Promise<void> {
  const [rows] = await db.query<CountRow[]>("SELECT COUNT(*) AS total FROM categorias");
  const total = rows[0].total;
  if (total > 0) return;

  for (const categoria of categories) {
    await db.query(
      `INSERT INTO categorias (slug, titulo, icone, descricao) VALUES (?, ?, ?, ?)`,
      [categoria.slug, categoria.title, categoria.icon, categoria.description],
    );
  }
  console.log(`[db] ${categories.length} categorias inseridas.`);
}

async function seedArtigosSeVazio(db: Pool): Promise<void> {
  const [rows] = await db.query<CountRow[]>("SELECT COUNT(*) AS total FROM artigos");
  const total = rows[0].total;
  if (total > 0) return;

  for (const artigo of articles) {
    await db.query(
      `INSERT INTO artigos
        (id, slug, titulo, resumo, autor, categoria, subcategoria,
         imagem_capa, publicado_em, localizacao, tags, conteudo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        artigo.id,
        artigo.slug,
        artigo.title,
        artigo.excerpt,
        artigo.author,
        artigo.category,
        artigo.subcategory,
        artigo.coverImage,
        artigo.publishedAt,
        artigo.location,
        JSON.stringify(artigo.tags),
        JSON.stringify(artigo.content),
      ],
    );
  }
  console.log(`[db] ${articles.length} artigos inseridos.`);
}

async function seedAdminSeVazio(db: Pool): Promise<void> {
  const [rows] = await db.query<CountRow[]>("SELECT COUNT(*) AS total FROM usuarios");
  const total = rows[0].total;
  if (total > 0) return;

  const senhaPadrao = process.env.ADMIN_SENHA_PADRAO ?? "tereemfoco123";
  const senhaHash = bcrypt.hashSync(senhaPadrao, 10);

  await db.query(
    `INSERT INTO usuarios (nome, email, senha_hash, papel, criado_em)
     VALUES (?, ?, ?, ?, ?)`,
    ["Administrador", "admin@tereemfoco.com.br", senhaHash, "admin", new Date()],
  );

  console.log(
    "[db] Usuário administrador padrão criado (admin@tereemfoco.com.br). " +
      "Veja a senha padrão no README.",
  );
}

async function seedOpcoesLazerSeVazio(db: Pool): Promise<void> {
  const [rows] = await db.query<CountRow[]>("SELECT COUNT(*) AS total FROM opcoes_lazer");
  const total = rows[0].total;
  if (total > 0) return;

  for (const item of lazerSeedItems) {
    await db.query(
      `INSERT INTO opcoes_lazer
        (slug, titulo, categoria, descricao, horario, localizacao, tags, imagens, criado_em, atualizado_em)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.slug,
        item.titulo,
        item.categoria,
        item.descricao,
        item.horario,
        item.localizacao,
        JSON.stringify(item.tags),
        JSON.stringify(item.imagens),
        new Date(),
        new Date(),
      ],
    );
  }
  console.log(`[db] ${lazerSeedItems.length} opções de lazer inseridas.`);
}

async function seedNoticiasSeVazio(db: Pool): Promise<void> {
  const [rows] = await db.query<CountRow[]>("SELECT COUNT(*) AS total FROM noticias");
  const total = rows[0].total;
  if (total > 0) return;

  for (const item of noticiasSeedItems) {
    await db.query(
      `INSERT INTO noticias
        (slug, titulo, resumo, categoria, autor, publicado_em, imagem, tags, destaque, tempo_leitura)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.slug,
        item.titulo,
        item.resumo,
        item.categoria,
        item.autor,
        item.publicadoEm,
        item.imagem,
        JSON.stringify(item.tags),
        item.destaque ? 1 : 0,
        item.tempoLeitura,
      ],
    );
  }
  console.log(`[db] ${noticiasSeedItems.length} notícias inseridas.`);
}

async function initDb(db: Pool): Promise<void> {
  await createSchema(db);
  await seedCategoriasSeVazio(db);
  await seedArtigosSeVazio(db);
  await seedOpcoesLazerSeVazio(db);
  await seedNoticiasSeVazio(db);
  await seedAdminSeVazio(db);
}

/**
 * Retorna o pool de conexões (singleton) com o MySQL.
 * Cria o schema e os dados iniciais na primeira chamada.
 */
export async function getDb(): Promise<Pool> {
  if (!pool) {
    pool = createPool();
  }
  if (!initPromise) {
    initPromise = initDb(pool);
  }
  await initPromise;
  return pool;
}
