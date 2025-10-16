// materna360_starter/app/brincar/page.jsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// libs com fallbacks
import * as Acts from "../../lib/activities.js";
import { get, set, keys } from "../../lib/storage.js";

// -------------------- helpers --------------------
const AGE_OPTS = [
  { v: "0-1", label: "0–1" },
  { v: "2-3", label: "2–3" },
  { v: "4-5", label: "4–5" },
  { v: "6-7", label: "6–7" },
  { v: "8+",  label: "8+"  },
];

const PLACE_OPTS = [
  { v: "casa",        label: "Casa" },
  { v: "parque",      label: "Parque" },
  { v: "escola",      label: "Escola" },
  { v: "ao-ar-livre", label: "Ao ar livre" },
];

// Usa função da lib se existir; senão, filtra um array simples
function listByFilters({ age, place }) {
  const src =
    Acts.listActivities ||
    Acts.getActivities ||
    Acts.default ||
    Acts.activities ||
    [];

  if (typeof src === "function") {
    try {
      return src({ age, place }) || [];
    } catch {
      // fallback abaixo
    }
  }

  const all = Array.isArray(src) ? src : [];
  return all.filter((a) => {
    const byAge   = !a.ages   || a.ages.includes(age);
    const byPlace = !a.places || a.places.includes(place);
    return byAge && byPlace;
  });
}

function saveToPlanner(activity) {
  const planner = get(keys.planner, { casa: [], filhos: [], eu: [] });

  const item = {
    id: `act_${activity.id || activity.title}_${Date.now()}`,
    title: activity.title || "Atividade",
    done: false,
    meta: {
      source: "brincar",
      activityId: activity.id || null,
    },
  };

  const next = {
    ...planner,
    filhos: [item, ...(planner.filhos || [])],
  };

  set(keys.planner, next);

  // badge: Exploradora
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("m360:win", {
        detail: { type: "badge", name: "Exploradora" },
      })
    );
  }
  return item;
}

// -------------------- UI --------------------
export default function BrincarPage() {
  const [age, setAge] = useState("2-3");
  const [place, setPlace] = useState("casa");
  const [ideas, setIdeas] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  const hint = useMemo(
    () => "Use os filtros e toque em Gerar Ideias.",
    []
  );

  function onGenerate() {
    const list = listByFilters({ age, place });
    setIdeas(list.slice(0, 12)); // limita para não ficar gigante
    setToastMsg("");
  }

  function onSave(activity) {
    const it = saveToPlanner(activity);
    setToastMsg(`Adicionado ao Planner: “${it.title}” 💛`);
    setTimeout(() => setToastMsg(""), 3000);
  }

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Brincar</h1>
        <Link href="/meu-dia/planner" className="btn bg-white border border-slate-200">
          Ver Planner
        </Link>
      </header>

      {/* Filtros */}
      <section className="card mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-slate-500">Idade</label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 mt-1"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            >
              {AGE_OPTS.map((o) => (
                <option key={o.v} value={o.v}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-500">Local</label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 mt-1"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            >
              {PLACE_OPTS.map((o) => (
                <option key={o.v} value={o.v}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button onClick={onGenerate} className="btn btn-primary w-full">
              Gerar Ideias
            </button>
          </div>
        </div>

        {!ideas.length ? (
          <p className="text-slate-500 text-sm mt-4">{hint}</p>
        ) : null}
      </section>

      {/* Lista de Ideias */}
      {!!ideas.length && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ideas.map((a) => (
            <article
              key={a.id || a.title}
              className="card flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {a.emoji ? <span className="mr-2">{a.emoji}</span> : null}
                  {a.title}
                </h3>

                {a.subtitle || a.description ? (
                  <p className="text-sm text-slate-600 mt-1">
                    {a.subtitle || a.description}
                  </p>
                ) : null}

                {Array.isArray(a.tags) && a.tags.length ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {a.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="text-xs rounded-full bg-slate-100 px-2 py-1"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {a.duration ? `${a.duration} min` : ""}
                </span>
                <button
                  onClick={() => onSave(a)}
                  className="btn bg-brand text-white"
                >
                  Salvar no Planner
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Toast simples */}
      {toastMsg ? (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 rounded-xl bg-black/80 text-white px-4 py-2 text-sm">
          {toastMsg}
        </div>
      ) : null}
    </main>
  );
}
