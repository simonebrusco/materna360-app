// materna360_starter/app/eu360/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import AppBar from "../../components/AppBar";
import GlassCard from "../../components/GlassCard";
import { get, set, keys } from "../../lib/storage";

// ---------- helpers ----------
function isoDay(d = new Date()) {
  // yyyy-mm-dd para comparar só por dia
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    .toISOString()
    .slice(0, 10);
}

function lastNDays(n) {
  const out = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - i
    );
    out.push(dt);
  }
  return out;
}

const MOOD_EMOJI = {
  1: "😞",
  2: "😐",
  3: "🙂",
  4: "😊",
  5: "🤩",
};

// fallback de chaves caso a lib/keys não tenha esses nomes
const K = {
  moods: keys.moods || "m360:moods", // [{date:'2025-10-16', score:1..5}]
  badges: keys.badges || "m360:badges", // [{name:'Cuidar de Mim', ts:...}] ou ["Cuidar de Mim", ...]
  gratitudes: keys.gratitudes || "m360:gratitudes", // [{text, date}]
  minutes: keys.minutes || "m360:minutes", // { meditation: number, breath: number }
  minutesLog: keys.minutesLog || "m360:minutes_log", // opcional: [{type:'meditation'|'breath', minutes, date}]
};

export default function Eu360Page() {
  // --------- estados baseados no storage ----------
  const [moods, setMoods] = useState(() => get(K.moods, []));
  const [badges, setBadges] = useState(() => get(K.badges, []));
  const [gratitudes, setGrats] = useState(() => get(K.gratitudes, []));
  const [minutes, setMinutes] = useState(() => get(K.minutes, { meditation: 0, breath: 0 }));
  const [minutesLog, setMinutesLog] = useState(() => get(K.minutesLog, []));

  // observar storage quando voltar para a aba
  useEffect(() => {
    const onFocus = () => {
      setMoods(get(K.moods, []));
      setBadges(get(K.badges, []));
      setGrats(get(K.gratitudes, []));
      setMinutes(get(K.minutes, { meditation: 0, breath: 0 }));
      setMinutesLog(get(K.minutesLog, []));
    };
    if (typeof window !== "undefined") {
      window.addEventListener("focus", onFocus);
      return () => window.removeEventListener("focus", onFocus);
    }
  }, []);

  // --------- Humor da Semana ----------
  const week = useMemo(() => lastNDays(7), []);
  const weekMoods = useMemo(() => {
    const byDay = new Map();
    (Array.isArray(moods) ? moods : []).forEach((m) => {
      // aceita tanto {date:'yyyy-mm-dd', score} quanto {ts:..., score}
      const k = (m.date && m.date.slice?.(0, 10)) || (m.ts && isoDay(new Date(m.ts))) || null;
      if (k) byDay.set(k, m.score);
    });
    return week.map((d) => {
      const dayKey = d.toISOString().slice(0, 10);
      const score = byDay.get(dayKey) || null;
      return { date: dayKey, score };
    });
  }, [moods, week]);

  // --------- Conquistas ----------
  const lastBadges = useMemo(() => {
    const arr = Array.isArray(badges) ? badges : [];
    const norm = arr.map((b) =>
      typeof b === "string" ? { name: b, ts: null } : b
    );
    return norm.slice(0, 5);
  }, [badges]);

  // --------- Gratidão ----------
  const [gInput, setGInput] = useState("");
  function addGratitude() {
    if (!gInput.trim()) return;
    const entry = { text: gInput.trim(), date: new Date().toISOString() };
    const next = [entry, ...gratitudes].slice(0, 50);
    set(K.gratitudes, next);
    setGrats(next);
    setGInput("");

    // badge de autocuidado
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Cuidar de Mim" },
        })
      );
    }
  }

  // --------- Meu Tempo (semana) ----------
  const weeklyMinutes = useMemo(() => {
    const end = new Date(); // hoje 23:59
    const start = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate() - 6
    ); // 7 dias
    const within = (dt) => {
      const d = new Date(dt);
      return d >= start && d <= end;
    };

    if (Array.isArray(minutesLog) && minutesLog.length) {
      const acc = minutesLog.reduce(
        (out, it) => {
          if (!within(it.date || it.ts)) return out;
          if (it.type === "meditation") out.meditation += it.minutes || 0;
          if (it.type === "breath") out.breath += it.minutes || 0;
          return out;
        },
        { meditation: 0, breath: 0 }
      );
      return acc;
    }

    // fallback: mostra acumulado caso ainda não exista 'minutes_log'
    return {
      meditation: Number(minutes.meditation || 0),
      breath: Number(minutes.breath || 0),
    };
  }, [minutes, minutesLog]);

  // ---------- UI ----------
  return (
    <main className="max-w-5xl mx-auto px-5 pb-24">
      <AppBar title="Eu360" backHref="/meu-dia" />

      {/* Banner acolhedor */}
      <section className="mt-4 rounded-2xl p-5 bg-[var(--brand)]/10 ring-1 ring-[var(--brand)]/15">
        <h1 className="text-xl font-semibold text-[var(--brand-navy)]">
          Você é importante 💛 — siga no seu ritmo.
        </h1>
        <p className="mt-1 text-sm subtitle">
          Um espaço para celebrar conquistas, cuidar do humor e agradecer o dia.
        </p>
      </section>

      {/* Humor da semana */}
      <section className="mt-5">
        <h2 className="title">Humor da Semana</h2>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between gap-2">
            {weekMoods.map(({ date, score }) => (
              <div key={date} className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-full grid place-items-center ring-1 ring-black/5 ${
                    score ? "bg-white" : "bg-black/5"
                  }`}
                  title={date}
                >
                  <span className="text-xl leading-none">
                    {score ? MOOD_EMOJI[score] || "🙂" : "—"}
                  </span>
                </div>
                <span className="text-[10px] opacity-60">
                  {new Date(date).toLocaleDateString("pt-BR", {
                    weekday: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs opacity-60">
            Dica: registrar seu humor 1x ao dia ajuda você a se observar com carinho.
          </p>
        </GlassCard>
      </section>

      {/* Conquistas */}
      <section className="mt-5">
        <h2 className="title">Conquistas</h2>
        <GlassCard className="p-5">
          {lastBadges.length ? (
            <div className="flex flex-wrap gap-2">
              {lastBadges.map((b, i) => (
                <span
                  key={`${b.name}-${i}`}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm bg-[var(--brand)]/10 ring-1 ring-[var(--brand)]/15"
                >
                  🏅 {b.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm opacity-70">
              Assim que você usar Cuidar/Brincar/Planner as conquistas aparecem aqui.
            </p>
          )}
        </GlassCard>
      </section>

      {/* Gratidão */}
      <section className="mt-5">
        <h2 className="title">Gratidão</h2>
        <GlassCard className="p-5">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={gInput}
              onChange={(e) => setGInput(e.target.value)}
              placeholder="Hoje eu agradeço por..."
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2"
            />
            <button onClick={addGratitude} className="btn btn-primary">
              Salvar
            </button>
          </div>

          <ul className="mt-4 space-y-2">
            {(gratitudes || []).slice(0, 5).map((g, idx) => (
              <li
                key={`${g.date}-${idx}`}
                className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-2 text-sm"
              >
                <div className="opacity-60 text-[11px]">
                  {new Date(g.date).toLocaleString("pt-BR")}
                </div>
                <div>{g.text}</div>
              </li>
            ))}
            {!gratitudes?.length && (
              <li className="text-sm opacity-70">
                Escreva sua primeira gratidão para começar 💛
              </li>
            )}
          </ul>
        </GlassCard>
      </section>

      {/* Meu Tempo */}
      <section className="mt-5 mb-6">
        <h2 className="title">Meu Tempo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <GlassCard className="p-5">
            <div className="text-sm opacity-70">Meditação</div>
            <div className="text-3xl font-semibold">
              {weeklyMinutes.meditation || 0} <span className="text-base">min</span>
            </div>
            <p className="text-xs opacity-60 mt-1">soma dos últimos 7 dias*</p>
          </GlassCard>
          <GlassCard className="p-5">
            <div className="text-sm opacity-70">Respiração</div>
            <div className="text-3xl font-semibold">
              {weeklyMinutes.breath || 0} <span className="text-base">min</span>
            </div>
            <p className="text-xs opacity-60 mt-1">soma dos últimos 7 dias*</p>
          </GlassCard>
        </div>
        <p className="text-[11px] opacity-60">
          *Se você ainda não tem registros semanais, mostramos o acumulado total até agora.
        </p>
      </section>
    </main>
  );
}
