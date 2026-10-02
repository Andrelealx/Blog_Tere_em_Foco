/**
 * @file lib/db.ts
 * @description Camada de acesso ao banco de dados MySQL do Terê em Foco.
 *
 * ─── Banco de dados ─────────────────────────────────────────────────────────
 * MySQL 8, rodando localmente via Docker (ver `docker-compose.yml`).
 * Schema: tabelas `categorias`, `artigos`, `usuarios` e `sessoes`.
 *
 * ─── Ciclo de vida ──────────────────────────────────────────────────────────
 * Na primeira execução (`npm run dev`), este módulo tenta conectar ao MySQL,
 * criar as tabelas e popular os dados iniciais. Se a conexão estiver indisponível,
 * usa os dados de seed em um pool em memória para manter a aplicação utilizável.
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
let memoryPool: Pool | null = null;

type MemoryRow = Record<string, unknown>;
type MemoryTables = Record<string, MemoryRow[]>;

function normalizeMemoryValue(value: unknown): unknown {
  return value instanceof Date ? value.toISOString() : value;
}

function createMemoryPool(): Pool {
  const tables: MemoryTables = {
    categorias: categories.map((categoria) => ({
      slug: categoria.slug,
      titulo: categoria.title,
      icone: categoria.icon,
      descricao: categoria.description,
    })),
    artigos: articles.map((artigo) => ({
      id: artigo.id,
      slug: artigo.slug,
      titulo: artigo.title,
      resumo: artigo.excerpt,
      autor: artigo.author,
      categoria: artigo.category,
      subcategoria: artigo.subcategory,
      imagem_capa: artigo.coverImage,
      publicado_em: artigo.publishedAt,
      localizacao: artigo.location,
      tags: JSON.stringify(artigo.tags),
      conteudo: JSON.stringify(artigo.content),
    })),
    opcoes_lazer: lazerSeedItems.map((item, index) => ({
      id: index + 1,
      slug: item.slug,
      titulo: item.titulo,
      categoria: item.categoria,
      descricao: item.descricao,
      horario: item.horario,
      localizacao: item.localizacao,
      tags: JSON.stringify(item.tags),
      imagens: JSON.stringify(item.imagens),
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    })),
    noticias: noticiasSeedItems.map((item, index) => ({
      id: index + 1,
      slug: item.slug,
      titulo: item.titulo,
      resumo: item.resumo,
      categoria: item.categoria,
      autor: item.autor,
      publicado_em: item.publicadoEm,
      imagem: item.imagem,
      tags: JSON.stringify(item.tags),
      destaque: item.destaque ? 1 : 0,
      tempo_leitura: item.tempoLeitura,
    })),
    usuarios: [
      {
        id: 1,
        nome: "Administrador",
        email: "admin@tereemfoco.com.br",
        senha_hash: bcrypt.hashSync(
          process.env.ADMIN_SENHA_PADRAO ?? "tereemfoco123",
          10,
        ),
        papel: "admin",
      },
    ],
    sessoes: [],
    contato: [],
    newsletter: [],
    comentarios: [],
  };
  const nextIds: Record<string, number> = {
    opcoes_lazer: lazerSeedItems.length + 1,
    noticias: noticiasSeedItems.length + 1,
    usuarios: 2,
    sessoes: 1,
    contato: 1,
    newsletter: 1,
    comentarios: 1,
  };

  const query = async <T>(
    rawSql: string,
    values: unknown[] = [],
  ): Promise<[T, []]> => {
    const sql = rawSql.replace(/\s+/g, " ").trim();
    const fromMatch = sql.match(/\bFROM\s+`?(\w+)`?/i);
    const tableName = fromMatch?.[1];
    if (!tableName || !tables[tableName]) {
      throw new Error(`Consulta não suportada no modo em memória: ${rawSql}`);
    }

    const table = tables[tableName];
    const whereMatch = sql.match(
      /\bWHERE\s+(.+?)(?=\s+ORDER BY\b|\s+LIMIT\b|$)/i,
    );
    let valueIndex = 0;
    let filteredRows = table;

    if (whereMatch) {
      const conditions = whereMatch[1].split(/\s+AND\s+/i).map((rawCondition) => {
        const condition = rawCondition.replace(/^\(+|\)+$/g, "").trim();
        const alternatives = condition.split(/\s+OR\s+/i);
        return alternatives.map((rawAlternative) => {
          const alternative = rawAlternative.replace(/^\(+|\)+$/g, "").trim();
          const notNullMatch = alternative.match(/^(\w+)\s+IS\s+NOT\s+NULL$/i);
          if (notNullMatch) return (row: MemoryRow) => row[notNullMatch[1]] != null;

          const lowerLikeMatch = alternative.match(
            /^LOWER\(CAST\((\w+)\s+AS\s+CHAR\)\)\s+LIKE\s+\?$/i,
          );
          const likeMatch = alternative.match(/^(\w+)\s+LIKE\s+\?$/i);
          if (lowerLikeMatch || likeMatch) {
            const column = (lowerLikeMatch ?? likeMatch)![1];
            const searchValue = String(values[valueIndex++] ?? "");
            const escapedPattern = searchValue
              .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
              .replace(/%/g, ".*")
              .replace(/_/g, ".");
            const pattern = new RegExp(`^${escapedPattern}$`, "i");
            return (row: MemoryRow) => pattern.test(String(row[column] ?? ""));
          }

          const comparisonMatch = alternative.match(/^(\w+)\s*(=|!=)\s*\?$/);
          if (comparisonMatch) {
            const expected = values[valueIndex++];
            return (row: MemoryRow) =>
              comparisonMatch[2] === "="
                ? row[comparisonMatch[1]] == expected
                : row[comparisonMatch[1]] != expected;
          }

          throw new Error(`Condição não suportada no modo em memória: ${alternative}`);
        });
      });
      filteredRows = table.filter((row) =>
        conditions.every((alternatives) =>
          alternatives.some((matches) => matches(row)),
        ),
      );
    }

    const countMatch = sql.match(/^SELECT\s+COUNT\(\*\)\s+AS\s+(\w+)/i);
    if (countMatch) {
      return [[{ [countMatch[1]]: filteredRows.length }] as T, []];
    }

    const distinctMatch = sql.match(/^SELECT\s+DISTINCT\s+(\w+)/i);
    if (distinctMatch) {
      const column = distinctMatch[1];
      const seen = new Set<unknown>();
      const result = filteredRows
        .filter((row) => {
          const value = row[column];
          if (seen.has(value)) return false;
          seen.add(value);
          return true;
        })
        .map((row) => ({ [column]: row[column] }));
      return [sortMemoryRows(result, sql) as T, []];
    }

    const orderMatch = sql.match(/\bORDER BY\s+(.+?)(?=\s+LIMIT\b|$)/i);
    let result = orderMatch
      ? sortMemoryRows([...filteredRows], sql)
      : [...filteredRows];

    const limitMatch = sql.match(/\bLIMIT\s+\?/i);
    if (limitMatch) {
      const limit = Number(values[valueIndex++]);
      const offsetMatch = sql.match(/\bOFFSET\s+\?/i);
      const offset = offsetMatch ? Number(values[valueIndex++]) : 0;
      result = result.slice(offset, offset + limit);
    }

    if (/^SELECT\s+\*/i.test(sql)) return [result as T, []];

    const columnsMatch = sql.match(/^SELECT\s+(.+?)\s+FROM\b/i);
    if (!columnsMatch) {
      throw new Error(`Consulta não suportada no modo em memória: ${rawSql}`);
    }
    const columns = columnsMatch[1].split(",").map((column) => column.trim());
    return [
      result.map((row) =>
        Object.fromEntries(
          columns.map((column) => [column, row[column]]),
        ),
      ) as T,
      [],
    ];
  };

  const insert = async <T>(rawSql: string, values: unknown[] = []): Promise<[T, []]> => {
    const sql = rawSql.replace(/\s+/g, " ").trim();
    const match = sql.match(/^INSERT INTO `?(\w+)`?\s*\(([^)]+)\)/i);
    const tableName = match?.[1];
    if (!tableName || !tables[tableName]) {
      throw new Error(`Inserção não suportada no modo em memória: ${rawSql}`);
    }

    const columns = match![2].split(",").map((column) => column.trim());
    const row = Object.fromEntries(
      columns.map((column, index) => [column, normalizeMemoryValue(values[index])]),
    );
    if (nextIds[tableName] !== undefined && row.id === undefined) {
      row.id = nextIds[tableName]++;
    }
    tables[tableName].push(row);
    return [{ insertId: Number(row.id ?? 0), affectedRows: 1 } as T, []];
  };

  const update = async <T>(rawSql: string, values: unknown[] = []): Promise<[T, []]> => {
    const sql = rawSql.replace(/\s+/g, " ").trim();
    const match = sql.match(/^UPDATE `?(\w+)`?\s+SET\s+(.+?)\s+WHERE\s+(\w+)\s*=\s*\?$/i);
    const tableName = match?.[1];
    if (!tableName || !tables[tableName]) {
      throw new Error(`Atualização não suportada no modo em memória: ${rawSql}`);
    }

    const assignments = match![2].split(",").map((assignment) => assignment.trim());
    const key = match![3];
    const keyValue = values[assignments.length];
    let affectedRows = 0;
    for (const row of tables[tableName]) {
      if (row[key] != keyValue) continue;
      assignments.forEach((assignment, index) => {
        const column = assignment.match(/^(\w+)\s*=/)?.[1];
        if (!column) throw new Error(`Campo não suportado no modo em memória: ${assignment}`);
        row[column] = normalizeMemoryValue(values[index]);
      });
      affectedRows += 1;
    }
    return [{ affectedRows, changedRows: affectedRows } as T, []];
  };

  const remove = async <T>(rawSql: string, values: unknown[] = []): Promise<[T, []]> => {
    const sql = rawSql.replace(/\s+/g, " ").trim();
    const match = sql.match(/^DELETE FROM `?(\w+)`?\s+WHERE\s+(\w+)\s*=\s*\?$/i);
    const tableName = match?.[1];
    if (!tableName || !tables[tableName]) {
      throw new Error(`Remoção não suportada no modo em memória: ${rawSql}`);
    }

    const initialLength = tables[tableName].length;
    tables[tableName] = tables[tableName].filter(
      (row) => row[match![2]] != values[0],
    );
    const affectedRows = initialLength - tables[tableName].length;
    return [{ affectedRows } as T, []];
  };

  const memoryClient = {
    query<T>(sql: string, values?: unknown[]): Promise<[T, []]> {
      const statement = sql.trimStart().toUpperCase();
      if (statement.startsWith("SELECT")) return query<T>(sql, values);
      if (statement.startsWith("INSERT")) return insert<T>(sql, values);
      if (statement.startsWith("UPDATE")) return update<T>(sql, values);
      if (statement.startsWith("DELETE")) return remove<T>(sql, values);
      throw new Error(`Comando não suportado no modo em memória: ${sql}`);
    },
  };

  return memoryClient as unknown as Pool;
}

