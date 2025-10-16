"use client";
import Link from "next/link";
import { useMemo } from "react";
import MessageOfDay from "../../components/MessageOfDay.jsx";

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

export default function Page() {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-100 to-rose-50">
      {/* header simples */}
      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
        <div className="text-sm md:text-base font-medium text-[#1A2240]/70">
          Materna<strong className="text-rose-500">360</strong>
        </div>
        <Link href="/eu360" className="rounded-full bg-white px-4 py-1.5 text-sm md:text-base ring-1 ring-black/5 shadow-sm">
          Eu360
        </Link>
      </header>

      {/* saudação */}
      <section className="mx-auto max-w-5xl px-5 pt-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-[#1A2240]">
          {greeting}, <span className="text-[#1A2240]">Simone</span> <span>👋</span>
        </h1>
      </section>

      {/* mensagem do dia */}
      <section className="mx-auto max-w-5xl px-5 pt-4">
        <MessageOfDay />
      </section>

      {/* atalhos */}
      <section className="mx-auto max-w-5xl px-5 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card emoji="🏠" title="Rotina da Casa" subtitle="Organizar tarefas" href="/meu-dia/planner" />
        <Card emoji="💕" title="Tempo com Meu Filho" subtitle="Registrar momentos" href="/meu-dia/momentos" />
        <Card emoji="🎨" title="Atividade do Dia" subtitle="Brincadeira educativa" href="/brincar" />
        <Card emoji="🌿" title="Momento para Mim" subtitle="Pausa e autocuidado" href="/cuidar" />
        {/* checklist do dia */}
        <Card emoji="✅" title="Checklist do Dia" subtitle="Microtarefas rápidas" href="/meu-dia/checklist" />
      </section>

      <div className="h-24" />
    </main>
  );
}
