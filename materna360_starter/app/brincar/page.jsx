"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// tenta usar sua lib; se não houver, não quebra
let Acts = {};
try {
  Acts = require("../../lib/activities.js");
} catch { /* noop */ }

// Fallback leve caso a lib não exporte dados
const FALLBACK_ACTIVITIES = [
  { id: "caca-cores", slug: "caca-cores", title: "Caça às Cores", subtitle: "Procurem objetos por cor em casa", ages: ["2-3","4-5"], places: ["casa"], duration: 10, tags: ["atenção","observação"], emoji: "🎨" },
  { id: "pula-almofadas", slug: "pula-almofadas", title: "Pula Almofadas", subtitle: "Circuito motor com almofadas", ages: ["2-3","4-5","6-7"], places: ["casa"], duration: 12, tags: ["coordenação","força"], emoji: "🛋️" },
  { id: "historia-maluca", slug: "historia-maluca", title: "História Maluca", subtitle: "Inventem uma história juntos", ages: ["4-5","6-7","8+"], places: ["casa","escola"], duration: 8, tags: ["linguagem","criatividade"], emoji: "📚" },
];

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

function pickActivities({ age, place }) {
  // prioriza funções/arrays da lib
  const src =
    Acts.listActivities ||
    Acts.getActivities ||
    Acts.ACTIVITIES ||
    Acts.activities ||
    FALLBACK_ACTIVITIES;

  if (typeof src === "function") {
    try { return src({ age, place }) || []; } catch {}
  }
  const all = Array.isArray(src) ? src : FALLBACK_ACTIVITIES;
  return all.filter(a => (!a.ages || a.ages.includes(age)) && (!a.places || a.places.includes(place)));
}

function getActivitiesArray() {
  const arr =
    Acts.ACTIVITIES ||
    Acts.activities ||
    FALLBACK_ACTIVITIES;
  return Array.isArray(arr) && arr.length ? arr : FALLBACK_ACTIVITIES;
}

function addToPlanner(title) {
  try {
    const KEY = "m360:planner";
    const raw = localStorage.getItem(KEY);
    const planner = raw ? JSON.parse(raw) : { casa: [], filhos: [], eu: [] };
    const item = { id: `act_${Date.now()}`, title, done: false, meta: { source: "brincar" } };
    const next = { ...planner, filhos: [item, ...(planner.filhos || [])] };
    localStorage.setItem(KEY, JSON.stringify(next));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Exploradora" } }));
    }
    return item;
  } catch { return null; }
}

export default function BrincarPage() {
  const [age, setAge] = useState("2-3");
  const [place, setPlace] = useState("casa");
  const [ideas, setIdeas] = useState([]);
  const [toast, setToast] = useState("");

  // Sugestão do dia: index determinístico para estabilidade
  const suggestion = useMemo(() => {
    const arr = getActivitiesArray();
    const idx = (new Date().getDate() + 7) % arr.length; // muda diariamente
    return arr[idx];
  }, []);

  function onGenerate() {
    const list = pickActivities({ age, place });
    setIdeas(list.slice(0, 12));
    setToast("");
  }

  function onSave(title) {
    const it = addToPlanner(title);
    if (it) {
      setToast(`Adicionado ao Planner: “${it.title}” 💛`);
      setTimeout(() => setToast(""), 2500);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Brincar</h1>
        <Link href="/meu-dia/planner" className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5">
          Ver Planner
        </Link>
      </header>

      {/* SUGESTÃO DO DIA */}
      {suggestion && (
        <section className="rounded-2xl bg-white ring-1 ring-black/5 p-4 mb-5">
          <div className="text-sm text-slate-500 mb-1">Sugestão do dia</div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-medium">
                {suggestion.emoji ? <span className="mr-2">{suggestion.emoji}</span> : null}
                {suggestion.title}
              </div>
              {suggestion.subtitle && (
                <div className="text-sm text-slate-500 mt-1">{suggestion.subtitle}</div>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                href={`/brincar/${suggestion.slug || suggestion.id}`}
                className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5"
              >
                Detalhes
              </Link>
              <button
                onClick={() => onSave(suggestion.title)}
                className="rounded-xl bg-[#ff005e] text-white px-3 py-1.5"
              >
                Salvar
              </button>
            </div>
          </div>
        </section>
      )}

      {/* FILTROS */}
      <section className="rounded-2xl bg-white ring-1 ring-black/5 p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-slate-600">Idade</label>
            <select
              className="w-full rounded-xl bg-white ring-1 ring-black/5 px-3 py-2 mt-1"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            >
              {AGE_OPTS.map(o => <option key={o.v} value={o.v}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">Local</label>
            <select
              className="w-full rounded-xl bg-white ring-1 ring-black/5 px-3 py-2 mt-1"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            >
              {PLACE_OPTS.map(o => <option key={o.v} value={o.v}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={onGenerate} className="rounded-xl bg-[#ff005e] text-white w-full py-2">
              Gerar Ideias
            </button>
          </div>
        </div>
        {!ideas.length && (
          <p className="text-slate-500 text-sm mt-3">Use os filtros e toque em “Gerar Ideias”.</p>
        )}
      </section>

      {/* LISTA GERADA */}
      {!!ideas.length && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ideas.map(a => (
            <article key={a.id || a.slug || a.title} className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-lg font-medium">
                  {a.emoji ? <span className="mr-2">{a.emoji}</span> : null}
                  {a.title}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/brincar/${a.slug || a.id || "detalhe"}`}
                    className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5"
                  >
                    Abrir
                  </Link>
                  <button
                    onClick={() => onSave(a.title)}
                    className="rounded-xl bg-[#ff005e] text-white px-3 py-1.5"
                  >
                    Salvar
                  </button>
                </div>
              </div>
              {(a.subtitle || a.description) && (
                <div className="text-sm text-slate-500 mt-1">{a.subtitle || a.description}</div>
              )}
              {a.duration ? (
                <div className="text-xs text-slate-500 mt-2">{a.duration} min</div>
              ) : null}
            </article>
          ))}
        </section>
      )}

      {/* Toast simples */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 rounded-xl bg-black/80 text-white px-4 py-2 text-sm">
          {toast}
        </div>
      )}
    </main>
  );
}
