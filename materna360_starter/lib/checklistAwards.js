// lib/checklistAwards.js
// Dispara eventos de gamificação quando certos itens do checklist são marcados.

const AWARD_IDS = new Set([
  "respirar", // 1 min de respiração
  "momento",  // um momento com meu filho
  // adicione aqui outros ids que também devem contar como “win”
]);

export function handleChecklistAward({ id, willCheck }) {
  if (typeof window === "undefined") return;
  try {
    if (willCheck && AWARD_IDS.has(id)) {
      // Evento global de “conquista” já usado no app
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { source: "checklist", id }
        })
      );
    }
    // evento de mudança do checklist (já usado pelo histórico)
    window.dispatchEvent(new CustomEvent("m360:checklist:changed"));
  } catch {
    // silencioso
  }
}
