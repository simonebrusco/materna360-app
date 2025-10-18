"use client";

import { useState } from "react";

/**
 * Componente leve que chama as IAs:
 *  - POST /api/ai/organize  -> dicas de organização
 *  - POST /api/ai/breaks    -> pausas rápidas
 *
 * Props:
 *  dayKey: string "yyyy-mm-dd" do dia selecionado
 *  onAppend: (text: string) => void  -> função para adicionar texto no bloco de notas do dia
 */
export default function PlannerQuickIdeas({ dayKey, onAppend }) {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [tips, setTips] = useState([]);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    try {
      // parâmetros básicos (ajuste depois se quiser)
      const bodyOrganize = { context: "casa", minutes: 10, kidsAge: "3-4" };
      const bodyBreaks   = { mood: "neutra", time: 3, place: "casa" };

      const [r1, r2] = await Promise.all([
        fetch("/api/ai/organize", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(bodyOrganize)}),
        fetch("/api/ai/breaks",   { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(bodyBreaks)}),
      ]);

      if (!r1.ok && !r2.ok) throw new Error("Falha ao gerar ideias.");

      const j1 = r1.ok ? await r1.json() : { tips: [] };
      const j2 = r2.ok ? await r2.json() : { ideas: [] };

      setTips(Array.isArray(j1.tips) ? j1.tips : []);
      setIdeas(Array.isArray(j2.ideas) ? j2.ideas : []);
    } catch (e) {
      setError("Não foi possível gerar ideias agora.");
    } finally {
      setLoading(false);
    }
  }

  function appendAllToNotes() {
    const lines = [
      `Ideias do dia (${dayKey}):`,
      ...tips.map(t => `• ${t}`),
      ...ideas.map(i => `• ${i}`),
    ].join("\n");
    onAppend(lines);
    alert("Ideias adicionadas ao bloco de notas!");
  }

  return (
    <div className="mt-3 rounded-lg border bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium">Sugestões rápidas com IA</div>
        <button
          onClick={generate}
          disabled={loading}
          className="px-3 py-1.5 rounded-md bg-[#ff005e] text-white disabled:opacity-60"
        >
          {loading ? "Gerando..." : "Gerar ideias para hoje"}
        </button>
      </div>

      {error ? <div className="mt-2 text-xs text-rose-600">{error}</div> : null}

      {(tips.length || ideas.length) ? (
        <>
          {tips.length ? (
            <div className="mt-3">
              <div className="text-xs font-semibold text-slate-600 mb-1">Organização (10 min)</div>
              <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
                {tips.map((t, idx) => <li key={`t-${idx}`}>{t}</li>)}
              </ul>
            </div>
          ) : null}
          {ideas.length ? (
            <div className="mt-3">
              <div className="text-xs font-semibold text-slate-600 mb-1">Pausas rápidas</div>
              <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
                {ideas.map((i, idx) => <li key={`i-${idx}`}>{i}</li>)}
              </ul>
            </div>
          ) : null}
          <div className="flex justify-end mt-3">
            <button
              onClick={appendAllToNotes}
              className="px-3 py-1.5 rounded-md border"
            >
              Adicionar ao bloco de notas
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
