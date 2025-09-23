// api/ai.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, ping: 'pong' });
  }

  // Aceita POST também pra já ficarmos prontos para a IA depois
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      return res.status(200).json({ ok: true, youSent: body ?? null });
    } catch (e) {
      return res.status(400).json({ ok: false, error: 'Invalid JSON body' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
