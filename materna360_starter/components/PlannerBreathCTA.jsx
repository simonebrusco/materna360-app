"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";

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
    try {
      window.addEventListener("m360:planner:changed", onAny);
      window.addEventListener("m360:checklist:changed", onAny);
    } catch {}
    return () => {
      try {
        window.removeEventListener("m360:planner:changed", onAny);
        window.removeEventListener("m360:checklist:changed", onAny);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!done) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "rounded-[var(--r-lg)] bg-[var(--m360-white)]",
        "m360-card-border shadow-[var(--elev-1)] p-4",
        "flex items-center justify-between gap-4",
        "m360-animate-in",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden>
          ✅
        </span>
        <div>
          <div className="font-medium text-[var(--m360-navy)]">
            Respiração já registrada hoje
          </div>
          <div className="text-sm text-[color:var(--m360-navy)]/60">
            Parabéns por cumprir seus 60s 💛
          </div>
        </div>
      </div>

      <Link href="/meu-dia/planner">
        <Button variant="primary" size="sm" aria-label="Ver registro no Planner">
          Ver no Planner
        </Button>
      </Link>
    </div>
  );
}
