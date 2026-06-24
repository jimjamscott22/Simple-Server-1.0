import fs from 'fs';
import path from 'path';
import { GetServerSideProps } from 'next';

interface FileEntry {
  name: string;
  base: string;
  ext: string;
}

interface Props {
  files: FileEntry[];
}

type LanguageMeta = {
  accent: string;
  label: string;
  icon: string;
  description: string;
};

const ALLOWED_EXTENSIONS = ['.tsx', '.jsx', '.html'];

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const dir = path.join(process.cwd(), 'previews');

  let files: FileEntry[] = [];

  try {
    files = fs
      .readdirSync(dir)
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ALLOWED_EXTENSIONS.includes(ext) && !file.startsWith('_');
      })
      .map((file) => ({
        name: file,
        base: path.basename(file, path.extname(file)),
        ext: path.extname(file).slice(1).toLowerCase(),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    // previews/ does not exist yet, so the homepage becomes a friendly empty state.
  }

  return { props: { files } };
};

const LANGS: Record<string, LanguageMeta> = {
  tsx: {
    accent: '#61dafb',
    label: 'TSX',
    icon: '⚛',
    description: 'React + TypeScript component preview',
  },
  jsx: {
    accent: '#f7df1e',
    label: 'JSX',
    icon: 'JS',
    description: 'React-style JavaScript preview',
  },
  html: {
    accent: '#ff7849',
    label: 'HTML',
    icon: '</>',
    description: 'Classic browser-ready page',
  },
};

function langOf(ext: string): LanguageMeta {
  return (
    LANGS[ext] ?? {
      accent: '#9aa7b2',
      label: ext.toUpperCase(),
      icon: '*',
      description: 'Preview file',
    }
  );
}

function titleFromBase(base: string) {
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function SimpleServerHome({ files }: Props) {
  const counts = files.reduce<Record<string, number>>((acc, file) => {
    acc[file.ext] = (acc[file.ext] ?? 0) + 1;
    return acc;
  }, {});

  const newestFile = files[files.length - 1];
  const totalKinds = Object.keys(counts).length;

  return (
    <main className="page">
      <section className="hero" aria-labelledby="home-title">
        <div className="orb orb--blue" aria-hidden="true" />
        <div className="orb orb--green" aria-hidden="true" />

        <nav className="topbar" aria-label="Simple-Server status">
          <a className="logo" href="/" aria-label="Simple-Server home">
            <span className="logo__glyph">SS</span>
            <span className="logo__text">Simple-Server</span>
          </a>
          <div className="status-pill" title="Local preview dashboard">
            <span className="status-pill__light" />
            Local Lab Online
          </div>
        </nav>

        <div className="hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">Preview Dock</p>
            <h1 id="home-title">Ship tiny experiments from one cozy command center.</h1>
            <p className="lede">
              Drop <code>.tsx</code>, <code>.jsx</code>, or <code>.html</code> files into{' '}
              <code>previews/</code>. Simple-Server turns them into launchable cards so your test
              pages, guides, and UI sketches do not vanish into folder soup.
            </p>

            <div className="hero__actions" aria-label="Primary actions">
              <a className="button button--primary" href="#previews">
                Browse previews
              </a>
              <a className="button button--ghost" href="https://github.com/jimjamscott22/Simple-Server-1.0">
                View repo
              </a>
            </div>
          </div>

          <aside className="terminal" aria-label="Simple-Server terminal summary">
            <div className="terminal__chrome">
              <span /><span /><span />
            </div>
            <div className="terminal__body">
              <p><span>$</span> scan previews/</p>
              <p><span>found</span> {files.length} {files.length === 1 ? 'file' : 'files'}</p>
              <p><span>types</span> {totalKinds || 0} active</p>
              <p><span>latest</span> {newestFile ? newestFile.name : 'waiting-for-first-page.tsx'}</p>
              <p className="terminal__blink">ready ▊</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="stats" aria-label="Preview stats">
        <article className="stat-card">
          <span className="stat-card__label">Total files</span>
          <strong>{files.length}</strong>
          <span className="stat-card__hint">inside previews/</span>
        </article>
        {Object.entries(LANGS).map(([ext, meta]) => (
          <article
            key={ext}
            className="stat-card stat-card--typed"
            style={{ ['--accent' as string]: meta.accent }}
          >
            <span className="stat-card__label">{meta.label}</span>
            <strong>{counts[ext] ?? 0}</strong>
            <span className="stat-card__hint">{meta.description}</span>
          </article>
        ))}
      </section>

      <section id="previews" className="preview-section" aria-labelledby="preview-title">
        <div className="section-head">
          <div>
            <p className="eyebrow">Launch Pad</p>
            <h2 id="preview-title">Available previews</h2>
          </div>
          <p className="section-head__note">Refresh after adding new files.</p>
        </div>

        {files.length === 0 ? (
          <div className="empty" role="status">
            <div className="empty__badge">{`{ }`}</div>
            <h3>No previews found yet</h3>
            <p>
              Create a <code>previews/</code> folder and add your first <code>index.tsx</code>,{' '}
              <code>demo.jsx</code>, or <code>guide.html</code>. The dashboard will pick it up on refresh.
            </p>
          </div>
        ) : (
          <ul className="cards">
            {files.map((file, index) => {
              const lang = langOf(file.ext);

              return (
                <li
                  key={file.name}
                  className="preview-card-wrap"
                  style={{ ['--accent' as string]: lang.accent, ['--delay' as string]: `${index * 50}ms` }}
                >
                  <a
                    className="preview-card"
                    href={`/preview/${encodeURIComponent(file.base)}?type=${file.ext}`}
                    aria-label={`Open preview for ${file.name}`}
                  >
                    <div className="preview-card__topline">
                      <span className="preview-card__icon">{lang.icon}</span>
                      <span className="preview-card__type">{lang.label}</span>
                    </div>
                    <h3>{titleFromBase(file.base)}</h3>
                    <p>{lang.description}</p>
                    <div className="preview-card__footer">
                      <span className="preview-card__filename">{file.name}</span>
                      <span className="preview-card__open">Open →</span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="workflow" aria-labelledby="workflow-title">
        <div>
          <p className="eyebrow">Suggested Flow</p>
          <h2 id="workflow-title">Build, preview, polish, repeat.</h2>
        </div>
        <ol>
          <li>
            <strong>Sketch</strong>
            <span>Create a tiny page or component idea.</span>
          </li>
          <li>
            <strong>Drop</strong>
            <span>Save it in <code>previews/</code>.</span>
          </li>
          <li>
            <strong>Launch</strong>
            <span>Open it from this homepage.</span>
          </li>
          <li>
            <strong>Archive</strong>
            <span>Keep the best demos for your portfolio.</span>
          </li>
        </ol>
      </section>

      <style jsx>{`
        .page {
          --bg: #070a12;
          --panel: rgba(15, 23, 42, 0.78);
          --panel-solid: #101827;
          --panel-high: #172033;
          --line: rgba(148, 163, 184, 0.18);
          --line-strong: rgba(148, 163, 184, 0.34);
          --text: #eef6ff;
          --muted: #9aa9bd;
          --green: #3ddc84;
          --blue: #61dafb;
          --pink: #ff4fd8;
          --shadow: 0 30px 90px rgba(0, 0, 0, 0.35);
          --mono: ui-monospace, SFMono-Regular, "SF Mono", "JetBrains Mono", "Fira Code", Consolas, monospace;
          --sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

          min-height: 100vh;
          color: var(--text);
          font-family: var(--sans);
          padding: clamp(1rem, 3vw, 2rem);
          background:
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            radial-gradient(circle at 12% 8%, rgba(97, 218, 251, 0.18), transparent 28rem),
            radial-gradient(circle at 88% 0%, rgba(255, 79, 216, 0.12), transparent 24rem),
            radial-gradient(circle at 50% 100%, rgba(61, 220, 132, 0.13), transparent 32rem),
            var(--bg);
          background-size: 44px 44px, 44px 44px, auto, auto, auto, auto;
        }

        code {
          font-family: var(--mono);
          font-size: 0.9em;
          color: #b8f7d0;
          background: rgba(61, 220, 132, 0.11);
          border: 1px solid rgba(61, 220, 132, 0.2);
          border-radius: 0.4rem;
          padding: 0.08rem 0.38rem;
        }

        .hero,
        .stats,
        .preview-section,
        .workflow {
          width: min(1120px, 100%);
          margin-inline: auto;
        }

        .hero {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 2rem;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(8, 13, 24, 0.72));
          box-shadow: var(--shadow);
          padding: clamp(1.2rem, 4vw, 2.5rem);
          isolation: isolate;
        }

        .orb {
          position: absolute;
          width: 18rem;
          height: 18rem;
          border-radius: 999px;
          filter: blur(28px);
          opacity: 0.24;
          z-index: -1;
        }

        .orb--blue {
          top: -6rem;
          right: 8%;
          background: var(--blue);
        }

        .orb--green {
          bottom: -8rem;
          left: 18%;
          background: var(--green);
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: clamp(2.5rem, 6vw, 5rem);
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text);
          text-decoration: none;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .logo__glyph {
          display: grid;
          place-items: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.9rem;
          color: #03110a;
          background: linear-gradient(135deg, var(--green), var(--blue));
          font-family: var(--mono);
          font-size: 0.82rem;
          box-shadow: 0 0 32px rgba(61, 220, 132, 0.24);
        }

        .logo__text {
          font-size: 1.02rem;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 0.5rem 0.75rem;
          color: var(--muted);
          background: rgba(15, 23, 42, 0.56);
          font-family: var(--mono);
          font-size: 0.76rem;
        }

        .status-pill__light {
          width: 0.55rem;
          height: 0.55rem;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 14px var(--green);
        }

        .hero__grid {
          display: grid;
          grid-template-columns: minmax(0, 1.16fr) minmax(280px, 0.84fr);
          gap: clamp(1.5rem, 5vw, 4rem);
          align-items: center;
        }

        .eyebrow {
          margin: 0 0 0.7rem;
          color: var(--green);
          font-family: var(--mono);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 11ch;
          margin-bottom: 1rem;
          font-size: clamp(3rem, 8vw, 6.8rem);
          line-height: 0.88;
          letter-spacing: -0.075em;
        }

        .lede {
          max-width: 67ch;
          color: var(--muted);
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          line-height: 1.75;
        }

        .hero__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 1.6rem;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 2.8rem;
          border-radius: 999px;
          padding: 0 1rem;
          font-weight: 800;
          text-decoration: none;
          transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
        }

        .button:hover {
          transform: translateY(-2px);
        }

        .button:focus-visible,
        .preview-card:focus-visible,
        .logo:focus-visible {
          outline: 2px solid var(--blue);
          outline-offset: 4px;
        }

        .button--primary {
          color: #04110a;
          background: linear-gradient(135deg, var(--green), var(--blue));
          box-shadow: 0 16px 40px rgba(61, 220, 132, 0.18);
        }

        .button--ghost {
          color: var(--text);
          border: 1px solid var(--line-strong);
          background: rgba(255, 255, 255, 0.04);
        }

        .button--ghost:hover {
          border-color: rgba(97, 218, 251, 0.55);
          background: rgba(97, 218, 251, 0.08);
        }

        .terminal {
          border: 1px solid var(--line);
          border-radius: 1.25rem;
          background: rgba(2, 6, 14, 0.72);
          box-shadow: inset 0 1px rgba(255, 255, 255, 0.05), 0 22px 70px rgba(0, 0, 0, 0.34);
          overflow: hidden;
        }

        .terminal__chrome {
          display: flex;
          gap: 0.5rem;
          padding: 0.85rem;
          border-bottom: 1px solid var(--line);
          background: rgba(255, 255, 255, 0.03);
        }

        .terminal__chrome span {
          width: 0.72rem;
          height: 0.72rem;
          border-radius: 50%;
          background: var(--line-strong);
        }

        .terminal__chrome span:nth-child(1) { background: #ff5f57; }
        .terminal__chrome span:nth-child(2) { background: #febc2e; }
        .terminal__chrome span:nth-child(3) { background: #28c840; }

        .terminal__body {
          padding: 1.2rem;
          font-family: var(--mono);
          color: #dfffea;
          font-size: clamp(0.82rem, 1.6vw, 0.96rem);
          line-height: 1.8;
        }

        .terminal__body p {
          margin: 0;
          word-break: break-word;
        }

        .terminal__body span {
          color: var(--green);
        }

        .terminal__blink {
          color: var(--blue);
          animation: blink 1.25s steps(2, start) infinite;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .stat-card {
          border: 1px solid var(--line);
          border-radius: 1.2rem;
          background: var(--panel);
          padding: 1rem;
          backdrop-filter: blur(18px);
        }

        .stat-card--typed {
          border-top: 3px solid var(--accent);
        }

        .stat-card__label,
        .stat-card__hint {
          display: block;
          color: var(--muted);
        }

        .stat-card__label {
          margin-bottom: 0.35rem;
          font-family: var(--mono);
          font-size: 0.76rem;
        }

        .stat-card strong {
          display: block;
          margin-bottom: 0.3rem;
          font-size: 2rem;
          line-height: 1;
        }

        .stat-card__hint {
          font-size: 0.82rem;
          line-height: 1.4;
        }

        .preview-section,
        .workflow {
          margin-top: clamp(1.5rem, 4vw, 2.5rem);
          border: 1px solid var(--line);
          border-radius: 1.5rem;
          background: rgba(15, 23, 42, 0.62);
          padding: clamp(1rem, 3vw, 1.5rem);
          backdrop-filter: blur(20px);
        }

        .section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .section-head h2,
        .workflow h2 {
          margin: 0;
          font-size: clamp(1.5rem, 3vw, 2.1rem);
          letter-spacing: -0.04em;
        }

        .section-head__note {
          margin: 0;
          color: var(--muted);
          font-family: var(--mono);
          font-size: 0.78rem;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(245px, 1fr));
          gap: 1rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .preview-card-wrap {
          animation: float-in 460ms cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: var(--delay);
        }

        .preview-card {
          display: flex;
          flex-direction: column;
          min-height: 15rem;
          color: var(--text);
          text-decoration: none;
          border: 1px solid var(--line);
          border-radius: 1.2rem;
          background:
            linear-gradient(135deg, color-mix(in srgb, var(--accent) 16%, transparent), transparent 40%),
            var(--panel-solid);
          padding: 1rem;
          overflow: hidden;
          position: relative;
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
        }

        .preview-card::after {
          content: '';
          position: absolute;
          inset: auto -1rem -3rem auto;
          width: 8rem;
          height: 8rem;
          border-radius: 50%;
          background: color-mix(in srgb, var(--accent) 24%, transparent);
          filter: blur(16px);
          opacity: 0;
          transition: opacity 180ms ease;
        }

        .preview-card:hover {
          transform: translateY(-5px);
          border-color: color-mix(in srgb, var(--accent) 60%, var(--line));
          background:
            linear-gradient(135deg, color-mix(in srgb, var(--accent) 22%, transparent), transparent 44%),
            var(--panel-high);
        }

        .preview-card:hover::after {
          opacity: 1;
        }

        .preview-card__topline,
        .preview-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          position: relative;
          z-index: 1;
        }

        .preview-card__icon {
          display: grid;
          place-items: center;
          width: 2.4rem;
          height: 2.4rem;
          border-radius: 0.8rem;
          color: #06101a;
          background: var(--accent);
          font-family: var(--mono);
          font-weight: 900;
        }

        .preview-card__type {
          color: var(--accent);
          font-family: var(--mono);
          font-size: 0.75rem;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .preview-card h3 {
          margin: 1.4rem 0 0.55rem;
          font-size: 1.22rem;
          line-height: 1.2;
          letter-spacing: -0.03em;
          position: relative;
          z-index: 1;
        }

        .preview-card p {
          color: var(--muted);
          line-height: 1.55;
          position: relative;
          z-index: 1;
        }

        .preview-card__footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--line);
          font-family: var(--mono);
          font-size: 0.76rem;
        }

        .preview-card__filename {
          min-width: 0;
          color: var(--muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .preview-card__open {
          flex: 0 0 auto;
          color: var(--accent);
          font-weight: 900;
        }

        .empty {
          border: 1px dashed var(--line-strong);
          border-radius: 1.2rem;
          padding: clamp(2rem, 5vw, 4rem) 1rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.03);
        }

        .empty__badge {
          display: grid;
          place-items: center;
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1rem;
          border-radius: 1.2rem;
          color: #03110a;
          background: linear-gradient(135deg, var(--green), var(--blue));
          font-family: var(--mono);
          font-weight: 900;
          font-size: 1.35rem;
        }

        .empty h3 {
          margin-bottom: 0.5rem;
          font-size: 1.35rem;
        }

        .empty p {
          max-width: 50ch;
          margin-inline: auto;
          color: var(--muted);
          line-height: 1.7;
        }

        .workflow {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .workflow ol {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.8rem;
          list-style: none;
          counter-reset: steps;
          margin: 0;
          padding: 0;
        }

        .workflow li {
          counter-increment: steps;
          border: 1px solid var(--line);
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.035);
          padding: 1rem;
          min-height: 8rem;
        }

        .workflow li::before {
          content: '0' counter(steps);
          display: block;
          margin-bottom: 0.8rem;
          color: var(--green);
          font-family: var(--mono);
          font-weight: 900;
        }

        .workflow strong,
        .workflow span {
          display: block;
        }

        .workflow strong {
          margin-bottom: 0.35rem;
        }

        .workflow span {
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.45;
        }

        @keyframes blink {
          50% { opacity: 0.25; }
        }

        @keyframes float-in {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 860px) {
          .hero__grid,
          .workflow {
            grid-template-columns: 1fr;
          }

          .stats,
          .workflow ol {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          h1 {
            max-width: 12ch;
          }
        }

        @media (max-width: 560px) {
          .page {
            padding: 0.75rem;
          }

          .topbar,
          .section-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .stats,
          .workflow ol {
            grid-template-columns: 1fr;
          }

          .hero__actions {
            flex-direction: column;
          }

          .button {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .terminal__blink,
          .preview-card-wrap {
            animation: none;
          }

          .button,
          .preview-card,
          .preview-card::after {
            transition: none;
          }

          .button:hover,
          .preview-card:hover {
            transform: none;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          background: #070a12;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </main>
  );
}
