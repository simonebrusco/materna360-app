// materna360_starter/app/brincar/page.jsx
"use client";

import { useMemo, useState } from "react";
import {
  ACTIVITIES,
  filterActivities,
  AGE_BUCKETS,
  PLACES,
} from "../../lib/activities";
import { addPlannerItem } from "../../lib/planner";

function Select({ value, onChange, options, label }) {
  return (
    <label className="flex-1">
      <span className="block text-sm text-slate-600 mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ActivityCard({ a, onSave }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{a.emoji}</div>
        <div>
          <div className="font-semibold text-slate-900">{a.title}</div>
          <div className="text-sm text-slate-500">{a.desc}</div>
        </div>
      </div>
      <div className="text-xs text-slate-500">
        Idades: {a.ageLabel} • Locais: {a.placeLabel}
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => onSave(a)}
          className="btn bg-brand text-white hover:opacity-90 rounded-xl px-4 py-2"
        >
          Salvar no Planner
        </button>
      </div>
    </div>
  );
}

export default function BrincarPage() {
  const [age, setAge] = useState(AGE_BUCKETS[1].value); // default 2–3
  const [place, setPlace] = useState(PLACES[0].value);  // default Casa
  const [seed, setSeed] = useState(0);

  const results = useMemo(() => {
    return filterActivities(ACTIVITIES, { age, place }, 6);
  }, [age, place, seed]);

  function regenerate() {
    setSeed((s) => s + 1);
  }

  function handleSave(a) {
    addPlannerItem({
      area: "filhos",
      title: `Brincar: ${a.title}`,
      done: false,
      meta: { activityId: a.id, age, place },
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Exploradora" },
        })
      );
    }

    alert("Atividade salva no Planner (aba Filhos) ✅");
  }

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold text-slate-900">Brincar</h1>
        <p className="text-sm text-slate-600">
          Ideias e brincadeiras por idade e contexto.
        </p>
      </header>

      <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 mb-5">
        <div className="flex flex-col md:flex-row gap-3">
          <Select
            value={age}
            onChange={setAge}
            options={AGE_BUCKETS}
            label="Idade"
          />
          <Select
            value={place}
            onChange={setPlace}
            options={PLACES}
            label="Local"
          />
          <div className="flex items-end">
            <button
              onClick={regenerate}
              className="btn bg-brand text-white hover:opacity-90 rounded-xl px-4 py-2"
            >
              Gerar Ideias
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.length === 0 ? (
          <div className="col-span-full text-slate-600 text-sm">
            Nada por aqui com esses filtros. Tente outra idade/local. 🙂
          </div>
        ) : (
          results.map((a) => (
            <ActivityCard key={a.id} a={a} onSave={handleSave} />
          ))
        )}
      </section>
    </main>
  );
}
