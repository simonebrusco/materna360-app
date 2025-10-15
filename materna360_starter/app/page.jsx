'use client';
 
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getSuggestedActivity } from "@/lib/activities";
import DailyMessage from "@/components/DailyMessage";
import GlassCard from "@/components/GlassCard";
import ActionCard from "@/components/ActionCard";
import Goal from "@/components/Goal";
import CheckinCard from "@/components/CheckinCard";

export default function TodayPage() {
  const name = "Simone";

  // ---------------- estados ----------------
  const [quote, setQuote] = useState({
    text: "Pequenos gestos diários constroem grandes memórias.",
    author: "Materna360",
  });
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [suggestion, setSuggestion] = useState(null);

  // --------------- carregar dados ---------------
  useEffect(() => {
    async function loadAll() {
      const now = new Date().toISOString();

      // Mensagem do dia ativa
      const { data: q } = await supabase
        .from("daily_quotes")
        .select("text, author, starts_at, ends_at")
        .lte("starts_at", now)
        .gte("ends_at", now)
        .order("starts_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (q) setQuote({ text: q.text, author: q.author || "Materna360" });

      // Atalhos
      const { data: acts, error: actsError } = await supabase
        .from("activities")
        .select("title, subtitle, icon, highlight, sort, href")
        .order("sort", { ascending: true });
      if (!actsError && acts) setActivities(acts);

      // Metas
      const { data: g } = await supabase
        .from("goals")
        .select("label, sort")
        .order("sort", { ascending: true });
      if (g) setGoals(g);

      const { data: suggestionData } = await getSuggestedActivity();
      if (suggestionData) setSuggestion(suggestionData);
    }
    loadAll();
  }, []);

  // --------------- fallbacks (segurança) ---------------
  const fallbackActivities = [
    { title: "Rotina da Casa",      subtitle: "Organizar tarefas",      icon: "🏠", highlight: false, href: "/brincar" },
    { title: "Tempo com Meu Filho", subtitle: "Registrar momentos",     icon: "💕", highlight: false, href: "/brincar" },
    { title: "Atividade do Dia",    subtitle: "Brincadeira educativa",  icon: "🎨", highlight: true,  href: "/brincar" },
    { title: "Momento para Mim",    subtitle: "Pausa e autocuidado",    icon: "🌿", highlight: false, href: "/cuidar" },
  ];
  const safeActivities = activities?.length ? activities : fallbackActivities;
  const resolveHref = (activity) => {
    if (activity?.href) return activity.href;

    const title = activity?.title ?? "";
    if (/atividade do dia/i.test(title) || /brincar/i.test(title)) {
      return "/brincar";
    }
    if (/cuidar/i.test(title) || /autocuidado/i.test(title)) {
      return "/cuidar";
    }

    return "/brincar";
  };

  const fallbackGoals = [
    { label: "Beber água" },
    { label: "Brincar 15 min" },
    { label: "Respirar 2 min" },
  ];
  const safeGoals = goals?.length ? goals : fallbackGoals;

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-secondary via-white to-white text-brand-ink">
      {/* App bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xs border-b border-white/60">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-header.png"
              alt="Materna360"
              width={112}
              height={28}
              className="h-7 w-auto"
              priority
            />
          </div>
          <a
            href="/eu360"
            className="text-sm rounded-full px-3 py-1 bg-white border border-brand-secondary/60 text-brand-slate hover:bg-brand-secondary/40 transition"
          >
            Eu360
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 py-6 space-y-16">
        {/* Saudação */}
        <section className="space-y-1">
          <p className="text-sm text-brand-slate">Hoje</p>
          <h1 className="text-2xl font-semibold">Olá, {name} 👋</h1>
        </section>

        {/* Sugestão do dia */}
        {suggestion && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Sugestão do dia</h2>
            <GlassCard className="flex items-center justify-between gap-4 border-white/70 bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl" aria-hidden>
                  {suggestion.emoji || "🎯"}
                </span>
                <div>
                  <p className="text-sm text-brand-slate">Uma brincadeira para agora</p>
                  <h3 className="text-base font-semibold text-brand-ink">{suggestion.title}</h3>
                </div>
              </div>
              <a
                href="/brincar"
                className="text-sm font-medium text-brand-primary underline-offset-2 hover:underline"
              >
                Ver detalhes
              </a>
            </GlassCard>
          </section>
        )}

        {/* Atalhos */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Atalhos do dia</h2>
          <div className="grid grid-cols-2 gap-3">
            {safeActivities.map((a, i) => (
              <ActionCard
                key={i}
                icon={a.icon || "✨"}
                title={a.title}
                subtitle={a.subtitle || ""}
                highlight={!!a.highlight}
                href={resolveHref(a)}
              />
            ))}
          </div>
        </section>

        {/* // CODEx:checkin:start */}
        <section id="checkin" className="mt-2">
          <CheckinCard />
        </section>
        {/* // CODEx:checkin:end */}

        {/* Mensagem do dia */}
        <section className="space-y-4">
          <GlassCard className="p-4 bg-white border-white/70">
            <DailyMessage text={quote.text} author={quote.author} />
          </GlassCard>
        </section>

        {/* Progresso + Planner */}
        <section className="space-y-5">
          <GlassCard className="p-4 bg-white border-white/70">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Seu Progresso</h3>
              <span className="text-sm text-brand-slate">Hoje</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-brand-secondary/60">
              <div className="h-2 w-2/3 rounded-full bg-brand-primary" />
            </div>
            <p className="mt-2 text-sm text-brand-slate">2 de 3 metas concluídas</p>
          </GlassCard>

          <GlassCard className="p-4 bg-white border-white/70">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                <Link
                  href="/eu360"
                  className="text-brand-ink transition hover:text-brand-primary"
                >
                  Planner da Família
                </Link>
              </h3>
              <a href="/eu360" className="text-xs underline text-brand-slate">Abrir</a>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2 text-center">
              {["S","T","Q","Q","S","S","D"].map((d, i) => (
                <div key={i} className="py-2 rounded-xl border border-brand-secondary/60 bg-white text-sm">
                  <div className="font-medium">{d}</div>
                  <div className="text-[11px] text-brand-slate">{10 + i} / 06</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Metas */}
        <section className="space-y-5">
          <GlassCard className="p-4 bg-white border-white/70">
            <h3 className="font-medium mb-3">Minhas Metas de Hoje</h3>
            <div className="flex items-center gap-3">
              {(safeGoals).map((g, i) => (
                <Goal key={i} label={g.label} done={i < 2} />
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Bottom nav */}
        <nav className="sticky bottom-4 mx-auto max-w-md">
          <div className="mx-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-white/60 shadow-soft">
            <ul className="grid grid-cols-4 text-center text-sm">
              {[
                { label: "Meu Dia",  icon: "🏡", href: "/" },
                { label: "Brincar",  icon: "🎯", href: "/brincar" },
                { label: "Cuidar",   icon: "🧘", href: "/cuidar" },
                { label: "Eu360",    icon: "👤", href: "/eu360" },
              ].map((t, i) => (
                <li key={i} className="py-3 flex flex-col items-center gap-1">
                  <a href={t.href} className="text-lg">{t.icon}</a>
                  <span className={`text-[11px] ${i === 0 ? "font-medium" : "text-brand-slate"}`}>
                    {t.label}
                  </span>
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
