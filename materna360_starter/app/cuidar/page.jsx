'use client';
import Link from "next/link";
import AppBar from "@/components/AppBar";
import BottomNav from "@/components/BottomNav";
import GlassCard from "@/components/GlassCard";

export default function CuidarPage() {
  return (
    <main className="mx-auto max-w-md">
      <AppBar title="Cuidar" backHref="/" />

      <div className="px-4 py-6 space-y-4">
        <h1 className="text-2xl font-semibold">Cuidar</h1>
        <p className="text-brand-slate">Pausas rápidas e rotinas leves para você.</p>

        {/* CODEX:programs:entrypoint:start */}
        <Link
          href="/programas"
          className="block rounded-2xl border border-brand-secondary/60 bg-gradient-to-r from-brand-primary/10 via-white to-brand-secondary/10 p-4 shadow-soft transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">
              🗓️
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-ink">Programas 7D</p>
              <p className="text-xs text-brand-slate">
                Jornadas guiadas com áudios, atividades e micro-ações por 7 dias.
              </p>
            </div>
          </div>
        </Link>
        {/* CODEX:programs:entrypoint:end */}

        <div className="space-y-3">
          <GlassCard className="p-4">
            <h3 className="font-medium">Manhã tranquila (3–5 min)</h3>
            <p className="text-sm text-brand-slate mt-1">
              Respiração 4–4, uma afirmação e um gesto de autocuidado.
            </p>
            <div className="mt-3">
              <a href="#" className="text-sm underline text-brand-ink">Iniciar agora</a>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <h3 className="font-medium">Pausa do meio-dia (3–5 min)</h3>
            <p className="text-sm text-brand-slate mt-1">
              Soltar ombros, mini-alongamento e 1 ideia leve de descanso mental.
            </p>
            <div className="mt-3">
              <a href="#" className="text-sm underline text-brand-ink">Iniciar agora</a>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <h3 className="font-medium">Antes de dormir (3–5 min)</h3>
            <p className="text-sm text-brand-slate mt-1">
              Respiração lenta + frase de fechamento do dia.
            </p>
            <div className="mt-3">
              <a href="#" className="text-sm underline text-brand-ink">Iniciar agora</a>
            </div>
          </GlassCard>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
