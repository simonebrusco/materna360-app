// components/BottomNav.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/meu-dia", label: "Meu Dia", icon: "🏠" },
  { href: "/brincar", label: "Brincar", icon: "🎲" },
  { href: "/cuidar",  label: "Cuidar",  icon: "🌿" },
  { href: "/eu360",   label: "Eu360",   icon: "👤" },
];

export default function BottomNav() {
  const path = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-card z-40">
      <div className="container-px py-2 grid grid-cols-4 text-center text-xs">
        {TABS.map(t => {
          const active = path?.startsWith(t.href);
          return (
            <Link key={t.href} href={t.href} className={active ? "text-brand" : "text-slate-500"}>
              <div className="text-lg leading-none">{t.icon}</div>
              <div className="mt-1">{t.label}</div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
