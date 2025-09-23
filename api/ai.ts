// api/ai.ts — Edge Function (sem @vercel/node)
export const config = { runtime: 'edge' };

import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const messages = body?.messages;

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'messages deve ser um array' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
    });

    return new Response(JSON.stringify(completion), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? 'Erro interno' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
