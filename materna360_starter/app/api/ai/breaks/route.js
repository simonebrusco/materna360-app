// app/api/ai/breaks/route.js
export const dynamic = "force-dynamic"; // evita cache

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { mood = "neutra", time = 3, place = "casa" } = body;

    const ideas = [
      `Pausa de ${time} min (${place}): respire 4-4-4 (inspire 4, segure 4, expire 4).`,
      "Alongue ombros e pescoço por 60s (lento, sem dor).",
      "Anote 1 coisa pela qual é grata hoje."
    ];

    return new Response(JSON.stringify({ mood, place, ideas, time }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Falha ao gerar pausas." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ error: "Use POST" }), {
    status: 405,
    headers: { "Content-Type": "application/json" }
  });
}
