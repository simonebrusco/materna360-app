"use client";

import { useEffect, useRef, useState } from "react";
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

  return (
    <main className="max-w-5xl mx-auto px-5 pb-24">
      <AppBar title="Respirar" backHref="/cuidar" />

      <section className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <GlassCard className="p-6 flex flex-col items-center justify-center">
          <div className="text-5xl font-semibold tabular-nums">{sec}s</div>
          <div className="mt-2 text-sm opacity-60">Ciclo guiado (60s)</div>

          <div className="mt-4 flex gap-2">
            {!running ? (
              <button onClick={() => setRunning(true)} className="btn btn-primary">Iniciar</button>
            ) : (
              <button onClick={() => { setRunning(false); clearInterval(timerRef.current); }} className="btn bg-white border border-slate-200">
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
        </GlassCard>
      </section>
    </main>
  );
}
