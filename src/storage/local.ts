import fs from 'fs';
import path from 'path';
import type { FileEntry, StorageAdapter } from './types';

const PREVIEWS_DIR = path.join(process.cwd(), 'previews');

function sanitizeSlug(slug: string): string {
  // Collapse any path to its final segment so a slug can never escape previews/.
  return path.basename(slug);
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
};

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
        return (ext === '.tsx' || ext === '.jsx') && !f.startsWith('_');
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
