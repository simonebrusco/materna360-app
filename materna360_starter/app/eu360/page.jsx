"use client";

import { useEffect, useMemo, useState } from "react";
import { get, set } from "../../lib/storage";
import { toast } from "../../lib/toast";

const K_MOODS = "m360:moods"; // [{date: 'YYYY-MM-DD', score: 1..5}]
const K_BADGES = "m360:badges"; // ['Organizada', ...] (listener já popula)
const K_GRATS = "m360:gratitudes"; // [{text, date}]
const K_MINUTES = "m360:minutes"; // { weekISO: '2025-W42', meditate: n, breathe: n }

function weekKey(d = new Date()) {
  // chave simples por ISO week aproximada
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export default function Eu360Page() {
  // humor (últimos 7 dias)
  const moods = useMemo(() => get(K_MOODS, []), []);
  // badges recentes
  const badges = useMemo(() => get(K_BADGES, []), []);
  // gratidões
  const [grats, setGrats] = useState(() => get(K_GRATS, []));
  const [text, setText] = useState("");
  // minutos semanais
  const minutes = useMemo(() => get(K_MINUTES, {}), []);
  const totalWeek =
    (minutes?.[weekKey()]?.meditate || 0) + (minutes?.[weekKey()]?.breathe || 0);

  // persist zippy quando adicionar
  function addGratitude() {
    const t = text.trim();
    if (!t) return;
    const next = [{ text: t, date: new Date().toISOString() }, ...grats].slice(
      0,
      20
    );
    set(K_GRATS, next);
    setGrats(next);
    setText("");
    toast("Gratidão registrada ✨");
  }

  // simula uma leitura reativa de badges (caso listener preencha localStorage)
  useEffect(() => {
    function onBadge(e) {
      try {
        const name = e?.detail?.name;
        if (!name) return;
        const current = get(K_BADGES, []);
        if (!current.includes(name)) {
          const next = [name, ...current].slice(0, 20);
          set(K_BADGES, next);
        }
      } catch {}
    }
    if (typeof window !== "undefined") {
      window.addEventListener("m360:win", onBadge);
      return () => window.removeEventListener("m360:win", onBadge);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-soft to-white">
      <header className="mx-auto max-w-5xl px-5 pt-6">
        <h1 className="text-[28px] md:text-[32px] font-semibold text-brand-navy">
          Eu360
        </h1>
        <p className="text-brand-navy/60 mt-1">
          Você é importante 💛 — siga no seu ritmo.
        </p>
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-6 pb-28 space-y-5 md:space-y-6">
        {/* Humor da semana */}
        <Card title="Humor da semana">
          {moods?.length ? (
            <div className="flex items-center gap-2">
              {[...Array(7)].map((_, i) => {
                const m = moods[moods.length - 1 - i];
                const score = m?.score ?? 0;
                return (
                  <div
                    key={i}
                    className="h-3 w-7 rounded"
                    style={{
                      background:
                        score >= 4
                          ? "#00C853"
                          : score === 3
                          ? "#FFD54F"
                          : score > 0
                          ? "#FF7043"
                          : "#E5E7EB",
                    }}
                    title={m?.date || ""}
                  />
                );
              })}
            </div>
          ) : (
            <Empty text="Sem registros ainda." />
          )}
        </Card>

        {/* Conquistas */}
        <Card title="Conquistas">
          {badges?.length ? (
            <ul className="flex flex-wrap gap-2">
              {badges.slice(0, 5).map((b, i) => (
                <li
                  key={i}
                  className="px-3 py-1.5 rounded-full text-sm text-white shadow"
                  style={{ backgroundColor: "#2f3a56" }}
                >
                  {b}
                </li>
              ))}
            </ul>
          ) : (
            <Empty text="Sem selos por enquanto." />
          )}
        </Card>

        {/* Gratidão */}
        <Card title="Gratidão">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escreva algo pelo qual é grata hoje…"
              className="flex-1 rounded-xl bg-white ring-1 ring-black/5 px-3 py-2 text-sm"
            />
            <button
              onClick={addGratitude}
              className="rounded-xl px-4 py-2 text-sm text-white"
              style={{ backgroundColor: "#ff005e" }}
            >
              Salvar
            </button>
          </div>
          {grats?.length ? (
            <ul className="mt-3 space-y-2">
              {grats.slice(0, 5).map((g, i) => (
                <li
                  key={i}
                  className="text-sm text-brand-navy/70 bg-white/60 rounded-lg px-3 py-2 ring-1 ring-black/5"
                >
                  {g.text}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-2">
              <Empty text="Sem registros ainda." />
            </div>
          )}
        </Card>

        {/* Meu Tempo */}
        <Card title="Meu Tempo">
          <div className="text-brand-navy/80">
            Minutos de meditação/respiração (semana):{" "}
            <strong>{totalWeek} min</strong>
          </div>
        </Card>
      </section>
    </main>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5 md:p-6">
      <div className="text-sm text-brand-navy/50 mb-2">{title}</div>
      {children}
    </div>
  );
}

function Empty({ text }) {
  return <div className="text-sm text-brand-navy/50">{text}</div>;
}
