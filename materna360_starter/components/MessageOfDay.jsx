"use client";

import { useEffect, useMemo, useState } from "react";
import { get, set, keys } from "../lib/storage";

const MESSAGES = [
  "Respire fundo. Você está fazendo o seu melhor 💛",
  "Pequenos passos também são progresso.",
  "Se acolha hoje: 5 min para você já mudam o dia.",
  "Você não está sozinha. Conte com a gente.",
  "Faça uma coisa por vez — com carinho."
];

// Guardamos índice e data da última exibição.
// Troca automática se passaram >= 24h desde o último registro.
function nextIndex(curr) {
  return (curr + 1) % MESSAGES.length;
}

export default function MessageOfDay() {
  const [msg, setMsg] = useState(MESSAGES[0]);

  const key = keys.motd || "m360:motd"; // fallback por segurança
  const now = useMemo(() => Date.now(), []);
  const DAY_MS = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const saved = get(key, { index: 0, ts: 0 });
    // se já passou 1 dia, rotaciona
    if (!saved.ts || now - saved.ts >= DAY_MS) {
      const idx = nextIndex(saved.index || 0);
      const payload = { index: idx, ts: now };
      set(key, payload);
      setMsg(MESSAGES[idx]);

      // badge por “organização” (gatilho ao rotacionar automaticamente)
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("m360:win", {
            detail: { type: "badge", name: "Organizada" },
          })
        );
      }
    } else {
      // ainda dentro da janela de 24h → mantém
      setMsg(MESSAGES[saved.index || 0]);
    }
  }, [DAY_MS, key, now]);

  return (
    <section className="glass rounded-2xl p-4 mb-4">
      <div className="text-sm opacity-70 mb-1">Mensagem do dia</div>
      <p className="text-lg leading-snug">
        {msg}
      </p>
      {/* sem CTA de troca manual, conforme pedido */}
    </section>
  );
}
