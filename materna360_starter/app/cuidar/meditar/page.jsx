// materna360_starter/app/cuidar/meditar/page.jsx
"use client";

import { useState } from "react";
import AppBar from "../../../components/AppBar";
import GlassCard from "../../../components/GlassCard";
import { get, set, keys } from "../../../lib/storage";

const TRACKS = [
  { id: "calma-3",  title: "Calma em 3 minutos",       minutes: 3 },
  { id: "foco-5",   title: "Foco gentil (5 min)",      minutes: 5 },
  { id: "sono-8",   title: "Acalmar para dormir (8)",  minutes: 8 },
];

function addMinutes(minutes) {
  const kMin = keys.minutes || "m360:minutes";
  const kLog = keys.minutesLog || "m360:minutes_log";

  const cur = get(kMin, { meditation: 0, breath: 0 });
  const next = { ...cur, meditation: Number(cur.meditation || 0) + minutes };
  set(kMin, next);

  const log = get(kLog, []);
  log.push({ type: "meditation", minutes, date: new Date().toISOString() });
  set(kLog, log);

  if (typeof window !== "undefined") {
    // avisa o app que os minutos mudaram (Eu360 atualiza na hora)
    try { window.dispatchEvent(new CustomEvent("m360:minutes:changed")); } catch {}

    window.dispatchEvent(
      new CustomEvent("m360:win", { detail: { type: "badge", name: "Cuidar de Mim" } })
    );
    window.dispatchEvent(
      new CustomEvent("m360:toast", { detail: { message: `+${minutes} min de meditação 🌿` } })
    );
  }
}

export default function MeditarPage() {
  const [playing, setPlaying] = useState(null);

  function onPlay(t) {
    setPlaying(t.id);
    // Simulação: considera a faixa concluída imediatamente
    addMinutes(t.minutes);
    setPlaying(null);
  }

  return (
    <main className="max-w-5xl mx-auto px-5 pb-24">
      <AppBar title="Meditar" backHref="/cuidar" />
      <section className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TRACKS.map((t) => (
          <GlassCard key={t.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-sm opacity-60">{t.minutes} min</div>
            </div>
            <button
              onClick={() => onPlay(t)}
              className="btn btn-primary min-w-[110px]"
              disabled={playing === t.id}
            >
              {playing === t.id ? "Tocando..." : "Tocar"}
            </button>
          </GlassCard>
        ))}
      </section>
    </main>
  );
}
