"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const K_NOTES = "m360:planner_notes";

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export default function PlannerBreathCTA({ className = "" }) {
  const [done, setDone] = useState(false);

  const dk = useMemo(todayKey, []);
  const check = () => {
    try {
      const raw = localStorage.getItem(K_NOTES);
      const map = raw ? JSON.parse(raw) : {};
      const txt = String(map?.[dk] || "");
      setDone(/\bRespiração concluída\b/i.test(txt));
    } catch {
      setDone(false);
    }
  };

  useEffect(() => {
    check();
    const onAny = () => check();
    window.addEventListener("m360:planner:changed", onAny);
    window.addEventListener("m360:checklist:changed", onAny);
    return () => {
      window.removeEventListener("m360:planner:changed", onAny);
      window.removeEventListener("m360:checklist:changed", onAny);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!done) return null;

  return (
    <div
      className={`rounded-xl bg-white ring-1 ring-black/5 shadow-sm p-4 flex items-center justify-between ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden>✅</span>
        <div>
          <div className="font-medium text-[#1A2240]">Respiração já registrada hoje</div>
          <div className="text-sm text-[#1A2240]/60">Parabéns por cumprir seus 60s 💛</div>
        </div>
      </div>
      <Link
        href="/meu-dia/planner"
        className="px-3 py-1.5 rounded-lg bg-[#ff005e] text-white text-sm"
      >
        Ver no Planner
      </Link>
    </div>
  );
}
