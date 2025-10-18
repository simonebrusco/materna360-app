"use client";

import clsx from "clsx";

/**
 * GlassCard — Card premium com visual Soft Luxury:
 * - Fundo branco, radius 16px, sombra elev1 → elev2 no hover/press
 * - Borda opcional (prop border)
 * - Animação de entrada (fade+slide) padrão
 * - Acessível: foco visível
 */
export default function GlassCard({
  as: Tag = "div",
  className,
  children,
  border = false,
  animated = true,
  ...props
}) {
  return (
    <Tag
      className={clsx(
        "bg-m360-white rounded-[var(--r-lg)] shadow-[var(--elev-1)]",
        "transition-all duration-300 ease-[var(--ease-soft)]",
        "hover:shadow-[var(--elev-2)]",
        "p-4 sm:p-6",
        animated && "m360-animate-in",
        border && "m360-card-border",
        "focus:outline-none focus-visible:m360-focus",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
