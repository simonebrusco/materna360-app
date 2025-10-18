"use client";

import clsx from "clsx";
import Link from "next/link";
import useScrollHide from "@/hooks/useScrollHide";
import { Home, HeartPulse, Puzzle, User } from "lucide-react";

/**
 * TabBar (Glass)
 * - Fixa no rodapé
 * - Oculta ao rolar para baixo, reaparece ao rolar para cima
 * - Ícone + label, pill ativo com primary e texto branco
 * - Props:
 *   - items: [{ key, label, icon, href? }]
 *   - activeKey: string
 *   - onChange?: (key) => void
 *   - floating?: boolean (leve elevação extra)
 */
export default function TabBar({
  items = defaultItems,
  activeKey = "meu-dia",
  onChange,
  floating = false,
  className,
}) {
  const hidden = useScrollHide(80);

  return (
    <nav
      className={clsx(
        "fixed inset-x-0 bottom-0 z-40",
        "px-3 pb-3 pt-2",
        floating ? "pb-6" : "",
        "transition-transform duration-300 ease-[var(--ease-soft)]",
        hidden ? "translate-y-full" : "translate-y-0",
        className
      )}
      role="navigation"
      aria-label="Navegação inferior"
    >
      <div
        className={clsx(
          "m360-glass",
          "rounded-[var(--r-lg)] shadow-[var(--elev-1)]",
          "grid grid-cols-4 gap-2 px-2 py-2"
        )}
      >
        {items.map((it) => {
          const active = it.key === activeKey;
          const Inner = (
            <button
              type="button"
              onClick={() => onChange?.(it.key)}
              className={clsx(
                "m360-touch w-full h-12",
                "inline-flex items-center justify-center gap-2",
                "rounded-[var(--r-lg)] px-2",
                "transition-all duration-300 ease-[var(--ease-soft)]",
                active
                  ? "bg-[var(--m360-primary)] text-white"
                  : "bg-[var(--m360-soft)] text-[var(--m360-navy)]"
              )}
              aria-current={active ? "page" : undefined}
              aria-label={it.label}
              title={it.label}
            >
              <it.icon size={18} strokeWidth={2.2} />
              <span className="text-sm font-semibold">{it.label}</span>
            </button>
          );

          // Se houver href, renderiza como Link (sem quebrar sandbox se sem rota real)
          return (
            <div key={it.key} className="flex">
              {it.href ? <Link href={it.href} className="flex-1">{Inner}</Link> : Inner}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

const defaultItems = [
  { key: "meu-dia", label: "Meu Dia", icon: Home, href: "#" },
  { key: "cuidar", label: "Cuidar", icon: HeartPulse, href: "#" },
  { key: "brincar", label: "Brincar", icon: Puzzle, href: "#" },
  { key: "eu360", label: "Eu360", icon: User, href: "#" },
];
