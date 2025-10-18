// lib/checklistAwards.js
// Compat: fornece handleChecklistAward SEM imports de supabase (evita erro de build).
// Mantém gamificação: dispara "m360:win" e tenta gravar em persistM360 (best-effort).

export function handleChecklistAward({
  id = "checklist",
  title = "Checklist do Dia",
  points = 1,
  ts = Date.now(),
} = {}) {
  // 1) Dispara evento global (engine de badges escuta "m360:win")
  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { id, source: "checklist", title, points, ts },
        })
      );
    }
  } catch {}

  // 2) Best-effort: tenta gravar na persistência local se existir
  try {
    import("./persistM360.js").then((m) => {
      if (m?.appendAward) {
        m.appendAward({
          kind: "heart",
          title,
          points,
          ts,
          meta: { from: "checklist", id },
        });
      }
    });
  } catch {}
}

// Export default para compat com imports antigos
export default { handleChecklistAward };
