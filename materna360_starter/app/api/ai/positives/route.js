// app/api/ai/positives/route.js
// Gera 3–5 mensagens positivas personalizadas (mock seguro, sem dependência externa).
// Aceita body JSON opcional: { name, kidsCount, mood }
//
// Resposta: { items: [{ text, emoji }] }

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = (body?.name || "mãe").trim();
    const mood = String(body?.mood || "").toLowerCase();
    const kidsCount = Number(body?.kidsCount || 0);

    // Base de frases (curtas, leves, sem clichê pesado)
    const base = [
      "{name}, você está fazendo um ótimo trabalho hoje.",
      "Pequenos gestos contam — e você já fez vários.",
      "Seu cuidado faz diferença real na rotina.",
      "Respire: você não precisa dar conta de tudo de uma vez.",
      "Seu carinho é a base de um dia mais calmo.",
      "Você pode escolher um passo de cada vez.",
      "Seu descanso também é prioridade.",
      "Ser gentil com você muda o dia inteiro.",
      "Tudo bem pedir ajuda — força também é partilha.",
    ];

    // Ajustes por humor
    const byMood =
      mood.includes("cansa") || mood.includes("triste") || mood.includes("ans")
        ? [
            "Tá pesado? Escolha só uma coisinha simples e celebre.",
            "Você merece pausa: 60s de respiração contam, sim.",
            "Se abrace hoje: tirar 5 min para você é cuidado com todos.",
          ]
        : mood.includes("feliz") || mood.includes("bem") || mood.includes("leve")
        ? [
            "Guarde esse momento: anote algo bom do dia.",
            "Compartilhe um sorriso com quem você ama, contagia.",
            "Que tal uma foto simples para lembrar de hoje?",
          ]
        : [
            "Escolha um micro-passo agora e avance gentilmente.",
            "Uma água e um minuto de respiro já mudam o clima.",
          ];

    // Ajustes por filhos
    const byKids =
      kidsCount >= 2
        ? [
            "Coordenação de rotinas não é fácil — você está mandando muito bem.",
            "Dividir atenção é arte: celebre sua presença de hoje.",
          ]
        : kidsCount === 1
        ? [
            "Seu vínculo é único — um momento de olho no olho vale ouro.",
            "Celebre a brincadeira simples de hoje, ela já é suficiente.",
          ]
        : [
            "Seu autocuidado puxa a fila — obrigada por se acolher.",
            "Você conta. De verdade.",
          ];

    // Montagem e personalização
    const replace = (s) =>
      s.replace("{name}", name.split(" ")[0]).trim();

    // embaralha leve
    function pickN(arr, n) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a.slice(0, n);
    }

    const chosen = [
      ...pickN(base, 4),
      ...pickN(byMood, 2),
      ...pickN(byKids, 1),
    ]
      .slice(0, 5)
      .map((t) => replace(t));

    const emojis = ["💛", "🌿", "✨", "🌸", "🌟", "🤍", "🌼"];
    const items = chosen.map((text, i) => ({
      text,
      emoji: emojis[i % emojis.length],
    }));

    return new Response(JSON.stringify({ items }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ items: [] }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
}
