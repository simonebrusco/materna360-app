// app/api/ai/organize/route.js
export const dynamic = "force-dynamic"; // evita cache em produção

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { context = "casa", minutes = 10, kidsAge = "3-4" } = body;

    const tips = [
      `Em ${minutes} minutos: escolha 1 micro-área do "${context}" e aplique a regra 3x3 (3 itens para guardar, 3 para doar, 3 para descartar).`,
      `Com a criança (${kidsAge}): transforme em jogo — cronômetro + música; ganhe um abraço a cada 10 itens guardados.`,
      `Feche com 1 nota no Planner: o que ficou para amanhã (máx. 3 itens).`
    ];

    return new Response(JSON.stringify({ tips, context, minutes, kidsAge }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Falha ao gerar dicas." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// opcional: bloqueia métodos não suportados
export async function GET() {
  return new Response(JSON.stringify({ error: "Use POST" }), {
    status: 405,
    headers: { "Content-Type": "application/json" }
  });
}
