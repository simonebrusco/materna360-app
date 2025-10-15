'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import DailyMessage from "@/components/DailyMessage";
import GlassCard from "@/components/GlassCard";
import ActionCard from "@/components/ActionCard";
import Goal from "@/components/Goal";

export default function TodayPage() {
  const name = "Simone";

  // Mensagem do dia (fallback até carregar)
  const [quote, setQuote] = useState({
    text: "Pequenos gestos diários constroem grandes memórias.",
    author: "Materna360",
  });

  // Atalhos e metas (dinâmicos)
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    async function loadAll() {
      const now = new Date().toISOString();

      // Daily quote
      const { data: q, error: qErr } = await supabase
        .from("daily_quotes")
        .select("text, author, starts_at")
        .lte("starts_at", now)
        .gte("ends_at", now)
        .order("starts_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!qErr && q) setQuote({ text: q.text, author: q.author || "Materna360" });

      // Activities
      const { data: acts, error: aErr } = await supabase
        .from("activities")
        .select("title, subtitle, icon, highlight, sort")
        .order("sort", { ascending: true });
      if (!aErr && acts) setActivities(acts);

      // Goals
      const { data: g, error: gErr } = await supabase
        .from("goals")
        .select("label, sort")
        .order("sort", { ascending: true });
      if (!gErr && g) setGoals(g);
    }

    loadAll();
  }, []);

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

        {/* Quatro cards (2x2) dinâmicos */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Atalhos do dia</h2>
          <div className="grid grid-cols-2 gap-3">
            {(activities.length ? activities : [
              { title: "Rotina da Casa", subtitle: "Organizar tarefas", icon: "🏠", highlight: false },
              { title: "Tempo com Meu Filho", subtitle: "Registre momentos", icon: "💕", highlight: false },
              { title: "Atividade do Dia", subtitle: "Brincadeira educativa", icon: "🎨", highlight: true },
              { title: "Momento para Mim", subtitle: "Pausa e autocuidado", icon: "🌿", highlight: false },
            ]).map((a, i) => (
              <ActionCard
                key={i}
                icon={a.icon || "✨"}
                title={a.title}
                subtitle={a.subtitle || ""}
                highlight={!!a.highlight}
              />
            ))}
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

        {/* Metas (dinâmico) + Bem-estar */}
        <section className="space-y-5">
          <GlassCard className="p-4">
            <h3 className="font-medium mb-3">Minhas Metas de Hoje</h3>
            <div className="flex items-center gap-3">
              {(goals.length ? goals : [
                { label: "Beber água" },
                { label: "Brincar 15 min" },
                { label: "Respirar 2 min" },
              ]).map((g, i) => (
                <Goal key={i} label={g.label} done={i < 2} />
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-4 bg-brand-secondary/50 border-brand-secondary/70">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🙂</span>
              <div>
                <h3 className="font-medium">Como você está hoje?</h3>
                <p className="text-sm text-brand-slate mt-1">Faça um check-in rápido do seu humor</p>
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
          <div className="mx-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-white/60 shadow-soft">
            <ul className="grid grid-cols-4 text-center text-sm">
              {[
                { label: "Hoje", icon: "🏡" },
                { label: "Atividades", icon: "🎯" },
                { label: "Bem-Estar", icon: "🧘" },
                { label: "Perfil", icon: "👤" },
              ].map((t, i) => (
                <li key={i} className="py-3 flex flex-col items-center gap-1">
                  <span className="text-lg">{t.icon}</span>
                  <span className={`text-[11px] ${i === 0 ? "font-medium" : "text-brand-slate"}`}>{t.label}</span>
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
