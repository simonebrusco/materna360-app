// materna360_starter/components/HomeClient.jsx
"use client";

import { useMemo } from "react";
import Link from "next/link";

function Card({ emoji, title, subtitle, href = "#" }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl bg-white/90 ring-1 ring-black/5 shadow-sm hover:shadow-md transition-shadow p-5 md:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl leading-none">{emoji}</div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-[#1A2240]">{title}</h3>
          <p className="text-sm md:text-base text-[#1A2240]/60">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}

function MoodDot({ children }) {
  return (
    <button
      type="button"
      className="rounded-full bg-white ring-1 ring-black/5 shadow-sm px-3 py-2 text-xl hover:shadow-md transition"
      aria-label="Registrar humor"
    >
      {children}
    </button>
  );
}

export default function HomeClient() {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  return (
    <main>
      {/* Topbar */}
      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
        <div className="text-sm md:text-base font-medium text-[#1A2240]/70">
          Materna<strong className="text-rose-500">360</strong>
        </div>
        <Link
          href="/eu360"
          className="rounded-full bg-white px-4 py-1.5 text-sm md:text-base ring-1 ring-black/5 shadow-sm"
        >
          Eu360
        </Link>
      </header>

      {/* Saudação */}
      <section className="mx-auto max-w-5xl px-5 pt-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-[#1A2240]">
          {greeting}, <span className="text-[#1A2240]">Simone</span> <span>👋</span>
        </h1>
        <p className="mt-2 text-[#1A2240]/60 text-lg md:text-xl">Atalhos do dia</p>
      </section>

      {/* Grid de Atalhos */}
      <section className="mx-auto max-w-5xl px-5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card emoji="🏠" title="Rotina da Casa" subtitle="Organizar tarefas" href="/cuidar" />
        <Card emoji="💕" title="Tempo com Meu Filho" subtitle="Registrar momentos" href="/momentos" />
        <Card emoji="🎨" title="Atividade do Dia" subtitle="Brincadeira educativa" href="/brincar" />
        <Card emoji="🌿" title="Momento para Mim" subtitle="Pausa e autocuidado" href="/eu360" />
      </section>

      {/* Humor do dia */}
      <section className="mx-auto max-w-5xl px-5 pt-6 pb-6">
        <div className="rounded-2xl bg-white/80 ring-1 ring-black/5 shadow-sm p-5 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-[#1A2240]">Como você está hoje?</h2>
          <p className="mt-1 text-[#1A2240]/60">Registre seu humor de hoje</p>
          <div className="mt-4 flex items-center gap-3 md:gap-4">
            <MoodDot>😞</MoodDot><MoodDot>😐</MoodDot><MoodDot>🙂</MoodDot><MoodDot>😊</MoodDot><MoodDot>🤩</MoodDot>
          </div>
          <p className="mt-4 text-sm md:text-base text-[#1A2240]/60">
            Dica: encontre um momento para se cuidar hoje 💗
          </p>
        </div>
      </section>
    </main>
  );
}
