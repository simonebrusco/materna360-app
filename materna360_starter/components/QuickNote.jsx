// materna360_starter/components/QuickNote.jsx
"use client";
import { useState } from "react";
import { get, set, keys } from "../lib/storage";

const TABS = [
  { id: "casa", label: "Casa" },
  { id: "filhos", label: "Filhos" },
  { id: "eu", label: "Eu" },
];

export default function QuickNote({ onClose }) {
  const [tab, setTab] = useState("casa");
  const [text, setText] = useState("");

  function add() {
    const t = text.trim();
    if (!t) return;
    const items = get(keys.planner, { casa: [], filhos: [], eu: [] });
    const id = Date.now().toString(36);
    const novo = { id, text: t, done: false };
    const updated = { ...items, [tab]: [novo, ...(items[tab] || [])] };
    set(keys.planner, updated);
    setText("");
    onClose?.();
  }

  return (
    <div className="fixed left-0 right-0 bottom-16 z-50">
      <div className="container-px">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Anotar no Planner</div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>

          <div className="flex gap-2 mb-2">
            {TABS.map(t => (
              <button key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1 rounded-lg text-sm border ${tab===t.id ? "bg-brand text-white border-brand" : "bg-white border-slate-200"}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e)=>setText(e.target.value)}
              onKeyDown={(e)=>e.key==="Enter" && add()}
              placeholder="Ex.: Comprar frutas / Ler 10 min / Beber água"
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand/30"
            />
            <button onClick={add} className="btn btn-primary">Adicionar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
