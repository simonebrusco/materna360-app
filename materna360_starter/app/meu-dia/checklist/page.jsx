// app/meu-dia/checklist/page.jsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { get, set, keys } from "../../../lib/storage";
import { todayKey } from "../../../lib/day";
import { grantBadge } from "../../../lib/gamification";

const DEFAULT = {
  day: "", // yyyy-mm-dd
  items: [
    { id: "w1", text: "Beber água 💧", done: false },
    { id: "w2", text: "Alongar 2 min 🧘", done: false },
    { id: "w3", text: "Brincar 5 min 🎲", done: false },
    { id: "w4", text: "3 respirações profundas 🌬️", done: false },
  ],
};

export default function ChecklistPage() {
  const [state, setState] = useState(DEFAULT);

  // carregar e reset diário
  useEffect(() => {
    const today = todayKey();
    const saved = get(keys.checklist, DEFAULT);
    setState(saved.day === today ? saved : { ...DEFAULT, day: today });
  }, []);

  // salvar
  useEffect(() => { set(keys.checklist, state); }, [state]);

  const doneCount = useMemo(() => state.items.filter(i => i.done).length, [state]);

  useEffect(() => {
    // Conquista: "Cuidar de Mim" quando concluir 3 microtarefas no dia
    if (doneCount >= 3) grantBadge("CuidarDeMim", "Checklist diário");
  }, [doneCount]);

  function toggle(id) {
    setState((prev) => ({
      ...prev,
      items: prev.items.map(i => i.id === id ? { ...i, done: !i.done } : i),
    }));
  }

  function resetToday() {
    const today = todayKey();
    setState({ ...DEFAULT, day: today });
  }

  return (
    <main className="pb-28">
      <header className="mb-4">
        <h1 className="title">Checklist do Dia</h1>
        <p className="subtitle">Pequenas ações que fazem diferença</p>
      </header>

      <div className="card mb-3">
        <div className="font-medium">Hoje: {state.day}</div>
        <div className="text-sm text-slate-500">Concluídos: {doneCount}/{state.items.length}</div>
      </div>

      <ul className="space-y-2">
        {state.items.map(i => (
          <li key={i.id} className="card flex items-center gap-3">
            <input
              type="checkbox"
              checked={i.done}
              onChange={() => toggle(i.id)}
              className="w-5 h-5 accent-[var(--brand)]"
            />
            <div className={`flex-1 ${i.done ? "line-through text-slate-400" : ""}`}>
              {i.text}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex gap-2">
        <a href="/meu-dia" className="btn bg-white border border-slate-200">Voltar</a>
        <button onClick={resetToday} className="btn btn-primary">Reiniciar dia</button>
      </div>
    </main>
  );
}
