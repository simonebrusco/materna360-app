// materna360_starter/app/brincar/page.jsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AppBar from "../../components/AppBar.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import QuickNote from "../../components/QuickNote.jsx";
import { ACTIVITIES, AGE_BUCKETS, PLACES, filterActivities } from "../../lib/activities.js";
import { addPlannerItem } from "../../lib/planner.js";

export default function BrincarPage() {
  // defaults seguros (caso algo não esteja definido na lib)
  const defaultAge = AGE_BUCKETS?.[0]?.id ?? "2-3";
  const defaultPlace = PLACES?.[0]?.id ?? "casa";

  const [age, setAge] = useState(defaultAge);
  const [place, setPlace] = useState(defaultPlace);

  // sugestão do dia com seed fixo (estável em build)
  const suggestion = useMemo(() => {
    const len = ACTIVITIES?.length || 1;
    const idx = Math.floor(0.37 * len) % len;
    return (
      ACTIVITIES?.[idx] ?? {
        slug: "atividade-surpresa",
        title: "Atividade surpresa",
        subtitle: "Uma ideia leve para hoje ✨",
      }
    );
  }, []);

  // lista filtrada (a lib trata defaults)
  const list = useMemo(() => filterActivities({ age, place }), [age, place]);

  function saveToPlanner(title) {
    const t = (title || "Atividade").trim();
    addPlannerItem("filhos", t);
    // toast + badge
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:toast", { detail: { message: "Atividade salva no Planner 💾" } })
      );
      window.dispatchEvent(
        new CustomEvent("m360:win", { detail: { type: "badge", name: "Exploradora" } })
      );
    }
  }

  // --- FAB “＋ Anotar” (salva em Filhos) ---
  const [noteOpen, setNoteOpen] = useState(false);
  function handleSaveNote(text) {
    const value = (text || "").trim();
    if (!value) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("m360:toast", { detail: { message: "Escreva algo para salvar ✍️" } })
        );
      }
      return;
    }
    addPlannerItem("filhos", value);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:toast", { detail: { message: "Salvo no Planner (Filhos) 💾" } })
      );
      window.dispatchEvent(
        new CustomEvent("m360:win", { detail: { type: "badge", name: "Exploradora" } })
      );
    }
    setNoteOpen(false);
  }

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <AppBar title="Brincar" />

      {/* Sugestão do dia */}
      <GlassCard className="p-4 mb-4">
        <div className="text-sm text-[var(--brand-navy-t60)] mb-1">Sugestão do dia</div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-medium">{suggestion.title}</div>
            {suggestion.subtitle && (
              <div className="text-sm text-[var(--brand-navy-t60)] mt-1">
                {suggestion.subtitle}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Link
              href={`/brincar/${suggestion.slug}`}
              className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5"
            >
              Detalhes
            </Link>
            <button
              onClick={() => saveToPlanner(suggestion.title)}
              className="rounded-xl bg-[var(--brand)] text-white px-3 py-1.5"
            >
              Salvar
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Filtros */}
      <GlassCard className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--brand-navy-t60)]">Idade:</label>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5 text-sm"
            >
              {AGE_BUCKETS.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--brand-navy-t60)]">Local:</label>
            <select
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5 text-sm"
            >
              {PLACES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Lista de atividades */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map((a) => (
          <GlassCard key={a.slug} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-lg font-medium">{a.title}</div>
                {a.subtitle && (
                  <div className="text-sm text-[var(--brand-navy-t60)] mt-1">
                    {a.subtitle}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/brincar/${a.slug}`}
                  className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5"
                >
                  Abrir
                </Link>
                <button
                  onClick={() => saveToPlanner(a.title)}
                  className="rounded-xl bg-[var(--brand)] text-white px-3 py-1.5"
                >
                  Salvar
                </button>
              </div>
            </div>
          </GlassCard>
        ))}

        {list.length === 0 && (
          <div className="text-sm text-[var(--brand-navy-t60)]">
            Nenhuma atividade para esse filtro por enquanto.
          </div>
        )}
      </section>

      {/* FAB “＋ Anotar” */}
      <button
        onClick={() => setNoteOpen(true)}
        aria-label="Adicionar anotação"
        className="fixed right-5 bottom-24 z-[60] rounded-full shadow-lg h-14 w-14 text-2xl
                   bg-[var(--brand)] text-white hover:scale-105 active:scale-95 transition grid place-items-center"
      >
        ＋
      </button>

      {/* Composer de nota */}
      {noteOpen && (
        <QuickNote
          title="Salvar no Planner (Filhos)"
          placeholder="Ex.: preparar caixa sensorial, separar pintura…"
          confirmLabel="Salvar"
          onSave={handleSaveNote}
          onClose={() => setNoteOpen(false)}
        />
      )}
    </main>
  );
}
