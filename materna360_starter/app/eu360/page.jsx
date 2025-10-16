// materna360_starter/app/eu360/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listGratitudes, addGratitude } from "../../lib/gratitudes";
import { getJSON } from "../../lib/storage";

function Section({ title, children, right }) {
  return (
    <section className="card mb-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

function Badge({ name }) {
  const map = {
    CuidarDeMim: "💛 Cuidar de Mim",
    MaePresente: "👩‍👧 Mãe Presente",
    Exploradora: "🧭 Exploradora",
    Organizada: "📋 Organizada",
    Conectada: "🤝 Conectada",
  };
  return (
    <div className="rounded-xl bg-white ring-1 ring-black/5 shadow-sm px-3 py-2 text-sm">
      {map[name] || name}
    </div>
  );
}

export default function Eu360Page() {
  // — GRADIENTE/BANNER
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  // — GRATIDÕES
  const [items, setItems] = useState(() => listGratitudes());
  const [text, setText] = useState("");

  function onAdd() {
    const next = addGratitude(text);
    setItems(next);
    setText("");
  }

  // — BADGES (gerados pelo GamificationListener)
  const [badges, setBadges] = useState(() => getJSON("m360:badges", []));
  useEffect(() => {
    function sync() {
      setBadges(getJSON("m360:badges", []));
    }
    window.addEventListener("storage", sync);
    // também ouvimos o evento customizado para refletir na hora
    function onWin() {
      sync();
    }
    window.addEventListener("m360:win", onWin);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("m360:win", onWin);
    };
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-b from-rose-100 to-rose-50 ring-1 ring-black/5 p-5 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              {greeting}, Simone 💛
            </h1>
            <p className="text-slate-600">
              Você é importante — siga no seu ritmo.
            </p>
          </div>
          <Link href="/meu-dia" className="btn bg-white border border-slate-200">
            ← Meu Dia
          </Link>
        </div>
      </div>

      {/* Conquistas */}
      <Section title="Conquistas (selos)">
        {badges && badges.length ? (
          <div className="flex flex-wrap gap-2">
            {badges.map((b, i) => (
              <Badge key={`${b.name}-${i}`} name={b.name || b} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600">Você ainda não conquistou selos. Que tal registrar uma gratidão ou fazer uma pausa hoje? ✨</p>
        )}
      </Section>

      {/* Gratidão */}
      <Section
        title="Gratidão"
        right={
          <div className="text-sm text-slate-500">
            {items.length ? `${items.length} recentes` : null}
          </div>
        }
      >
        <div className="flex gap-2 mb-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva algo pelo qual é grata hoje…"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2"
          />
          <button onClick={onAdd} className="btn btn-primary">Adicionar</button>
        </div>

        {items.length ? (
          <ul className="space-y-2">
            {items.slice(0, 8).map((g) => (
              <li
                key={g.id}
                className="rounded-xl bg-white ring-1 ring-black/5 shadow-sm px-3 py-2 text-sm text-slate-700"
              >
                {g.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600">Sem registros ainda. Comece com uma pequena gratidão 💫</p>
        )}
      </Section>
    </main>
  );
}
