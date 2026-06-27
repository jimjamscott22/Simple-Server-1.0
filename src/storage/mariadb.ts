import { createPool, type Pool } from 'mariadb';
import type { StorageAdapter } from './types';

/**
 * MariaDB backend. Stores each HTML preview as a row:
 *
 *   CREATE TABLE previews (
 *     slug       VARCHAR(255) PRIMARY KEY,
 *     content    MEDIUMTEXT   NOT NULL,
 *     updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 *   );
 *
 * Configure via env (see .env.local.example). The table name is parameter-unsafe
 * (identifiers can't be bound), so it is validated against a strict allow-list.
 */

const TABLE = (() => {
  const name = process.env.MARIADB_TABLE ?? 'previews';
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
    throw new Error(`Invalid MARIADB_TABLE name: ${JSON.stringify(name)}`);
  }
  return name;
})();

// Reuse a single pool across Next.js dev hot-reloads, which otherwise re-evaluate
// modules and would leak pools / exhaust the server's connection limit.
const globalForPool = globalThis as unknown as { _mariadbPool?: Pool };

function getPool(): Pool {
  if (!globalForPool._mariadbPool) {
    const host = process.env.MARIADB_HOST;
    const database = process.env.MARIADB_DATABASE;
    const user = process.env.MARIADB_USER;
    if (!host || !database || !user) {
      throw new Error(
        'MariaDB backend selected but MARIADB_HOST, MARIADB_DATABASE, and MARIADB_USER must all be set.',
      );
    }
    globalForPool._mariadbPool = createPool({
      host,
      port: process.env.MARIADB_PORT ? Number(process.env.MARIADB_PORT) : 3306,
      user,
      password: process.env.MARIADB_PASSWORD,
      database,
      connectionLimit: process.env.MARIADB_CONNECTION_LIMIT
        ? Number(process.env.MARIADB_CONNECTION_LIMIT)
        : 5,
      acquireTimeout: 10000,
    });
  }
  return globalForPool._mariadbPool;
}

export const mariadbStorage: StorageAdapter = {
  async listHtml() {
    const rows = await getPool().query<{ slug: string }[]>(
      `SELECT slug FROM \`${TABLE}\` ORDER BY slug`,
    );
    return rows.map(r => r.slug);
  },

  async getHtml(slug) {
    const rows = await getPool().query<{ content: string }[]>(
      `SELECT content FROM \`${TABLE}\` WHERE slug = ? LIMIT 1`,
      [slug],
    );
    return rows.length ? rows[0].content : null;
  },
};
