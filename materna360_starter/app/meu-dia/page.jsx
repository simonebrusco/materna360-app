// materna360_starter/app/meu-dia/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppBar from "../../components/AppBar.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import QuickNote from "../../components/QuickNote.jsx";
import { addPlannerItem } from "../../lib/planner.js";
import { get, set, keys } from "../../lib/storage.js";

// ===================== helpers ======================
const MESSAGES = [
  "Respire fundo. Você está fazendo o seu melhor 💛",
  "Tudo bem desacelerar hoje — gentileza com você.",
  "Pequenos passos contam muito. Valorize-se.",
  "O seu cuidado também é prioridade. Você merece.",
  "Um momento de presença transforma o dia ✨",
];

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function useMessageOfDay() {
  const [msg, setMsg] = useState(MESSAGES[0]);

  useEffect(() => {
    const saved = get("m360:message_of_day", null);
    const t = todayStr();

    if (!saved) {
      const idx = 0;
      set("m360:message_of_day", { idx, date: t });
      setMsg(MESSAGES[idx]);
      return;
    }
    if (saved.date !== t) {
      const idx = (Number(saved.idx) + 1) % MESSAGES.length;
      set("m360:message_of_day", { idx, date: t });
      setMsg(MESSAGES[idx]);

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("m360:win", {
            detail: { type: "badge", name: "Organizada" },
          })
        );
        window.dispatchEvent(
          new CustomEvent("m360:toast", {
            detail: { message: "Nova Mensagem do Dia 💫" },
          })
        );
      }
    } else {
      setMsg(MESSAGES[Number(saved.idx) || 0]);
    }
  }, []);

  return msg;
}

function usePlannerProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const p = get(keys.planner, { casa: [], filhos: [], eu: [] });
    const all = [...(p.casa || []), ...(p.filhos || []), ...(p.eu || [])];
    if (!all.length) {
      setProgress(0);
      return;
    }
    const done = all.filter((i) => i && i.done).length;
    setProgress(Math.round((done / all.length) * 100));
  }, []);

  return progress;
}

// cria/usa defs padrão (3–5 itens) e calcula progresso de hoje
function useChecklistToday() {
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const defsKey = "m360:checklist_defs";
    const tid = `m360:checklist_log:${todayStr()}`;

    // se não houver defs, semeia 5 sugestões
    const DEFAULT_ITEMS = [
      { id: "agua", title: "Beber água 6–8 copos" },
      { id: "respirar", title: "1 min de respiração" },
      { id: "momento-filho", title: "Um momento com meu filho" },
      { id: "movimento", title: "5 min de alongamento" },
      { id: "gentileza", title: "Uma gentileza comigo" },
    ];
    const defs = get(defsKey, null);
    if (!defs || !Array.isArray(defs) || defs.length === 0) {
      set(defsKey, DEFAULT_ITEMS);
      setTotal(DEFAULT_ITEMS.length);
    } else {
      setTotal(defs.length);
    }

    const log = get(tid, null);
    if (!log || !Array.isArray(log)) {
      set(tid, []);
      setCount(0);
    } else {
      setCount(log.length);
    }
  }, []);

  const percent = total ? Math.round((count / total) * 100) : 0;
  return { total, count, percent };
}

