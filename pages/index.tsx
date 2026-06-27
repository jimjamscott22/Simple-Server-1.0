import { GetServerSideProps } from 'next';
import { getStorage, listLocalReactFiles, type FileEntry } from '@/src/storage';
import SimpleServerHome from '@/previews/simple-server-home-variant.index';

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

export default function Home({ files }: Props) {
  return <SimpleServerHome files={files} />;
}
