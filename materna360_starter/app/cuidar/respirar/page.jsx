// materna360_starter/app/cuidar/respirar/page.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { getJSON, setJSON } from "../../../lib/storage";
import { toast } from "../../../lib/toast";

function incWellbeingMinutes(kind, minutes) {
  const key = "m360:wellbeing";
  const data = getJSON(key) || { meditationMin: 0, breathMin: 0, history: [] };
  if (kind === "breath") data.breathMin = (data.breathMin || 0) + minutes;
  setJSON(key, data);
}

export default function RespirarPage() {
  const TOTAL = 60; // segundos
  const [sec, setSec] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    // ao iniciar: badge + toast
    try {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Cuidar de Mim" },
        })
      );
    } catch {}
    toast("Respiração guiada iniciada", { icon: "🫁" });

    timerRef.current = setInterval(() => {
      setSec((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  useEffect(() => {
    if (sec === 0 && running) {
      setRunning(false);
      clearInterval(timerRef.current);
      incWellbeingMinutes("breath", 1); // +1 min concluído
      toast("Ciclo concluído. Muito bem! 💗", { icon: "✅" });
    }
  }, [sec, running]);

  function start() {
    setSec(TOTAL);
    setRunning(true);
  }
  function pause() {
    setRunning(false);
    clearInterval(timerRef.current);
  }

  // instrução simples: 4s inspira / 4s segura / 4s expira (sugestão visual)
  const phase = ((TOTAL - sec) % 12);
  const label =
    phase < 4 ? "Inspire" : phase < 8 ? "Segure" : "Expire";

  const pct = Math.round(((TOTAL - sec) / TOTAL) * 100);

  return (
    <main className="max-w-sm mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-[#2f3a56]">Respirar</h1>
      <p className="text-sm text-[#545454] mt-1">
        Um minuto para recentrar. Siga o ritmo: 4s inspirar • 4s segurar • 4s expirar.
      </p>

      <div className="mt-6 rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6 text-center">
        <div className="text-5xl font-bold text-[#2f3a56] tabular-nums">{sec}s</div>
        <div className="mt-2 text-sm text-[#545454]">{label}</div>

        <div className="mt-4 h-2 w-full rounded-full bg-[#ffd8e6]">
          <div
            className="h-2 rounded-full"
            style={{ width: `${pct}%`, backgroundColor: "#ff005e" }}
          />
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          {!running ? (
            <button
              onClick={start}
              className="rounded-xl px-4 py-2 text-white"
              style={{ backgroundColor: "#ff005e" }}
            >
              Iniciar
            </button>
          ) : (
            <button
              onClick={pause}
              className="rounded-xl px-4 py-2 ring-1 ring-black/10 bg-white"
            >
              Pausar
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
