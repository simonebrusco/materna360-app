// app/meu-dia/planner/page.jsx
"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { get, set, keys } from "../../../lib/storage.js";

const TABS = [
  { id: "casa", label: "Casa", emoji: "🏠" },
  { id: "filhos", label: "Filhos", emoji: "💕" },
  { id: "eu", label: "Eu", emoji: "🌿" },
];

function pct(list = []) {
  if (!list.length) return 0;
  const done = list.filter((i) => i.done).length;
  return Math.round((done / list.length) * 100);
}

export default function PlannerPage() {
  const [tab, setTab] = useState("casa");
  const [text, setText] = useState("");
  const [items, setItems] = useState({ casa: [], filhos: [], eu: [] });

  // carregar do storage
  useEffect(() => {
    const initial = get(keys.planner, { casa: [], filhos: [], eu: [] });
    setItems(initial);
  }, []);

  // progresso geral e por aba
  const prog = useMemo(() => {
    const casa = pct(items.casa);
    const filhos = pct(items.filhos);
    const eu = pct(items.eu);
    const all = pct([...(items.casa || []), ...(items.filhos || []), ...(items.eu || [])]);
    return { casa, filhos, eu, all };
  }, [items]);

  // checar selo "Organizada" (5 concluídas no total)
  useEffect(() => {
    const totalDone =
      (items.casa || []).filter((i) => i.done).length +
      (items.filhos || []).filter((i) => i.done).length +
      (items.eu || []).filter((i) => i.done).length;

    if (typeof window !== "undefined" && totalDone >= 5) {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Organizada" },
        })
      );
    }
  }, [items]);

  function persist(next) {
    setItems(next);
    set(keys.planner, next);
  }

  function add() {
    const v = text.trim();
    if (!v) return;
    const id = Date.now().toString(36);
    const next = {
      ...items,
      [tab]: [{ id, text: v, done: false }, ...(items[tab] || [])],
    };
    setText("");
    persist(next);
  }

  function toggle(id) {
    const next = {
      ...items,
      [tab]: (items[tab] || []).map((it) => (it.id === id ? { ...it, done: !it.done } : it)),
    };
    persist(next);
  }

  function del(id) {
    const next = {
      ...items,
      [tab]: (items[tab] || []).filter((it) => it.id !== id),
    };
    persist(next);
  }

  function edit(id, newText) {
    const t = newText.trim();
    if (!t) return;
    const next = {
      ...items,
      [tab]: (items[tab] || []).map((it) => (it.id === id ? { ...it, text: t } : it)),
    };
    persist(next);
  }

  return (
    <main className="container-px py-5">
      {/* topo */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Planner da Família</h1>
          <p className="text-sm text-slate-500">Organize seu dia por áreas</p>
        </div>
        <Link href="/meu-dia" className="btn bg-white border border-slate-200">
          ← Voltar
        </Link>
      </div>

      {/* progresso geral */}
      <div className="card mb-5">
        <div className="flex justify-between text-sm mb-1">
          <span>Progresso de hoje</span>
          <span className="text-slate-500">{prog.all}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-2 bg-brand rounded-full" style={{ width: `${prog.all}%` }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          {[
            { label: "Casa", v: prog.casa },
            { label: "Filhos", v: prog.filhos },
            { label: "Eu", v: prog.eu },
          ].map((x) => (
            <div key={x.label} className="rounded-xl border border-slate-200 p-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{x.label}</span>
                <span className="text-slate-500">{x.v}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-2 bg-slate-400 rounded-full" style={{ width: `${x.v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* tabs */}
      <div className="flex gap-2 mb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 rounded-xl border text-sm flex items-center gap-2 ${
              tab === t.id ? "bg-brand text-white border-brand" : "bg-white border-slate-200"
            }`}
          >
            <span className="text-base">{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* input */}
      <div className="card mb-4">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder={
              tab === "casa"
                ? "Ex.: Comprar frutas, organizar roupas…"
                : tab === "filhos"
                ? "Ex.: Ler 10 min, brincar de memória…"
                : "Ex.: Pausa 5 min, beber água…"
            }
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand/30"
          />
          <button onClick={add} className="btn btn-primary">
            Adicionar
          </button>
        </div>
      </div>

      {/* lista */}
      <ul className="space-y-2">
        {(items[tab] || []).map((it) => (
          <li
            key={it.id}
            className="rounded-xl border border-slate-200 bg-white p-3 flex items-center gap-3"
          >
            <input
              type="checkbox"
              checked={it.done}
              onChange={() => toggle(it.id)}
              className="h-5 w-5 accent-brand"
            />
            <input
              defaultValue={it.text}
              onBlur={(e) => edit(it.id, e.target.value)}
              className={`flex-1 bg-transparent outline-none ${
                it.done ? "line-through text-slate-400" : ""
              }`}
            />
            <button
              onClick={() => del(it.id)}
              className="text-slate-400 hover:text-rose-500 text-lg"
              title="Apagar"
            >
              ⌫
            </button>
          </li>
        ))}
        {!(items[tab] || []).length && (
          <li className="text-slate-500 text-sm">Sem itens ainda nessa aba.</li>
        )}
      </ul>
    </main>
  );
}
