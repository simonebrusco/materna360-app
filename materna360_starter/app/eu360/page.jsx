"use client";

import { useMemo, useState } from "react";
import { getJSON, setJSON, get } from "../../lib/storage";

function weekMoods() {
  const list = getJSON("m360:moods") ?? []; // [{date, score}]
  const last7 = list.slice(0, 7);
  return last7;
}

export default function Eu360Page() {
  const moods = useMemo(() => weekMoods(), []);
  const badges = getJSON("m360:badges") ?? [];       // mantido pelo ClientInit/listener
  const gratitudes = getJSON("m360:gratitudes") ?? [];
  const minutes = useMemo(() => {
    const m = JSON.parse(get("m360:minutes") ?? "{}");
    return m.wellbeing ?? 0;
  }, []);

  const [g, setG] = useState("");

  function addGratitude() {
    if (!g.trim()) return;
    const list = [{ id: crypto.randomUUID(), text: g.trim(), date: new Date().toISOString() }, ...gratitudes].slice(0, 50);
    setJSON("m360:gratitudes", list);
    setG("");
  }

  return (
    <main className="max-w-4xl mx-auto px-5 py-6">
      <h1 className="text-2xl font-semibold mb-4">Eu360</h1>

      {/* Humor da Semana */}
      <section className="rounded-2xl bg-white ring-1 ring-black/5 p-4 mb-4">
        <div className="font-medium mb-2">Humor da semana</div>
        <div className="flex gap-2">
          {moods.length === 0 && <div className="text-sm text-slate-500">Sem registros ainda.</div>}
          {moods.map((m) => (
            <div key={m.date} className="size-8 rounded-full bg-rose-100 grid place-items-center text-sm">
              {m.score}
            </div>
          ))}
        </div>
      </section>

      {/* Conquistas */}
      <section className="rounded-2xl bg-white ring-1 ring-black/5 p-4 mb-4">
        <div className="font-medium mb-2">Conquistas</div>
        {badges.length === 0 && <div className="text-sm text-slate-500">Sem selos por enquanto.</div>}
        <div className="flex flex-wrap gap-2">
          {badges.slice(-5).reverse().map((b, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-rose-100 text-[#1A2240] text-sm">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* Gratidão */}
      <section className="rounded-2xl bg-white ring-1 ring-black/5 p-4 mb-4">
        <div className="font-medium mb-2">Gratidão</div>
        <div className="flex gap-2 mb-3">
          <input
            value={g}
            onChange={(e) => setG(e.target.value)}
            className="flex-1 rounded-xl bg-white ring-1 ring-black/5 px-3 py-2"
            placeholder="Escreva algo pelo qual é grata hoje…"
          />
          <button onClick={addGratitude} className="rounded-xl bg-[#F15A2E] text-white px-4 py-2">Salvar</button>
        </div>
        <ul className="space-y-1">
          {gratitudes.slice(0, 5).map((x) => (
            <li key={x.id} className="text-sm text-slate-700">• {x.text}</li>
          ))}
          {gratitudes.length === 0 && <li className="text-sm text-slate-500">Sem registros ainda.</li>}
        </ul>
      </section>

      {/* Meu Tempo */}
      <section className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
        <div className="font-medium mb-1">Meu Tempo</div>
        <div className="text-sm text-slate-600">Minutos de meditação/respiração (semana): <strong>{minutes} min</strong></div>
      </section>
    </main>
  );
}
