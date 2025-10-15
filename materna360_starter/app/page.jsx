// materna360_starter/app/page.jsx
'use client';
export const revalidate = 0; // número (0, 60, ...) — nunca objeto

import Link from 'next/link';
import { useState } from 'react';

import DailyMessage from '@/components/DailyMessage';
import GlassCard from '@/components/GlassCard';
import CheckinCard from '@/components/CheckinCard';

export default function TodayPage() {
  const name = 'Simone';
  const [showShortcuts] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-secondary/40 via-white to-white text-brand-ink">
      <div className="mx-auto max-w-md px-4 py-5">
        {/* Cabeçalho */}
        <header className="mb-4">
          <p className="text-sm text-brand-ink/70">Hoje</p>
          <h1 className="text-3xl font-semibold">
            Olá, {name} <span className="inline-block">👋</span>
          </h1>
        </header>

        {/* Mensagem do Dia */}
        <GlassCard className="mb-5">
          <DailyMessage />
        </GlassCard>

        {/* Check-in empático */}
        <CheckinCard />

        {/* Atalhos do dia (fixos) */}
        {showShortcuts && (
          <>
            <h2 className="mt-6 mb-2 text-lg font-semibold">Atalhos do dia</h2>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/brincar" className="no-underline">
                <GlassCard className="p-4 hover:shadow-brand transition-shadow">
                  <div className="text-2xl">🏠</div>
                  <div className="mt-2 font-semibold">Rotina da Casa</div>
                  <div className="text-sm text-brand-ink/70">Organizar tarefas</div>
                </GlassCard>
              </Link>

              <Link href="/brincar/moments" className="no-underline">
                <GlassCard className="p-4 hover:shadow-brand transition-shadow">
                  <div className="text-2xl">💕</div>
                  <div className="mt-2 font-semibold">Tempo com Meu Filho</div>
                  <div className="text-sm text-brand-ink/70">Registrar momentos</div>
                </GlassCard>
              </Link>

              <Link href="/brincar" className="no-underline">
                <GlassCard className="p-4 hover:shadow-brand transition-shadow">
                  <div className="text-2xl">🎨</div>
                  <div className="mt-2 font-semibold">Atividade do Dia</div>
                  <div className="text-sm text-brand-ink/70">Brincadeira educativa</div>
                </GlassCard>
              </Link>

              <Link href="/cuidar" className="no-underline">
                <GlassCard className="p-4 hover:shadow-brand transition-shadow">
                  <div className="text-2xl">🌿</div>
                  <div className="mt-2 font-semibold">Momento para Mim</div>
                  <div className="text-sm text-brand-ink/70">Pausa e autocuidado</div>
                </GlassCard>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
