"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/meu-dia", label: "Meu Dia", emoji: "🏠" },
  { href: "/brincar", label: "Brincar", emoji: "🧸" }, // “Descobrir” está como /brincar no projeto
  { href: "/cuidar", label: "Cuidar", emoji: "🧘‍♀️" },
  { href: "/eu360", label: "Eu360", emoji: "💛" },
];

function isActive(pathname, href) {
  return pathname === href || pathname.startsWith(href + "/");
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-3 md:bottom-5 px-4 z-40"
      role="navigation"
      aria-label="Navegação inferior"
    >
      <div className="mx-auto max-w-3xl m360-glass rounded-[var(--r-lg)] shadow-[var(--elev-1)] px-2 py-2 grid grid-cols-4 gap-2">
        {TABS.map((t) => {
          const active = isActive(pathname, t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`m360-touch h-12 px-2 rounded-[var(--r-lg)] inline-flex flex-col items-center justify-center gap-0.5 text-[13px] font-semibold transition-all duration-300 ease-[var(--ease-soft)] ${
                active
                  ? "bg-[var(--m360-primary)] text-white"
                  : "bg-[var(--m360-soft)] text-[var(--m360-navy)]"
              } hover:shadow-[var(--elev-1)]`}
              aria-current={active ? "page" : undefined}
            >
              <span className={`text-xl ${active ? "scale-110" : ""}`}>{t.emoji}</span>
              <span>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
