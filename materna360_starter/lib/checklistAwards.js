// lib/checklistAwards.js
// Dispara eventos de gamificação quando certos itens do checklist são marcados.

const AWARD_IDS = new Set([
  "respirar", // 1 min de respiração
  "momento",  // um momento com meu filho
  // adicione mais IDs se necessário
]);

export function handleChecklistAward({ id, willCheck }) {
  // evita rodar no SSR
  if (typeof window === "undefined") return;
  try {
    if (willCheck && AWARD_IDS.has(id)) {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { source: "checklist", id }
        })
      );
    }
    // manter histórico em sincronia
    window.dispatchEvent(new CustomEvent("m360:checklist:changed"));
  } catch {
    // silencioso
  }
}

// export default opcional, caso algum import use default
export default { handleChecklistAward };
