"use client";

import { useRef, useState } from "react";
import AppBar from "../../../components/AppBar";
import GlassCard from "../../../components/GlassCard";
import { get, set, keys } from "../../../lib/storage";

const TRACKS = [
  { id: "resp-3min",   title: "Respiração Suave (3 min)",  dur: 3 },
  { id: "calma-5min",  title: "Calma e Presença (5 min)",  dur: 5 },
  { id: "sono-8min",   title: "Relaxar para Dormir (8 min)", dur: 8 },
];

export default function MeditarPage() {
  const [playing, setPlaying] = useState(null);
  const timerRef = useRef(null);

  function trackStart(t) {
    setPlaying(t.id);

    // telemetria de minutos de autocuidado
    const key = keys.minutes || "m360:minutes";
    const minutes = get(key, { meditation: 0, breath: 0 });
    set(key, { ...minutes, meditation: minutes.meditation + t.dur });

    // badge
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("m360:win", {
        detail: { type: "badge", name: "Cuidar de Mim" }
      }));
    }

    // simula término
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPlaying(null), t.dur * 1000); // 1s = 1min (demo)
  }

  return (
    <main className="max-w-5xl mx-auto px-5 pb-24">
      <AppBar title="Meditar" backHref="/cuidar" />
      <div className="container-px py-5 space-y-3">
        {TRACKS.map((t) => (
          <GlassCard key={t.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm opacity-70">{t.dur} min</div>
            </div>
            <button
              onClick={() => trackStart(t)}
              className={`btn ${playing === t.id ? "bg-slate-200 text-slate-700" : "btn-primary"}`}
            >
              {playing === t.id ? "Tocando..." : "Tocar"}
            </button>
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
