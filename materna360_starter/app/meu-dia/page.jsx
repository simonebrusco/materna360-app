// materna360_starter/app/meu-dia/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useChecklistProgress from "../../lib/hooks/useChecklistProgress.js";
import PlannerWeekly from "../../components/PlannerWeekly.jsx";
import { get, keys } from "../../lib/storage";
import PlannerWeeklyNotes from "@/components/PlannerWeeklyNotes";
import PlannerNotesPeek from "@/components/PlannerNotesPeek";


const PROFILE_KEY = (keys && keys.profile) || "m360:profile";

// Card simples reutilizável
function Card({ emoji, title, subtitle, href = "#" }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl bg-white ring-1 ring-black/5 shadow-sm hover:shadow-md transition-shadow p-5 md:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl leading-none">{emoji}</div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-[#1A2240]">
            {title}
          </h3>
          {subtitle ? (
            <p className="text-sm md:text-base text-[#1A2240]/60">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

// Mensagem do dia (troca automática a cada 24h, sem botão de trocar)
function DailyMessage() {
  const msgs = [
    "Respire fundo — você está fazendo o seu melhor 💛",
    "Pequenos passos também são progresso.",
    "Seu cuidado é o coração da casa.",
    "Hoje vale celebrar uma coisa simples.",
    "Você não está sozinha — estamos juntas!",
    "Gentileza com você mesma muda o dia.",
    "A rotina fica leve quando você se acolhe.",
  ];
  const index = useMemo(() => {
    const d = new Date();
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day % msgs.length;
  }, [msgs.length]);
  const text = msgs[index];

  return (
    <section className="mx-auto max-w-5xl px-5 mt-4">
      <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 md:p-5">
        <div className="text-sm text-[#1A2240]/60 mb-1">Mensagem do dia</div>
        <p className="text-[#1A2240] text-lg md:text-xl">{text}</p>
      </div>
    </section>
  );
}

export default function MeuDiaPage() {
  const { percent } = useChecklistProgress();

  // nome salvo no Eu360
  const [motherName, setMotherName] = useState("");
  useEffect(() => {
    const p = get(PROFILE_KEY, { motherName: "" });
    setMotherName(p?.motherName || "");
  }, []);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const displayName = motherName?.trim() || "Mãe";

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-100 to-rose-50">
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
          {greeting}, <span className="text-[#1A2240]">{displayName}</span> <span>👋</span>
        </h1>
        <p className="mt-2 text-[#1A2240]/60 text-lg md:text-xl">
          Atalhos do dia
        </p>
      </section>

      <DailyMessage />

      {/* Planner semanal */}
      <section className="mx-auto max-w-5xl px-5 pt-4">
        <PlannerWeekly />
      </section>

      {/* Grid de Atalhos */}
      <section className="mx-auto max-w-5xl px-5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card emoji="📅" title="Planner da Família" subtitle="Organize suas tarefas" href="/meu-dia/planner" />
        <Card emoji="✅" title="Checklist do Dia" subtitle={`${percent}% concluído hoje`} href="/meu-dia/checklist" />
        <Card emoji="🎨" title="Atividade do Dia" subtitle="Brincadeira educativa" href="/brincar" />
        <Card emoji="🌿" title="Momento para Mim" subtitle="Pausa e autocuidado" href="/cuidar" />
      </section>

      {/* Humor do dia (teaser) */}
      <section className="mx-auto max-w-5xl px-5 pt-6 pb-28">
        <div className="rounded-2xl bg-white/80 ring-1 ring-black/5 shadow-sm p-5 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-[#1A2240]">
            Como você está hoje?
          </h2>
          <p className="mt-1 text-[#1A2240]/60 text-sm">Registre seu humor no Eu360</p>
          <div className="mt-4 flex items-center gap-3 md:gap-4">
            <span className="rounded-full bg-white ring-1 ring-black/5 shadow-sm px-3 py-2 text-xl">😞</span>
            <span className="rounded-full bg-white ring-1 ring-black/5 shadow-sm px-3 py-2 text-xl">😐</span>
            <span className="rounded-full bg-white ring-1 ring-black/5 shadow-sm px-3 py-2 text-xl">🙂</span>
            <span className="rounded-full bg-white ring-1 ring-black/5 shadow-sm px-3 py-2 text-xl">😊</span>
            <span className="rounded-full bg-white ring-1 ring-black/5 shadow-sm px-3 py-2 text-xl">🤩</span>
          </div>
          <div className="mt-4">
            <Link
              href="/eu360"
              className="inline-flex items-center gap-2 rounded-xl bg-white ring-1 ring-black/5 px-4 py-2 text-sm hover:shadow"
            >
              Abrir Eu360 →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
