"use client";

import Link from "next/link";

export default function AppBar({ title, backHref, right = null }) {
  return (
    <header className="sticky top-0 z-30 bg-[color:var(--surface)]/85 backdrop-blur border-b border-black/5">
      <div className="container-px py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {backHref && (
            <Link
              href={backHref}
              className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-sm hover:shadow-sm"
              aria-label="Voltar"
            >
              ←
            </Link>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <div>{right}</div>
      </div>
    </header>
  );
}
