import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { file } = req.query;

  if (!file || typeof file !== 'string') {
    return res.status(400).send('Missing file parameter');
  }

  const safe = path.basename(file);
  const filePath = path.join(process.cwd(), 'previews', `${safe}.html`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(fs.readFileSync(filePath, 'utf-8'));
}
