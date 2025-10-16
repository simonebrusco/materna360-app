"use client";

import { useMemo, useState } from "react";
import { ACTIVITIES, filterActivities, AGE_BUCKETS, PLACES } from "../../lib/activities";
import { addPlannerItem } from "../../lib/planner";

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-slate-600">{label}</span>
      <select
        className="rounded-xl bg-white ring-1 ring-black/5 shadow-sm px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

function IdeaCard({ item, onSave }) {
  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{item.emoji}</div>
        <div>
          <div className="font-semibold text-[#1A2240]">{item.title}</div>
          <p className="text-sm text-slate-600">{item.desc}</p>
          <p className="mt-1 text-xs text-slate-500">
            <strong>Idade:</strong> {item.ageLabel} · <strong>Local:</strong> {item.placeLabel}
          </p>
          {item.tags?.length ? (
            <p className="mt-1 text-xs text-slate-500">
              <strong>Desenvolve:</strong> {item.tags.join(" · ")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          className="btn"
          onClick={() => onSave(item)}
          aria-label="Salvar no Planner"
          title="Salvar no Planner"
        >
          Salvar no Planner
        </button>
      </div>
    </div>
  );
}

export default function BrincarPage() {
  const [age, setAge] = useState("2-3");
  const [place, setPlace] = useState("casa");
  const [ideas, setIdeas] = useState([]);

  const ageOptions = useMemo(
    () => AGE_BUCKETS.map((b) => ({ value: b.value, label: b.label })),
    []
  );
  const placeOptions = useMemo(
    () => PLACES.map((p) => ({ value: p.value, label: p.label })),
    []
  );

  function handleGenerate() {
    const out = filterActivities(ACTIVITIES, { age, place }, 6);
    setIdeas(out);
  }

  function handleSave(item) {
    // salva no planner (categoria Filhos por padrão)
    addPlannerItem({
      area: "filhos",
      title: `Brincar: ${item.title}`,
      meta: { from: "brincar", id: item.id },
    });

    // badge “Exploradora”
    window.dispatchEvent(
      new CustomEvent("m360:win", {
        detail: { type: "badge", name: "Exploradora" },
      })
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold">Brincar</h1>
        <p className="text-sm text-slate-500">Ideias e brincadeiras por idade e contexto.</p>
      </header>

      <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 md:p-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label="Idade" value={age} onChange={setAge} options={ageOptions} />
          <Select label="Local" value={place} onChange={setPlace} options={placeOptions} />
          <div className="flex items-end">
            <button onClick={handleGenerate} className="btn btn-primary w-full">
              Gerar Ideias
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-3">
          Use os filtros e toque em <strong>Gerar Ideias</strong>. Salve no Planner para fazer depois. 💛
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.length === 0 ? (
          <div className="text-sm text-slate-500">
            Ainda sem ideias listadas. Gere sugestões com os filtros acima.
          </div>
        ) : (
          ideas.map((it) => <IdeaCard key={it.id} item={it} onSave={handleSave} />)
        )}
      </section>
    </main>
  );
}
