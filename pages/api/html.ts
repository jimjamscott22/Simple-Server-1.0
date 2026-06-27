import type { NextApiRequest, NextApiResponse } from 'next';
import { getStorage } from '@/src/storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { file } = req.query;

  if (!file || typeof file !== 'string') {
    return res.status(400).send('Missing file parameter');
  }

  try {
    const html = await getStorage().getHtml(file);
    if (html === null) {
      return res.status(404).send('File not found');
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (err) {
    console.error('Failed to load HTML preview:', err);
    return res.status(500).send('Failed to load preview');
  }
}
