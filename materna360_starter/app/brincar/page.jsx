"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ACTIVITIES,
  AGE_BUCKETS,
  PLACES,
  filterActivities,
} from "../../lib/activities";
import { addPlannerItem } from "../../lib/planner";
import { toast } from "../../lib/toast";

// fallback seguro para quando algo vier vazio da lib
const SAFE_AGE = (Array.isArray(AGE_BUCKETS) && AGE_BUCKETS[0]?.id) || "2-3";
const SAFE_PLACE = (Array.isArray(PLACES) && PLACES[0]?.id) || "casa";

function indexByToday(len) {
  const d = new Date();
  const stamp = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  let hash = 0;
  for (let i = 0; i < stamp.length; i++) hash = (hash * 31 + stamp.charCodeAt(i)) >>> 0;
  return len ? hash % len : 0;
}

export default function BrincarPage() {
  const [age, setAge] = useState(SAFE_AGE);
  const [place, setPlace] = useState(SAFE_PLACE);
  const [ideas, setIdeas] = useState([]);

  // sugestão do dia (determinística)
  const suggestion = useMemo(() => {
    const list = Array.isArray(ACTIVITIES) ? ACTIVITIES : [];
    if (!list.length)
      return { slug: "atividade", title: "Atividade surpresa", subtitle: "" };
    return list[indexByToday(list.length)];
  }, []);

  // lista filtrada (defensivo)
  const list = useMemo(() => {
    try {
      return filterActivities({ age, place });
    } catch {
      return [];
    }
  }, [age, place]);

  function save(title) {
    addPlannerItem("filhos", title);
    toast("Atividade salva no Planner 💾");
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Exploradora" },
        })
      );
    }
  }

  function onGenerate() {
    // se a lib já traz filtrado, só exibimos; senão, cortamos a 12 ideias
    const base = Array.isArray(list) ? list : [];
    setIdeas(base.slice(0, 12));
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-soft to-white">
      {/* Topbar */}
      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
        <h1 className="text-[28px] md:text-[32px] font-semibold text-brand-navy">
          Brincar
        </h1>
        <Link
          href="/meu-dia/planner"
          className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm"
        >
          Ver Planner
        </Link>
      </header>

      {/* Sugestão do dia */}
      <section className="mx-auto max-w-5xl px-5 pt-6">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5 md:p-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-brand-navy/50 mb-1">Sugestão do dia</div>
            <h3 className="text-lg md:text-xl font-semibold text-brand-navy">
              {suggestion.title}
            </h3>
            {suggestion.subtitle ? (
              <p className="text-sm md:text-base text-brand-navy/60 mt-1">
                {suggestion.subtitle}
              </p>
            ) : null}
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href={`/brincar/${suggestion.slug}`}
              className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5 text-sm"
            >
              Detalhes
            </Link>
            <button
              onClick={() => save(suggestion.title)}
              className="rounded-xl px-3 py-1.5 text-sm text-white"
              style={{ backgroundColor: "#ff005e" }}
            >
              Salvar
            </button>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="mx-auto max-w-5xl px-5 pt-6">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 md:p-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-brand-navy/60">Idade:</label>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5 text-sm"
            >
              {(AGE_BUCKETS || []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-brand-navy/60">Local:</label>
            <select
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5 text-sm"
            >
              {(PLACES || []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="ms-auto">
            <button
              onClick={onGenerate}
              className="rounded-xl px-4 py-2 text-sm text-white"
              style={{ backgroundColor: "#ff005e" }}
            >
              Gerar Ideias
            </button>
          </div>
        </div>

        {!ideas.length ? (
          <p className="text-brand-navy/60 text-sm mt-3">
            Use os filtros e toque em <strong>Gerar Ideias</strong>.
          </p>
        ) : null}
      </section>

      {/* Lista */}
      {!!ideas.length && (
        <section className="mx-auto max-w-5xl px-5 pt-5 pb-28 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {ideas.map((a) => (
            <article
              key={a.slug || a.id || a.title}
              className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 md:p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-lg font-medium text-brand-navy">{a.title}</div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/brincar/${a.slug || "atividade"}`}
                    className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5 text-sm"
                  >
                    Abrir
                  </Link>
                  <button
                    onClick={() => save(a.title)}
                    className="rounded-xl px-3 py-1.5 text-sm text-white"
                    style={{ backgroundColor: "#ff005e" }}
                  >
                    Salvar
                  </button>
                </div>
              </div>
              {a.subtitle ? (
                <p className="text-sm text-brand-navy/60">{a.subtitle}</p>
              ) : null}
              {a.duration ? (
                <div className="text-xs text-brand-navy/50">{a.duration} min</div>
              ) : null}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
