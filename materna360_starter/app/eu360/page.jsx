// materna360_starter/app/eu360/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import AppBar from "../../components/AppBar";
import GlassCard from "../../components/GlassCard";
import MoodCheckin from "../../components/MoodCheckin";
import BadgesLastFive from "../../components/BadgesLastFive.jsx";
import ProfileCard from "../../components/ProfileCard";
import { get, set, keys } from "../../lib/storage";
import Eu360ReportCTA from "@/components/Eu360ReportCTA";

/* ----------------------- hooks auxiliares ----------------------- */
function useWeeklyMinutes() {
  const [minutes, setMinutes] = useState({ meditation: 0, breath: 0 });

  useEffect(() => {
    const k = keys.minutes || "m360:minutes";
    const cur = get(k, { meditation: 0, breath: 0 });
    setMinutes({
      meditation: Number(cur.meditation || 0),
      breath: Number(cur.breath || 0),
    });
  }, []);

  return minutes;
}

/* ----------------------- blocos de UI ----------------------- */
function GratitudeBlock() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const k = keys.gratitudes || "m360:gratitudes";
    const arr = Array.isArray(get(k, [])) ? get(k, []) : [];
    setItems(arr.slice(-8).reverse());
  }, []);

  function onAdd(e) {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;

    const k = keys.gratitudes || "m360:gratitudes";
    const arr = Array.isArray(get(k, [])) ? get(k, []) : [];
    const next = [...arr, { text: v, date: new Date().toISOString() }];
    set(k, next);
    setItems(next.slice(-8).reverse());
    setText("");

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", { detail: { type: "badge", name: "Cuidar de Mim" } })
      );
      window.dispatchEvent(
        new CustomEvent("m360:toast", { detail: { message: "Gratidão registrada ✨" } })
      );
    }
  }

  return (
    <GlassCard className="p-4">
      <div className="font-medium">Gratidão</div>
      <form onSubmit={onAdd} className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
          placeholder="Hoje sou grata por..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Salvar
        </button>
      </form>

      <ul className="mt-3 space-y-2">
        {items.length === 0 && (
          <li className="text-sm opacity-60">Registre sua primeira gratidão 💛</li>
        )}
        {items.map((g, idx) => (
          <li key={idx} className="text-sm">
            • {g.text}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

function WeeklyMood() {
  // lê os 7 últimos check-ins (se existir chave m360:moods)
  const [dots, setDots] = useState([3, 3, 3, 3, 3, 3, 3]);

  useEffect(() => {
    const k = keys.moods || "m360:moods";
    const arr = Array.isArray(get(k, [])) ? get(k, []) : [];
    const last7 = arr.slice(-7).map((m) => Number(m.score || 3));
    if (last7.length) {
      // preenche à esquerda com 3 (neutro) se faltar
      const padded = Array(7 - last7.length).fill(3).concat(last7);
      setDots(padded);
    }
  }, []);

  return (
    <GlassCard className="p-4">
      <div className="font-medium">Humor da Semana</div>
      <div className="mt-3 flex items-center gap-2">
        {dots.map((s, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full grid place-items-center ring-1 ring-black/5"
            style={{
              background:
                s >= 4 ? "rgba(255,0,94,0.12)" :
                s === 3 ? "rgba(84,84,84,0.08)" :
                "rgba(47,58,86,0.10)"
            }}
            title={`Dia ${i + 1}: ${s}`}
          >
            {["😞", "😐", "🙂", "😊", "🤩"][s - 1] || "🙂"}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

/* ----------------------- página ----------------------- */
export default function Eu360Page() {
  const minutes = useWeeklyMinutes();

  const bannerCopy = useMemo(
    () => ({
      title: "Você é importante 💛",
      subtitle: "Acolha seu ritmo. Aqui é seu espaço de cuidado.",
    }),
    []
  );

  return (
    <main className="max-w-5xl mx-auto px-5 pb-24">
      <AppBar title="Eu360" />

      {/* Banner */}
      <section className="mt-4 rounded-2xl p-5 bg-[var(--brand)]/10 ring-1 ring-[var(--brand)]/15">
        <div className="text-lg font-semibold">{bannerCopy.title}</div>
        <div className="text-sm opacity-70">{bannerCopy.subtitle}</div>

        {/* Check-in de Humor */}
        <div className="mt-4">
          <MoodCheckin />
        </div>

        {/* Conquistas — últimos 5 selos */}
        <div className="mt-4">
          <GlassCard className="p-4 bg-white/80">
            <div className="font-medium">Conquistas</div>
            <p className="text-sm opacity-60">Últimos selos ganhos</p>
            <div className="mt-3">
              <BadgesLastFive />
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Humor da Semana + Meu Tempo */}
      <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <WeeklyMood />

        <GlassCard className="p-4">
          <div className="font-medium">Meu Tempo</div>
          <p className="text-sm opacity-60">Minutos de autocuidado nesta semana</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-white ring-1 ring-black/5 p-4">
              <div className="text-xs opacity-60">Meditar</div>
              <div className="text-2xl font-semibold tabular-nums">
                {minutes.meditation}
              </div>
              <div className="text-xs opacity-60">min</div>
            </div>
            <div className="rounded-xl bg-white ring-1 ring-black/5 p-4">
              <div className="text-xs opacity-60">Respirar</div>
              <div className="text-2xl font-semibold tabular-nums">
                {minutes.breath}
              </div>
              <div className="text-xs opacity-60">min</div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* === RELATÓRIO SEMANAL CTA === */}
      <section className="mt-4">
        <Eu360ReportCTA />
      </section>

      {/* Gratidão */}
      <section className="mt-4">
        <GratitudeBlock />
      </section>

      {/* Personalização — FORMULÁRIO */}
      <section className="mt-4">
        <ProfileCard />
      </section>
    </main>
  );
}
