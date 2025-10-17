'use client';

import { useEffect, useMemo, useState } from 'react';
import { get, set, keys, weekDaysPt, fullWeekPt } from '@/lib/m360';

// =======================================================
// Materna360 — Planner semanal + notas livres
// Cores: usa as CSS vars definidas em styles/globals.css
// Não quebra nada existente (componente standalone)
// =======================================================

export default function PlannerWeekly() {
  const [planner, setPlanner] = useState({});
  const [activeIndex, setActiveIndex] = useState(new Date().getDay());

  useEffect(() => {
    setPlanner(get(keys.planner, {}));
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
        label: weekDaysPt[i],
      });
    }
    return days;
  }, []);

  const activeDay = week[activeIndex];
  const data = planner[activeDay?.iso] ?? { items: [], notes: '' };

  function persist(next) {
    set(keys.planner, next);
    setPlanner(next);
  }

  function addItem() {
    const label = typeof window !== 'undefined'
      ? window.prompt('Nova tarefa rápida para o Planner (ex: “Lancheiras”, “Ler 10min”)')
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
    nextItems[i] = was.startsWith('✓ ') ? was.replace(/^✓\s/, '') : `✓ ${was}`;
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
    <section className="bg-[--m360-white] rounded-2xl shadow-sm border border-[--m360-blush]/60 p-4">
      <header className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-[--m360-navy]">Planner semanal</h2>
        <button
          onClick={addItem}
          className="rounded-xl px-3 py-2 text-[--m360-white] bg-[--m360-coral] hover:opacity-90"
        >
          + Adicionar
        </button>
      </header>

      <nav className="flex gap-2 overflow-x-auto pb-2">
        {week.map((d, i) => (
          <button
            key={d.iso}
            onClick={() => setActiveIndex(i)}
            className={`px-3 py-2 rounded-xl text-sm font-medium ${
              i === activeIndex
                ? 'bg-[--m360-blush] text-[--m360-navy]'
                : 'bg-[--m360-blush]/50 text-[--m360-navy]/70'
            }`}
          >
            {d.label}
          </button>
        ))}
      </nav>

      <div className="mt-3 rounded-2xl p-3 ring-1 ring-[--m360-navy]/10">
        <div className="text-sm text-[--m360-navy]/70 mb-2">
          {fullWeekPt[activeIndex]}, {activeDay?.iso}
        </div>

        <ul className="space-y-2">
          {data.items.length === 0 && (
            <li className="text-sm text-[--m360-navy]/60">
              Sem itens ainda. Toque em “+ Adicionar”.
            </li>
          )}
          {data.items.map((it, i) => (
            <li key={`${it}-${i}`}>
              <button
                onClick={() => toggleItem(i)}
                className="w-full text-left px-3 py-2 rounded-xl bg-[--m360-blush]/40 hover:bg-[--m360-blush]"
              >
                {it}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-3">
          <label className="text-sm font-medium text-[--m360-navy]">Notas do dia</label>
          <textarea
            className="mt-1 w-full min-h-[88px] rounded-xl border border-[--m360-blush] bg-[--m360-white] p-3 outline-none focus:ring-2 focus:ring-[--m360-coral]"
            placeholder="Escreva lembretes livres, emoções, observações…"
            value={data.notes ?? ''}
            onChange={(e) => saveNotes(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
