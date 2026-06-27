import fs from 'fs';
import path from 'path';
import type { FileEntry, StorageAdapter } from './types';

const PREVIEWS_DIR = path.join(process.cwd(), 'previews');

function sanitizeSlug(slug: string): string {
  // Collapse any path to its final segment so a slug can never escape previews/.
  return path.basename(slug);
}

/**
 * Files named `*.index.tsx` / `*.index.jsx` are treated as page layouts (e.g.
 * the home-page variant rendered by `pages/index.tsx`), not standalone
 * previews, so they are kept out of the dashboard listing.
 */
function isPageLayout(file: string): boolean {
  return /\.index\.(t|j)sx$/i.test(file);
}

/**
 * Default backend: serves HTML straight from the `previews/` directory, matching
 * the original Simple-Server behaviour.
 */
export const localStorage: StorageAdapter = {
  async listHtml() {
    try {
      return fs
        .readdirSync(PREVIEWS_DIR)
        .filter(f => path.extname(f).toLowerCase() === '.html' && !f.startsWith('_'))
        .map(f => path.basename(f, path.extname(f)));
    } catch {
      // previews/ doesn't exist yet.
      return [];
    }
  },

  async getHtml(slug) {
    const filePath = path.join(PREVIEWS_DIR, `${sanitizeSlug(slug)}.html`);
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, 'utf-8');
  },

  async putHtml(slug, content) {
    fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
    const filePath = path.join(PREVIEWS_DIR, `${sanitizeSlug(slug)}.html`);
    fs.writeFileSync(filePath, content, 'utf-8');
  },
};

/**
 * Writes a React preview (`.jsx` / `.tsx`) into `previews/`. These always live on
 * the local filesystem because Next.js bundles them via `import()` — they can't
 * be stored in a remote backend. `fileName` must already be a validated, single
 * `.jsx`/`.tsx` file name (see `pages/api/upload.ts`).
 */
export function writeLocalReactFile(fileName: string, content: string): void {
  fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
  const filePath = path.join(PREVIEWS_DIR, sanitizeSlug(fileName));
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Lists local React previews (`.jsx` / `.tsx`). These are ALWAYS read from the
 * filesystem because Next.js bundles them at build/dev time via `import()` —
 * they cannot be served from a remote backend without a runtime compiler.
 */
export function listLocalReactFiles(): FileEntry[] {
  try {
    return fs
      .readdirSync(PREVIEWS_DIR)
      .filter(f => {
        const ext = path.extname(f).toLowerCase();
        return (
          (ext === '.tsx' || ext === '.jsx') &&
          !f.startsWith('_') &&
          !isPageLayout(f)
        );
      })
      .map(f => ({
        name: f,
        base: path.basename(f, path.extname(f)),
        ext: path.extname(f).slice(1).toLowerCase(),
      }));
  } catch {
    return [];
  }
}
