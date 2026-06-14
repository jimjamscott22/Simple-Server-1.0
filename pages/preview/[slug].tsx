import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';

interface Props {
  slug: string;
  type: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, query }) => {
  const slug = params!.slug as string;
  const type = (query.type as string) ?? 'tsx';
  return { props: { slug, type } };
};

function BackBar({ label }: { label: string }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '32px',
      background: 'rgba(13,13,13,0.92)',
      borderBottom: '1px solid #1a1a1a',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      padding: '0 1rem',
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '0.78rem',
      zIndex: 9999,
    }}>
      <a href="/" style={{ color: '#00ff41', textDecoration: 'none' }}>← back</a>
      <span style={{ color: '#444' }}>{label}</span>
    </div>
  );
}

function ComponentPreview({ slug, type }: { slug: string; type: string }) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = type === 'jsx'
      ? import(`../../previews/${slug}.jsx`)
      : import(`../../previews/${slug}.tsx`);

    load
      .then(mod => setComponent(() => mod.default))
      .catch(err => setError(err.message));
  }, [slug, type]);

  if (error) {
    return (
      <div style={{
        padding: '2rem',
        fontFamily: '"Courier New", monospace',
        color: '#ff4444',
        background: '#0d0d0d',
        minHeight: '100vh',
      }}>
        <p>Failed to load <strong>{slug}.{type}</strong></p>
        <pre style={{ color: '#666', fontSize: '0.8rem', marginTop: '1rem' }}>{error}</pre>
      </div>
    );
  }

  if (!Component) {
    return (
      <div style={{
        padding: '2rem',
        fontFamily: '"Courier New", monospace',
        color: '#444',
        background: '#0d0d0d',
        minHeight: '100vh',
      }}>
        Loading...
      </div>
    );
  }

  return <Component />;
}

export default function PreviewPage({ slug, type }: Props) {
  const label = `${slug}.${type}`;

  if (type === 'html') {
    return (
      <>
        <BackBar label={label} />
        <iframe
          src={`/api/html?file=${encodeURIComponent(slug)}`}
          style={{
            position: 'fixed',
            top: '32px',
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: 'calc(100vh - 32px)',
            border: 'none',
          }}
          title={label}
        />
      </>
    );
  }

  return (
    <>
      <BackBar label={label} />
      <div style={{ paddingTop: '32px' }}>
        <ComponentPreview slug={slug} type={type} />
      </div>
    </>
  );
}
