'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Meu Dia", href: "/",       icon: "🏡" },
  { label: "Brincar", href: "/brincar", icon: "🎯" },
  { label: "Cuidar",  href: "/cuidar",  icon: "🧘" },
  { label: "Eu360",   href: "/eu360",   icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname() || "/";
  return (
    <nav className="sticky bottom-4 mx-auto max-w-md">
      <div className="mx-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-white/60 shadow-soft">
        <ul className="grid grid-cols-4 text-center text-sm">
          {LINKS.map((t) => {
            const active = pathname === t.href || pathname.startsWith(t.href + "/");
            return (
              <li key={t.href} className="py-3 flex flex-col items-center gap-1">
                <Link href={t.href} className={`text-lg ${active ? "" : "opacity-80"}`}>{t.icon}</Link>
                <span className={`text-[11px] ${active ? "font-medium" : "text-brand-slate"}`}>{t.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
