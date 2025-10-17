"use client";

import { useEffect, useRef, useState } from "react";
import AppBar from "../../../components/AppBar";
import GlassCard from "../../../components/GlassCard";
import { get, set, keys } from "../../../lib/storage";

const TOTAL = 60; // 60s de prática guiada (MVP)

export default function RespirarPage() {
  const [sec, setSec] = useState(0);
  const [running, setRunning] = useState(false);
  const idRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    idRef.current = setInterval(() => {
      setSec((s) => {
        const next = s + 1;
        if (next >= TOTAL) {
          clearInterval(idRef.current);
          setRunning(false);

          // telemetria e badge
          const key = keys.minutes || "m360:minutes";
          const minutes = get(key, { meditation: 0, breath: 0 });
          set(key, { ...minutes, breath: minutes.breath + 1 });

          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("m360:win", {
              detail: { type: "badge", name: "Cuidar de Mim" }
            }));
          }
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(idRef.current);
  }, [running]);

  function start() {
    setSec(0);
    setRunning(true);
  }
  function pause() {
    setRunning(false);
    clearInterval(idRef.current);
  }

  const pct = Math.min(100, Math.round((sec / TOTAL) * 100));

  return (
    <main className="max-w-5xl mx-auto px-5 pb-24">
      <AppBar title="Respirar" backHref="/cuidar" />
      <div className="container-px py-6">
        <GlassCard className="p-6">
          <div className="font-semibold mb-1">Ciclo guiado • 60s</div>
          <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--brand)]" style={{ width: `${pct}%` }} />
          </div>

          <div className="mt-4 flex gap-2">
            {!running ? (
              <button onClick={start} className="btn btn-primary">Iniciar</button>
            ) : (
              <button onClick={pause} className="btn bg-white border border-slate-200">Pausar</button>
            )}
            <span className="text-sm opacity-70 self-center">{sec}s</span>
          </div>

          <p className="mt-4 text-sm opacity-70">
            Inspire 4s • segure 2s • expire 6s — repita com suavidade.
          </p>
        </GlassCard>
      </div>
    </main>
  );
}
