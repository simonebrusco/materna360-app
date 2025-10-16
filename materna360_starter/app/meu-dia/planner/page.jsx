// app/meu-dia/planner/page.jsx
"use client";
import { useEffect, useMemo, useState } from "react";
import ProgressBar from "../../../components/ProgressBar";
import { get, set, keys } from "../../../lib/storage";
import { grantBadge } from "../../../lib/gamification";

const TABS = [
  { id: "casa", label: "Casa", emoji: "🏠" },
  { id: "filhos", label: "Filhos", emoji: "👨‍👩‍👧" },
  { id: "eu", label: "Eu", emoji: "💛" },
];

const DEFAULT_DATA = {
  casa: [
    { id: "1", text: "Organizar a cozinha", done: false },
    { id: "2", text: "Lista de compras", done: false },
  ],
  filhos: [
    { id: "3", text: "Ler 10 min com o(a) filho(a)", done: false },
    { id: "4", text: "Separar lancheira", done: false },
  ],
  eu: [
    { id: "5", text: "Respiração 3 min", done: false },
    { id: "6", text: "Beber água", done: false },
  ],
};

export default function PlannerPage() {
  const [tab, setTab] = useState("casa");
  const [items, setItems] = useState(DEFAULT_DATA);
  const [newText, setNewText] = useState("");

  useEffect(() => {
    const saved = get(keys.planner, null);
    if (saved) setItems(saved);
  }, []);

  useEffect(() => { set(keys.planner, items); }, [items]);

  const currentList = items[tab] || [];
  const progress = useMemo(() => {
    const total = currentList.length || 1;
    const done = currentList.filter((i) => i.done).length;
    return Math.round((done / total) * 100);
  }, [currentList]);

  // gatilho de selo: 5 tarefas concluídas em qualquer aba
  useEffect(() => {
    const totalDone =
      items.casa.filter(i=>i.done).length +
      items.filhos.filter(i=>i.done).length +
      items.eu.filter(i=>i.done).length;
    if (totalDone >= 5) grantBadge("Organizada", "Concluiu 5 tarefas");
  }, [items]);

  function toggle(id) {
    setItems((prev) => ({
      ...prev,
      [tab]: prev[tab].map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    }));
  }
  function addItem() {
    const text = newText.trim();
    if (!text) return;
    const id = Date.now().toString(36);
    setItems((prev) => ({ ...prev, [tab]: [{ id, text, done: false }, ...prev[tab]] }));
    setNewText("");
  }
  function removeItem(id) {
    setItems((prev) => ({ ...prev, [tab]: prev[tab].filter((i) => i.id !== id) }));
  }
  function clearDone() {
    setItems((prev) => ({ ...prev, [tab]: prev[tab].filter((i) => !i.done) }));
  }

  return (
    <main className="pb-28">
      <header className="mb-4">
        <h1 className="title">Planner da Família</h1>
        <p className="subtitle">Abas: Casa · Filhos · Eu</p>
      </header>

      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl border text-sm ${
              tab === t.id ? "bg-brand text-white border-brand" : "bg-white border-slate-200"
            }`}
          >
            <span className="mr-1">{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>

      <div className="card mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Progresso — {progress}% concluído</div>
          <button onClick={clearDone} className="text-xs text-slate-500 hover:underline">
            Limpar concluídos
          </button>
        </div>
        <ProgressBar value={progress} />
      </div>

      <div className="card mb-4">
        <div className="flex gap-2">
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Adicionar tarefa..."
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand/30"
          />
          <button onClick={addItem} className="btn btn-primary">Adicionar</button>
        </div>
      </div>

      <ul className="space-y-2">
        {currentList.map((i) => (
          <li key={i.id} className="card flex items-center gap-3">
            <input
              type="checkbox"
              checked={i.done}
              onChange={() => toggle(i.id)}
              className="w-5 h-5 accent-[var(--brand)]"
            />
            <div className={`flex-1 ${i.done ? "line-through text-slate-400" : ""}`}>{i.text}</div>
            <button onClick={() => removeItem(i.id)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
          </li>
        ))}
        {currentList.length === 0 && (
          <li className="card text-slate-500">Sem itens ainda. Adicione o primeiro ✨</li>
        )}
      </ul>
    </main>
  );
}
