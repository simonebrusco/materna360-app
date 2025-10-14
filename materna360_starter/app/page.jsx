'use client';

import { motion } from "framer-motion";
import DailyMessage from "@/components/DailyMessage";
import GlassCard from "@/components/GlassCard";
import ActionCard from "@/components/ActionCard";
import Goal from "@/components/Goal";

export default function TodayPage() {
  const name = "Simone";
  const quote = {
    text: "Pequenos gestos diários constroem grandes memórias.",
    author: "Materna360",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-neutral-900">
      {/* App bar */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-rose-500 grid place-items-center text-white font-bold shadow-sm">M</div>
            <span className="font-semibold tracking-tight">Materna360</span>
          </div>
          <button className="text-sm rounded-full px-3 py-1 bg-neutral-100 hover:bg-neutral-200 transition">Perfil</button>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="mx-auto max-w-md px-4 py-6 space-y-16">
        {/* Saudação + Mensagem do dia */}
        <section className="space-y-4">
          <div>
            <p className="text-sm text-neutral-500">Hoje</p>
            <h1 className="text-2xl font-semibold">Olá, {name} 👋</h1>
          </div>

          <GlassCard className="p-4 border-orange-200/70">
            <DailyMessage text={quote.text} author={quote.author} />
          </GlassCard>
        </section>

        {/* Quatro cards (2x2) */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Atalhos do dia</h2>
          <div className="grid grid-cols-2 gap-3">
            <ActionCard icon="🏠" title="Rotina da Casa" subtitle="Organizar tarefas" />
            <ActionCard icon="💕" title="Tempo com Meu Filho" subtitle="Registre momentos" />
            <ActionCard icon="🎨" title="Atividade do Dia" subtitle="Brincadeira educativa" highlight />
            <ActionCard icon="🌿" title="Momento para Mim" subtitle="Pausa e autocuidado" />
          </div>
        </section>

        {/* Progresso + Planner 7 dias */}
        <section className="space-y-5">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Seu Progresso</h3>
              <span className="text-sm text-neutral-500">Hoje</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-neutral-200">
              <div className="h-2 w-2/3 rounded-full bg-violet-500" />
            </div>
            <p className="mt-2 text-sm text-neutral-600">2 de 3 metas concluídas</p>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Planner da Semana</h3>
              <button className="text-xs underline">Ver tudo</button>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2 text-center">
              {["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => (
                <div key={i} className="py-2 rounded-xl border border-neutral-200/70 bg-neutral-50 text-sm">
                  <div className="font-medium">{d}</div>
                  <div className="text-[11px] text-neutral-500">{10 + i} / 06</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Metas (3 corações) + Bem-estar */}
        <section className="space-y-5">
          <GlassCard className="p-4">
            <h3 className="font-medium mb-3">Minhas Metas de Hoje</h3>
            <div className="flex items-center gap-3">
              <Goal label="Beber água" done />
              <Goal label="Brincar 15 min" done />
              <Goal label="Respirar 2 min" />
            </div>
          </GlassCard>

          <GlassCard className="p-4 bg-violet-50/70 border-violet-200/70">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🙂</span>
              <div>
                <h3 className="font-medium">Como você está hoje?</h3>
                <p className="text-sm text-violet-900/80 mt-1">Faça um check-in rápido do seu humor</p>
                <div className="mt-3 flex gap-2 text-2xl">
                  {"😞😐🙂😊🤩".split("")?.map((m, i) => (
                    <motion.button
                      key={i}
                      className="hover:scale-110 active:scale-95 transition-transform"
                      whileTap={{ scale: 0.9 }}
                      aria-label={`mood-${i}`}
                    >
                      {m}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Bottom nav */}
        <nav className="sticky bottom-4 mx-auto max-w-md">
          <div className="mx-4 rounded-2xl bg-white/90 backdrop-blur border border-neutral-200 shadow-xl">
            <ul className="grid grid-cols-4 text-center text-sm">
              {[
                { label: "Hoje", icon: "🏡" },
                { label: "Atividades", icon: "🎯" },
                { label: "Bem-Estar", icon: "🧘" },
                { label: "Perfil", icon: "👤" },
              ].map((t, i) => (
                <li key={i} className="py-3 flex flex-col items-center gap-1">
                  <span className="text-lg">{t.icon}</span>
                  <span className={`text-[11px] ${i === 0 ? "font-medium" : "text-neutral-500"}`}>{t.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="h-2" />
      </div>
    </div>
  );
}
