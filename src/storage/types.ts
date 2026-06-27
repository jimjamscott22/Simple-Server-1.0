/**
 * Storage abstraction for HTML previews.
 *
 * Only HTML is backed by pluggable storage. JSX/TSX previews are compiled and
 * bundled by Next.js via dynamic `import()`, so they must live on the local
 * filesystem regardless of the active backend (see `listLocalReactFiles`).
 */
export interface StorageAdapter {
  /** Base names (without extension) of the available `.html` previews. */
  listHtml(): Promise<string[]>;

  /** Raw HTML for a preview, or `null` if it does not exist. */
  getHtml(slug: string): Promise<string | null>;

  /** Stores (creates or overwrites) the HTML for a preview. */
  putHtml(slug: string, content: string): Promise<void>;
}

export interface FileEntry {
  /** File name as shown in the dashboard, e.g. `landing.html`. */
  name: string;
  /** Base name without extension, used in preview URLs. */
  base: string;
  /** Lower-cased extension without the dot: `html` | `jsx` | `tsx`. */
  ext: string;
}
