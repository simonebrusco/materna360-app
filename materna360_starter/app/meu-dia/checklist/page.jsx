// materna360_starter/app/meu-dia/checklist/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import AppBar from "../../../components/AppBar.jsx";
import GlassCard from "../../../components/GlassCard.jsx";
import { get, set } from "../../../lib/storage.js";

// chave diária
function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const DEFAULT_ITEMS = [
  { id: "agua", title: "Beber água 6–8 copos" },
  { id: "respirar", title: "1 min de respiração consciente" },
  { id: "momento-filho", title: "Um momento de presença com meu filho" },
  { id: "movimento", title: "5 min de alongamento/movimento" },
  { id: "gentileza", title: "Uma gentileza comigo hoje" },
];

export default function ChecklistPage() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [done, setDone] = useState([]);
  const tid = useMemo(() => `m360:checklist_log:${todayStr()}`, []);
  const defsKey = "m360:checklist_defs";

  // inicializa defs + log do dia
  useEffect(() => {
    const defs = get(defsKey, null);
    if (!defs || !Array.isArray(defs) || defs.length === 0) {
      set(defsKey, DEFAULT_ITEMS);
      setItems(DEFAULT_ITEMS);
    } else {
      setItems(defs);
    }

    const log = get(tid, null);
    if (!log || !Array.isArray(log)) {
      set(tid, []);
      setDone([]);
    } else {
      setDone(log);
    }
  }, [tid]);

  const total = items.length;
  const count = done.length;
  const percent = total ? Math.round((count / total) * 100) : 0;

  function toggle(id) {
    let next;
    if (done.includes(id)) {
      next = done.filter((x) => x !== id);
    } else {
      next = [id, ...done];
      // feedback sutil
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("m360:toast", {
            detail: { message: "Feito! ✅" },
          })
        );
      }
    }
    setDone(next);
    set(tid, next);

    // badge “Organizada” quando completa 3
    if (next.length === 3 && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Organizada" },
        })
      );
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <AppBar title="Checklist do Dia" backHref="/meu-dia" />

      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Hoje</h1>
            <p className="subtitle mt-0.5">
              {count}/{total} concluídos — {percent}%
            </p>
          </div>
        </div>

        <div className="mt-3 h-2 rounded-full bg-black/5 overflow-hidden">
          <div
            className="h-full bg-[var(--brand)] rounded-full transition-[width]"
            style={{ width: `${percent}%` }}
          />
        </div>

        <ul className="mt-4 space-y-2">
          {items.map((it) => {
            const checked = done.includes(it.id);
            return (
              <li
                key={it.id}
                className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-black/[0.03]"
              >
                <button
                  onClick={() => toggle(it.id)}
                  aria-pressed={checked}
                  className={`h-6 w-6 grid place-items-center rounded-md ring-1 transition
                    ${checked ? "bg-[var(--brand)] text-white ring-[var(--brand)]" : "bg-white ring-black/10"}`}
                >
                  {checked ? "✓" : ""}
                </button>
                <span className={`text-sm ${checked ? "line-through opacity-60" : ""}`}>
                  {it.title}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="text-[12px] text-[var(--brand-navy-t60)] mt-4">
          Dica: 3/5 concluídos já é excelente — celebre 💛
        </p>
      </GlassCard>
    </main>
  );
}
