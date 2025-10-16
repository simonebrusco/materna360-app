"use client";

import { useState } from "react";
import Link from "next/link";

const TRACKS = [
  { id: "resp-3", title: "Meditação 3 min – acalmar", minutes: 3 },
  { id: "resp-5", title: "Meditação 5 min – presença", minutes: 5 },
  { id: "resp-8", title: "Meditação 8 min – gratidão", minutes: 8 },
];

// chave única para o resumo semanal
const TIME_KEY = "m360:time";

function weekKey(d = new Date()) {
  // YYYY-WW simples
  const firstJan = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d - firstJan) / 86400000);
  const week = Math.ceil((d.getDay() + 1 + days) / 7);
  return `${d.getFullYear()}-${String(week).padStart(2, "0")}`;
}

function addMeditationMinutes(min) {
  try {
    const wk = weekKey();
    const raw = localStorage.getItem(TIME_KEY);
    const obj = raw ? JSON.parse(raw) : {};
    const cur = obj[wk] || { meditation: 0, breathing: 0 };
    const next = { ...obj, [wk]: { ...cur, meditation: (cur.meditation || 0) + min } };
    localStorage.setItem(TIME_KEY, JSON.stringify(next));
    // badge
    window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Cuidar de Mim" } }));
    return true;
  } catch {
    return false;
  }
}

export default function MeditarPage() {
  const [toast, setToast] = useState("");

  function onPlay(t) {
    const ok = addMeditationMinutes(t.minutes);
    if (ok) {
      setToast(`Registrado: ${t.minutes} min de meditação 💛`);
      setTimeout(() => setToast(""), 2500);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-5 py-6">
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold">Meditar</h1>
          <p className="text-sm text-slate-500">Áudios curtos para acalmar</p>
        </div>
        <Link href="/cuidar" className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5">← Cuidar</Link>
      </header>

      <section className="grid grid-cols-1 gap-3">
        {TRACKS.map(t => (
          <article key={t.id} className="rounded-2xl bg-white ring-1 ring-black/5 p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-xs text-slate-500 mt-1">{t.minutes} min</div>
            </div>
            <button onClick={() => onPlay(t)} className="rounded-xl bg-[#ff005e] text-white px-3 py-1.5">Tocar</button>
          </article>
        ))}
      </section>

      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 rounded-xl bg-black/80 text-white px-4 py-2 text-sm">
          {toast}
        </div>
      )}
    </main>
  );
}
