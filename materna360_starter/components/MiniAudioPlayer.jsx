"use client";

import { useEffect, useMemo, useState } from "react";

function fmt(t) {
  if (!isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Mini player simples para um <audio> controlado externamente.
 * Props:
 *  - audioRef: ref para o <audio>
 *  - title: string (título da faixa)
 *  - onStop: () => void
 *  - onConcludeNow: () => void
 */
export default function MiniAudioPlayer({ audioRef, title = "Reproduzindo…", onStop, onConcludeNow }) {
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(NaN);

  useEffect(() => {
    const el = audioRef?.current;
    if (!el) return;

    const onTime = () => setCur(el.currentTime || 0);
    const onDur = () => setDur(el.duration || NaN);
    const onEnd = () => setCur(el.duration || 0);

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("durationchange", onDur);
    el.addEventListener("ended", onEnd);

    // inicial
    onDur();
    onTime();

    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("durationchange", onDur);
      el.removeEventListener("ended", onEnd);
    };
  }, [audioRef]);

  const progress = useMemo(() => {
    if (!isFinite(dur) || dur <= 0) return 0;
    return Math.min(100, Math.max(0, (cur / dur) * 100));
  }, [cur, dur]);

  return (
    <div className="rounded-xl bg-white ring-1 ring-black/5 shadow-sm p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium text-[#1A2240] truncate">{title}</div>
          <div className="mt-2 h-2 rounded-full bg-black/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--brand,#ff005e)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-[#1A2240]/60 tabular-nums">
            {fmt(cur)} {isFinite(dur) ? ` / ${fmt(dur)}` : ""}
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2">
          <button
            onClick={onConcludeNow}
            className="px-3 py-1.5 rounded-lg bg-[var(--brand,#ff005e)] text-white text-sm"
            title="Marcar como concluído agora"
          >
            Concluir agora
          </button>
          <button
            onClick={onStop}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm"
            title="Parar"
          >
            Parar
          </button>
        </div>
      </div>
    </div>
  );
}
