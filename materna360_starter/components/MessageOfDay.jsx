// materna360_starter/components/MessageOfDay.jsx
"use client";

import { useEffect, useState } from "react";
import { messageForDate, messageIndexForDate } from "../lib/messages";
import { get, set } from "../lib/storage";

// Chave local para persistir a mensagem do dia
const K = "m360:messageOfDay"; // { dateISO: '2025-10-16', idx: number, text: string, ts: number }

function isOlderThan24h(ts) {
  if (!ts) return true;
  return Date.now() - ts > 24 * 60 * 60 * 1000;
}

export default function MessageOfDay() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try {
      const today = new Date();
      const todayISO = today.toISOString().slice(0, 10);

      const saved = get(K, null);
      // Se não existir, ou passou 24h, ou o índice do dia mudou → rotaciona
      const todaysIndex = messageIndexForDate(today);
      const needsRotate =
        !saved ||
        isOlderThan24h(saved?.ts) ||
        saved?.idx !== todaysIndex ||
        saved?.dateISO !== todayISO;

      if (needsRotate) {
        const text = messageForDate(today);
        const payload = { dateISO: todayISO, idx: todaysIndex, text, ts: Date.now() };
        set(K, payload);
        setMsg(text);

        // Gamificação: ao “trocar” a mensagem do dia, premiamos organização
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("m360:win", {
              detail: { type: "badge", name: "Organizada" },
            })
          );
        }
      } else {
        setMsg(saved.text);
      }
    } catch {
      // fallback harden
      setMsg(messageForDate(new Date()));
    }
  }, []);

  return (
    <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5 md:p-6">
      <div className="text-sm text-brand-navy/60 mb-1">Mensagem do dia</div>
      <p className="text-lg md:text-xl leading-relaxed text-brand-navy">“{msg}”</p>
      <p className="mt-3 text-xs text-brand-navy/50">
        Atualiza automaticamente a cada 24 horas.
      </p>
    </section>
  );
}
