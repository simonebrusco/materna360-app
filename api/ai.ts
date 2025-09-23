// api/ai.ts  — handler sem dependências de @vercel/node
export default async function handler(req: any, res: any) {
  try {
    // Se quiser testar método:
    // if (req.method !== 'GET') {
    //   res.status(405).json({ ok: false, error: 'Method not allowed' });
    //   return;
    // }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({ ok: true, ping: 'pong' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'internal_error' });
  }
}
