import type { NextApiRequest, NextApiResponse } from 'next';
import { getStorage, writeLocalReactFile } from '@/src/storage';

// Previews are text files (html/jsx/tsx); the browser reads them as text and
// posts JSON, so the default JSON body parser is all we need. Bump the limit a
// little to allow larger single-file pages.
export const config = {
  api: {
    bodyParser: { sizeLimit: '5mb' },
  },
};

const ALLOWED_EXTS = ['html', 'jsx', 'tsx'] as const;
type AllowedExt = (typeof ALLOWED_EXTS)[number];

// Base name: letters/numbers/dot/dash/underscore, must not start with `_`
// (those are hidden) and must contain no path separators.
const SAFE_BASE = /^(?!_)[A-Za-z0-9][A-Za-z0-9._-]*$/;

interface UploadBody {
  name?: unknown;
  content?: unknown;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, content } = (req.body ?? {}) as UploadBody;

  if (typeof name !== 'string' || typeof content !== 'string') {
    return res.status(400).json({ error: 'Expected JSON body with string `name` and `content`.' });
  }

  // Strip any directory components a client might have sent.
  const fileName = name.split(/[\\/]/).pop() ?? '';
  const dot = fileName.lastIndexOf('.');
  const base = dot > 0 ? fileName.slice(0, dot) : '';
  const ext = dot > 0 ? fileName.slice(dot + 1).toLowerCase() : '';

  if (!ALLOWED_EXTS.includes(ext as AllowedExt)) {
    return res
      .status(400)
      .json({ error: `Unsupported file type ".${ext}". Allowed: ${ALLOWED_EXTS.join(', ')}.` });
  }

  if (!SAFE_BASE.test(base)) {
    return res.status(400).json({
      error: 'Invalid file name. Use letters, numbers, dot, dash or underscore (not starting with "_").',
    });
  }

  try {
    if (ext === 'html') {
      // HTML respects the active storage backend (local fs or MariaDB).
      await getStorage().putHtml(base, content);
    } else {
      // JSX/TSX must stay on disk so Next.js can bundle them via import().
      writeLocalReactFile(`${base}.${ext}`, content);
    }

    return res.status(201).json({ ok: true, file: { name: `${base}.${ext}`, base, ext } });
  } catch (err) {
    console.error('Failed to save uploaded preview:', err);
    return res.status(500).json({ error: 'Failed to save file.' });
  }
}
