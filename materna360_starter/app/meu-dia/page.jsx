// materna360_starter/app/meu-dia/page.jsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import MessageOfDay from "../../components/MessageOfDay"; // ⬅️ novo bloco

function Card({ emoji, title, subtitle, href = "#" }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl bg-white/90 ring-1 ring-black/5 shadow-sm hover:shadow-md transition-shadow p-5 md:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl leading-none">{emoji}</div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-brand-navy">{title}</h3>
          <p className="text-sm md:text-base text-brand-navy/60">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}

export default function MeuDiaPage() {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-soft to-white pb-28">
      {/* Topbar */}
      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
        <div className="text-sm md:text-base font-medium text-brand-navy/70">
          Materna<strong style={{ color: "#ff005e" }}>360</strong>
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
        <h1 className="text-[28px] md:text-[36px] font-bold text-brand-navy">
          {greeting}, <span className="text-brand-navy">Mãe</span> <span>👋</span>
        </h1>
        <p className="mt-2 text-brand-navy/60 text-lg md:text-xl">Seu dia, com leveza</p>
      </section>

      {/* Mensagem do Dia */}
      <section className="mx-auto max-w-5xl px-5 pt-5">
        <MessageOfDay />
      </section>

      {/* Grid de Atalhos */}
      <section className="mx-auto max-w-5xl px-5 pt-5 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card
          emoji="🏠"
          title="Rotina da Casa"
          subtitle="Organizar tarefas"
          href="/meu-dia/rotina"
        />
        <Card
          emoji="💕"
          title="Tempo com Meu Filho"
          subtitle="Registrar momentos"
          href="/meu-dia/momentos"
        />
        <Card
          emoji="🎨"
          title="Atividade do Dia"
          subtitle="Ideias para brincar e aprender"
          href="/meu-dia/atividade"
        />
        <Card
          emoji="📝"
          title="Checklist do Dia"
          subtitle="Marque microtarefas e avance"
          href="/meu-dia/checklist"      // ⬅️ atalho garantido
        />
      </section>
    </main>
  );
}
