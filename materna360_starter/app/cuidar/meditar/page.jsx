"use client";

import { useState } from "react";
import Link from "next/link";
import { set, get } from "../../../lib/storage";
import { toast } from "../../../lib/toast";

const TRACKS = [
  { id: "calma1", name: "Calma em 2 min", dur: 120 },
  { id: "descanso3", name: "Descansar a mente (3 min)", dur: 180 },
  { id: "sono2", name: "Pré-sono (2 min)", dur: 120 },
];

export default function MeditarPage() {
  const [playing, setPlaying] = useState(null);

  function onPlay(tr) {
    setPlaying(tr.id);
    // soma “minutos de autocuidado”
    const key = "m360:minutes";
    const base = JSON.parse(get(key) ?? "{}");
    const next = { ...base, wellbeing: (base.wellbeing ?? 0) + Math.round(tr.dur / 60) };
    set(key, JSON.stringify(next));
    // badge
    window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "CuidarDeMim" } }));
    toast(`Tocando: ${tr.name} 🎧`);
  }

  return (
    <main className="max-w-3xl mx-auto px-5 py-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Meditar</h1>
        <Link href="/cuidar" className="btn bg-white border border-slate-200">← Voltar</Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TRACKS.map((tr) => (
          <button
            key={tr.id}
            onClick={() => onPlay(tr)}
            className={`rounded-xl p-4 text-left ring-1 ring-black/5 bg-white hover:shadow ${playing === tr.id ? "outline outline-2 outline-[#F15A2E]" : ""}`}
          >
            <div className="text-lg font-medium">🎧 {tr.name}</div>
            <div className="text-sm text-slate-500">{tr.dur / 60} min</div>
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-500 mt-4">(*) na próxima etapa adicionamos seus áudios mindfulness reais aqui.</p>
    </main>
  );
}
