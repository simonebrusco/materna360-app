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
    <div className="min-h-screen bg-gradient-to-b from-brand-secondary via-white to-white text-brand-ink">
      {/* App bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xs border-b border-white/60">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo-header.png" alt="Materna360" className="h-7 w-auto" />
          </div>
          <button className="text-sm rounded-full px-3 py-1 bg-white border border-brand-secondary/60 text-brand-slate hover:bg-brand-secondary/40 transition">
            Perfil
          </button>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="mx-auto max-w-md px-4 py-6 space-y-16">
        {/* Saudação + Mensagem do dia */}
        <section className="space-y-4">
          <div>
            <p className="text-sm text-brand-slate">Hoje</p>
            <h1 className="text-2xl font-semibold">Olá, {name} 👋</h1>
          </div>

          <GlassCard className="p-4 border-brand-primary/40">
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
              <span className="text-sm text-brand-slate">Hoje</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-brand-secondary/60">
              <div className="h-2 w-2/3 rounded-full bg-brand-primary" />
            </div>
            <p className="mt-2 text-sm text-brand-slate">2 de 3 metas concluídas</p>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Planner da Semana</h3>
              <button className="text-xs underline text-brand-slate">Ver tudo</button>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2 text-center">
              {["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => (
                <div key={i} className="py-2 rounded-xl border border-brand-secondary/60 bg-white text-sm">
                  <div className="font-medium">{d}</div>
                  <div className="text-[11px] text-brand-slate">{10 + i} / 06</div>
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

          <GlassCard className="p-4 bg-brand-secondary/50 border-brand-secondary/70">
            <div className="flex items-start gap-3
