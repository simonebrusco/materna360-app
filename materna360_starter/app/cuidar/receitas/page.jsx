// app/cuidar/receitas/page.jsx
"use client";

import { useState } from "react";
import AppBar from "../../../components/AppBar";
import GlassCard from "../../../components/GlassCard";

const AGE_RANGES = [
  { v: "6-12m", label: "6–12 meses" },
  { v: "1-2",   label: "1–2 anos" },
  { v: "2-4",   label: "2–4 anos" },
  { v: "4-6",   label: "4–6 anos" },
  { v: "6-9",   label: "6–9 anos" },
];

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#ffd8e6] text-[#1A2240] text-xs">
      {label}
      <button onClick={onRemove} className="opacity-70 hover:opacity-100" aria-label="Remover">×</button>
    </span>
  );
}

export default function ReceitasPage() {
  const [ageRange, setAgeRange] = useState("2-4");
  const [pantry, setPantry] = useState(["ovo", "banana", "aveia"]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);

  function addIng(e) {
    e.preventDefault();
    const v = input.trim();
    if (!v) return;
    if (!pantry.includes(v.toLowerCase())) {
      setPantry((p) => [...p, v.toLowerCase()]);
    }
    setInput("");
  }

  function removeIng(idx) {
    setPantry((p) => p.filter((_, i) => i !== idx));
  }

  async function generate(e) {
    e.preventDefault();
    setLoading(true);
    setRecipes([]);
    try {
      const res = await fetch("/api/ai/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ageRange, pantry }),
      });
      const data = await res.json();
      setRecipes(Array.isArray(data.recipes) ? data.recipes : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-5 pb-24">
      <AppBar title="Receitas (IA)" backHref="/cuidar" />

      {/* Formulário */}
      <section className="mt-4">
        <GlassCard className="p-4">
          <form onSubmit={generate} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <label className="text-xs uppercase tracking-wide text-[#1A2240]/60">Faixa etária</label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
              >
                {AGE_RANGES.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-wide text-[#1A2240]/60">Despensa (ingredientes)</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
                  placeholder="Ex.: queijo, legumes, azeite…"
                />
                <button onClick={addIng} className="px-3 py-2 rounded-xl bg-[#ffd8e6] text-[#1A2240]">
                  + Adicionar
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {pantry.map((p, i) => <Chip key={i} label={p} onRemove={() => removeIng(i)} />)}
              </div>
            </div>

            <div className="md:col-span-3 flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-xl text-white bg-[#ff005e] hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Gerando..." : "Gerar receitas"}
              </button>
            </div>
          </form>
        </GlassCard>
      </section>

      {/* Resultados */}
      <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((r, idx) => (
          <GlassCard key={idx} className="p-4 bg-white/80">
            <div className="text-base font-semibold text-[#1A2240]">{r.title}</div>
            <div className="text-xs text-[#1A2240]/60">Faixa etária: {r.ageRange} • Preparo ~{r.prepTime} min</div>

            <div className="mt-2">
              <div className="text-xs uppercase tracking-wide text-[#1A2240]/60">Ingredientes</div>
              <ul className="mt-1 list-disc pl-5 text-sm text-[#1A2240]">
                {r.ingredients.map((i, k) => <li key={k}>{i}</li>)}
              </ul>
            </div>

            <div className="mt-2">
              <div className="text-xs uppercase tracking-wide text-[#1A2240]/60">Passo a passo</div>
              <ol className="mt-1 list-decimal pl-5 text-sm text-[#1A2240] space-y-1">
                {r.steps.map((s, k) => <li key={k}>{s}</li>)}
              </ol>
            </div>

            {r.notes && (
              <div className="mt-3 rounded-xl bg-[#ffd8e6] text-[#1A2240] p-3 text-sm">
                {r.notes}
              </div>
            )}
          </GlassCard>
        ))}

        {!loading && recipes.length === 0 && (
          <div className="text-sm text-[#1A2240]/60">
            Adicione alguns ingredientes da despensa e clique em <b>Gerar receitas</b> ✨
          </div>
        )}
      </section>
    </main>
  );
}
