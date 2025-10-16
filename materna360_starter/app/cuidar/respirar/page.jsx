"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { set, get } from "../../../lib/storage";
import { toast } from "../../../lib/toast";

export default function RespirarPage() {
  const [sec, setSec] = useState(60);
  const timer = useRef(null);

  function start() {
    if (timer.current) return;
    window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "CuidarDeMim" } }));
    toast("Respiração guiada iniciada 🌬️");
    timer.current = setInterval(() => setSec((s) => Math.max(0, s - 1)), 1000);
  }

  function pause() {
    clearInterval(timer.current);
    timer.current = null;
  }

  useEffect(() => {
    if (sec === 0) {
      pause();
      const key = "m360:minutes";
      const base = JSON.parse(get(key) ?? "{}");
      const next = { ...base, wellbeing: (base.wellbeing ?? 0) + 1 };
      set(key, JSON.stringify(next));
      toast("Parabéns! +1 min de autocuidado 💛");
    }
    return pause;
  }, [sec]);

  return (
    <main className="max-w-md mx-auto px-5 py-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Respirar</h1>
        <Link href="/cuidar" className="btn bg-white border border-slate-200">← Voltar</Link>
      </header>

      <div className="rounded-2xl bg-white ring-1 ring-black/5 p-6 text-center">
        <div className="text-6xl font-semibold tabular-nums">{sec}s</div>
        <div className="mt-4 flex gap-2 justify-center">
          <button onClick={start} className="rounded-xl bg-[#F15A2E] text-white px-4 py-2">Iniciar</button>
          <button onClick={pause} className="rounded-xl bg-white ring-1 ring-black/5 px-4 py-2">Pausar</button>
        </div>
        <p className="text-sm text-slate-500 mt-3">Inspira 4s • Segura 2s • Expira 4s • Pausa 2s…</p>
      </div>
    </main>
  );
}
