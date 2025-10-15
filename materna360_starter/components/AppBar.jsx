'use client';
import Link from "next/link";

export default function AppBar({ title = "", backHref = "/" }) {
  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xs border-b border-white/60">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
        <Link href={backHref} className="text-xl leading-none" aria-label="Voltar">
          ←
        </Link>
        <div className="text-sm font-medium text-brand-ink">{title}</div>
        <Link
          href="/eu360"
          className="text-xs rounded-full px-3 py-1 bg-white border border-brand-secondary/60 text-brand-slate hover:bg-brand-secondary/40 transition"
        >
          Eu360
        </Link>
      </div>
    </div>
  );
}
