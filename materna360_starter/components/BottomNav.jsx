// materna360_starter/components/BottomNav.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/meu-dia",  label: "Meu Dia",  emoji: "🏡" },
  { href: "/cuidar",   label: "Cuidar",   emoji: "🌿" },
  { href: "/brincar",  label: "Descobrir",emoji: "🧸" },
  { href: "/eu360",    label: "Eu360",    emoji: "💛" },
];

export default function BottomNav(){
  const path = usePathname() || "";

  return (
    <nav className="fixed inset-x-0 bottom-4 md:bottom-6 px-4 z-40">
      <div className="container-px px-0">
        <div className="glass px-4 py-2 radius-2xl shadow-strong">
          <ul className="grid grid-cols-4">
            {TABS.map((t) => {
              const active = path === t.href || path.startsWith(t.href + "/");
              return (
                <li key={t.href} className="flex">
                  <Link
                    href={t.href}
                    className={`flex flex-1 flex-col items-center justify-center py-2 rounded-xl transition ${
                      active ? "text-[--brand]" : "text-[color:rgba(47,58,86,0.75)]"
                    }`}
                  >
                    <span className="text-[20px] leading-none">{t.emoji}</span>
                    <span className="text-[11px] font-medium">{t.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
