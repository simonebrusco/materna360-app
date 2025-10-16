"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getJSON, setJSON } from "../../../lib/storage";
import { toast } from "../../../lib/toast";

const TABS = ["casa", "filhos", "eu"];

function calcProgress(items) {
  const totals = { casa: 0, filhos: 0, eu: 0 };
  const done = { casa: 0, filhos: 0, eu: 0 };
  for (const it of items) {
    totals[it.area] = (totals[it.area] ?? 0) + 1;
    if (it.done) done[it.area] = (done[it.area] ?? 0) + 1;
  }
  const pct = (a) => (totals[a] ? Math.round((100 * done[a]) / totals[a]) : 0);
  return { totals, done, pctCasa: pct("casa"), pctFilhos: pct("filhos"), pctEu: pct("eu") };
}

export default function PlannerPage() {
  const [tab, setTab] = useState("casa");
  const [items, setItems] = useState(() => getJSON("m360:planner") ?? []);
  const prog = useMemo(() => calcProgress(items), [items]);

  function add(title) {
    const next = [
      ...items,
      { id: crypto.randomUUID(), title, area: tab, done: false, date: new Date().toISOString().slice(0, 10) },
    ];
    setItems(next);
    setJSON("m360:planner", next);
  }

  function toggle(id) {
    const next = items.map((i) => (i.id === id ? { ...i, done: !i.done } : i));
    setItems(next);
    setJSON("m360:planner", next);
    toast("Boa! Progresso atualizado ✅");
  }

  const filtered = items.filter((i) => i.area === tab);

  return (
    <main className="max-w-3xl mx-auto px-5 py-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Planner da Família</h1>
        <Link href="/meu-dia" className="btn bg-white border border-slate-200">← Voltar</Link>
      </header>

      <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 mb-4">
        <div className="text-sm text-slate-500 mb-2">Progresso de hoje</div>
        <div className="space-y-2">
          <Bar label="Casa" value={prog.pctCasa} />
          <Bar label="Filhos" value={prog.pctFilhos} />
          <Bar label="Eu" value={prog.pctEu} />
        </div>
      </section>

      <div className="flex gap-2 mb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-sm ${tab === t ? "bg-[#F15A2E] text-white" : "bg-white ring-1 ring-black/5"}`}
          >
            {t === "casa" ? "🏠 Casa" : t === "filhos" ? "💕 Filhos" : "🌿 Eu"}
          </button>
        ))}
      </div>

      <AddBox onAdd={add} />

      <ul className="mt-3 space-y-2">
        {filtered.length === 0 && <li className="text-slate-500 text-sm">Sem itens ainda nessa aba.</li>}
        {filtered.map((i) => (
          <li key={i.id} className="rounded-xl bg-white ring-1 ring-black/5 p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={i.done} onChange={() => toggle(i.id)} />
              <span className={i.done ? "line-through text-slate-500" : ""}>{i.title}</span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Bar({ label, value }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full mt-1">
        <div className="h-2 rounded-full bg-slate-300" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function AddBox({ onAdd }) {
  const [txt, setTxt] = useState("");
  return (
    <div className="flex gap-2">
      <input
        value={txt}
        onChange={(e) => setTxt(e.target.value)}
        className="flex-1 rounded-xl bg-white ring-1 ring-black/5 px-3 py-2"
        placeholder="Ex.: Comprar frutas, organizar roupas…"
      />
      <button
        onClick={() => { if (txt.trim()) { onAdd(txt.trim()); setTxt(""); } }}
        className="rounded-xl bg-[#F15A2E] text-white px-4 py-2"
      >
        Adicionar
      </button>
    </div>
  );
}
