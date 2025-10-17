// materna360_starter/components/PlannerWeekly.jsx
"use client";

/**
 * Planner semanal + notas livres
 * - Armazena no localStorage em "m360:planner"
 * - Standalone (não depende de '@/lib/m360')
 * - Não altera rotas; aparece como um card na Home "Meu Dia"
 */

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "m360:planner";

function readPlanner() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writePlanner(next) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

const WEEK_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEK_FULL  = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];

export default function PlannerWeekly() {
  const [planner, setPlanner] = useState({});
  const [activeIndex, setActiveIndex] = useState(new Date().getDay());

  useEffect(() => {
    setPlanner(readPlanner());
  }, []);

  const week = useMemo(() => {
    // Gera a semana ancorada no domingo (0) até sábado (6)
    const start = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(start.getDate() - d.getDay() + i);
      days.push({
        iso: d.toISOString().slice(0, 10),
        dow: i,
        label: WEEK_SHORT[i],
      });
    }
    return days;
  }, []);

  const activeDay = week[activeIndex];
  const data = planner[activeDay?.iso] ?? { items: [], notes: "" };

  function persist(next) {
    writePlanner(next);
    setPlanner(next);
  }

  function addItem() {
    const label =
      typeof window !== "undefined"
        ? window.prompt('Nova tarefa (ex: "Lancheiras", "Ler 10min")')
        : null;
    if (!label) return;
    const next = {
      ...planner,
      [activeDay.iso]: {
        ...data,
        items: [...data.items, label],
      },
    };
    persist(next);
  }

  function toggleItem(i) {
    const nextItems = [...data.items];
    const was = nextItems[i];
    nextItems[i] = was.startsWith("✓ ") ? was.replace(/^✓\s/, "") : `✓ ${was}`;
    const next = {
      ...planner,
      [activeDay.iso]: { ...data, items: nextItems },
    };
    persist(next);
  }

  function saveNotes(v) {
    const next = {
      ...planner,
      [activeDay.iso]: { ...data, notes: v },
    };
    persist(next);
  }

  return (
    <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 md:p-5">
      <header className="flex items-center justify-between mb-3">
        <h2 className="text-base md:text-lg font-semibold text-[#1A2240]">Planner semanal</h2>
        <button
          onClick={addItem}
          className="rounded-xl px-3 py-2 text-white bg-[#ff005e] hover:opacity-90"
        >
          + Adicionar
        </button>
      </header>

      {/* Tabs dos dias da semana */}
      <nav className="flex gap-2 overflow-x-auto pb-2">
        {week.map((d, i) => (
          <button
            key={d.iso}
            onClick={() => setActiveIndex(i)}
            className={`px-3 py-2 rounded-xl text-sm font-medium ${
              i === activeIndex
                ? "bg-[#ffd8e6] text-[#1A2240]"
                : "bg-[#ffd8e6]/60 text-[#1A2240]/70"
            }`}
            title={d.iso}
          >
            {WEEK_SHORT[i]}
          </button>
        ))}
      </nav>

      {/* Conteúdo do dia ativo */}
      <div className="mt-3 rounded-2xl ring-1 ring-black/5 p-3">
        <div className="text-sm text-[#1A2240]/60 mb-2">
          {WEEK_FULL[activeIndex]}, {activeDay?.iso}
        </div>

        {/* Lista de itens */}
        <ul className="space-y-2">
          {data.items.length === 0 && (
            <li className="text-sm text-[#1A2240]/60">
              Sem itens ainda. Toque em “+ Adicionar”.
            </li>
          )}
          {data.items.map((it, i) => (
            <li key={`${it}-${i}`}>
              <button
                onClick={() => toggleItem(i)}
                className="w-full text-left px-3 py-2 rounded-xl bg-[#ffd8e6]/50 hover:bg-[#ffd8e6]"
              >
                {it}
              </button>
            </li>
          ))}
        </ul>

        {/* Notas livres */}
        <div className="mt-3">
          <label className="text-sm font-medium text-[#1A2240]">Notas do dia</label>
          <textarea
            className="mt-1 w-full min-h-[88px] rounded-xl border border-black/10 bg-white p-3 outline-none focus:ring-2 focus:ring-[#ff005e]"
            placeholder="Escreva lembretes, emoções, observações…"
            value={data.notes ?? ""}
            onChange={(e) => saveNotes(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
