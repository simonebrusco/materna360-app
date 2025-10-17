// materna360_starter/app/eu360/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import AppBar from "../../components/AppBar";
import GlassCard from "../../components/GlassCard";
import MoodCheckin from "../../components/MoodCheckin";
import { get, set, keys } from "../../lib/storage";

// util: yyyy-mm-dd
function isoDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    .toISOString()
    .slice(0, 10);
}

// util: início da semana (7 dias atrás)
function startOfWeek(date = new Date()) {
  const d = new Date(date);
  d.setDate(d.getDate() - 6); // hoje + 6 dias pra trás = janela de 7
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Eu360Page() {
  // Gratidão
  const [gratList, setGratList] = useState([]);
  const [gratText, setGratText] = useState("");

  // Minutos (meditação/respiração)
  const [minutes, setMinutes] = useState({ meditation: 0, breath: 0 });
  const [minutesLog, setMinutesLog] = useState([]);

  useEffect(() => {
    // carrega gratidões
    const kGr = keys.gratitudes || "m360:gratitudes";
    const gl = Array.isArray(get(kGr, [])) ? get(kGr, []) : [];
    setGratList(gl);

    // carrega minutos acumulados + log
    const kMin = keys.minutes || "m360:minutes";
    const kLog = keys.minutesLog || "m360:minutes_log";
    setMinutes(get(kMin, { meditation: 0, breath: 0 }));
    setMinutesLog(Array.isArray(get(kLog, [])) ? get(kLog, []) : []);
  }, []);

  function addGratitude() {
    const text = (gratText || "").trim();
    if (!text) return;
    const kGr = keys.gratitudes || "m360:gratitudes";
    const next = [{ date: new Date().toISOString(), text }, ...gratList].slice(0, 100);
    set(kGr, next);
    setGratList(next);
    setGratText("");

    // feedback
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", { detail: { type: "badge", name: "Cuidar de Mim" } })
      );
      window.dispatchEvent(
        new CustomEvent("m360:toast", { detail: { message: "Gratidão registrada 💛" } })
      );
    }
  }

  // minutos da semana (somando pelo log dos últimos 7 dias)
  const weekly = useMemo(() => {
    const since = startOfWeek();
    let med = 0;
    let bre = 0;
    for (const it of minutesLog) {
      const when = new Date(it.date || it.when || Date.now());
      if (when >= since) {
        if (it.type === "meditation") med += Number(it.minutes || 0);
        if (it.type === "breath") bre += Number(it.minutes || 0);
      }
    }
    return { meditation: med, breath: bre, total: med + bre };
  }, [minutesLog]);

  return (
    <main className="max-w-5xl mx-auto px-5 pb-24">
      <AppBar title="Eu360" backHref="/" />

      {/* Banner de acolhimento */}
      <section className="mt-4 rounded-2xl p-5 bg-[var(--brand)]/10 ring-1 ring-[var(--brand)]/15">
        <h1 className="text-xl font-semibold text-[var(--brand-navy)]">
          Você é importante 💛 — siga no seu ritmo.
        </h1>
        <p className="mt-1 text-sm subtitle">
          Um espaço para celebrar conquistas, cuidar do humor e agradecer o dia.
        </p>

        {/* Check-in de humor */}
        <div className="mt-3">
          <MoodCheckin />
        </div>
      </section>

      {/* Meu Tempo (semana) */}
      <section className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <GlassCard className="p-4">
          <div className="text-sm opacity-60">Minutos na semana</div>
          <div className="text-3xl font-semibold mt-1">{weekly.total} min</div>
          <div className="mt-2 text-xs opacity-60">
            Meditar: {weekly.meditation} • Respirar: {weekly.breath}
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-sm opacity-60">Acumulado (local)</div>
          <div className="text-3xl font-semibold mt-1">
            {(Number(minutes.meditation || 0) + Number(minutes.breath || 0))} min
          </div>
          <div className="mt-2 text-xs opacity-60">
            Meditar: {Number(minutes.meditation || 0)} • Respirar: {Number(minutes.breath || 0)}
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-sm opacity-60">Hoje</div>
          <div className="text-3xl font-semibold mt-1">{isoDay()}</div>
          <div className="mt-2 text-xs opacity-60">
            Siga no seu ritmo — cada minuto conta. 🌿
          </div>
        </GlassCard>
      </section>

      {/* Gratidão */}
      <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <GlassCard className="p-4">
          <div className="font-medium">Gratidão</div>
          <p className="text-sm opacity-60">Registre algo bom do seu dia.</p>

          <div className="mt-3 flex gap-2">
            <input
              value={gratText}
              onChange={(e) => setGratText(e.target.value)}
              placeholder="Sou grata por..."
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2"
            />
            <button onClick={addGratitude} className="btn btn-primary">
              Salvar
            </button>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="font-medium">Recentes</div>
          <ul className="mt-2 space-y-2">
            {gratList.length === 0 && (
              <li className="text-sm opacity-60">Sem itens ainda — que tal registrar o primeiro? ✨</li>
            )}
            {gratList.slice(0, 6).map((g, i) => (
              <li key={i} className="text-sm">
                <span className="opacity-60 mr-2">{(g.date || "").slice(0, 10)}</span>
                {g.text}
              </li>
            ))}
          </ul>
        </GlassCard>
      </section>
    </main>
  );
}
