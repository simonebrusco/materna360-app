// app/meu-dia/page.jsx  (RAIZ)
"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// ✅ imports pela RAIZ do projeto (case-sensitive no build)
import QuickNote from "../../components/QuickNote.jsx";
import { getMessage, nextMessage } from "../../lib/messages.js";
import { get, keys } from "../../lib/storage.js";

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const CARDS = [
  { title: "Rotina da Casa",       desc: "Organizar tarefas",     href: "/meu-dia/rotina",   emoji: "🏠" },
  { title: "Tempo com Meu Filho",  desc: "Registrar momentos",    href: "/meu-dia/momentos", emoji: "💕" },
  { title: "Atividade do Dia",     desc: "Brincadeira educativa", href: "/meu-dia/atividade",emoji: "🎨" },
  { title: "Momento para Mim",     desc: "Pausa e autocuidado",   href: "/cuidar",           emoji: "🌿" },
  // ✅ novo atalho
  { title: "Checklist do Dia",     desc: "Microtarefas rápidas",  href: "/meu-dia/checklist",emoji: "✅" },
];

function calcPct(list = []) {
  if (!list.length) return 0;
  const done = list.filter((i) => i.done).length;
  return Math.round((done / list.length) * 100);
}

export default function MeuDiaPage() {
  const nome = "Simone";
  const [msg, setMsg] = useState(getMessage());
  const [openNote, setOpenNote] = useState(false);
  const [planner, setPlanner] = useState({ casa: [], filhos: [], eu: [] });

  useEffect(() => {
    setMsg(getMessage());
    setPlanner(get(keys.planner, { casa: [], filhos: [], eu: [] }));
  }, []);

  const pct = useMemo(() => {
    const casa = calcPct(planner.casa);
    const filhos = calcPct(planner.filhos);
    const eu = calcPct(planner.eu);
    const all = calcPct([
      ...(planner.casa || []),
      ...(planner.filhos || []),
      ...(planner.eu || []),
    ]);
    return { casa, filhos, eu, all };
  }, [planner]);

  function novaMensagem() {
    nextMessage();
    setMsg(getMessage());
  }

  return (
    <main>
      {/* Header + mensagem do dia */}
      <section className="rounded-2xl p-6 bg-gradient-to-b from-rose-100 to-rose-50 mb-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-rose-500 font-semibold">Materna360</span>
          <Link href="/eu360" className="text-xs bg-white/70 backdrop-blur px-3 py-1 rounded-full">
            Eu360
          </Link>
        </div>

        <h1 className="mt-3 text-[clamp(24px,4.5vw,36px)] font-semibold">
          {saudacao()}, {nome} <span className="inline-block">👋</span>
        </h1>

        <div className="mt-2 text-[15px] text-slate-600 max-w-[48ch] flex items-start gap-2">
          <span className="text-2xl leading-none">✨</span>
          <div className="flex-1">
            <div>{msg}</div>
            <button onClick={novaMensagem} className="text-brand text-sm hover:underline mt-1">
              Nova mensagem
            </button>
          </div>
        </div>
      </section>

      {/* Atalhos */}
      <h3 className="subtitle mb-3">Atalhos do dia</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="card flex gap-3 items-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl">{c.emoji}</div>
            <div>
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm text-slate-500">{c.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Planner na Home */}
      <section className="card mb-6">
        <div className="flex items-center justify-between mb-2 gap-2">
          <h4 className="text-lg font-semibold">Planner da Família</h4>
          <div className="flex gap-2">
            {/* ✅ novo botão */}
            <Link href="/meu-dia/checklist" className="btn bg-white border border-slate-200">
              Checklist
            </Link>
            <Link href="/meu-dia/planner" className="btn bg-white border border-slate-200">
              Abrir Planner
            </Link>
          </div>
        </div>

        {/* Barra geral */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Progresso de hoje</span>
            <span className="text-slate-500">{pct.all}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-2 bg-brand rounded-full" style={{ width: `${pct.all}%` }} />
          </div>
        </div>

        {/* Resumo por aba */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { k: "casa", label: "Casa", v: pct.casa },
            { k: "filhos", label: "Filhos", v: pct.filhos },
            { k: "eu", label: "Eu", v: pct.eu },
          ].map((it) => (
            <div key={it.k} className="rounded-xl border border-slate-200 p-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{it.label}</span>
                <span className="text-slate-500">{it.v}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-2 bg-slate-400 rounded-full" style={{ width: `${it.v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Humor (placeholder) */}
      <section className="card">
        <h4 className="text-lg font-semibold mb-1">Como você está hoje?</h4>
        <p className="text-sm text-slate-500 mb-3">Registre seu humor de hoje</p>
        <div className="flex gap-2 text-2xl">
          <button className="hover:scale-110 transition">😕</button>
          <button className="hover:scale-110 transition">🙂</button>
          <button className="hover:scale-110 transition">😊</button>
          <button className="hover:scale-110 transition">😁</button>
          <button className="hover:scale-110 transition">😌</button>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Dica: encontre um momento para se cuidar hoje 💗
        </p>
      </section>

      {/* FAB Quick Note */}
      {!openNote && (
        <button
          onClick={() => setOpenNote(true)}
          className="fixed right-5 bottom-24 z-50 rounded-full px-5 py-3 shadow-card bg-brand text-white font-medium"
        >
          ＋ Anotar
        </button>
      )}
      {openNote && (
        <QuickNote
          onClose={() => {
            setOpenNote(false);
            setPlanner(get(keys.planner, { casa: [], filhos: [], eu: [] }));
          }}
        />
      )}
    </main>
  );
}
