// materna360_starter/components/MoodCheckin.jsx
"use client";

import { useMemo, useState } from "react";
import { get, set, keys } from "../lib/storage";

const MOODS = [
  { v: 1, emoji: "😞", label: "Difícil" },
  { v: 2, emoji: "😐", label: "Ok" },
  { v: 3, emoji: "🙂", label: "Bem" },
  { v: 4, emoji: "😊", label: "Feliz" },
  { v: 5, emoji: "🤩", label: "Uau" },
];

function isoDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    .toISOString()
    .slice(0, 10);
}

export default function MoodCheckin() {
  const today = useMemo(() => isoDay(), []);
  const [saving, setSaving] = useState(false);

  async function save(score) {
    if (saving) return;
    setSaving(true);

    const k = keys.moods || "m360:moods";
    const arr = Array.isArray(get(k, [])) ? get(k, []) : [];
    const withoutToday = arr.filter(
      (m) => (m.date || "").slice(0, 10) !== today
    );
    const next = [{ date: today, score }, ...withoutToday].slice(0, 60);

    set(k, next);

    // badge + toast
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Cuidar de Mim" },
        })
      );
      window.dispatchEvent(
        new CustomEvent("m360:toast", {
          detail: { message: "Humor registrado 💛" },
        })
      );
    }

    setSaving(false);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {MOODS.map((m) => (
        <button
          key={m.v}
          onClick={() => save(m.v)}
          disabled={saving}
          className="rounded-full bg-white ring-1 ring-black/5 shadow-sm px-3 py-2 text-xl hover:shadow-md transition disabled:opacity-60"
          aria-label={m.label}
          title={m.label}
        >
          {m.emoji}
        </button>
      ))}
    </div>
  );
}
