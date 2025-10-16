// app/meu-dia/checklist/page.jsx
"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// paths: estamos em app/meu-dia/checklist -> voltar 3 níveis até /lib
import { get, set, keys } from "../../../lib/storage.js";

const STORAGE_KEY = (keys && keys.checklist) || "m360:checklist";

const BASE_ITEMS = [
  { id: "agua",   text: "Beber água",            emoji: "💧" },
  { id: "pausa",  text: "Fazer pausa de 5 min",  emoji: "🕐" },
  { id: "brincar",text: "Brincar com meu filho", emoji: "🎲" },
  { id: "alongar",text: "Alongar-se",            emoji: "🧘" },
  { id: "respiro",text: "Respirar fundo 3x",     emoji: "🌿" },
];

function todayId() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function pct(list = []) {
  if (!list.length) return 0;
  const done = list.filter((i) => i.done).length;
  return Math.round((done / list.length) * 100);
}

export default function ChecklistPage() {
  const [text, setText] = useState("");
  const [data, setData] = useState({});    // { [YYYY-MM-DD]: { items:[], awarded?:bool } }
  const tid = todayId();

  // estado do dia corrente
  const items = data[tid]?.items || [];
  const progress = useMemo(() => pct(items), [items]);
  const allDone = items.length > 0 && items.every((i) => i.done === true);

  // carregar do storage
  useEffect(() => {
    const saved = get(STORAGE_KEY, {});
    // se ainda não há items para hoje, hidrata com base
    if (!saved[tid]) {
      saved[tid] = { items: BASE_ITEMS.map((b) => ({ ...b, done: false })) };
      set(STORAGE_KEY, saved);
    }
    setData(saved);
  }, []);

  // persistir sempre que mudar
  useEffect(() => {
    if (Object.keys(data).length) set(STORAGE_KEY, data);
  }, [data]);

  // badge quando concluir tudo (uma vez por dia)
  useEffect(() => {
    if (allDone && !data[tid]?.awarded) {
      // “Organizada” casa com microtarefas/rotina
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("m360:win", {
            detail: { type: "badge", name: "Organizada" },
          })
        );
      }
      setData((prev) => ({ ...prev, [tid]: { ...prev[tid], awarded: true } }));
    }
  }, [allDone]);

  function persist(nextItems) {
    setData((prev) => ({ ...prev, [tid]: { ...(prev[tid] || {}), items: nextItems } }));
  }

  function toggle(id) {
    const next = (items || []).map((it) => (it.id === id ? { ...it, done: !it.done } : it));
    persist(next);
  }

  function remove(id) {
    const next = (items || []).filter((it) => it.id !== id);
    persist(next);
  }

  function add() {
    const v = text.trim();
    if (!v) return;
    const id = `c-${Date.now().toString(36)}`;
    persist([{ id, text: v, emoji: "📝", done: false }, ...items]);
    setText("");
  }

  function resetToday() {
    persist(BASE_ITEMS.map((b) => ({ ...b, done: false })));
    setData((prev) => ({ ...prev, [tid]: { ...prev[tid], awarded: false } }));
  }

  return (
    <main className="container-px py-5">
      {/* topo */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Checklist do Dia</h1>
          <p className="text-sm text-slate-500">Microtarefas rápidas para um dia leve</p>
        </div>
        <Link href="/meu-dia" className="btn bg-white border border-slate-200">
          ← Voltar
        </Link>
      </div>

      {/* progresso */}
      <div className="card mb-5">
        <div className="flex justify-between text-sm mb-1">
          <span>Progresso de hoje</span>
          <span className="text-slate-500">{progress}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-2 bg-brand rounded-full" style={{ width: `${progress}%` }} />
        </div>
        {allDone && (
          <p className="mt-2 text-sm text-emerald-600">
            ✔️ Parabéns! Você concluiu sua checklist de hoje.
          </p>
        )}
      </div>

      {/* adicionar item */}
      <div className="card mb-4">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Adicionar nova microtarefa…"
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand/30"
          />
          <button onClick={add} className="btn btn-primary">
            Adicionar
          </button>
        </div>
        <div className="mt-3">
          <button onClick={resetToday} className="text-sm text-slate-500 hover:underline">
            Restaurar checklist padrão do dia
          </button>
        </div>
      </div>

      {/* lista */}
      <ul className="space-y-2">
        {(items || []).map((it) => (
          <li
            key={it.id}
            className="rounded-xl border border-slate-200 bg-white p-3 flex items-center gap-3"
          >
            <input
              type="checkbox"
              checked={!!it.done}
              onChange={() => toggle(it.id)}
              className="h-5 w-5 accent-brand"
            />
            <div className="text-xl">{it.emoji}</div>
            <div className={`flex-1 ${it.done ? "line-through text-slate-400" : ""}`}>{it.text}</div>
            <button
              onClick={() => remove(it.id)}
              className="text-slate-400 hover:text-rose-500 text-lg"
              title="Remover"
            >
              ⌫
            </button>
          </li>
        ))}
        {!(items || []).length && (
          <li className="text-slate-500 text-sm">Sem itens hoje. Que tal adicionar um agora?</li>
        )}
      </ul>
    </main>
  );
}
