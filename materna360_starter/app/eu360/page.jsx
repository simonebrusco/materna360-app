"use client";

import { useState } from "react";
import AppBar from "@/components/AppBar";
import BottomNav from "@/components/BottomNav";
import PlannerList from "@/components/PlannerList";
import { getWeeklySummary } from "@/lib/planner";

export default function Eu360Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const text = await getWeeklySummary();
      setSummary(text);
      setModalOpen(true);
    } catch (err) {
      console.error("planner.summary", err);
      setError("Não foi possível gerar o resumo agora.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!summary) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = summary;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("planner.copy", err);
      setCopied(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <main className="mx-auto min-h-screen max-w-md bg-brand-secondary/10">
      <AppBar title="Eu360" backHref="/" />

      <div className="space-y-6 px-4 py-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-brand-ink">Eu360</h1>
          <p className="text-brand-slate">
            Explore seu planner semanal com foco na família, casa e autocuidado.
          </p>
        </header>

        <PlannerList />

        <div className="rounded-2xl border border-brand-primary/20 bg-brand-white/70 p-5 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-brand-ink">Resumo da semana</h2>
              <p className="text-sm text-brand-slate">
                Gere um texto com os destaques do planner para compartilhar.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center justify-center rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold uppercase tracking-wide text-brand-white transition hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Gerando..." : "Gerar resumo da semana"}
            </button>
          </div>
          {error ? (
            <p className="mt-3 text-sm text-brand-primary">{error}</p>
          ) : null}
        </div>
      </div>

      <BottomNav />

      {modalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ink/40 px-4 py-6"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-brand-secondary/60 bg-brand-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-semibold text-brand-ink">
                Resumo da semana
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-transparent px-3 py-1 text-sm font-semibold text-brand-slate transition hover:border-brand-primary/40 hover:text-brand-primary"
              >
                Fechar
              </button>
            </div>
            <p className="mt-2 text-sm text-brand-slate">
              Texto pronto para colar onde preferir.
            </p>
            <textarea
              className="mt-4 h-48 w-full rounded-xl border border-brand-secondary/60 bg-brand-secondary/20 p-4 text-sm text-brand-ink"
              value={summary}
              readOnly
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center rounded-full border border-brand-primary/40 bg-brand-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-brand-primary transition hover:bg-brand-primary/20"
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
              <span className="text-xs uppercase tracking-wide text-brand-slate/70">
                texto selecionável
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
