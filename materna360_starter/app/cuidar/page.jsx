'use client';
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
