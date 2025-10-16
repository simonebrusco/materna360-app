// lib/messages.js
const MESSAGES = [
  "Hoje pode ser mais leve. Um passo de cada vez 💛",
  "Respire: você está fazendo o melhor que pode.",
  "Pequenas pausas, grandes efeitos no coração.",
  "A rotina é corrida, mas o amor acalma o passo.",
  "Um gesto de autocuidado é um ato de amor por todos.",
];

export function getMessage() {
  if (typeof window === "undefined") return MESSAGES[0];
  const i = Number(localStorage.getItem("m360:msgIndex") || "0");
  return MESSAGES[i % MESSAGES.length];
}

export function nextMessage() {
  if (typeof window === "undefined") return;
  const i = Number(localStorage.getItem("m360:msgIndex") || "0");
  localStorage.setItem("m360:msgIndex", String((i + 1) % MESSAGES.length));
}