function sortMemoryRows(rows: MemoryRow[], sql: string): MemoryRow[] {
  const orderMatch = sql.match(/\bORDER BY\s+(.+?)(?=\s+LIMIT\b|$)/i);
  if (!orderMatch) return rows;
  const columns = orderMatch[1].split(",").map((part) => {
    const [column, direction] = part.trim().split(/\s+/);
    return { column, descending: direction?.toUpperCase() === "DESC" };
  });
  return rows.sort((left, right) => {
    for (const { column, descending } of columns) {
      const a = left[column];
      const b = right[column];
      if (a === b) continue;
      const comparison =
        a == null
          ? -1
          : b == null
            ? 1
            : typeof a === "number" && typeof b === "number"
              ? a - b
              : String(a).localeCompare(String(b));
      if (comparison !== 0) return descending ? -comparison : comparison;
    }
    return 0;
  });
}

function isConnectionUnavailable(error: unknown): boolean {
  if (!(error instanceof Error) || !("code" in error)) return false;
  return ["ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND", "EHOSTUNREACH"].includes(
    String(error.code),
  );
}

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
  if (memoryPool) return memoryPool;
  if (!pool) {
    pool = createPool();
  }
  if (!initPromise) {
    initPromise = initDb(pool);
  }
  try {
    await initPromise;
    return pool;
  } catch (error) {
    if (isConnectionUnavailable(error)) {
      memoryPool = createMemoryPool();
      pool = null;
      initPromise = null;
      console.warn(
        "[db] MySQL indisponível; usando dados simulados em memória.",
        error,
      );
      return memoryPool;
    }
    pool = null;
    initPromise = null;
    throw error;
  }
}
