import { GetServerSideProps } from 'next';
import { getStorage, listLocalReactFiles, type FileEntry } from '@/src/storage';

interface Props {
  files: FileEntry[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  // JSX/TSX always come from the local filesystem (Next.js bundles them).
  const reactFiles = listLocalReactFiles();

  // HTML comes from the active storage backend (local fs or MariaDB).
  let htmlFiles: FileEntry[] = [];
  try {
    const bases = await getStorage().listHtml();
    htmlFiles = bases.map(base => ({ name: `${base}.html`, base, ext: 'html' }));
  } catch (err) {
    console.error('Failed to list HTML previews:', err);
  }

  const files = [...reactFiles, ...htmlFiles].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return { props: { files } };
};

const LANGS: Record<string, { accent: string; label: string }> = {
  tsx:  { accent: '#61dafb', label: 'TSX' },
  jsx:  { accent: '#f7df1e', label: 'JSX' },
  html: { accent: '#e34f26', label: 'HTML' },
};

function langOf(ext: string) {
  return LANGS[ext] ?? { accent: '#7d8590', label: ext.toUpperCase() };
}

export default function Dashboard({ files }: Props) {
  const counts = files.reduce<Record<string, number>>((acc, f) => {
    acc[f.ext] = (acc[f.ext] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className="page">
      <div className="shell">
        <header className="head">
          <div className="brand">
            <span className="brand__mark" aria-hidden="true">{'</>'}</span>
            <h1 className="brand__name">Simple-Server</h1>
            <span className="pill pill--version">v1.0</span>
          </div>
          <p className="lede">
            A local preview server. Drop <code>.tsx</code>, <code>.jsx</code>, or{' '}
            <code>.html</code> files into <code>previews/</code> and open them in the browser.
          </p>
        </header>

        <div className="meta">
          <span className="meta__path">previews/</span>
          <span className="meta__dot" aria-hidden="true">•</span>
          <span className="meta__count">
            {files.length} {files.length === 1 ? 'file' : 'files'}
          </span>
          {files.length > 0 && (
            <span className="badges">
              {Object.entries(counts).map(([ext, n]) => {
                const lang = langOf(ext);
                return (
                  <span
                    key={ext}
                    className="badge"
                    style={{ ['--accent' as string]: lang.accent }}
                  >
                    <span className="badge__dot" aria-hidden="true" />
                    {n} {lang.label}
                  </span>
                );
              })}
            </span>
          )}
        </div>

        {files.length === 0 ? (
          <section className="empty" aria-live="polite">
            <div className="empty__icon" aria-hidden="true">{'{ }'}</div>
            <h2 className="empty__title">No previews yet</h2>
            <p className="empty__body">
              Add a component or page to the <code>previews/</code> directory, then refresh to
              see it appear here as a card.
            </p>
          </section>
        ) : (
          <ul className="grid">
            {files.map((f, i) => {
              const lang = langOf(f.ext);
              return (
                <li
                  key={f.name}
                  className="cell"
                  style={{ ['--accent' as string]: lang.accent, ['--i' as string]: i }}
                >
                  <a
                    className="card"
                    href={`/preview/${encodeURIComponent(f.base)}?type=${f.ext}`}
                  >
                    <div className="card__chrome">
                      <span className="lights" aria-hidden="true">
                        <i /><i /><i />
                      </span>
                      <span className="card__ext">{lang.label}</span>
                    </div>
                    <div className="card__body">
                      <span className="card__name">{f.name}</span>
                      <span className="card__open">
                        Open preview
                        <span className="card__arrow" aria-hidden="true">→</span>
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        <footer className="foot">
          Refresh after adding files to update this list.
        </footer>
      </div>

      <style jsx>{`
        .page {
          --bg: #0a0e14;
          --panel: #141b26;
          --panel-hi: #1a2230;
          --line: #1f2937;
          --line-hi: #2c3a4d;
          --text: #e6edf3;
          --muted: #7d8590;
          --mint: #3ddc84;
          --mono: ui-monospace, "SF Mono", "JetBrains Mono", "Fira Code", Menlo, Consolas, monospace;
          --sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

          min-height: 100vh;
          background:
            radial-gradient(900px 500px at 12% -10%, rgba(61, 220, 132, 0.08), transparent 60%),
            radial-gradient(800px 600px at 100% 0%, rgba(97, 218, 251, 0.06), transparent 55%),
            var(--bg);
          color: var(--text);
          font-family: var(--sans);
          padding: clamp(2rem, 5vw, 4.5rem) 1.25rem 3rem;
        }

        .shell {
          max-width: 960px;
          margin: 0 auto;
        }

        code {
          font-family: var(--mono);
          font-size: 0.85em;
          color: var(--mint);
          background: rgba(61, 220, 132, 0.08);
          border: 1px solid rgba(61, 220, 132, 0.18);
          padding: 0.05em 0.4em;
          border-radius: 5px;
        }

        /* Header */
        .head {
          margin-bottom: 2.25rem;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 0.85rem;
        }
        .brand__mark {
          font-family: var(--mono);
          font-weight: 700;
          font-size: 0.95rem;
          color: #04130b;
          background: var(--mint);
          padding: 0.35rem 0.5rem;
          border-radius: 8px;
          line-height: 1;
          box-shadow: 0 0 0 1px rgba(61, 220, 132, 0.4), 0 6px 20px -8px rgba(61, 220, 132, 0.7);
        }
        .brand__name {
          font-size: clamp(1.5rem, 3.5vw, 2rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .pill {
          font-family: var(--mono);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
        }
        .pill--version {
          color: var(--muted);
          border: 1px solid var(--line-hi);
          background: var(--panel);
        }
        .lede {
          margin: 0;
          max-width: 60ch;
          color: var(--muted);
          font-size: 0.98rem;
          line-height: 1.6;
        }

        /* Meta / badges row */
        .meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.55rem;
          padding-bottom: 0.9rem;
          margin-bottom: 1.4rem;
          border-bottom: 1px solid var(--line);
          font-family: var(--mono);
          font-size: 0.8rem;
        }
        .meta__path { color: var(--text); }
        .meta__dot { color: var(--line-hi); }
        .meta__count { color: var(--muted); }
        .badges {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-left: auto;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          background: var(--panel);
          border: 1px solid var(--line);
          color: var(--text);
          font-size: 0.72rem;
        }
        .badge__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px -1px var(--accent);
        }

        /* Grid */
        .grid {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 1rem;
        }
        .cell {
          animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) backwards;
          animation-delay: calc(var(--i) * 45ms);
        }

        .card {
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none;
          color: inherit;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .card::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 3px;
          background: var(--accent);
          opacity: 0.85;
        }
        .card:hover {
          transform: translateY(-4px);
          border-color: var(--line-hi);
          background: var(--panel-hi);
          box-shadow: 0 18px 40px -22px rgba(0, 0, 0, 0.9);
        }
        .card:focus-visible {
          outline: 2px solid var(--mint);
          outline-offset: 2px;
        }

        .card__chrome {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.7rem 0.85rem;
          border-bottom: 1px solid var(--line);
        }
        .lights {
          display: inline-flex;
          gap: 0.35rem;
        }
        .lights i {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--line-hi);
          display: block;
        }
        .card:hover .lights i:nth-child(1) { background: #ff5f57; }
        .card:hover .lights i:nth-child(2) { background: #febc2e; }
        .card:hover .lights i:nth-child(3) { background: #28c840; }
        .lights i { transition: background 0.18s ease; }

        .card__ext {
          font-family: var(--mono);
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 14%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
          padding: 0.15rem 0.45rem;
          border-radius: 6px;
        }

        .card__body {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding: 1rem 0.95rem 1.05rem;
          flex: 1;
        }
        .card__name {
          font-family: var(--mono);
          font-size: 0.92rem;
          color: var(--text);
          word-break: break-all;
          line-height: 1.4;
        }
        .card__open {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          color: var(--muted);
          transition: color 0.18s ease;
        }
        .card:hover .card__open { color: var(--mint); }
        .card__arrow {
          transition: transform 0.18s ease;
        }
        .card:hover .card__arrow { transform: translateX(3px); }

        /* Empty state */
        .empty {
          border: 1px dashed var(--line-hi);
          border-radius: 14px;
          background: linear-gradient(180deg, var(--panel), transparent);
          padding: 3rem 1.5rem;
          text-align: center;
        }
        .empty__icon {
          font-family: var(--mono);
          font-size: 1.8rem;
          color: var(--mint);
          margin-bottom: 0.75rem;
        }
        .empty__title {
          margin: 0 0 0.5rem;
          font-size: 1.15rem;
          font-weight: 600;
        }
        .empty__body {
          margin: 0 auto;
          max-width: 42ch;
          color: var(--muted);
          font-size: 0.92rem;
          line-height: 1.6;
        }

        /* Footer */
        .foot {
          margin-top: 2.5rem;
          color: var(--line-hi);
          font-family: var(--mono);
          font-size: 0.74rem;
        }

        @keyframes rise {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 540px) {
          .badges { margin-left: 0; width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cell { animation: none; }
          .card, .card__arrow, .card__open, .lights i { transition: none; }
          .card:hover { transform: none; }
        }
      `}</style>

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background: #0a0e14;
        }
        * { box-sizing: border-box; }
      `}</style>
    </main>
  );
}
