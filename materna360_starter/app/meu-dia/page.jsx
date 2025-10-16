// materna360_starter/app/meu-dia/page.jsx
"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ACTIVITIES } from "../../lib/activities";
import { addPlannerItem } from "../../lib/planner";
import { toast } from "../../lib/toast";

// ---- helpers ---------------------------------------------------------------

// saudação por horário
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

// índice determinístico por dia (para mensagem e atividade)
function indexByToday(len) {
  const d = new Date();
  const stamp = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  let hash = 0;
  for (let i = 0; i < stamp.length; i++) {
    hash = (hash * 31 + stamp.charCodeAt(i)) >>> 0;
  }
  return len ? hash % len : 0;
}

// mensagens curtas e acolhedoras (trocam 1x por dia, sem botão)
const DAILY_MESSAGES = [
  "Respire fundo. Você está fazendo o melhor que pode.",
  "Pequenos passos contam — celebre o que couber hoje.",
  "Pare por um minuto, beba água e sorria para si 💛",
  "Tudo bem ir devagar. Você não está sozinha.",
  "Seu carinho é o porto seguro da casa — inclusive o seu.",
];

export default function MeuDiaPage() {
  // mensagem do dia (determinística por data)
  const message = useMemo(() => {
    const i = indexByToday(DAILY_MESSAGES.length);
    return DAILY_MESSAGES[i];
  }, []);

  // “troca” de mensagem detectada 1x por dia → badge Organizada
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const key = "m360:lastMessageDate";
      const today = new Date().toDateString();
      const last = window.localStorage.getItem(key);
      if (last !== today) {
        window.localStorage.setItem(key, today);
        // badge por manter a rotina do dia “em dia”
        window.dispatchEvent(
          new CustomEvent("m360:win", {
            detail: { type: "badge", name: "Organizada" },
          })
        );
      }
    } catch {
      /* ignore */
    }
  }, []);

  // sugestão/atividade do dia com fallback
  const suggestion = useMemo(() => {
    const list = Array.isArray(ACTIVITIES) ? ACTIVITIES : [];
    if (!list.length) {
      return {
        slug: "atividade",
        title: "Atividade surpresa",
        subtitle: "Em breve traremos uma ideia especial para hoje.",
      };
    }
    return list[indexByToday(list.length)];
  }, []);

  function saveSuggestion() {
    addPlannerItem("filhos", suggestion.title);
    toast("Atividade salva no Planner 💾");
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Exploradora" },
        })
      );
    }
  }

  // ---- UI ------------------------------------------------------------------

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-soft to-white">
      {/* Topbar simples */}
      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
        <div className="text-sm font-medium text-brand-navy/70">
          Materna<strong className="text-brand">360</strong>
        </div>
        <Link
          href="/eu360"
          className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm"
        >
          Eu360
        </Link>
      </header>

      {/* Saudação + Mensagem do dia */}
      <section className="mx-auto max-w-5xl px-5 pt-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-brand-navy">
          {greeting()}, <span className="text-brand-navy">Simone</span> <span>👋</span>
        </h1>

        <div className="mt-4 rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4">
          <div className="text-xs uppercase tracking-wide text-brand-navy/50 mb-1">
            Mensagem do dia
          </div>
          <p className="text-brand-navy/80 text-base md:text-lg">{message}</p>
        </div>
      </section>

      {/* Atividade do Dia (destaque) */}
      <section className="mx-auto max-w-5xl px-5 pt-6">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5 md:p-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-brand-navy/50 mb-1">Atividade do dia</div>
            <h3 className="text-lg md:text-xl font-semibold text-brand-navy">
              {suggestion.title}
            </h3>
            {suggestion.subtitle && (
              <p className="text-sm md:text-base text-brand-navy/60 mt-1">
                {suggestion.subtitle}
              </p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href={`/brincar/${suggestion.slug}`}
              className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5 text-sm"
            >
              Detalhes
            </Link>
            <button
              onClick={saveSuggestion}
              className="rounded-xl px-3 py-1.5 text-sm text-white"
              style={{ backgroundColor: "#ff005e" }}
            >
              Salvar no Planner
            </button>
          </div>
        </div>
      </section>

      {/* Atalhos do dia */}
      <section className="mx-auto max-w-5xl px-5 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-28">
        <ShortcutCard
          emoji="🏠"
          title="Rotina da Casa"
          subtitle="Organizar tarefas"
          href="/meu-dia/rotina"
        />
        <ShortcutCard
          emoji="💕"
          title="Tempo com Meu Filho"
          subtitle="Registrar momentos"
          href="/meu-dia/momentos"
        />
        <ShortcutCard
          emoji="🎨"
          title="Atividade do Dia"
          subtitle="Brincadeira educativa"
          href="/brincar"
        />
        <ShortcutCard
          emoji="✅"
          title="Checklist do Dia"
          subtitle="Microtarefas rápidas"
          href="/meu-dia/checklist"
        />
      </section>
    </main>
  );
}

// --- pequenos componentes locais -------------------------------------------

function ShortcutCard({ emoji, title, subtitle, href }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl bg-white ring-1 ring-black/5 shadow-sm hover:shadow-md transition-shadow p-5 md:p-6"
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
