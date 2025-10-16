// materna360_starter/app/brincar/page.jsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ACTIVITIES, AGE_BUCKETS, PLACES, filterActivities } from "../../lib/activities";
import { addPlannerItem } from "../../lib/planner";
import { toast } from "../../lib/toast";

export default function BrincarPage() {
  // defaults seguros
  const defaultAge = AGE_BUCKETS[0]?.id ?? "2-3";
  const defaultPlace = PLACES[0]?.id ?? "casa";

  const [age, setAge] = useState(defaultAge);
  const [place, setPlace] = useState(defaultPlace);

  // sugestão do dia com fallback
  const suggestion = useMemo(() => {
    const len = ACTIVITIES.length || 1;
    const idx = Math.floor(0.37 * len) % len;
    return ACTIVITIES[idx] ?? { slug: "caca-cores", title: "Atividade surpresa", subtitle: "" };
  }, []);

  // lista filtrada — se algo vier indefinido, a lib tem defaults
  const list = useMemo(() => filterActivities({ age, place }), [age, place]);

  function save(title) {
    addPlannerItem("filhos", title);
    toast("Atividade salva no Planner 💾");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Exploradora" } }));
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <h1 className="text-2xl font-semibold mb-4">Brincar</h1>

      {/* Sugestão do dia */}
      <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 mb-4">
        <div className="text-sm text-slate-500 mb-1">Sugestão do dia</div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-medium">{suggestion.title}</div>
            {suggestion.subtitle && <div className="text-sm text-slate-500 mt-1">{suggestion.subtitle}</div>}
          </div>
          <div className="flex gap-2">
            <Link href={`/brincar/${suggestion.slug}`} className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5">
              Detalhes
            </Link>
            <button onClick={() => save(suggestion.title)} className="rounded-xl bg-[#F15A2E] text-white px-3 py-1.5">
              Salvar
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Idade:</label>
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5 text-sm"
          >
            {AGE_BUCKETS.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Local:</label>
          <select
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5 text-sm"
          >
            {PLACES.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista */}
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
            {a.subtitle && <div className="text-sm text-slate-500 mt-1">{a.subtitle}</div>}
          </div>
        ))}
        {list.length === 0 && (
          <div className="text-sm text-slate-500">Nenhuma atividade para esse filtro por enquanto.</div>
        )}
      </div>
    </main>
  );
}
