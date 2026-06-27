@AGENTS.md

# Storage

HTML previews are served through a pluggable backend; JSX/TSX previews are not.

- The abstraction lives in `src/storage/`: a `StorageAdapter` interface
  (`listHtml`, `getHtml`, `putHtml`), a `local` adapter (filesystem) and a
  `mariadb` adapter, plus `getStorage()` which selects one via the
  `STORAGE_BACKEND` env var (`local` default, `mariadb`). The mariadb driver is
  `require`d lazily so it's only loaded when that backend is active.
- **JSX/TSX must stay local.** `pages/preview/[slug].tsx` renders them via a
  dynamic `import()`, which Next.js compiles/bundles at build time — they cannot
  come from a remote store without a runtime compiler. `listLocalReactFiles()`
  always reads them from `previews/` regardless of backend, and
  `writeLocalReactFile()` always writes them there.
- **Uploads** go through `pages/api/upload.ts` (POST JSON `{ name, content }`;
  previews are text, so the browser reads them as text — no multipart parser).
  It validates the extension (`html`/`jsx`/`tsx`) and base name, then routes
  HTML through `getStorage().putHtml()` (respects the backend) and JSX/TSX
  through `writeLocalReactFile()` (always disk). The home page's drop zone is the
  client for this.
- **`*.index.tsx` / `*.index.jsx` are page layouts, not previews.**
  `listLocalReactFiles()` excludes them so they don't self-list as cards.
  `previews/simple-server-home-variant.index.tsx` is the home-page UI, rendered
  by `pages/index.tsx` (which supplies the real `files` via `getServerSideProps`).
- Consumers of the adapter are server-only: `pages/index.tsx`
  (`getServerSideProps` lists HTML + merges local React files), `pages/api/html.ts`
  (serves HTML content), and `pages/api/upload.ts` (saves uploads).
- MariaDB setup: `db/schema.sql` (the `previews` table),
  `scripts/import-html-to-mariadb.mjs` (migrate `previews/*.html` into it), and
  `.env.local.example` (connection vars). The mariadb adapter uses a
  hot-reload-safe pooled connection singleton on `globalThis` and parameterized
  queries; the table name is validated against an allow-list (identifiers can't
  be bound).
- To add a backend (e.g. S3): implement `StorageAdapter` in `src/storage/` and
  add a case to `getStorage()`. Keep secrets in `.env.local` (gitignored).
