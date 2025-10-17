// materna360_starter/app/brincar/page.jsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import AppBar from "../../components/AppBar";
import GlassCard from "../../components/GlassCard";

import * as Acts from "../../lib/activities";
import { addPlannerItem } from "../../lib/planner";
import { toast } from "../../lib/toast";

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

// Ideias rápidas (geradas conforme idade/local)
function quickIdeas(age, place) {
  const base = {
    "0-1": ["Explorar texturas com panos", "Cantiga com toques suaves", "Olhar figuras grandes"],
    "2-3": ["Caça às cores pela casa", "Construir uma torre de 6 blocos", "Pintura com água no muro"],
    "4-5": ["História maluca em 5 frases", "Pista de fita crepe", "Jogo de rimas"],
    "6-7": ["Labirinto com cordas (leve)", "Mapa do tesouro do quarto", "Teatro com bonecos"],
    "8+":  ["HQ rápida em 4 quadros", "Desafio de origami simples", "Coreografia de 30 segundos"],
  }[age] || ["Brincadeira livre guiada", "Desenho de observação", "Jogo de mímica"];

  const localHint = {
    "casa": "que caiba no espaço da sala",
    "parque": "aproveitando gramado/bancos",
    "escola": "em duplas ou trio",
    "ao-ar-livre": "com vento/sol à vista",
  }[place];

  return base.map((t) => (localHint ? `${t} (${localHint})` : t));
}

export default function BrincarPage() {
  const defaultAge = AGE_BUCKETS[0]?.id ?? "2-3";
  const defaultPlace = PLACES[0]?.id ?? "casa";

  const [age, setAge] = useState(defaultAge);
  const [place, setPlace] = useState(defaultPlace);
  const [showQuick, setShowQuick] = useState(false);
  const [myIdea, setMyIdea] = useState("");

  const suggestion = useMemo(() => {
    const len = ACTIVITIES.length || 1;
    const idx = Math.floor(0.37 * len) % len;
    return ACTIVITIES[idx] ?? {
      slug: "surpresa",
      title: "Atividade surpresa",
      subtitle: "Divirtam-se juntas por alguns minutos.",
    };
  }, []);

  const list = useMemo(() => safeFilterActivities({ age, place }).slice(0, 12), [age, place]);

  function saveToPlanner(title) {
    if (!title) return;
    addPlannerItem("filhos", title);
    toast("Atividade salva no Planner 💾");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Exploradora" } }));
    }
  }

  const ideas = useMemo(() => quickIdeas(age, place), [age, place]);

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
              onClick={() => {/* useMemo já refiltra */}}
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

      {/* FAB */}
      <button
        aria-label="Ideias rápidas"
        onClick={() => setShowQuick(true)}
        className="fixed bottom-24 right-5 rounded-full w-14 h-14 bg-[var(--brand)] text-white shadow-lg text-2xl"
      >
        +
      </button>

      {/* Painel de ideias rápidas */}
      {showQuick && (
        <div className="fixed inset-0 z-50">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowQuick(false)} />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-20 w-[min(92vw,700px)]">
            <GlassCard className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">Ideias rápidas</h3>
                  <p className="text-sm text-[var(--ink-soft)]">Geradas para {AGE_BUCKETS.find(a=>a.id===age)?.label} • {PLACES.find(p=>p.id===place)?.label}</p>
                </div>
                <button onClick={() => setShowQuick(false)} className="rounded-xl bg-white ring-1 ring-black/10 px-3 py-1.5 text-sm">Fechar</button>
              </div>

              <div className="mt-3 space-y-2">
                {ideas.slice(0,3).map((t) => (
                  <div key={t} className="flex items-center justify-between gap-3 rounded-xl bg-white ring-1 ring-black/10 px-3 py-2">
                    <div className="text-sm">{t}</div>
                    <button
                      onClick={() => saveToPlanner(t)}
                      className="rounded-lg bg-[var(--brand)] text-white px-3 py-1.5 text-sm"
                    >
                      Salvar
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t pt-4">
                <label className="text-sm text-[var(--ink-soft)]">Anotar minha brincadeira</label>
                <div className="mt-1 flex gap-2">
                  <input
                    value={myIdea}
                    onChange={(e)=>setMyIdea(e.target.value)}
                    placeholder="Ex.: Teatro das fantoches com meias"
                    className="flex-1 rounded-xl bg-white ring-1 ring-black/10 px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => { saveToPlanner(myIdea); setMyIdea(""); setShowQuick(false); }}
                    className="rounded-xl bg-[var(--brand)] text-white px-4 py-2 text-sm"
                    disabled={!myIdea.trim()}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </main>
  );
}
