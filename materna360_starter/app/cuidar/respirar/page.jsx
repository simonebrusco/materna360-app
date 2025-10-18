// app/cuidar/respirar/page.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import BreathCircle from "@/components/BreathCircle";

const TOTAL = 60; // segundos

export default function RespirarPage() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // 0..TOTAL
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const carriedRef = useRef(0); // acumula quando pausa/retoma

  // formata mm:ss
  const mmss = useMemo(() => {
    const left = Math.max(0, TOTAL - Math.floor(elapsed));
    const m = String(Math.floor(left / 60)).padStart(2, "0");
    const s = String(left % 60).padStart(2, "0");
    return `${m}:${s}`;
  }, [elapsed]);

  useEffect(() => {
    if (!running) return;
    // start timestamp
    startRef.current = performance.now();
    const tick = (t) => {
      const deltaSec = (t - startRef.current) / 1000;
      const next = Math.min(TOTAL, carriedRef.current + deltaSec);
      setElapsed(next);
      if (next >= TOTAL) {
        setRunning(false);
        carriedRef.current = 0;
        // 🔔 gamificação
        try {
          window.dispatchEvent(
            new CustomEvent("m360:win", { detail: { source: "respirar", id: "respirar" } })
          );
        } catch {}
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  function start() {
    if (running) return;
    setRunning(true);
  }
  function pause() {
    if (!running) return;
    setRunning(false);
    carriedRef.current = elapsed; // guarda progresso
  }
  function reset() {
    setRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    carriedRef.current = 0;
    setElapsed(0);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-100 to-rose-50">
      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
        <Link href="/meu-dia" className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm">
          ← Meu Dia
        </Link>
        <Link href="/cuidar" className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm">
          Cuidar
        </Link>
      </header>

      <section className="mx-auto max-w-md px-5 pt-8 pb-28">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A2240]">Respirar</h1>
          <p className="mt-1 text-[#1A2240]/60">Um minuto para você — inspire, segure, expire.</p>

          {/* 🔵 círculo sincronizado */}
          <div className="mt-6 flex justify-center">
            <BreathCircle total={TOTAL} elapsed={elapsed} size={200} />
          </div>

          {/* cronômetro */}
          <div className="mt-4 text-center text-3xl font-semibold text-[#1A2240] tabular-nums">
            {mmss}
          </div>

          {/* controles */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {!running ? (
              <button onClick={start} className="px-4 py-2 rounded-xl bg-[#ff005e] text-white">
                Iniciar
              </button>
            ) : (
              <button onClick={pause} className="px-4 py-2 rounded-xl bg-white border border-slate-200">
                Pausar
              </button>
            )}
            <button onClick={reset} className="px-4 py-2 rounded-xl bg-white border border-slate-200">
              Reiniciar
            </button>
          </div>

          {/* dica respiratória */}
          <div className="mt-6 text-sm text-[#1A2240]/70 text-center">
            Dica: respire pelo nariz em 4s, segure 4s e solte pela boca em 4s.
          </div>
        </div>
      </section>
    </main>
  );
}
