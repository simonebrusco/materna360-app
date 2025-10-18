"use client";

import React from "react";

/**
 * Button — Materna360 (Soft Luxury)
 * Variants: primary | secondary | ghost
 * Sizes: sm | md | lg
 */
export default function Button({
  variant = "primary",
  size = "md",
  block = false,
  className = "",
  children,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[var(--r-lg)] transition-all duration-300 ease-[var(--ease-soft)] focus:outline-none focus-visible:m360-focus select-none";

  const byVariant = {
    primary:
      "bg-[var(--m360-primary)] text-[var(--m360-white)] shadow-[var(--elev-1)] hover:shadow-[var(--elev-2)] active:scale-[1.02]",
    secondary:
      "bg-[var(--m360-white)] text-[var(--m360-navy)] m360-card-border shadow-[var(--elev-1)] hover:shadow-[var(--elev-2)] active:scale-[1.02]",
    ghost:
      "bg-transparent text-[var(--m360-navy)] underline underline-offset-4 hover:no-underline",
  };

  const bySize = {
    sm: "h-10 px-4 text-sm",
    md: "h-[var(--touch-min)] px-5 text-base", // 44px
    lg: "h-14 px-6 text-base",
  };

  const disabledCls =
    "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";

  const width = block ? "w-full" : "";

  return (
    <button
      className={[
        base,
        byVariant[variant] || byVariant.primary,
        bySize[size] || bySize.md,
        disabledCls,
        width,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
