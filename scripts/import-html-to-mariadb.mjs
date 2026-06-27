#!/usr/bin/env node
/**
 * One-off migration: upsert every previews/*.html file into the MariaDB
 * `previews` table so the mariadb backend can serve them.
 *
 * Usage:
 *   node scripts/import-html-to-mariadb.mjs
 *
 * Reads connection settings from .env.local (or the environment). Re-running is
 * safe — existing slugs are overwritten with the current file contents.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mariadb from 'mariadb';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Minimal .env.local loader (no dotenv dependency).
const envPath = path.join(root, '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

const table = process.env.MARIADB_TABLE ?? 'previews';
if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(table)) {
  throw new Error(`Invalid MARIADB_TABLE: ${table}`);
}

const previewsDir = path.join(root, 'previews');
const htmlFiles = fs
  .readdirSync(previewsDir)
  .filter(f => f.toLowerCase().endsWith('.html') && !f.startsWith('_'));

if (htmlFiles.length === 0) {
  console.log('No previews/*.html files to import.');
  process.exit(0);
}

const pool = mariadb.createPool({
  host: process.env.MARIADB_HOST,
  port: process.env.MARIADB_PORT ? Number(process.env.MARIADB_PORT) : 3306,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  connectionLimit: 2,
});

try {
  for (const file of htmlFiles) {
    const slug = path.basename(file, '.html');
    const content = fs.readFileSync(path.join(previewsDir, file), 'utf-8');
    await pool.query(
      `INSERT INTO \`${table}\` (slug, content) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE content = VALUES(content)`,
      [slug, content],
    );
    console.log(`✓ imported ${slug} (${content.length} bytes)`);
  }
  console.log(`\nDone. ${htmlFiles.length} preview(s) in "${table}".`);
} finally {
  await pool.end();
}
