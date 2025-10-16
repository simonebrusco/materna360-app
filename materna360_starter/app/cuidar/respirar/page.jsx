"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const DURATION = 60; // segundos
const TIME_KEY = "m360:time";

function weekKey(d = new Date()) {
  const firstJan = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d - firstJan) / 86400000);
  const week = Math.ceil((d.getDay() + 1 + days) / 7);
  return `${d.getFullYear()}-${String(week).padStart(2, "0")}`;
}

function addBreathingMinute() {
  try {
    const wk = weekKey();
    const raw = localStorage.getItem(TIME_KEY);
    const obj = raw ? JSON.parse(raw) : {};
    const cur = obj[wk] || { meditation: 0, breathing: 0 };
    const next = { ...obj, [wk]: { ...cur, breathing: (cur.breathing || 0) + 1 } };
    localStorage.setItem(TIME_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Cuidar de Mim" } }));
    return true;
  } catch {
    return false;
  }
}

export default function RespirarPage() {
  const [left, setLeft] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [toast, setToast] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          clearInterval(ref.current);
          setRunning(false);
          addBreathingMinute();
          setToast("Respiração concluída: +1 min 💛");
          setTimeout(() => setToast(""), 2500);
          return DURATION;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running]);

  return (
    <main className="max-w-3xl mx-auto px-5 py-6">
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold">Respirar</h1>
          <p className="text-sm text-slate-500">Micro pausa guiada (60s)</p>
        </div>
        <Link href="/cuidar" className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5">← Cuidar</Link>
      </header>

      <section className="rounded-2xl bg-white ring-1 ring-black/5 p-6 text-center">
        <div className="text-4xl font-semibold tabular-nums">{left}s</div>
        <div className="mt-3 flex gap-3 justify-center">
          {!running ? (
            <button onClick={() => setRunning(true)} className="rounded-xl bg-[#ff005e] text-white px-4 py-2">Iniciar</button>
          ) : (
            <button onClick={() => setRunning(false)} className="rounded-xl bg-white ring-1 ring-black/5 px-4 py-2">Pausar</button>
          )}
          <button onClick={() => { setRunning(false); setLeft(DURATION); }} className="rounded-xl bg-white ring-1 ring-black/5 px-4 py-2">
            Reiniciar
          </button>
        </div>
      </section>

      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 rounded-xl bg-black/80 text-white px-4 py-2 text-sm">
          {toast}
        </div>
      )}
    </main>
  );
}
