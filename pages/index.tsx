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

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const dir = path.join(process.cwd(), 'previews');
  const ALLOWED = ['.tsx', '.jsx', '.html'];

  let files: FileEntry[] = [];
  try {
    files = fs
      .readdirSync(dir)
      .filter(f => ALLOWED.includes(path.extname(f).toLowerCase()) && !f.startsWith('_'))
      .map(f => ({
        name: f,
        base: path.basename(f, path.extname(f)),
        ext: path.extname(f).slice(1).toLowerCase(),
      }));
  } catch {
    // previews/ doesn't exist yet
  }

  return { props: { files } };
};

const BADGE: Record<string, { bg: string; label: string }> = {
  tsx:  { bg: '#61dafb', label: 'TSX' },
  jsx:  { bg: '#f7df1e', label: 'JSX' },
  html: { bg: '#e34f26', label: 'HTML' },
};

export default function Dashboard({ files }: Props) {
  return (
    <div style={{
      background: '#0d0d0d',
      minHeight: '100vh',
      color: '#00ff41',
      fontFamily: '"Courier New", Courier, monospace',
      padding: '2.5rem 2rem',
    }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        <div style={{ marginBottom: '0.25rem', fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>
          Simple-Server <span style={{ color: '#444', fontSize: '0.9rem' }}>v1.0</span>
        </div>
        <div style={{ color: '#555', marginBottom: '2.5rem', fontSize: '0.85rem' }}>
          Drop .tsx, .jsx, or .html files into <code style={{ color: '#888' }}>previews/</code> to get started
        </div>

        <div style={{ color: '#444', marginBottom: '1rem', fontSize: '0.85rem' }}>
          $ ls ./previews/
        </div>

        {files.length === 0 ? (
          <div style={{ color: '#444', fontStyle: 'italic', fontSize: '0.9rem' }}>
            No files found. The previews/ directory is empty.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {files.map(f => {
              const badge = BADGE[f.ext] ?? { bg: '#888', label: f.ext.toUpperCase() };
              return (
                <li key={f.name} style={{ marginBottom: '0.75rem' }}>
                  <a
                    href={`/preview/${encodeURIComponent(f.base)}?type=${f.ext}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      textDecoration: 'none',
                      color: '#00ff41',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#00ff41')}
                  >
                    <span style={{
                      background: badge.bg,
                      color: '#000',
                      padding: '1px 7px',
                      borderRadius: '3px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      minWidth: '38px',
                      textAlign: 'center',
                      flexShrink: 0,
                    }}>
                      {badge.label}
                    </span>
                    <span style={{ borderBottom: '1px dashed #2a2a2a' }}>{f.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        <div style={{ marginTop: '3.5rem', color: '#2a2a2a', fontSize: '0.75rem' }}>
          Refresh the page after adding new files to see them listed here.
        </div>
      </div>
    </div>
  );
}
