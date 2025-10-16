// app/brincar/page.jsx
"use client";
import { useState } from "react";
import { get, set, keys } from "../../lib/storage";
import { grantBadge } from "../../lib/gamification";

const IDADES = ["0–1", "2–3", "4–5", "6–7", "8+"];
const LOCAIS = ["Casa", "Parque", "Escola", "Ao ar livre"];

export default function BrincarPage() {
  const [idade, setIdade] = useState("2–3");
  const [local, setLocal] = useState("Casa");
  const [ideias, setIdeias] = useState([]);

  function gerarIdeias() {
    const base = [
      "Caça ao Tesouro de Cores 🎨",
      "Pintura com Bolhas de Sabão 🫧",
      "História com Objetos da Sala 📚",
      "Circuito de Almofadas 🧩",
      "Jogo do Siga o Ritmo 🥁",
    ];
    const seed = `${idade}-${local}`.length;
    const start = seed % 3;
    setIdeias(base.slice(start, start + 3));
  }

  function salvarNoPlanner(titulo) {
    const items = get(keys.planner, { casa: [], filhos: [], eu: [] });
    const id = Date.now().toString(36);
    const novo = { id, text: `${titulo} (Sugestão)`, done: false };
    const updated = { ...items, filhos: [novo, ...(items.filhos || [])] };
    set(keys.planner, updated);
    grantBadge("Exploradora", "Salvou sugestão no Planner");
    alert("Salvo no Planner (aba Filhos) ✅");
  }

  return (
    <main className="pb-28">
      <header className="mb-4">
        <h1 className="title">Brincar</h1>
        <p className="subtitle">Ideias e brincadeiras por idade e contexto</p>
      </header>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-slate-500">Idade</label>
            <select value={idade} onChange={(e) => setIdade(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2">
              {IDADES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-500">Local</label>
            <select value={local} onChange={(e) => setLocal(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2">
              {LOCAIS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={gerarIdeias} className="btn btn-primary w-full">Gerar Ideias</button>
          </div>
        </div>
      </div>

      {/* Ideias */}
      <ul className="space-y-2">
        {ideias.map((t, idx) => (
          <li key={idx} className="card flex items-center justify-between">
            <div>{t}</div>
            <button className="text-sm text-brand hover:underline" onClick={() => salvarNoPlanner(t)}>
              Salvar no Planner
            </button>
          </li>
        ))}
        {ideias.length === 0 && (
          <li className="card text-slate-500">
            Use os filtros e toque em <span className="text-brand font-medium">Gerar Ideias</span>.
          </li>
        )}
      </ul>
    </main>
  );
}
