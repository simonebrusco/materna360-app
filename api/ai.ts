// api/ai.ts — Vercel Serverless Function (Node runtime)
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const isPost = req.method === 'POST';
    const body = isPost ? req.body : req.query;
    const kind = String(body?.kind || 'mensagem-dia');
    const idadeMeses = Number(body?.idadeMeses || 12);

    const promptMap: Record<string, string> = {
      'receita-dia': `Gere 1 receita simples e saudável para uma mãe com bebê de ${idadeMeses} meses. Formate em: Título; Tempo; Ingredientes; Modo de preparo; Dica.`,
      'brincadeira': `Sugira 1 brincadeira segura e divertida para bebê de ${idadeMeses} meses. Formate em: Nome; Materiais; Passo a passo; Benefícios; Precauções.`,
      'mensagem-dia': `Escreva uma mensagem curta, carinhosa e motivadora para uma mãe. 2 a 3 frases.`,
    };
    const prompt = promptMap[kind] ?? 'Escreva uma mensagem curta e positiva para uma mãe.';

    // ====== OpenAI (padrão) ======
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    }).then(r => r.json());

    const text = r?.choices?.[0]?.message?.content?.trim() || 'Não consegui gerar agora 😅 Tente novamente.';

    res.status(200).json({ ok: true, kind, text });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'erro' });
  }
}
