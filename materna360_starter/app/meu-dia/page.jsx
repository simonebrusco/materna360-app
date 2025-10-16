// app/meu-dia/page.jsx
"use client";
import Link from "next/link";

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const CARDS = [
  {
    title: "Rotina da Casa",
    desc: "Organizar tarefas",
    href: "/meu-dia/rotina",
    emoji: "🏠",
  },
  {
    title: "Tempo com Meu Filho",
    desc: "Registrar momentos",
    href: "/meu-dia/momentos",
    emoji: "💕",
  },
  {
    title: "Atividade do Dia",
    desc: "Brincadeira educativa",
    href: "/brincar",
    emoji: "🎨",
  },
  {
    title: "Momento para Mim",
    desc: "Pausa e autocuidado",
    href: "/cuidar",
    emoji: "🌿",
  },
];

export default function MeuDiaPage() {
  const nome = "Simone";
  const msgDoDia = "Hoje pode ser mais leve. Um passo de cada vez 💛";

  return (
    <main className="pb-28">
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

        <p className="mt-2 text-[15px] text-slate-500 max-w-[42ch]">
          {msgDoDia}
        </p>
      </section>

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
    </main>
  );
}
