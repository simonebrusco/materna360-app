// app/eu360/relatorio/page.jsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildWeeklyReport } from "@/lib/weeklyReport.js";

const PROFILE_KEY = "m360:profile";

function getProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function fmtDate(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

export default function Eu360WeeklyReportPage() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  const profile = useMemo(() => getProfile(), []);
  const displayName = (profile?.motherName || "Mãe").split(" ")[0] || "Mãe";
  const userId = profile?.userId || null;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const r = await buildWeeklyReport({ userId, when: new Date() });
      if (mounted) setReport(r);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [userId]);

  const shareText = useMemo(() => {
    if (!report) return "";
    const { range, metrics, highlights } = report;
    const lines = [
      `Relatório da semana (${fmtDate(range.start)}–${fmtDate(range.end)})`,
      `• Dias com Planner: ${metrics.daysWithNotes}`,
      `• Respiração (1 min): ${metrics.breathMin} min`,
      `• Momentos com meu filho: ${metrics.momentos}`,
    ];
    if (highlights?.length) {
      lines.push("• Destaques:");
      highlights.forEach((h) => lines.push(`  - ${h.line}`));
    }
    return lines.join("\n");
  }, [report]);

  function handleShare() {
    try {
      if (!shareText) return;
      if (navigator.share) {
        navigator.share({ text: shareText });
      } else {
        navigator.clipboard.writeText(shareText);
        alert("Relatório copiado!");
      }
    } catch {}
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-rose-100 to-rose-50">
        <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
          <Link href="/eu360" className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm">
            ← Eu360
          </Link>
          <div className="text-sm md:text-base font-medium text-[#1A2240]/70">Relatório</div>
          <div />
        </header>
        <section className="mx-auto max-w-5xl px-5 pt-8 pb-28">
          <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6">Gerando relatório…</div>
        </section>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-rose-100 to-rose-50">
        <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
          <Link href="/eu360" className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm">
            ← Eu360
          </Link>
          <div className="text-sm md:text-base font-medium text-[#1A2240]/70">Relatório</div>
          <div />
        </header>
        <section className="mx-auto max-w-5xl px-5 pt-8 pb-28">
          <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6">
            Não foi possível gerar o relatório agora.
          </div>
        </section>
      </main>
    );
  }

  const { title, range, metrics, highlights } = report;

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-100 to-rose-50">
      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
        <Link href="/eu360" className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm">
          ← Eu360
        </Link>
        <div className="text-sm md:text-base font-medium text-[#1A2240]/70">
          Relatório
        </div>
        <button
          onClick={handleShare}
          className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm"
        >
          Compartilhar
        </button>
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-6 pb-28">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A2240]">
            {title} — {displayName}
          </h1>
          <p className="mt-1 text-[#1A2240]/60">
            {fmtDate(range.start)} até {fmtDate(range.end)}
          </p>

          {/* KPIs */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl bg-white ring-1 ring-black/5 p-4">
              <div className="text-sm text-[#1A2240]/60">Dias com Planner</div>
              <div className="text-2xl font-semibold text-[#1A2240]">{metrics.daysWithNotes}</div>
            </div>
            <div className="rounded-xl bg-white ring-1 ring-black/5 p-4">
              <div className="text-sm text-[#1A2240]/60">Respiração (1 min)</div>
              <div className="text-2xl font-semibold text-[#1A2240]">{metrics.breathMin} min</div>
            </div>
            <div className="rounded-xl bg-white ring-1 ring-black/5 p-4">
              <div className="text-sm text-[#1A2240]/60">Momentos com meu filho</div>
              <div className="text-2xl font-semibold text-[#1A2240]">{metrics.momentos}</div>
            </div>
          </div>

          {/* Destaques */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[#1A2240]">Destaques</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {highlights.length ? (
                highlights.map((h, i) => (
                  <li key={i} className="text-[#1A2240]/80">{h.line}</li>
                ))
              ) : (
                <li className="text-[#1A2240]/60">Sem destaques nesta semana.</li>
              )}
            </ul>
          </div>

          {/* Call to action */}
          <div className="mt-6 flex gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl bg-[#ff005e] text-white"
            >
              Compartilhar
            </button>
            <Link
              href="/meu-dia/planner"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200"
            >
              Abrir Planner
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
