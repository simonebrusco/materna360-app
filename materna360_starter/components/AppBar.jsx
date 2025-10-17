"use client";
import Link from "next/link";

export default function AppBar({ title, backHref, right }) {
  return (
    <header className="w-full">
      <div className="m360-container py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-black/5 shadow-sm"
              aria-label="Voltar"
            >
              ←
            </Link>
          ) : (
            <div className="text-sm md:text-base font-medium m360-muted">
              Materna<strong style={{ color: "var(--m360-coral)" }}>360</strong>
            </div>
          )}
          {title && <h1 className="m360-h2">{title}</h1>}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </header>
  );
}
