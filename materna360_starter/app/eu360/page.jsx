// materna360_starter/app/eu360/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listGratitudes, addGratitude } from "../../lib/gratitudes";
import { getJSON, hasWindow } from "../../lib/storage";

function Section({ title, right, children }) {
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
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const [grats, setGrats] = useState([]);     // lista de gratidões
  const [text, setText] = useState("");       // input
  const [badges, setBadges] = useState([]);   // selos

  useEffect(() => {
    // Hidratação segura no cliente
    setGrats(listGratitudes());
    setBadges(getJSON("m360:badges", []) || []);

    if (!hasWindow()) return;

    const onStorage = (e) => {
      if (e?.key === "m360:badges") {
        setBadges(getJSON("m360:badges", []) || []);
      }
      if (e?.key === "m360:gratitudes") {
        setGrats(listGratitudes());
      }
    };

    const onWin = () => {
      setBadges(getJSON("m360:badges", []) || []);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("m360:win", onWin);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("m360:win", onWin);
    };
  }, []);

  function onAdd() {
    const next = addGratitude(text);
    setGrats(next);
    setText("");
  }

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-b from-rose-100 to-rose-50 ring-1 ring-black/5 p-5 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              {greeting}, Simone 💛
            </h1>
            <p className="text-slate-600">Você é importante — siga no seu ritmo.</p>
          </div>
          <Link href="/meu-dia" className="btn bg-white border border-slate-200">
            ← Meu Dia
          </Link>
        </div>
      </div>

      {/* Conquistas */}
      <Section title="Conquistas (selos)">
        {badges?.length ? (
          <div className="flex flex-wrap gap-2">
            {badges.map((b, i) => {
              const name = typeof b === "string" ? b : b?.name;
              return <Badge key={`${name}-${i}`} name={name || "Selo"} />;
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            Você ainda não conquistou selos. Que tal registrar uma gratidão ou fazer uma pausa hoje? ✨
          </p>
        )}
      </Section>

      {/* Gratidão */}
      <Section
        title="Gratidão"
        right={<div className="text-sm text-slate-500">{grats.length ? `${grats.length} recentes` : null}</div>}
      >
        <div className="flex gap-2 mb-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva algo pelo qual é grata hoje…"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2"
          />
          <button
            onClick={onAdd}
            disabled={!text.trim()}
            className="btn btn-primary disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>

        {grats.length ? (
          <ul className="space-y-2">
            {grats.slice(0, 8).map((g) => (
              <li key={g.id} className="rounded-xl bg-white ring-1 ring-black/5 shadow-sm px-3 py-2 text-sm text-slate-700">
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
