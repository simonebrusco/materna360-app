"use client";

import { useMemo } from "react";

/**
 * Círculo de respiração sincronizado ao timer.
 * Props:
 *  - total (segundos, default 60)
 *  - elapsed (segundos corridos, 0..total)
 *  - size (px do SVG, default 160)
 */
export default function BreathCircle({ total = 60, elapsed = 0, size = 160 }) {
  const { radius, stroke, center, circ, progress } = useMemo(() => {
    const stroke = 10;
    const center = size / 2;
    const radius = center - stroke; // padding interno
    const circ = 2 * Math.PI * radius;
    const clamped = Math.max(0, Math.min(total, elapsed || 0));
    const progress = clamped / total; // 0..1
    return { radius, stroke, center, circ, progress };
  }, [size, total, elapsed]);

  const dashoffset = useMemo(() => {
    // barra “vai esvaziando” conforme o tempo passa
    return circ * (1 - progress);
  }, [circ, progress]);

  // fase respiratória visual (opcional): 4s inspirar, 4 segurar, 4 expirar → 12s ciclo
  const phase = useMemo(() => {
    const t = Math.floor((elapsed || 0) % 12);
    if (t < 4) return { label: "Inspire", hint: "nariz" };
    if (t < 8) return { label: "Segure", hint: "calma" };
    return { label: "Expire", hint: "boca" };
  }, [elapsed]);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
        {/* trilho */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={10}
          fill="none"
        />
        {/* progresso */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#ff005e"
          strokeWidth={10}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s linear" }}
          transform={`rotate(-90 ${center} ${center})`} // começa no topo
        />
        {/* ponto pulsante no topo (decoração leve) */}
        <circle
          cx={center}
          cy={center - radius}
          r={4}
          fill="#ff005e"
          opacity="0.7"
        />
      </svg>

      <div className="mt-2 text-sm text-[#1A2240]/60">
        {Math.max(0, Math.ceil(total - (elapsed || 0)))}s restantes
      </div>
      <div className="text-lg font-medium text-[#1A2240]">
        {phase.label} <span className="text-[#1A2240]/60">({phase.hint})</span>
      </div>
    </div>
  );
}
