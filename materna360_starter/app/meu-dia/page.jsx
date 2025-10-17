// materna360_starter/app/meu-dia/page.jsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { get } from "../../lib/storage.js";
import ChecklistEditorModal from "../../components/ChecklistEditorModal.jsx";

// helpers locais para ler o log de hoje
function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
const tid = () => `m360:checklist_log:${todayStr()}`;

export default function MeuDiaPage() {
  // estado do editor (modal)
  const [openChecklistEditor, setOpenChecklistEditor] = useState(false);

  // defs e log do dia (armazenamento local – tolerante a SSR)
  const defs = get("m360:checklist_defs", []);
  const done = get(tid(), []);

  // percentual concluído do dia
  const percentToday = useMemo(() => {
    const total = Array.isArray(defs) ? defs.length : 0;
    const count = Array.isArray(done) ? done.length : 0;
    return total ? Math.round((count / total) * 100) : 0;
  }, [defs, done]);

  // saudação simples
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      {/* Header simples */}
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold">{greeting}, Mãe 💛</h1>
          <p className="text-sm text-slate-500">Seu dia com leveza e presença</p>
        </div>

        {/* atalho para o Planner, opcional */}
        <Link href="/meu-dia/planner" className="btn bg-white border border-slate-200">
          Ver Planner
        </Link>
      </header>

      {/* ===== Card: Checklist do Dia (com botão ⋯ para editar via modal) ===== */}
      <section className="card mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Checklist do Dia</h3>
            {typeof percentToday === "number" ? (
              <p className="subtitle mt-0.5">{percentToday}% do dia concluído</p>
            ) : (
              <p className="subtitle mt-0.5">Organize microtarefas de hoje</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* abre editor inline */}
            <button
              aria-label="Editar checklist"
              onClick={() => setOpenChecklistEditor(true)}
              className="h-9 w-9 grid place-items-center rounded-xl bg-white ring-1 ring-black/10 hover:ring-black/20"
              title="Editar checklist"
            >
              ⋯
            </button>

            {/* abre a tela completa do checklist */}
            <Link
              href="/meu-dia/checklist"
              className="px-3 py-1.5 rounded-xl bg-[var(--brand)] text-white text-sm"
            >
              Abrir
            </Link>
          </div>
        </div>

        {/* mini barra de progresso */}
        <div className="mt-3 h-2 rounded-full bg-black/5 overflow-hidden">
          <div
            className="h-full bg-[var(--brand)] rounded-full transition-all"
            style={{ width: `${percentToday}%` }}
          />
        </div>
      </section>

      {/* ===== Outros atalhos da Home (opcional, ilustrativo) ===== */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/meu-dia/momentos" className="card hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💕</div>
            <div>
              <h3 className="text-lg font-semibold">Tempo com Meu Filho</h3>
              <p className="subtitle">Registrar momentos especiais</p>
            </div>
          </div>
        </Link>

        <Link href="/meu-dia/atividade" className="card hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🎨</div>
            <div>
              <h3 className="text-lg font-semibold">Atividade do Dia</h3>
              <p className="subtitle">Brincadeira educativa sugerida</p>
            </div>
          </div>
        </Link>

        <Link href="/meu-dia/rotina" className="card hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🏠</div>
            <div>
              <h3 className="text-lg font-semibold">Rotina da Casa</h3>
              <p className="subtitle">Organize as tarefas do lar</p>
            </div>
          </div>
        </Link>

        <Link href="/meu-dia/pausas" className="card hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🌿</div>
            <div>
              <h3 className="text-lg font-semibold">Momento para Mim</h3>
              <p className="subtitle">Pausas, afirmações e autocuidado</p>
            </div>
          </div>
        </Link>
      </section>

      {/* ===== Modal de edição do Checklist ===== */}
      <ChecklistEditorModal
        open={openChecklistEditor}
        onClose={() => setOpenChecklistEditor(false)}
      />
    </main>
  );
}
