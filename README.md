# Simple-Server 1.0

A lightweight development server built on Next.js that serves and renders static HTML, JSX, and TSX files in the browser, with a built-in terminal-style dashboard.

---

## Overview

Simple-Server provides a zero-configuration local development environment for previewing and testing frontend files. Drop in an `.html`, `.jsx`, or `.tsx` file, start the server, and view it rendered live in your browser. The dashboard (`public/index.html`) gives you a terminal-style status interface showing server state.

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

Open [http://localhost:3000](http://localhost:3000) in your browser to see the terminal-style server dashboard.

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
│   ├── page.tsx          # Main dashboard entry point
│   └── globals.css       # Global CSS (Tailwind base styles)
├── public/
│   ├── index.html        # Terminal-style server dashboard
│   └── *.svg             # Static assets
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
├── postcss.config.mjs    # PostCSS / Tailwind configuration
└── eslint.config.mjs     # ESLint configuration
```

---

## Serving Static Files

Place any static file inside the `public/` directory to serve it directly:

| File type | Example URL |
|---|---|
| HTML | `public/my-page.html` → `http://localhost:3000/my-page.html` |
| SVG / images | `public/logo.svg` → `http://localhost:3000/logo.svg` |
| JavaScript | `public/script.js` → `http://localhost:3000/script.js` |

Files in `public/` are served at the root path with no build step required.

### Rendering JSX / TSX Files

Place React component files inside the `app/` directory following Next.js App Router conventions:

```
app/
└── my-component/
    └── page.tsx      →  http://localhost:3000/my-component
```

Any valid React component exported as `default` from a `page.tsx` (or `page.jsx`) file will be rendered automatically by the Next.js server.

---

## Dashboard

The terminal-style dashboard (`public/index.html`) provides a visual status indicator for the server. It uses a green-on-black terminal aesthetic and shows:

- Server initialization status
- Active port (`8080` by default in the dashboard script)
- Blinking cursor to indicate the server is live

The dashboard is served as a static file and can be customized directly in `public/index.html`.

---

## Configuration

### Environment Variables

Create a `.env.local` file in the project root for local secrets:

```env
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=your_dataset
```

These are forwarded to the browser via `next.config.js`. Do not commit `.env.local` to version control.

### Next.js Config (`next.config.js`)

```js
const nextConfig = {
  reactStrictMode: true,   // Highlights potential issues during development
  swcMinify: true,         // Fast SWC-based minification on build
  images: {
    domains: ["cdn.sanity.io"],  // Allowed external image hosts
  },
};
```

Extend this file to add custom rewrites, redirects, headers, or webpack configuration.

---

## Development Workflow

1. **Add a file** — put `.html` in `public/` or a `page.tsx` under `app/`
2. **Start the server** — `npm run dev`
3. **View in browser** — navigate to the corresponding URL
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
