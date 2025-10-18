"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import BreathCircle from "@/components/BreathCircle";
import { setPlannerNote } from "../../lib/persistM360.js"; // ✅ relativo, estável no Vercel

const TOTAL = 60; // segundos
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

export default function RespirarPage() {
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(TOTAL);
  const tickRef = useRef(null);

  const elapsed = useMemo(
    () => Math.min(TOTAL, Math.max(0, TOTAL - left)),
    [left]
  );

  // auto-salvar no Planner quando concluir 60s
  async function saveBreathToPlanner() {
    const dk = todayKey();
    const profile = getProfile();
    const userId = profile?.userId || null;

    const map = readNotes();
    const prev = String(map[dk] || "");
    const line = "• Respiração concluída (60s)";
    const already = prev.split("\n").some((l) => l.trim().startsWith("• Respiração concluída"));

    const nextText = already ? prev : (prev ? prev + "\n" : "") + line;

    // salva local imediatamente
    const nextMap = { ...map, [dk]: nextText };
    writeNotes(nextMap);

    // sincroniza remoto (fallback local automático)
    await setPlannerNote(userId, dk, nextText);
  }

  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => {
      setLeft((s) => {
        const next = s - 1;
        if (next <= 0) {
          clearInterval(tickRef.current);

          // gamificação existente
          try {
            window.dispatchEvent(
              new CustomEvent("m360:win", { detail: { source: "respirar", id: "respirar" } })
            );
          } catch {}

          // ✅ salva no Planner
          saveBreathToPlanner().finally(() => {
            try {
              window.dispatchEvent(
                new CustomEvent("m360:toast", { detail: { message: "Respiração salva no Planner 💛" } })
              );
            } catch {}
          });

          setRunning(false);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [running]);

  function start() {
    setLeft(TOTAL);
    setRunning(true);
  }
  function stop() {
    setRunning(false);
    setLeft(TOTAL);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-100 to-rose-50">
      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
        <Link
          href="/meu-dia"
          className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm"
        >
          ← Meu Dia
        </Link>
        <div className="text-sm md:text-base font-medium text-[#1A2240]/70">Cuidar</div>
        <Link
          href="/cuidar"
          className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm"
        >
          Voltar
        </Link>
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-6 pb-28">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A2240]">Respirar</h1>
          <p className="mt-1 text-[#1A2240]/60">
            Siga o círculo: Inspire, Segure, Expire. 60s de respiração gentil.
          </p>

          {/* círculo sincronizado ao timer */}
          <div className="mt-6 grid place-items-center">
            <BreathCircle total={TOTAL} elapsed={elapsed} size={220} />
          </div>

          {/* timer + controles */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="rounded-xl bg-white ring-1 ring-black/5 p-4 text-center">
              <div className="text-xs opacity-60">Tempo</div>
              <div className="text-3xl font-semibold tabular-nums">
                {String(Math.floor(left / 60)).padStart(2, "0")}:
                {String(left % 60).padStart(2, "0")}
              </div>
            </div>

            <div className="flex gap-2 justify-center md:col-span-2">
              {!running ? (
                <button
                  onClick={start}
                  className="px-4 py-2 rounded-xl bg-[#ff005e] text-white"
                >
                  Iniciar 60s
                </button>
              ) : (
                <button
                  onClick={stop}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200"
                >
                  Parar
                </button>
              )}
              <Link
                href="/meu-dia/planner"
                className="px-4 py-2 rounded-xl bg-white border border-slate-200"
              >
                Abrir Planner
              </Link>
            </div>
          </div>

          <hr className="my-6 border-black/10" />

          <div className="text-sm text-slate-600 space-y-1">
            <p><strong>Ritmo de referência:</strong> 4s inspirar · 2s segurar · 6s expirar.</p>
            <p>Ao concluir, salvamos no Planner do dia: “Respiração concluída (60s)”.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
