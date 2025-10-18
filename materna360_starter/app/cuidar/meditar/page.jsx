"use client";

import { useRef, useState } from "react";
import AppBar from "../../../components/AppBar";
import GlassCard from "../../../components/GlassCard";
import { get, set, keys } from "../../../lib/storage";
import { setPlannerNote } from "@/lib/persistM360.js"; // grava Planner (local + Supabase)

/**
 * Coloque seus MP3 em /public/audio e ajuste os 'src' abaixo.
 * Se 'src' estiver ausente ou o arquivo falhar, fazemos fallback e registramos mesmo assim.
 */
const TRACKS = [
  { id: "calma-3", title: "Calma em 3 minutos",      minutes: 3,  src: "/audio/calma-3.mp3" },
  { id: "foco-5",  title: "Foco gentil (5 min)",     minutes: 5,  src: "/audio/foco-5.mp3" },
  { id: "sono-8",  title: "Acalmar para dormir (8)", minutes: 8,  src: "/audio/sono-8.mp3" },
];

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

function addMinutes(minutes) {
  const kMin = keys.minutes || "m360:minutes";
  const kLog = keys.minutesLog || "m360:minutes_log";

  const cur = get(kMin, { meditation: 0, breath: 0 });
  const next = { ...cur, meditation: Number(cur.meditation || 0) + minutes };
  set(kMin, next);

  const log = get(kLog, []);
  log.push({ type: "meditation", minutes, date: new Date().toISOString() });
  set(kLog, log);

  try {
    window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Cuidar de Mim" } }));
    window.dispatchEvent(new CustomEvent("m360:toast", { detail: { message: `+${minutes} min de meditação 🌿` } }));
  } catch {}
}

async function saveMeditationToPlanner(minutes) {
  const dk = todayKey();
  const profile = getProfile();
  const userId = profile?.userId || null;

  const map = readNotes();
  const prev = String(map[dk] || "");
  const line = `• Meditação concluída (${minutes} min)`;
  const already = prev.split("\n").some((l) => l.trim().startsWith(`• Meditação concluída (${minutes} min)`));
  const nextText = already ? prev : (prev ? prev + "\n" : "") + line;

  const nextMap = { ...map, [dk]: nextText };
  writeNotes(nextMap);
  await setPlannerNote(userId, dk, nextText);
}

export default function MeditarPage() {
  const [playing, setPlaying] = useState(null); // track.id ou null
  const audioRef = useRef(null);

  const finishFlow = async (t, reason = "ended") => {
    addMinutes(t.minutes);
    await saveMeditationToPlanner(t.minutes);
    try {
      window.dispatchEvent(
        new CustomEvent("m360:toast", {
          detail: { message: reason === "error" ? "Áudio indisponível — progresso salvo mesmo assim 💛" : "Meditação salva no Planner 💛" }
        })
      );
    } catch {}
    setPlaying(null);
  };

  const onPlay = async (t) => {
    // se não houver src, registramos imediatamente (fallback)
    if (!t.src) {
      await finishFlow(t, "nosrc");
      return;
    }

    try {
      // inicia/renova o player
      let el = audioRef.current;
      if (!el) return; // sem player montado
      el.pause();
      el.src = t.src;
      el.currentTime = 0;

      // limpa handlers anteriores
      el.onended = null;
      el.onerror = null;

      el.onended = () => finishFlow(t, "ended");
      el.onerror = () => finishFlow(t, "error");

      setPlaying(t.id);
      await el.play();
    } catch {
      // falhou em tocar → fallback
      await finishFlow(t, "error");
    }
  };

  const onStop = () => {
    const el = audioRef.current;
    try { el?.pause(); } catch {}
    setPlaying(null);
  };

  return (
    <main className="max-w-5xl mx-auto px-5 pb-24">
      <AppBar title="Meditar" backHref="/cuidar" />

      {/* player oculto (controlado) */}
      <audio ref={audioRef} preload="auto" className="hidden" />

      <section className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TRACKS.map((t) => (
          <GlassCard key={t.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-sm opacity-60">
                {t.minutes} min {t.src ? "" : "• (sem arquivo — fallback)"}
              </div>
            </div>
            {playing === t.id ? (
              <button onClick={onStop} className="btn bg-white border border-slate-200 min-w-[110px]">
                Parar
              </button>
            ) : (
              <button onClick={() => onPlay(t)} className="btn btn-primary min-w-[110px]">
                Tocar
              </button>
            )}
          </GlassCard>
        ))}
      </section>
    </main>
  );
}
