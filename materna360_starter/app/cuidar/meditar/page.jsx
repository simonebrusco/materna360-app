// materna360_starter/app/cuidar/meditar/page.jsx
"use client";

import { useState } from "react";
import AppBar from "../../../components/AppBar";
import GlassCard from "../../../components/GlassCard";
import { get, set, keys } from "../../../lib/storage";
import { setPlannerNote } from "@/lib/persistM360.js"; // grava Planner (local + Supabase)

// ---- config das faixas ----
const TRACKS = [
  { id: "calma-3",  title: "Calma em 3 minutos",       minutes: 3 },
  { id: "foco-5",   title: "Foco gentil (5 min)",      minutes: 5 },
  { id: "sono-8",   title: "Acalmar para dormir (8)",  minutes: 8 },
];

// ---- helpers de data / storage Planner ----
const PROFILE_KEY = "m360:profile";
const K_NOTES = "m360:planner_notes";

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
function getProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function readNotes() {
  try {
    const raw = localStorage.getItem(K_NOTES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function writeNotes(map) {
  try {
    localStorage.setItem(K_NOTES, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent("m360:planner:changed"));
  } catch {}
}

// ---- continua somando minutos e logando, como antes ----
function addMinutes(minutes) {
  const kMin = keys.minutes || "m360:minutes";
  const kLog = keys.minutesLog || "m360:minutes_log";

  const cur = get(kMin, { meditation: 0, breath: 0 });
  const next = { ...cur, meditation: Number(cur.meditation || 0) + minutes };
  set(kMin, next);

  const log = get(kLog, []);
  log.push({ type: "meditation", minutes, date: new Date().toISOString() });
  set(kLog, log);

  if (typeof window !== "undefined") {
    // badge/toast existentes
    window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Cuidar de Mim" } }));
    window.dispatchEvent(new CustomEvent("m360:toast", { detail: { message: `+${minutes} min de meditação 🌿` } }));
  }
}

export default function MeditarPage() {
  const [playing, setPlaying] = useState(null);

  async function onPlay(t) {
    setPlaying(t.id);

    // Aqui você pode integrar áudio real.
    // Por enquanto, simulamos a conclusão imediata:
    addMinutes(t.minutes);

    // ✅ Salva no Planner (append seguro)
    try {
      const dk = todayKey();
      const profile = getProfile();
      const userId = profile?.userId || null;

      const map = readNotes();
      const prev = String(map[dk] || "");
      const line = `• Meditação concluída (${t.minutes} min)`;
      const already = prev.split("\n").some((l) => l.trim().startsWith(`• Meditação concluída (${t.minutes} min)`));
      const nextText = already ? prev : (prev ? prev + "\n" : "") + line;

      // salva local imediato
      const nextMap = { ...map, [dk]: nextText };
      writeNotes(nextMap);

      // sincroniza remoto (fallback local dentro de setPlannerNote)
      await setPlannerNote(userId, dk, nextText);

      // toast suave
      try {
        window.dispatchEvent(
          new CustomEvent("m360:toast", { detail: { message: "Meditação salva no Planner 💛" } })
        );
      } catch {}
    } catch {
      // silencioso
    }

    setPlaying(null);
  }

  return (
    <main className="max-w-5xl mx-auto px-5 pb-24">
      <AppBar title="Meditar" backHref="/cuidar" />
      <section className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TRACKS.map((t) => (
          <GlassCard key={t.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-sm opacity-60">{t.minutes} min</div>
            </div>
            <button
              onClick={() => onPlay(t)}
              className="btn btn-primary min-w-[110px]"
              disabled={playing === t.id}
            >
              {playing === t.id ? "Tocando..." : "Tocar"}
            </button>
          </GlassCard>
        ))}
      </section>
    </main>
  );
}
