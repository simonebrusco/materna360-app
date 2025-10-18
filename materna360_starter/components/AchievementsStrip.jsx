"use client";

import { useEffect, useState } from "react";
import { readAwards, handleWinEvent } from "@/lib/awards.js";

/**
 * Mostra conquistas recentes como pílulas.
 * Escuta:
 *  - m360:win            -> emitido pelo checklistAwards.js ao marcar itens
 *  - m360:awards:changed -> quando o log local é atualizado
 */
export default function AchievementsStrip() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(readAwards().items);

    const onWin = (ev) => {
      try { handleWinEvent(ev.detail || {}); } catch {}
      setItems(readAwards().items);
    };
    const onChanged = () => setItems(readAwards().items);

    window.addEventListener("m360:win", onWin);
    window.addEventListener("m360:awards:changed", onChanged);
    return () => {
      window.removeEventListener("m360:win", onWin);
      window.removeEventListener("m360:awards:changed", onChanged);
    };
  }, []);

  if (!items || items.length === 0) return null;

  const recent = items.slice(0, 8);

  return (
    <section className="mx-auto max-w-5xl px-5 mt-4">
      <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4">
        <div className="text-sm text-slate-600 mb-2">Conquistas recentes</div>
        <div className="flex flex-wrap gap-2">
          {recent.map((it, idx) => (
            <span
              key={`${it.id}-${it.ts}-${idx}`}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm bg-white"
              title={new Date(it.ts).toLocaleString()}
            >
              <span className="text-base">{it.emoji}</span>
              <span className="text-slate-700">{it.label}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
