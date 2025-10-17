// materna360_starter/app/brincar/page.jsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import AppBar from "../../components/AppBar";
import GlassCard from "../../components/GlassCard";

import * as Acts from "../../lib/activities";
import { addPlannerItem } from "../../lib/planner";
import { toast } from "../../lib/toast";

// ——— helpers defensivos (a lib pode variar um pouco entre branches)
const ACTIVITIES = Array.isArray(Acts.ACTIVITIES) ? Acts.ACTIVITIES : (Acts.activities || []);
const AGE_BUCKETS = Acts.AGE_BUCKETS || [
  { id: "0-1", label: "0–1" },
  { id: "2-3", label: "2–3" },
  { id: "4-5", label: "4–5" },
  { id: "6-7", label: "6–7" },
  { id: "8+",  label: "8+"  },
];
const PLACES = Acts.PLACES || [
  { id: "casa",        label: "Casa" },
  { id: "parque",      label: "Parque" },
  { id: "escola",      label: "Escola" },
  { id: "ao-ar-livre", label: "Ao ar livre" },
];

function safeFilterActivities(params) {
  if (typeof Acts.filterActivities === "function") return Acts.filterActivities(params) || [];
  // fallback simples se a função não existir
  const { age, place } = params;
  return ACTIVITIES.filter(a => {
    const okAge   = !a.ages   || a.ages.includes(age);
    const okPlace = !a.places || a.places.includes(place);
    return okAge && okPlace;
  });
}

function Badge({ children }) {
  return (
    <span className="rounded-full bg-black/5 text-[13px] px-2.5 py-1">
      {children}
    </span>
  );
}

export default function BrincarPage() {
  // defaults seguros
  const defaultAge = AGE_BUCKETS[0]?.id ?? "2-3";
  const defaultPlace = PLACES[0]?.id ?? "casa";

  const [age, setAge] = useState(defaultAge);
  const [place, setPlace] = useState(defaultPlace);

  // sugestão do dia (seed estático p/ não “pular” entre reloads)
  const suggestion = useMemo(() => {
    const len = ACTIVITIES.length || 1;
    const idx = Math.floor(0.37 * len) % len;
    return ACTIVITIES[idx] ?? {
      slug: "surpresa",
      title: "Atividade surpresa",
      subtitle: "Divirtam-se juntas por alguns minutos.",
    };
  }, []);

  // lista filtrada
  const list = useMemo(() => safeFilterActivities({ age, place }).slice(0, 12), [age, place]);

  function saveToPlanner(title) {
    addPlannerItem("filhos", title);
    toast("Atividade salva no Planner 💾");
    // gamificação
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Exploradora" } }));
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-5">
      <AppBar title="Brincar" />

      {/* Sugestão do dia */}
      <GlassCard className="p-4 mb-4">
        <div className="text-sm text-[var(--ink-soft)] mb-1">Sugestão do dia</div>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-lg font-medium truncate">{suggestion.title}</div>
            {suggestion.subtitle && (
              <div className="text-sm text-[var(--ink-soft)] mt-1 truncate">{suggestion.subtitle}</div>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            {suggestion.slug && (
              <Link
                href={`/brincar/${suggestion.slug}`}
                className="rounded-xl bg-white ring-1 ring-black/10 px-3 py-1.5 text-sm"
              >
                Detalhes
              </Link>
            )}
            <button
              onClick={() => saveToPlanner(suggestion.title)}
              className="rounded-xl bg-[var(--brand)] text-white px-3 py-1.5 text-sm"
            >
              Salvar
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Filtros */}
      <GlassCard className="p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="grow min-w-[160px]">
            <label className="text-sm text-[var(--ink-soft)]">Idade</label>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 w-full rounded-xl bg-white ring-1 ring-black/10 px-3 py-2 text-sm"
            >
              {AGE_BUCKETS.map((a) => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </div>

          <div className="grow min-w-[160px]">
            <label className="text-sm text-[var(--ink-soft)]">Local</label>
            <select
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="mt-1 w-full rounded-xl bg-white ring-1 ring-black/10 px-3 py-2 text-sm"
            >
              {PLACES.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => {/* o useMemo já reage às mudanças */}}
              className="rounded-xl bg-[var(--brand)] text-white px-4 py-2 text-sm"
            >
              Gerar Ideias
            </button>
          </div>
        </div>

        {!list.length && (
          <p className="text-sm text-[var(--ink-soft)] mt-3">
            Use os filtros para ver ideias. Assim que você salvar uma atividade, ela aparece no Planner. 💛
          </p>
        )}
      </GlassCard>

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map((a) => (
          <GlassCard key={a.slug || a.title} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-base font-medium truncate">{a.title}</div>
                {a.subtitle && <div className="text-sm text-[var(--ink-soft)] mt-1 line-clamp-2">{a.subtitle}</div>}

                <div className="flex flex-wrap gap-2 mt-2">
                  {a.duration && <Badge>{a.duration} min</Badge>}
                  {Array.isArray(a.tags) && a.tags.slice(0, 3).map((t) => <Badge key={t}>{t}</Badge>)}
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                {a.slug && (
                  <Link
                    href={`/brincar/${a.slug}`}
                    className="rounded-xl bg-white ring-1 ring-black/10 px-3 py-1.5 text-sm text-center"
                  >
                    Abrir
                  </Link>
                )}
                <button
                  onClick={() => saveToPlanner(a.title)}
                  className="rounded-xl bg-[var(--brand)] text-white px-3 py-1.5 text-sm"
                >
                  Salvar
                </button>
              </div>
            </div>
          </GlassCard>
        ))}

        {!list.length && (
          <GlassCard className="p-6 text-center text-[var(--ink-soft)]">
            Nenhuma atividade para esse filtro por enquanto. Tente outro recorte de idade ou local. 🌿
          </GlassCard>
        )}
      </div>
    </main>
  );
}
