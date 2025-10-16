// materna360_starter/components/BottomNav.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Tab = ({ href, icon, label }) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 ${
        active ? "text-rose-600" : "text-[#1A2240]"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-4 md:bottom-6 px-4 z-50">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white/95 ring-1 ring-black/5 shadow-lg backdrop-blur px-4 py-3 flex items-center justify-between">
        <Tab href="/" icon="🏠" label="Meu Dia" />
        <Tab href="/brincar" icon="🎯" label="Brincar" />
        <Tab href="/cuidar" icon="🧘‍♀️" label="Cuidar" />
        <Tab href="/eu360" icon="👤" label="Eu360" />
      </div>
    </nav>
  );
}
