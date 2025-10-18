// components/Eu360ReportCTA.jsx
"use client";

import Link from "next/link";

export default function Eu360ReportCTA() {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-[#1A2240]/60">Resumo da semana</div>
          <h3 className="text-lg md:text-xl font-semibold text-[#1A2240]">
            Relatório Semanal
          </h3>
          <p className="mt-1 text-sm text-[#1A2240]/60">
            Veja seus dias com Planner, respirações e momentos em família.
          </p>
        </div>
        <Link
          href="/eu360/relatorio"
          className="shrink-0 px-4 py-2 rounded-xl bg-[#ff005e] text-white"
        >
          Abrir
        </Link>
      </div>
    </div>
  );
}
