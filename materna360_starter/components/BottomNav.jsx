"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/meu-dia", label: "Meu Dia", emoji: "🏠" },
  { href: "/brincar", label: "Brincar", emoji: "🎯" },
  { href: "/cuidar", label: "Cuidar", emoji: "🌿" },
  { href: "/eu360",  label: "Eu360",  emoji: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname() || "/";

  return (
    <nav className="fixed inset-x-0 bottom-3 md:bottom-5 px-4 z-50">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white/95 ring-1 ring-black/5 shadow-lg backdrop-blur px-4 py-3 flex items-center justify-between">
        {tabs.map((t) => {
          const active = pathname === t.href || (t.href !== "/" && pathname.startsWith(t.href));
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-col items-center gap-1 ${active ? "text-[#F15A2E]" : "text-[#1E1E1E]"}`}
            >
              <span className="text-xl">{t.emoji}</span>
              <span className="text-xs font-medium">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
