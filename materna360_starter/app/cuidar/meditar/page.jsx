// materna360_starter/app/cuidar/meditar/page.jsx
"use client";

import { useState } from "react";
import { getJSON, setJSON } from "../../../lib/storage";
import { toast } from "../../../lib/toast";

const TRACKS = [
  { id: "resp-simples", title: "Respiração Simples", durMin: 5, emoji: "🌬️" },
  { id: "acalma-mente", title: "Acalmar a mente", durMin: 8, emoji: "🧘‍♀️" },
  { id: "sono-suave", title: "Sono Suave", durMin: 10, emoji: "🌙" },
];

function incWellbeingMinutes(kind, minutes) {
  const key = "m360:wellbeing";
  const data = getJSON(key) || { meditationMin: 0, breathMin: 0, history: [] };
  if (kind === "meditation") data.meditationMin = (data.meditationMin || 0) + minutes;
  setJSON(key, data);
}

export default function MeditarPage() {
  const [playing, setPlaying] = useState(null);

  function onPlay(t) {
    setPlaying(t.id);

    // badge + toast + métrica local
    try {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Cuidar de Mim" },
        })
      );
    } catch {}
    incWellbeingMinutes("meditation", t.durMin);
    toast(`Reproduzindo: ${t.title}`, { icon: "▶️" });
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-[#2f3a56]">Meditar</h1>
      <p className="text-sm text-[#545454] mt-1">
        Momentos curtos para desacelerar e cuidar de você 💗
      </p>

      <ul className="mt-5 grid grid-cols-1 gap-3">
        {TRACKS.map((t) => (
          <li key={t.id} className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{t.emoji}</span>
                <div>
                  <div className="font-medium text-[#2f3a56]">{t.title}</div>
                  <div className="text-xs text-[#545454]">{t.durMin} min</div>
                </div>
              </div>
              <button
                onClick={() => onPlay(t)}
                className="rounded-xl px-4 py-2 text-white"
                style={{ backgroundColor: "#ff005e" }}
              >
                {playing === t.id ? "Tocando..." : "Tocar"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 text-xs text-[#545454]">
        * Nesta MVP, o player é simbólico. Ao tocar, registramos seu cuidado para o resumo no Eu360.
      </div>
    </main>
  );
}
