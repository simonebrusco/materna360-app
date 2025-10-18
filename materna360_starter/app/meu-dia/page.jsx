// materna360_starter/app/meu-dia/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// 🧩 hooks e libs
import useChecklistProgress from "@/lib/hooks/useChecklistProgress.js";
import { get, keys } from "@/lib/storage.js";

// 🧱 componentes existentes
import PlannerWeekly from "@/components/PlannerWeekly.jsx";

// 🆕 integração Planner x Checklist
import PlannerWeeklyNotes from "@/components/PlannerWeeklyNotes";
import PlannerNotesPeek from "@/components/PlannerNotesPeek";

const PROFILE_KEY = (keys && keys.profile) || "m360:profile";

// Card simples reutilizável
function Card({ emoji, title, subtitle, href = "#" }) {
  return (
    <Link
      href={href}
      className={[
        "block",
        "rounded-[var(--r-lg)]",
        "bg-[var(--m360-white)]",
        "m360-card-border",
        "shadow-[var(--elev-1)] hover:shadow-[var(--elev-2)]",
        "transition-all duration-300 ease-[var(--ease-soft)]",
        "p-5 md:p-6",
        "m360-animate-in",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl leading-none">{emoji}</div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-[var(--m360-navy)]">
            {title}
          </h3>
          {subtitle ? (
            <p className="text-sm md:text-base text-[color:var(--m360-navy)]/60">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

// Mensagem do dia (rotativa diária)
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

  return (
    <section className="mx-auto max-w-5xl px-5 mt-4">
      <div
        className={[
          "rounded-[var(--r-lg)] bg-[var(--m360-white)]",
          "m360-card-border shadow-[var(--elev-1)]",
          "p-4 md:p-5 m360-animate-in",
        ].join(" ")}
      >
        <div className="text-sm text-[color:var(--m360-navy)]/60 mb-1">
          Mensagem do dia
        </div>
        <p className="text-[var(--m360-navy)] text-lg md:text-xl">
          {msgs[index]}
        </p>
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
    <main className="min-h-screen">
      {/* Topbar */}
      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
        <div className="text-sm md:text-base font-medium text-[color:var(--m360-navy)]/70">
          Materna<strong className="text-[var(--m360-primary)]">360</strong>
        </div>
        <Link
          href="/eu360"
          className={[
            "rounded-[999px] bg-[var(--m360-white)]",
            "px-4 py-1.5 text-sm md:text-base",
            "m360-card-border shadow-[var(--elev-1)] hover:shadow-[var(--elev-2)]",
            "transition-all duration-300 ease-[var(--ease-soft)]",
          ].join(" ")}
        >
          Eu360
        </Link>
      </header>

      {/* Saudação */}
      <section className="mx-auto max-w-5xl px-5 pt-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-[var(--m360-navy)]">
          {greeting}, <span className="text-[var(--m360-navy)]">{displayName}</span> 👋
        </h1>
        <p className="mt-2 text-[color:var(--m360-navy)]/60 text-lg md:text-xl">
          Atalhos do dia
        </p>
      </section>

      <DailyMessage />

      {/* 👀 Visão rápida da semana (notas + progresso) */}
      <section className="mx-auto max-w-5xl px-5 mt-2">
        <PlannerNotesPeek />
      </section>

      {/* Planner semanal (componente anterior, mantido) */}
      <section className="mx-auto max-w-5xl px-5 pt-4">
        <PlannerWeekly />
      </section>

      {/* 🗓️ Planner semanal com notas + resumo do dia selecionado */}
      <section className="mx-auto max-w-5xl px-5 mt-4">
        <h2 className="text-lg font-semibold mb-2 text-[var(--m360-navy)]">
          Planner
        </h2>
        <PlannerWeeklyNotes />
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
        <div className="rounded-[var(--r-lg)] bg-[var(--m360-white)] m360-card-border shadow-[var(--elev-1)] p-5 md:p-6 m360-animate-in">
          <h2 className="text-xl md:text-2xl font-semibold text-[var(--m360-navy)]">
            Como você está hoje?
          </h2>
          <p className="mt-1 text-[color:var(--m360-navy)]/60 text-sm">
            Registre seu humor no Eu360
          </p>
          <div className="mt-4 flex items-center gap-3 md:gap-4">
            {["😞", "😐", "🙂", "😊", "🤩"].map((e) => (
              <span
                key={e}
                className="rounded-full bg-[var(--m360-white)] m360-card-border shadow-[var(--elev-1)] px-3 py-2 text-xl"
              >
                {e}
              </span>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/eu360"
              className={[
                "inline-flex items-center gap-2",
                "rounded-[var(--r-lg)] bg-[var(--m360-white)]",
                "m360-card-border px-4 py-2 text-sm",
                "shadow-[var(--elev-1)] hover:shadow-[var(--elev-2)]",
                "transition-all duration-300 ease-[var(--ease-soft)]",
              ].join(" ")}
            >
              Abrir Eu360 →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
