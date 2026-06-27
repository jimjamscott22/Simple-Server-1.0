import type { StorageAdapter } from './types';
import { localStorage } from './local';

export type { StorageAdapter, FileEntry } from './types';
export { listLocalReactFiles } from './local';

/**
 * Returns the active HTML storage backend, selected by `STORAGE_BACKEND`:
 *   - `local`   (default) — reads from the `previews/` directory.
 *   - `mariadb`           — reads from a MariaDB table on your LAN.
 *
 * The mariadb module is imported lazily so the driver is never loaded (or its
 * env vars required) unless that backend is actually selected.
 */
export function getStorage(): StorageAdapter {
  const backend = (process.env.STORAGE_BACKEND ?? 'local').toLowerCase();

  switch (backend) {
    case 'mariadb':
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return (require('./mariadb') as typeof import('./mariadb')).mariadbStorage;
    case 'local':
      return localStorage;
    default:
      throw new Error(
        `Unknown STORAGE_BACKEND "${backend}". Use "local" or "mariadb".`,
      );
  }
}
