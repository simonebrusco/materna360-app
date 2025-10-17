// materna360_starter/lib/messages.js

// Frases curtas, acolhedoras, alinhadas ao tom Materna360
export const MESSAGES = [
  "Pequenos passos também são cuidado 💛",
  "Respire fundo: você está fazendo o seu melhor.",
  "Carinho e presença valem ouro hoje.",
  "Seu ritmo importa — vá com gentileza.",
  "Celebrar o simples também é progresso.",
  "Pedir ajuda é um ato de amor próprio.",
  "Dê um sorriso para si; você merece.",
  "Organize o essencial e abrace o resto.",
  "Uma pausa curta pode mudar o dia.",
  "Acolha o que cabe hoje — e só.",
  "Você não está sozinha. Estamos juntas.",
  "Cada momento com seu filho é um tesouro.",
];

// Índice determinístico para a data informada (UTC, estável)
export function messageIndexForDate(d = new Date()) {
  const base = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  // número de dias desde 1970-01-01
  const days = Math.floor(base / 86400000);
  return Math.abs(days) % MESSAGES.length;
}

export function messageForDate(d = new Date()) {
  return MESSAGES[messageIndexForDate(d)];
}
