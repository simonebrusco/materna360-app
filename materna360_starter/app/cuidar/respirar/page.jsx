// materna360_starter/app/cuidar/respirar/page.jsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { addMinutes } from "../../../lib/wellbeing";
import { toast } from "../../../lib/toast";

export default function RespirarPage() {
  const [sec, setSec] = useState(60);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => setSec((s) => s - 1), 1000);
    return () => clearInterval(ref.current);
  }, [running]);

  useEffect(() => {
    if (sec === 0) {
      setRunning(false);
      addMinutes("breathe", 1);
      toast("Respiração concluída • +1 min");
      setSec(60);
    }
  }, [sec]);

  function start() {
    setRunning(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Cuidar de Mim" } }));
      window.dispatchEvent(new CustomEvent("m360:event", { detail: { type: "breath_play", seconds: 60 } }));
    }
    toast("Respiração guiada iniciada");
  }

  function pause() {
    setRunning(false);
    toast("Pausado");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-soft to-white">
      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
        <h1 className="text-[28px] md:text-[32px] font-semibold text-brand-navy">Respirar</h1>
        <Link href="/cuidar" className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm">
          ← Voltar
        </Link>
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-10 pb-28">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-8 md:p-10 text-center">
          <div className="text-sm text-brand-navy/50 mb-2">Timer</div>
          <div className="text-6xl font-semibold text-brand-navy tabular-nums">{sec}s</div>

          <div className="mt-6 flex items-center justify-center gap-3">
            {!running ? (
              <button
                onClick={start}
                className="rounded-xl px-6 py-2 text-white text-sm"
                style={{ backgroundColor: "#ff005e" }}
              >
                Iniciar
              </button>
            ) : (
              <button
                onClick={pause}
                className="rounded-xl px-6 py-2 text-sm ring-1 ring-black/10 bg-white"
              >
                Pausar
              </button>
            )}
            <button
              onClick={() => setSec(60)}
              className="rounded-xl px-6 py-2 text-sm ring-1 ring-black/10 bg-white"
            >
              Resetar
            </button>
          </div>

          <p className="mt-6 text-brand-navy/60">
            Inspire por 4s — segure 2s — expire por 6s. Repita até completar o minuto.
          </p>
        </div>
      </section>
    </main>
  );
}
