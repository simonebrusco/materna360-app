// app/eu360/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { get, set, keys } from "../../lib/storage.js";
import { CATALOG, getBadgeEvents, getUserBadges } from "../../lib/gamification.js";

const GRATS_KEY = "m360:gratitudes"; // [{id, text, ts}]

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function lastNDates(n = 7) {
  const out = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    const dt = new Date(d);
    dt.setDate(d.getDate() - i);
    out.push(dt.toISOString().slice(0, 10)); // YYYY-MM-DD
  }
  return out.reverse();
}

export default function Eu360Page() {
  // Gratidão
  const [gratText, setGratText] = useState("");
  const [grats, setGrats] = useState([]);

  // Badges
  const [events, setEvents] = useState([]);
  const badges = useMemo(() => getUserBadges(), [events]);

  // Humor (placeholder: se existir m360:moods, sumariza; senão, neutro)
  const [moods, setMoods] = useState([]); // [{date:'YYYY-MM-DD', value:1..5}]
  const dates = useMemo(() => lastNDates(7), []);
  const moodSeries = useMemo(() => {
    // estrutura esperada: localStorage["m360:moods"] = [{date, value}]
    const raw = get("m360:moods", []);
    const map = new Map(raw.map((m) => [m.date, m.value]));
    return dates.map((d) => ({ date: d, value: map.get(d) ?? 3 })); // 3 = neutro
  }, [dates]);

  // Meu Tempo (conta pausas do checklist dos últimos 7 dias)
  const tempoResumo = useMemo(() => {
    const chk = get(keys.checklist, {}); // { [date]: { items:[{id, done}], awarded? } }
    let pausas = 0;
    dates.forEach((d) => {
      const its = chk[d]?.items || [];
      its.forEach((it) => {
        if ((it.id === "pausa" || it.id === "respiro") && it.done) pausas++;
      });
    });
    return { pausas7d: pausas };
  }, [dates]);

  // carregar dados locais
  useEffect(() => {
    setGrats(get(GRATS_KEY, []));
    setEvents(getBadgeEvents());
  }, []);

  function addGratitude() {
    const t = gratText.trim();
    if (!t) return;
    const id = `g_${Date.now().toString(36)}`;
    const item = { id, text: t, ts: Date.now() };
    const next = [item, ...grats].slice(0, 50);
    setGrats(next);
    set(GRATS_KEY, next);
    setGratText("");
    // opcional: acionar selo de autocuidado
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Cuidar de Mim" },
        })
      );
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold">Eu360</h1>
          <p className="text-sm text-slate-500">Você é importante 💛 — siga no seu ritmo.</p>
        </div>
        <Link href="/meu-dia" className="btn bg-white border border-slate-200">← Meu Dia</Link>
      </header>

      {/* Humor da Semana */}
      <section className="card mb-6">
        <h2 className="text-lg font-semibold mb-3">Humor da Semana</h2>
        <div className="grid grid-cols-7 gap-2">
          {moodSeries.map((m) => (
            <div key={m.date} className="flex flex-col items-center gap-1">
              <div
                className="w-8 rounded-md"
                style={{
                  height: `${m.value * 10 + 10}px`,
                  background:
                    m.value >= 4 ? "#86efac" : m.value <= 2 ? "#fecaca" : "#fde68a",
                }}
                title={`${m.date} → ${m.value}/5`}
              />
              <span className="text-[10px] text-slate-500">{m.date.slice(5).replace("-", "/")}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Dica: registre seu humor diariamente para ver sua evolução.
        </p>
      </section>

      {/* Conquistas */}
      <section className="card mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Conquistas</h2>
          <span className="text-sm text-slate-500">{badges.length} selos</span>
        </div>

        {badges.length === 0 ? (
          <p className="text-sm text-slate-500 mt-2">
            Nenhum selo ainda. Use o Planner, Brincar ou Mentoria para desbloquear.
          </p>
        ) : (
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((name) => {
              const meta = CATALOG[name] || {};
              const last = events.find((e) => e.name === name)?.ts;
              return (
                <li key={name} className="rounded-xl border border-slate-200 p-3 bg-white">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{meta.emoji || "🏅"}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{name}</div>
                      <div className="text-sm text-slate-600">{meta.desc || "Conquista Materna360"}</div>
                      {last ? (
                        <div className="text-xs text-slate-500 mt-1">
                          Última conquista: {fmtDate(last)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Gratidão */}
      <section className="card mb-6">
        <h2 className="text-lg font-semibold mb-3">Gratidão</h2>
        <div className="flex gap-2">
          <input
            value={gratText}
            onChange={(e) => setGratText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addGratitude()}
            placeholder="Registrar uma gratidão..."
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand/30"
          />
          <button onClick={addGratitude} className="btn btn-primary">Registrar</button>
        </div>
        <ul className="mt-3 space-y-2">
          {grats.slice(0, 5).map((g) => (
            <li key={g.id} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-sm">{g.text}</div>
              <div className="text-xs text-slate-400 mt-1">{fmtDate(g.ts)}</div>
            </li>
          ))}
          {grats.length === 0 && (
            <li className="text-sm text-slate-500">Sem registros ainda. Que tal começar hoje? 💛</li>
          )}
        </ul>
      </section>

      {/* Meu Tempo */}
      <section className="card">
        <h2 className="text-lg font-semibold mb-1">Meu Tempo</h2>
        <p className="text-sm text-slate-600 mb-3">
          Resumo dos últimos 7 dias.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="text-sm text-slate-500">Pausas/Respiros</div>
            <div className="text-2xl font-semibold">{tempoResumo.pausas7d}</div>
            <div className="text-xs text-slate-500 mt-1">Registros do Checklist</div>
          </div>
          <div className="rounded-xl border border-slate-200 p-3 opacity-60">
            <div className="text-sm text-slate-500">Minutos de autocuidado</div>
            <div className="text-2xl font-semibold">—</div>
            <div className="text-xs text-slate-500 mt-1">(conectar meditações na próxima etapa)</div>
          </div>
          <div className="rounded-xl border border-slate-200 p-3 opacity-60">
            <div className="text-sm text-slate-500">Atividades com o filho</div>
            <div className="text-2xl font-semibold">—</div>
            <div className="text-xs text-slate-500 mt-1">(integração Momentos v2)</div>
          </div>
        </div>
      </section>
    </main>
  );
}
