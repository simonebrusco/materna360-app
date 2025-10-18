"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

/**
 * AppBar (Glass)
 * - Transparente sobre o gradiente global
 * - Ganha sombra sutil quando há scroll
 * - Props: title, subtitle, leftSlot, rightSlot
 */
export default function AppBar({
  title = "Materna360",
  subtitle = "",
  leftSlot = null,
  rightSlot = null,
  className,
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-30",
        "px-4 py-3",
        "m360-glass rounded-[var(--r-lg)]",
        scrolled ? "shadow-[var(--elev-1)]" : "shadow-none",
        className
      )}
      role="banner"
    >
      <div className="flex items-center gap-3">
        <div className="shrink-0">{leftSlot}</div>
        <div className="flex-1 min-w-0">
          <h1 className="text-m360-navy font-bold text-[24px] leading-none truncate">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-m360-gray text-sm mt-1 truncate">{subtitle}</p>
          ) : null}
        </div>
        <div className="shrink-0">{rightSlot}</div>
      </div>
    </header>
  );
}
