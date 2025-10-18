"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AppBar({ title, backHref, right = null }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 m360-glass rounded-[var(--r-lg)] transition-shadow ${
        scrolled ? "shadow-[var(--elev-1)]" : "shadow-none"
      }`}
      role="banner"
    >
      <div className="container-px py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {backHref && (
            <Link
              href={backHref}
              className="m360-touch rounded-[var(--r-lg)] bg-[var(--m360-white)] border m360-card-border px-3 py-2 text-sm text-[var(--m360-navy)] hover:shadow-[var(--elev-1)] active:scale-[1.02)] transition-all duration-300 ease-[var(--ease-soft)]"
              aria-label="Voltar"
              title="Voltar"
            >
              ←
            </Link>
          )}
          <h1 className="text-[18px] font-semibold text-[var(--m360-navy)]">{title}</h1>
        </div>
        <div>{right}</div>
      </div>
    </header>
  );
}
