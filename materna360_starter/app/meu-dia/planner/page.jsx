// materna360_starter/app/meu-dia/planner/page.jsx
"use client";
<PlannerBreathCTA className="mt-4" />


import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppBar from "../../../components/AppBar";
import { get, set, keys } from "../../../lib/storage";
import { toast } from "../../../lib/toast";
import PlannerBreathCTA from "@/components/PlannerBreathCTA";

// ----- tipos e helpers ------------------------------------------------------
const DEFAULT_PLANNER = { casa: [], filhos: [], eu: [] };
const TABS = [
  { id: "casa", label: "Casa", emoji: "🏠" },
  { id: "filhos", label: "Filhos", emoji: "👶" },
  { id: "eu", label: "Eu", emoji: "💛" },
];

function calcProgress(list) {
  const total = list.length || 0;
  const done = list.filter((i) => i.done).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  return { total, done, percent };
}

function ProgressBar({ value }) {
  return (
    <div className="w-full h-3 rounded-full bg-black/5 ring-1 ring-black/5 overflow-hidden">
      <div
        className="h-full bg-[var(--brand)] transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

// Item da lista
function Row({ item, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <button
        onClick={() => onToggle(item.id)}
        className={`h-5 w-5 rounded-md border transition shadow-sm ${
          item.done
            ? "bg-[var(--brand)] border-[var(--brand)]"
            : "bg-white border-black/10"
        }`}
        aria-label="Marcar concluído"
      />
      <div className={`flex-1 text-sm ${item.done ? "line-through text-slate-400" : "text-slate-800"}`}>
        {item.title}
      </div>
      <button
        onClick={() => onDelete(item.id)}
        className="text-xs px-2 py-1 rounded-lg bg-white ring-1 ring-black/10 hover:bg-black/5"
      >
        Remover
      </button>
    </div>
  );
}

// ----- página ---------------------------------------------------------------
export default function PlannerPage() {
  const [data, setData] = useState(DEFAULT_PLANNER);
  const [tab, setTab] = useState("casa");
  const [newTitle, setNewTitle] = useState("");

  // carregar do storage
  useEffect(() => {
    const initial = get(keys.planner, DEFAULT_PLANNER);
    // garante estrutura
    setData({
      casa: Array.isArray(initial.casa) ? initial.casa : [],
      filhos: Array.isArray(initial.filhos) ? initial.filhos : [],
      eu: Array.isArray(initial.eu) ? initial.eu : [],
    });
  }, []);

  // salvar no storage sempre que mudar
  useEffect(() => {
    set(keys.planner, data);
  }, [data]);

  // listas e progresso
  const currentList = data[tab] || [];
  const { total, done, percent } = useMemo(
    () => calcProgress(currentList),
    [currentList]
  );

  const overall = useMemo(() => {
    const merged = [...data.casa, ...data.filhos, ...data.eu];
    return calcProgress(merged);
  }, [data]);

  // ações
  function toggle(id) {
    setData((prev) => {
      const list = (prev[tab] || []).map((i) =>
        i.id === id ? { ...i, done: !i.done } : i
      );
      const next = { ...prev, [tab]: list };

      // toast de feedback
      const toggled = list.find((i) => i.id === id);
      if (toggled?.done) toast("Tarefa concluída ✨");
      else toast("Tarefa desmarcada");

      // badge “Organizada” quando atingir 5 concluídas no total
      const merged = [...next.casa, ...next.filhos, ...next.eu];
      const countDone = merged.filter((i) => i.done).length;
      if (countDone >= 5 && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("m360:win", {
            detail: { type: "badge", name: "Organizada" },
          })
        );
      }
      return next;
    });
  }

  function removeItem(id) {
    setData((prev) => {
      const list = (prev[tab] || []).filter((i) => i.id !== id);
      toast("Item removido");
      return { ...prev, [tab]: list };
    });
  }

  function addItem(e) {
    e?.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    const item = {
      id: `${tab}_${Date.now()}`,
      title,
      done: false,
      meta: { source: "planner:manual" },
    };
    setData((prev) => {
      const list = [item, ...(prev[tab] || [])];
      toast("Adicionado ao Planner 💾");
      return { ...prev, [tab]: list };
    });
    setNewTitle("");
  }

  return (
    <main className="max-w-3xl mx-auto px-5 pb-28">
      <AppBar title="Planner da Família" backHref="/meu-dia" />

      {/* Resumo geral */}
      <section className="mt-4 rounded-2xl bg-white ring-1 ring-black/5 p-4 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm text-slate-500">Progresso geral</div>
            <div className="text-2xl font-semibold">{overall.percent}%</div>
          </div>
          <div className="min-w-[50%]">
            <ProgressBar value={overall.percent} />
            <div className="mt-1 text-xs text-slate-500">
              {overall.done} de {overall.total} concluídas
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="mt-4 grid grid-cols-3 gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 rounded-xl ring-1 ring-black/10 transition ${
              tab === t.id
                ? "bg-[var(--brand)] text-white"
                : "bg-white hover:bg-black/5"
            }`}
          >
            <span className="mr-1">{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </nav>

      {/* Progresso da aba */}
      <section className="mt-3 rounded-2xl bg-white ring-1 ring-black/5 p-4 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm text-slate-500">
              {TABS.find((t) => t.id === tab)?.label}
            </div>
            <div className="text-xl font-semibold">{percent}%</div>
          </div>
          <div className="min-w-[50%]">
            <ProgressBar value={percent} />
            <div className="mt-1 text-xs text-slate-500">
              {done} de {total} concluídas
            </div>
          </div>
        </div>
      </section>

      {/* Form de novo item */}
      <form onSubmit={addItem} className="mt-3 flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Adicionar tarefa..."
          className="flex-1 rounded-xl bg-white ring-1 ring-black/10 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-xl px-4 py-2 text-sm bg-[var(--brand)] text-white"
        >
          Adicionar
        </button>
      </form>

      {/* Lista */}
      <section className="mt-2 rounded-2xl bg-white ring-1 ring-black/5 p-2 md:p-3 shadow-sm">
        {currentList.length === 0 ? (
          <div className="p-4 text-sm text-slate-500">
            Sem itens por aqui. Que tal adicionar um agora? 🙂
          </div>
        ) : (
          currentList.map((it) => (
            <Row
              key={it.id}
              item={it}
              onToggle={toggle}
              onDelete={removeItem}
            />
          ))
        )}
      </section>

      {/* Atalho para Checklist */}
      <div className="mt-6 flex justify-end">
        <Link
          href="/meu-dia/checklist"
          className="text-sm px-3 py-2 rounded-xl bg-white ring-1 ring-black/10 hover:bg-black/5"
        >
          Abrir Checklist do Dia →
        </Link>
      </div>
    </main>
  );
}
