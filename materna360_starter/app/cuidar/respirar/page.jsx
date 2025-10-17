"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AppBar from "../../../components/AppBar";
import GlassCard from "../../../components/GlassCard";
import { get, set, keys } from "../../../lib/storage";

function addBreathMinute() {
  const kMin = keys.minutes || "m360:minutes";
  const kLog = keys.minutesLog || "m360:minutes_log";

  const cur = get(kMin, { meditation: 0, breath: 0 });
  const next = { ...cur, breath: Number(cur.breath || 0) + 1 };
  set(kMin, next);

  const log = get(kLog, []);
  log.push({ type: "breath", minutes: 1, date: new Date().toISOString() });
  set(kLog, log);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Cuidar de Mim" } }));
    window.dispatchEvent(new CustomEvent("m360:toast", { detail: { message: "+1 min de respiração 🌬️" } }));
  }
}

// calcula a fase do ciclo box-breath 4-4-6 dentro de 60s (ciclo de 14s)
function useBreathCue(sec, running) {
  // elapsed cresce de 0 → 60
  const elapsed = 60 - sec;
  const t = elapsed % 14; // 0..13
  if (!running) return { cue: "Pronta?", sub: "Toque em Iniciar", phasePct: 0 };

  if (t < 4) {
    return { cue: "Inspire", sub: "4s de entrada de ar", phasePct: Math.round(((t + 1) / 4) * 100) };
  } else if (t < 8) {
    const k = t - 4;
    return { cue: "Segure", sub: "4s de pausa", phasePct: Math.round(((k + 1) / 4) * 100) };
  } else {
    const k = t - 8; // 0..5
    return { cue: "Expire", sub: "6–8s soltando o ar", phasePct: Math.round(((k + 1) / 6) * 100) };
  }
}

export default function RespirarPage() {
  const [sec, setSec] = useState(60);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setSec((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          setRunning(false);
          addBreathMinute(); // registra 1 min ao completar 60s
          return 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running]);

  // dica textual da fase (inspire/segure/expire)
  const { cue, sub, phasePct } = useBreathCue(sec, running);

  // progresso total (0..100) do minuto
  const totalPct = useMemo(() => Math.round(((60 - sec) / 60) * 100), [sec]);

  // ring visual com conic-gradient
  const ringStyle = useMemo(() => ({
    background: `conic-gradient(#ff005e ${totalPct * 3.6}deg, rgba(0,0,0,0.06) 0deg)`,
  }), [totalPct]);

  return (
    <main className="max-w-5xl mx-auto px-5 pb-24">
      <AppBar title="Respirar" backHref="/cuidar" />

      <section className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <GlassCard className="p-6 flex flex-col items-center justify-center">
          {/* Círculo animado */}
          <div className="relative">
            <div
              className="h-44 w-44 md:h-56 md:w-56 rounded-full grid place-items-center"
              style={ringStyle}
              aria-hidden
            >
              <div
                className={`h-32 w-32 md:h-40 md:w-40 rounded-full bg-[#ffd8e6] grid place-items-center
                ${running ? "animate-[m360-breathe_4s_ease-in-out_infinite]" : ""}`}
              >
                <div className="text-3xl font-semibold tabular-nums text-[#1A2240]">{sec}s</div>
              </div>
            </div>

            {/* marcação percentual pequena */}
            <div className="absolute inset-0 grid place-items-end pr-2 pb-2">
              <span className="text-xs text-[#1A2240]/60">{totalPct}%</span>
            </div>
          </div>

          {/* cues */}
          <div className="mt-3 text-center">
            <div className="text-lg font-medium text-[#1A2240]">{cue}</div>
            <div className="text-xs text-[#1A2240]/60">{sub}</div>
            {running && (
              <div className="mt-2 h-1.5 w-40 rounded-full bg-black/10 overflow-hidden mx-auto">
                <div
                  className="h-full bg-[#ff005e] transition-all"
                  style={{ width: `${phasePct}%` }}
                />
              </div>
            )}
          </div>

          {/* controles */}
          <div className="mt-4 flex gap-2">
            {!running ? (
              <button onClick={() => setRunning(true)} className="btn btn-primary">Iniciar</button>
            ) : (
              <button
                onClick={() => { setRunning(false); clearInterval(timerRef.current); }}
                className="btn bg-white border border-slate-200"
              >
                Pausar
              </button>
            )}
            <button
              onClick={() => { setRunning(false); clearInterval(timerRef.current); setSec(60); }}
              className="btn bg-white border border-slate-200"
            >
              Resetar
            </button>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="font-medium">Como fazer</div>
          <ul className="mt-2 text-sm opacity-80 space-y-1">
            <li>• Inspire profundamente por 4 segundos</li>
            <li>• Segure o ar por 4 segundos</li>
            <li>• Expire lentamente por 6–8 segundos</li>
            <li>• Repita até o ciclo completar 60s</li>
          </ul>

          <div className="mt-4 rounded-xl bg-white ring-1 ring-black/5 p-3">
            <div className="text-xs uppercase tracking-wide text-[#1A2240]/60">Dica</div>
            <div className="text-sm text-[#1A2240]">
              Mantenha os ombros relaxados e o maxilar solto. Se ficar desconfortável,
              pause e retome quando estiver pronta 💛
            </div>
          </div>
        </GlassCard>
      </section>
    </main>
  );
}
