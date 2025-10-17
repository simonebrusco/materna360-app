// app/brincar/gerar-ideias/page.jsx
"use client";

import { useState } from "react";

simonebrusco-patch-905473
import AppBar from "../../components/AppBar";
import GlassCard from "../../components/GlassCard";

import AppBar from "../../../components/AppBar";
import GlassCard from "../../../components/GlassCard";
import { get, set, keys } from "../../../lib/storage";
main

const AGE_RANGES = [
  { v: "0-1",  label: "0–1 ano" },
  { v: "1-2",  label: "1–2 anos" },
  { v: "2-3",  label: "2–3 anos" },
  { v: "3-5",  label: "3–5 anos" },
  { v: "5-7",  label: "5–7 anos" },
  { v: "7-9",  label: "7–9 anos" },
];

simonebrusco-patch-905473

const PLANNER_INBOX_KEY = (keys && keys.plannerInbox) || "m360:planner_inbox";

function safeToast(message) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("m360:toast", { detail: { message } }));
  }
}

function saveToPlannerInbox(idea) {
  const inbox = Array.isArray(get(PLANNER_INBOX_KEY, [])) ? get(PLANNER_INBOX_KEY, []) : [];
  const payload = {
    id: `idea-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: idea.title,
    description: idea.description,
    duration: idea.duration,
    type: idea.type,
    createdAt: new Date().toISOString(),
    materials: idea.materials || [],
    source: "ai-ideas",
  };
  inbox.push(payload);
  set(PLANNER_INBOX_KEY, inbox);
  safeToast("Ideia salva no Planner ✨");
}

main
export default function GerarIdeiasPage() {
  const [ageRange, setAgeRange] = useState("3-5");
  const [location, setLocation] = useState("casa");
  const [time, setTime] = useState(12);
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState([]);

  async function generate(e) {
    e.preventDefault();
    setLoading(true);
    setIdeas([]);
    try {
      const res = await fetch("/api/ai/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ageRange, location, time: Number(time) || 0 }),
      });
      const data = await res.json();
      setIdeas(Array.isArray(data.ideas) ? data.ideas : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-5 pb-24">
      <AppBar title="Gerar ideias (IA)" backHref="/brincar" />

      {/* Formulário */}
      <section className="mt-4">
        <GlassCard className="p-4">
          <form onSubmit={generate} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="text-xs uppercase tracking-wide text-[#1A2240]/60">Faixa etária</label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
              >
                {AGE_RANGES.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-[#1A2240]/60">Local</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
              >
                <option value="casa">Em casa</option>
                <option value="arLivre">Ao ar livre</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-[#1A2240]/60">Tempo (min)</label>
              <input
                type="number"
                min={0}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
                placeholder="ex.: 12"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-xl text-white bg-[#ff005e] hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Gerando..." : "Gerar ideias"}
              </button>
            </div>
          </form>
        </GlassCard>
      </section>

      {/* Resultados */}
      <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.map((it, idx) => (
          <GlassCard key={idx} className="p-4 bg-white/80">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-[#1A2240]">{it.title}</div>
                <div className="text-xs text-[#1A2240]/60">
                  Tipo: {it.type} • Duração: {it.duration} min
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-[#1A2240]">{it.description}</div>
            {Array.isArray(it.materials) && it.materials.length > 0 && (
              <div className="mt-2">
                <div className="text-xs uppercase tracking-wide text-[#1A2240]/60">Materiais</div>
                <ul className="mt-1 text-sm text-[#1A2240] list-disc pl-5">
                  {it.materials.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            )}
simonebrusco-patch-905473


            <div className="mt-3 flex justify-end">
              <button
                onClick={() => saveToPlannerInbox(it)}
                className="px-3 py-2 rounded-xl bg-[#ffd8e6] text-[#1A2240] hover:opacity-90"
              >
                Salvar no Planner
              </button>
            </div>
main
          </GlassCard>
        ))}

        {!loading && ideas.length === 0 && (
          <div className="text-sm text-[#1A2240]/60">
            Preencha os campos e clique em <b>Gerar ideias</b> ✨
          </div>
        )}
      </section>
    </main>
  );
}
