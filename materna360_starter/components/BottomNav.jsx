"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/meu-dia", label: "Meu Dia", emoji: "🏠" },
  { href: "/brincar", label: "Brincar", emoji: "🧸" },   // “Descobrir” está como /brincar no projeto
  { href: "/cuidar",  label: "Cuidar",  emoji: "🧘‍♀️" },
  { href: "/eu360",   label: "Eu360",   emoji: "💛" },
];

function isActive(pathname, href) {
  return pathname === href || pathname.startsWith(href + "/");
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-3 md:bottom-5 px-4 z-40">
      <div className="mx-auto max-w-3xl bg-white/90 backdrop-blur rounded-2xl ring-1 ring-black/5 shadow-lg px-3 py-2 flex items-center justify-between">
        {TABS.map((t) => {
          const active = isActive(pathname, t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-col items-center gap-0.5 text-[13px] transition-transform ${
                active ? "text-[var(--brand)] font-semibold" : "text-[color:var(--brand-navy)]/80"
              }`}
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
