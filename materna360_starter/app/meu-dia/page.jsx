// materna360_starter/app/meu-dia/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppBar from "../../components/AppBar";
import GlassCard from "../../components/GlassCard";
import { get, set, keys } from "../../lib/storage";

// (opcional) tenta importar a lista de mensagens se existir
let EXTERNAL_MESSAGES = null;
try {
  // se você já criou ../../lib/messages.js exportando MESSAGES, usamos aqui:
  // export const MESSAGES = [{ quote, author }, ...]
  EXTERNAL_MESSAGES = require("../../lib/messages").MESSAGES || null;
} catch (_) {
  EXTERNAL_MESSAGES = null;
}

const FALLBACK_MESSAGES = [
  { quote: "Você é a melhor mãe para o seu filho 💛", author: "Materna360" },
  { quote: "Pequenos passos também são progresso.", author: "Materna360" },
  { quote: "Respire fundo. Você não está sozinha.", author: "Materna360" },
  { quote: "Rotina leve, um dia de cada vez.", author: "Materna360" },
];

const MESSAGES = Array.isArray(EXTERNAL_MESSAGES) && EXTERNAL_MESSAGES.length
  ? EXTERNAL_MESSAGES
  : FALLBACK_MESSAGES;

function startOfDayStr(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString(); // comparável como string
}

function Greeting() {
  const text = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);
  return (
    <div className="mb-2">
      <h1 className="text-2xl font-semibold">Meu Dia</h1>
      <p className="text-sm opacity-70">{text}, Mãe 💛</p>
    </div>
  );
}

/** Mensagem do Dia — muda sozinha a cada 24h */
function MessageOfDay() {
  const [msg, setMsg] = useState(MESSAGES[0]);

  useEffect(() => {
    const k = keys.motd || "m360:motd";
    const today = startOfDayStr();
    const saved = get(k, null);

    // estrutura salva: { idx: number, date: string(iso-start-of-day) }
    if (!saved) {
      const first = { idx: 0, date: today };
      set(k, first);
      setMsg(MESSAGES[0]);
      return;
    }

    const isSameDay = saved.date === today;
    if (isSameDay) {
      setMsg(MESSAGES[saved.idx % MESSAGES.length]);
      return;
    }

    // novo dia → avança índice, salva, dispara badge + toast
    const next = { idx: (Number(saved.idx || 0) + 1) % MESSAGES.length, date: today };
    set(k, next);
    setMsg(MESSAGES[next.idx]);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Organizada" },
        })
      );
      window.dispatchEvent(
        new CustomEvent("m360:toast", {
          detail: { message: "Nova Mensagem do Dia ✨" },
        })
      );
    }
  }, []);

  return (
    <GlassCard className="p-4 bg-white/90">
      <div className="text-xs uppercase tracking-wide opacity-60">Mensagem do Dia</div>
      <blockquote className="mt-2 text-lg leading-snug">
        “{msg?.quote}”
      </blockquote>
      {msg?.author && (
        <div className="mt-1 text-sm opacity-60">— {msg.author}</div>
      )}
      <p className="mt-3 text-xs opacity-50">
        Atualiza automaticamente a cada novo dia.
      </p>
    </GlassCard>
  );
}

/** Preview do Planner (progresso simples) */
function PlannerPreview() {
  const [progress, setProgress] = useState({ done: 0, total: 0, pct: 0 });

  useEffect(() => {
    const k = keys.planner || "m360:planner";
    const p = get(k, { casa: [], filhos: [], eu: [] });

    const all = [
      ...(Array.isArray(p.casa) ? p.casa : []),
      ...(Array.isArray(p.filhos) ? p.filhos : []),
      ...(Array.isArray(p.eu) ? p.eu : []),
    ];
    const total = all.length;
    const done = all.filter((i) => !!i.done).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    setProgress({ done, total, pct });
  }, []);

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">Planner da Família</div>
          <div className="text-sm opacity-70">
            {progress.total ? `${progress.done}/${progress.total} concluídos` : "Sem itens ainda"}
          </div>
        </div>
        <Link href="/meu-dia/planner" className="btn btn-primary">Abrir</Link>
      </div>

      <div className="mt-3 w-full h-2 rounded-full bg-black/5 overflow-hidden">
        <div
          className="h-2 bg-[var(--brand)] transition-all"
          style={{ width: `${progress.pct}%` }}
        />
      </div>
    </GlassCard>
  );
}

/** Card de Checklist com % do dia (se existir algo no storage) */
function ChecklistCard() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    // formato livre — tentamos dois jeitos comuns
    const kDay = (keys.checklistToday || "m360:checklist:today");
    const kLogs = (keys.checklist || "m360:checklist");

    let total = 0, done = 0;

    const today = get(kDay, null);
    if (today && Array.isArray(today.items)) {
      total = today.items.length;
      done = today.items.filter((i) => !!i.done).length;
    } else {
      // fallback genérico
      const arr = get(kLogs, []);
      if (Array.isArray(arr) && arr.length) {
        const last = arr[arr.length - 1];
        if (last && Array.isArray(last.items)) {
          total = last.items.length;
          done = last.items.filter((i) => !!i.done).length;
        }
      }
    }

    setPct(total ? Math.round((done / total) * 100) : 0);
  }, []);

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">Checklist do Dia</div>
          <div className="text-sm opacity-70">{pct}% concluído</div>
        </div>
        <Link href="/meu-dia/checklist" className="btn bg-white border border-slate-200">
          Abrir
        </Link>
      </div>
      <div className="mt-3 w-full h-2 rounded-full bg-black/5 overflow-hidden">
        <div
          className="h-2 bg-[var(--brand-ink)]/80 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </GlassCard>
  );
}

function HomeCard({ emoji, title, subtitle, href }) {
  return (
    <Link href={href} className="card block">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{emoji}</div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="subtitle">{subtitle}</div>
        </div>
      </div>
    </Link>
  );
}

export default function MeuDiaPage() {
  return (
    <main className="max-w-5xl mx-auto px-5 pb-24">
      <AppBar title="Meu Dia" />

      {/* Saudação */}
      <section className="mt-4">
        <Greeting />
      </section>

      {/* Mensagem do Dia (auto-24h) */}
      <section className="mt-3">
        <MessageOfDay />
      </section>

      {/* Atalhos principais */}
      <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <HomeCard
          emoji="🏠"
          title="Rotina da Casa"
          subtitle="Organizar tarefas"
          href="/meu-dia/rotina"
        />
        <HomeCard
          emoji="💕"
          title="Tempo com Meu Filho"
          subtitle="Registrar momentos"
          href="/meu-dia/momentos"
        />
        <HomeCard
          emoji="🎨"
          title="Atividade do Dia"
          subtitle="Brincadeira educativa"
          href="/meu-dia/atividade"
        />
        <HomeCard
          emoji="🌿"
          title="Momento para Mim"
          subtitle="Pausa e autocuidado"
          href="/meu-dia/pausas"
        />
      </section>

      {/* Planner + Checklist */}
      <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <PlannerPreview />
        <ChecklistCard />
      </section>
    </main>
  );
}
