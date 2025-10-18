"use client";

import clsx from "clsx";

/**
 * Button — Variantes: primary | secondary | ghost
 * - Altura mínima 44–48px
 * - Radius 16px
 * - Acessível (foco visível, área de toque)
 */
export default function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center select-none whitespace-nowrap " +
    "rounded-[var(--r-lg)] font-semibold tracking-wide " +
    "transition-all duration-300 ease-[var(--ease-soft)] " +
    "focus:outline-none focus-visible:m360-focus m360-touch";

  const sizes = {
    sm: "h-11 px-4 text-sm",
    md: "h-12 px-5 text-base",
    lg: "h-14 px-6 text-base",
  };

  const variants = {
    primary:
      "bg-[var(--m360-primary)] text-white shadow-[var(--elev-1)] " +
      "hover:shadow-[var(--elev-2)] active:scale-[1.02]",
    secondary:
      "bg-[var(--m360-white)] text-[var(--m360-navy)] border border-m360-navy " +
      "hover:shadow-[var(--elev-1)] active:scale-[1.02]",
    ghost:
      "bg-transparent text-[var(--m360-navy)] underline-offset-4 " +
      "hover:underline active:scale-[1.01]",
  };

  return (
    <Tag
      className={clsx(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