// ===================== page ======================
export default function MeuDiaPage() {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const message = useMessageOfDay();
  const plannerProgress = usePlannerProgress();
  const checklist = useChecklistToday();

  // FAB Anotar
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteType, setNoteType] = useState("casa");

  function handleSaveNote(text) {
    const value = (text || "").trim();
    if (!value) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("m360:toast", { detail: { message: "Escreva algo para salvar ✍️" } })
        );
      }
      return;
    }
    addPlannerItem(noteType, value);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:toast", {
          detail: { message: `Anotado no Planner (${noteType[0].toUpperCase() + noteType.slice(1)}) 💾` },
        })
      );
      window.dispatchEvent(
        new CustomEvent("m360:win", { detail: { type: "badge", name: "Organizada" } })
      );
    }
    setNoteOpen(false);
  }

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <AppBar title="Meu Dia" />

      {/* Saudação + Mensagem do Dia */}
      <section className="mt-2">
        <h1 className="text-[22px] font-semibold">
          {greeting}, Mãe 💛
        </h1>

        <GlassCard className="p-5 mt-3 bg-[var(--brand)]/7 ring-[var(--brand)]/10">
          <div className="text-[13px] text-[var(--brand-navy-t60)] mb-1">Mensagem do Dia</div>
          <p className="text-base leading-relaxed">{message}</p>
          <p className="text-[12px] text-[var(--brand-navy-t60)] mt-2">Gira automaticamente a cada 24h.</p>
        </GlassCard>
      </section>

      {/* Atalhos principais */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <Link href="/meu-dia/rotina" className="block">
          <GlassCard className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🏠</div>
              <div>
                <div className="font-semibold">Rotina da Casa</div>
                <p className="subtitle mt-0.5">Organizar tarefas e micro-rotinas</p>
              </div>
            </div>
          </GlassCard>
        </Link>

        <Link href="/meu-dia/momentos" className="block">
          <GlassCard className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💕</div>
              <div>
                <div className="font-semibold">Tempo com Meu Filho</div>
                <p className="subtitle mt-0.5">Registrar momentos especiais</p>
              </div>
            </div>
          </GlassCard>
        </Link>

        <Link href="/meu-dia/atividade" className="block">
          <GlassCard className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎨</div>
              <div>
                <div className="font-semibold">Atividade do Dia</div>
                <p className="subtitle mt-0.5">Sugestão automática para hoje</p>
              </div>
            </div>
          </GlassCard>
        </Link>

        <Link href="/meu-dia/pausas" className="block">
          <GlassCard className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🌿</div>
              <div>
                <div className="font-semibold">Momento para Mim</div>
                <p className="subtitle mt-0.5">Pausas, afirmações e autocuidado</p>
              </div>
            </div>
          </GlassCard>
        </Link>
      </section>

      {/* Planner + Checklist */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <Link href="/meu-dia/planner" className="block">
          <GlassCard className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Planner da Família</div>
                <p className="subtitle mt-0.5">Casa | Filhos | Eu</p>
              </div>
              <div className="text-sm font-medium">{plannerProgress}%</div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-black/5 overflow-hidden">
              <div
                className="h-full bg-[var(--brand)] rounded-full transition-[width]"
                style={{ width: `${plannerProgress}%` }}
              />
            </div>
          </GlassCard>
        </Link>

        <Link href="/meu-dia/checklist" className="block">
          <GlassCard className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Checklist do Dia</div>
                <p className="subtitle mt-0.5">
                  {checklist.count}/{checklist.total} — {checklist.percent}%
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-black/5 overflow-hidden">
              <div
                className="h-full bg-[var(--brand)] rounded-full transition-[width]"
                style={{ width: `${checklist.percent}%` }}
              />
            </div>
          </GlassCard>
        </Link>
      </section>

      {/* FAB “＋ Anotar” */}
      <button
        onClick={() => setNoteOpen(true)}
        aria-label="Adicionar anotação"
        className="fixed right-5 bottom-24 z-[60] rounded-full shadow-lg h-14 w-14 text-2xl
                   bg-[var(--brand)] text-white hover:scale-105 active:scale-95 transition grid place-items-center"
      >
        ＋
      </button>

      {/* Seletor de destino */}
      {noteOpen && (
        <div className="fixed bottom-[140px] left-1/2 -translate-x-1/2 z-[65]">
          <div className="rounded-full bg-white/95 ring-1 ring-black/5 shadow-lg px-2 py-1 flex gap-1">
            {[
              { id: "casa", label: "Casa" },
              { id: "filhos", label: "Filhos" },
              { id: "eu", label: "Eu" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setNoteType(opt.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  noteType === opt.id
                    ? "bg-[var(--brand)] text-white"
                    : "bg-transparent text-[var(--brand-navy)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Composer da nota */}
      {noteOpen && (
        <QuickNote
          title={`Nova anotação — ${noteType[0].toUpperCase() + noteType.slice(1)}`}
          placeholder={
            noteType === "casa"
              ? "Ex.: lavar uniforme, separar lixo reciclável…"
              : noteType === "filhos"
              ? "Ex.: preparar caixa sensorial, atividade de pintura…"
              : "Ex.: 10 min de respiração, alongar, beber água…"
          }
          confirmLabel="Salvar no Planner"
          onSave={handleSaveNote}
          onClose={() => setNoteOpen(false)}
        />
      )}
    </main>
  );
}
