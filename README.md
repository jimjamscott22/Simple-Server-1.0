# Simple-Server 1.0

A lightweight preview server built on Next.js that serves static HTML and renders JSX/TSX preview files in the browser, with a built-in terminal-style dashboard.

---

## Overview

Simple-Server provides a zero-configuration local development environment for previewing and testing frontend files. Drop an `.html`, `.jsx`, or `.tsx` file into `previews/`, start the server, and open the dashboard to view it in the browser.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Next.js](https://nextjs.org) | Server framework and file rendering |
| [React 19](https://react.dev) | Component rendering engine |
| [TypeScript 5](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com) | Dashboard styling |
| [ESLint 9](https://eslint.org) | Code linting |

---

## Prerequisites

- **Node.js** 18.x or later
- **npm** 9.x or later (or compatible package manager)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The server starts at [http://localhost:3000](http://localhost:3000) with hot-reload enabled.

### 3. View the dashboard

Open [http://localhost:3000](http://localhost:3000) in your browser to see the terminal-style dashboard. It lists files from `previews/` and links to each preview.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot-reload |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server (run `build` first) |
| `npm run lint` | Run ESLint across the project |

---

## Project Structure

```
Simple-Server-1.0/
├── app/
│   ├── layout.tsx        # Root layout (fonts, metadata, global styles)
│   └── globals.css       # Global CSS (Tailwind base styles)
├── pages/
│   ├── index.tsx         # Dashboard that lists preview files
│   ├── preview/[slug].tsx # Preview route for HTML, JSX, and TSX files
│   └── api/html.ts       # HTML file loader used by iframe previews
├── previews/
│   ├── example.tsx       # Example React component preview
│   └── *.html|*.jsx|*.tsx # Files you want to preview
├── public/
│   └── *                 # Static assets served directly from the site root
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
├── postcss.config.mjs    # PostCSS / Tailwind configuration
└── eslint.config.mjs     # ESLint configuration
```

---

## Where To Put Files

### Preview Files

Put files you want to view through the dashboard in the top level of the `previews/` directory:

```
previews/
├── landing-page.html       →  http://localhost:3000/preview/landing-page?type=html
├── pricing-card.jsx        →  http://localhost:3000/preview/pricing-card?type=jsx
└── dashboard-widget.tsx    →  http://localhost:3000/preview/dashboard-widget?type=tsx
```

Then open [http://localhost:3000](http://localhost:3000). The dashboard scans `previews/` and creates links for every top-level `.html`, `.jsx`, and `.tsx` file.

Notes:

- React preview files must default-export a React component.
- Files beginning with `_`, such as `_placeholder.jsx`, are ignored by the dashboard.
- The preview scanner is not recursive; put files directly inside `previews/`, not nested folders.
- You do not need to put preview components in `app/`. The `app/` directory is for the Next.js shell/layout code.

### Static Assets

Place static assets that should be served directly inside `public/`:

| File type    | Example URL                                                  |
|--------------|--------------------------------------------------------------|
| HTML         | `public/my-page.html` → `http://localhost:3000/my-page.html` |
| SVG / images | `public/logo.svg` → `http://localhost:3000/logo.svg`         |
| JavaScript   | `public/script.js` → `http://localhost:3000/script.js`       |

Files in `public/` are served at the root path with no preview wrapper. Use this for images, scripts, downloads, and other supporting assets. If you want an HTML file to appear in the dashboard, place it in `previews/` instead.

---

## Preview Behavior

### HTML

HTML previews are loaded from `previews/<name>.html` and displayed in an iframe at:

```text
http://localhost:3000/preview/<name>?type=html
```

### JSX / TSX

JSX and TSX previews are dynamically imported from `previews/<name>.jsx` or `previews/<name>.tsx` and rendered as React components at:

```text
http://localhost:3000/preview/<name>?type=jsx
http://localhost:3000/preview/<name>?type=tsx
```

Example:

```tsx
export default function Example() {
  return <main>Hello from previews/example.tsx</main>;
}
```

## Dashboard

The terminal-style dashboard at [http://localhost:3000](http://localhost:3000) lists preview files from `previews/`. It uses a green-on-black terminal aesthetic and shows:

- Supported file type badges for `.html`, `.jsx`, and `.tsx`
- Links to each preview route
- A message when no preview files are found

Refresh the dashboard after adding new files to `previews/` so they appear in the list.

---

## Configuration

### Environment Variables

Create a `.env.local` file in the project root for local secrets:

```env
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=your_dataset
```

These are forwarded to the browser via `next.config.js`. Do not commit `.env.local` to version control.

---

## Storage Backends

HTML previews can be served from a pluggable backend, selected with the
`STORAGE_BACKEND` environment variable. JSX/TSX previews are always read from the
local `previews/` directory because Next.js compiles and bundles them at build
time — they can't be served from a remote store without a runtime compiler.

| `STORAGE_BACKEND` | Source of HTML previews |
|---|---|
| `local` *(default)* | `previews/*.html` on disk — original behaviour |
| `mariadb` | A `previews` table on your LAN MariaDB server |

The backend abstraction lives in [`src/storage/`](src/storage/): a small
`StorageAdapter` interface (`listHtml`, `getHtml`) with `local` and `mariadb`
implementations, selected by [`getStorage()`](src/storage/index.ts).

### MariaDB backend

1. **Create the table** on your MariaDB server:

   ```bash
   mariadb -h <host> -u <user> -p <database> < db/schema.sql
   ```

2. **Configure `.env.local`** (see [`.env.local.example`](.env.local.example)):

   ```env
   STORAGE_BACKEND=mariadb
   MARIADB_HOST=192.168.1.50
   MARIADB_PORT=3306
   MARIADB_USER=simple_server
   MARIADB_PASSWORD=change_me
   MARIADB_DATABASE=simple_server
   ```

3. **Migrate any existing HTML previews** into the table (optional, re-runnable):

   ```bash
   node scripts/import-html-to-mariadb.mjs
   ```

4. **Start the server** — `npm run dev`. The dashboard now lists HTML previews
   from MariaDB (plus local JSX/TSX), and `/api/html` serves their content from
   the database.

Connections use a pooled singleton (`mariadb` connector) that survives dev
hot-reloads. Set `STORAGE_BACKEND=local` (or unset it) to revert to the
filesystem at any time.

### Next.js Config (`next.config.js`)

```js
const nextConfig = {
  reactStrictMode: true,   // Highlights potential issues during development
  images: {
    domains: ["cdn.sanity.io"],  // Allowed external image hosts
  },
  env: {
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.SANITY_DATASET,
  },
};
```

Extend this file to add custom rewrites, redirects, headers, or webpack configuration.

---

## Development Workflow

1. **Add a preview file** — put `.html`, `.jsx`, or `.tsx` directly inside `previews/`
2. **Start the server** — `npm run dev`
3. **View in browser** — open [http://localhost:3000](http://localhost:3000) and click the file
4. **Edit and save** — the browser refreshes automatically via hot-reload
5. **Lint before committing** — `npm run lint`

---

## Production Build

```bash
npm run build   # Compiles and optimises the app
npm run start   # Serves the built app on port 3000
```

For deployment, the built output in `.next/` can be hosted on any Node.js-capable server or platform (Vercel, Railway, Render, etc.).

---

## License

Private — not licensed for redistribution.
