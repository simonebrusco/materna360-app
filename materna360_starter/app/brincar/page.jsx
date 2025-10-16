"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ACTIVITIES, AGE_BUCKETS, PLACES, filterActivities } from "../../lib/activities";
import { addPlannerItem } from "../../lib/planner";
import { toast } from "../../lib/toast";

export default function BrincarPage() {
  const [age, setAge] = useState(AGE_BUCKETS[1].id);
  const [place, setPlace] = useState(PLACES[0].id);
  const seed = 0.37;
  const suggestion = useMemo(
    () => ACTIVITIES[Math.floor(seed * ACTIVITIES.length)],
    []
  );

  const list = useMemo(() => filterActivities({ age, place }), [age, place]);

  function save(title) {
    addPlannerItem("filhos", title);
    toast("Atividade salva no Planner 💾");
    window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Exploradora" } }));
  }

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <h1 className="text-2xl font-semibold mb-4">Brincar</h1>

      {/* Sugestão do dia */}
      <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 mb-4">
        <div className="text-sm text-slate-500 mb-1">Sugestão do dia</div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-medium">{suggestion.title}</div>
          <div className="flex gap-2">
            <Link href={`/brincar/${suggestion.slug}`} className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5">Detalhes</Link>
            <button onClick={() => save(suggestion.title)} className="rounded-xl bg-[#F15A2E] text-white px-3 py-1.5">Salvar</button>
          </div>
        </div>
      </div>

      {/* filtros */}
      {/* ... seus selects já existentes ... */}

      {/* listagem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map((a) => (
          <div key={a.slug} className="rounded-xl bg-white ring-1 ring-black/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-medium">{a.title}</div>
              <div className="flex gap-2">
                <Link href={`/brincar/${a.slug}`} className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5">Abrir</Link>
                <button onClick={() => save(a.title)} className="rounded-xl bg-[#F15A2E] text-white px-3 py-1.5">Salvar</button>
              </div>
            </div>
            <div className="text-sm text-slate-500 mt-1">{a.subtitle}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
