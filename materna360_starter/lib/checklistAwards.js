// lib/checklistAwards.js
// Compat: fornece handleChecklistAward sem imports estáticos.
// Mantém gamificação local (evento m360:win) e tenta (best-effort) persistir/ sincronizar.

export function handleChecklistAward({
  id = "checklist",
  title = "Checklist do Dia",
  points = 1,
  ts = Date.now(),
} = {}) {
  // 1) Dispara evento global para a engine de badges (sem depender de nada externo)
  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { id, source: "checklist", title, points, ts },
        })
      );
    }
  } catch {}

  // 2) Tenta gravar no storage/engine local (se existir)
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

  // 3) Tenta sincronizar no Supabase (best-effort e totalmente opcional)
  //    Não usar import estático aqui!
  try {
    import("./supaClient").then(async (m) => {
      const client = m?.getSupabase?.() || m?.supabase || null;
      if (!client) return; // sem ENV, ignora

      try {
        await client.from("awards_log").insert([
          {
            id: String(id),
            label: String(title || "Checklist do Dia"),
            emoji: "✅",
            ts,
            source: "checklist",
            points,
          },
        ]);
      } catch {
        // silencioso — não quebrar fluxo
      }
    });
  } catch {}
}

// Export default opcional para importações antigas
export default { handleChecklistAward };
