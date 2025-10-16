// materna360_starter/app/cuidar/meditar/page.jsx
"use client";

import { addMinutes } from "../../../lib/wellbeing";
import { toast } from "../../../lib/toast";
import Link from "next/link";
import { useState } from "react";

const TRACKS = [
  { id: "resp-curta",  title: "Respiração Curta",  minutes: 3, emoji: "🌬️" },
  { id: "foco-leve",   title: "Foco Leve",        minutes: 5, emoji: "🎯" },
  { id: "acalmar",     title: "Acalmar a mente",  minutes: 10, emoji: "🧘‍♀️" },
];

export default function MeditarPage() {
  const [playingId, setPlayingId] = useState(null);

  function play(t) {
    setPlayingId(t.id);
    // telemetria + badge
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Cuidar de Mim" } }));
      window.dispatchEvent(new CustomEvent("m360:event", { detail: { type: "audio_play", track: t.id } }));
    }
    // soma minutos no painel do Eu360
    addMinutes("meditate", t.minutes);
    toast(`Tocando: ${t.title} • +${t.minutes} min`);
    // simulação de “tocando” (visualmente)
    setTimeout(() => setPlayingId(null), 1200);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-soft to-white">
      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
        <h1 className="text-[28px] md:text-[32px] font-semibold text-brand-navy">Meditar</h1>
        <Link href="/cuidar" className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm">
          ← Voltar
        </Link>
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-6 pb-28 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {TRACKS.map((t) => (
          <article key={t.id} className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm text-brand-navy/50">Meditação</div>
              <div className="text-lg font-medium text-brand-navy flex items-center gap-2">
                <span className="text-2xl">{t.emoji}</span>{t.title}
              </div>
              <div className="text-xs text-brand-navy/50 mt-1">{t.minutes} min</div>
            </div>
            <button
              onClick={() => play(t)}
              className="rounded-xl px-4 py-2 text-sm text-white"
              style={{ backgroundColor: "#ff005e" }}
              disabled={playingId === t.id}
            >
              {playingId === t.id ? "Tocando…" : "Tocar"}
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
