@AGENTS.md

# Storage

HTML previews are served through a pluggable backend; JSX/TSX previews are not.

- The abstraction lives in `src/storage/`: a `StorageAdapter` interface
  (`listHtml`, `getHtml`), a `local` adapter (filesystem) and a `mariadb`
  adapter, plus `getStorage()` which selects one via the `STORAGE_BACKEND` env
  var (`local` default, `mariadb`). The mariadb driver is `require`d lazily so
  it's only loaded when that backend is active.
- **JSX/TSX must stay local.** `pages/preview/[slug].tsx` renders them via a
  dynamic `import()`, which Next.js compiles/bundles at build time — they cannot
  come from a remote store without a runtime compiler. `listLocalReactFiles()`
  always reads them from `previews/` regardless of backend.
- Two consumers use the adapter, both server-only: `pages/index.tsx`
  (`getServerSideProps` lists HTML + merges local React files) and
  `pages/api/html.ts` (serves HTML content).
- MariaDB setup: `db/schema.sql` (the `previews` table),
  `scripts/import-html-to-mariadb.mjs` (migrate `previews/*.html` into it), and
  `.env.local.example` (connection vars). The mariadb adapter uses a
  hot-reload-safe pooled connection singleton on `globalThis` and parameterized
  queries; the table name is validated against an allow-list (identifiers can't
  be bound).
- To add a backend (e.g. S3): implement `StorageAdapter` in `src/storage/` and
  add a case to `getStorage()`. Keep secrets in `.env.local` (gitignored).
