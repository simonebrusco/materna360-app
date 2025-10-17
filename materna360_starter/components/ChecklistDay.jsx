// materna360_starter/components/ChecklistDay.jsx
"use client";

/**
 * Checklist do Dia — com data no cabeçalho e histórico simples.
 * - Armazena em localStorage:
 *   - "m360:checklist": { [yyyy-mm-dd]: Array<{ id, label, done }> }
 *   - "m360:history"  : Array<{ date, completed }>
 * - Visual padronizado com os estilos atuais do app (bg white, ring-black/5)
 * - Standalone (não depende de hooks/utilitários do projeto)
 */

import { useEffect, useMemo, useState } from "react";

const STORAGE_CHECKLIST = "m360:checklist";
const STORAGE_HISTORY   = "m360:history";

function isClient() {
  return typeof window !== "undefined";
}

function readChecklist() {
  if (!isClient()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_CHECKLIST);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function writeChecklist(map) {
  if (!isClient()) return;
  try { window.localStorage.setItem(STORAGE_CHECKLIST, JSON.stringify(map)); } catch {}
}

function readHistory() {
  if (!isClient()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeHistory(list) {
  if (!isClient()) return;
  try { window.localStorage.setItem(STORAGE_HISTORY, JSON.stringify(list)); } catch {}
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function formatPtBrFull(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const dow = d.toLocaleDateString("pt-BR", { weekday: "long" });
  const day = d.toLocaleDateString("pt-BR", { day: "2-digit" });
  const mon = d.toLocaleDateString("pt-BR", { month: "long" });
  return `${capitalize(dow)}, ${day} de ${mon}`;
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export default function ChecklistDay() {
  const iso = todayISO();
  const [list, setList] = useState([]);

  // Carrega checklist do dia
  useEffect(() => {
    const map = readChecklist();
    setList(map[iso] ?? []);
  }, [iso]);

  // Persist helpers
  function persist(next) {
    const map = readChecklist();
    map[iso] = next;
    writeChecklist(map);
    setList(next);

    // Atualiza histórico de concluídos do dia
    const completed = next.filter(x => x.done).length;
    const hist = readHistory();
    const i = hist.findIndex(h => h.date === iso);
    if (i >= 0) hist[i].completed = completed;
    else hist.push({ date: iso, completed });
    writeHistory(hist);
  }

  function addItem() {
    const label = isClient() ? window.prompt("Novo item do dia") : null;
    if (!label) return;
    const item = { id: cryptoRandom(), label, done: false };
    persist([...list, item]);
  }

  function toggle(id) {
    persist(list.map(it => it.id === id ? { ...it, done: !it.done } : it));
  }

  function remove(id) {
    persist(list.filter(it => it.id !== id));
  }

  const headerDate = useMemo(() => formatPtBrFull(iso), [iso]);
  const progress = list.length ? Math.round((list.filter(i=>i.done).length / list.length) * 100) : 0;

  return (
    <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 md:p-5">
      <header className="flex items-center justify-between gap-3 mb-2">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-[#1A2240]">Checklist do Dia</h2>
          <p className="text-xs md:text-sm text-[#1A2240]/60">{headerDate}</p>
        </div>
        <button
          onClick={addItem}
          className="rounded-xl px-3 py-2 text-white bg-[#ff005e] hover:opacity-90"
        >
          + Item
        </button>
      </header>

      {/* Barra de progresso simples */}
      <div className="mt-2 h-2 rounded-full bg-black/5 overflow-hidden">
        <div
          className="h-full bg-[#ff005e] transition-all"
          style={{ width: `${progress}%` }}
          aria-label={`Progresso ${progress}%`}
        />
      </div>
      <div className="mt-1 text-xs text-[#1A2240]/60">{progress}% concluído</div>

      {/* Itens */}
      <ul className="mt-3 space-y-2">
        {list.length === 0 && (
          <li className="text-sm text-[#1A2240]/60">Sem itens ainda. Toque em “+ Item”.</li>
        )}
        {list.map((it) => (
          <li key={it.id} className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={it.done}
                onChange={() => toggle(it.id)}
                className="h-5 w-5 rounded-md border-black/20 text-[#ff005e] focus:ring-[#ff005e]"
              />
              <span className={`text-sm md:text-base ${it.done ? "line-through opacity-70" : ""}`}>
                {it.label}
              </span>
            </label>
            <button
              onClick={() => remove(it.id)}
              className="text-xs md:text-sm px-2 py-1 rounded-lg bg-black/5 hover:bg-black/10"
              aria-label="Remover item"
              title="Remover"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function cryptoRandom() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "id-" + Math.random().toString(36).slice(2);
}
