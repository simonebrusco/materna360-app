// materna360_starter/components/BadgesLastFive.jsx
"use client";

/**
 * Conquistas recentes — últimos 5 selos
 * - Lê de localStorage "m360:badges": Array<{ id, type, earnedAt }>
 * - Tipos suportados: 'weekly' | 'special' | 'streak'
 * - Apenas visual; não concede selos.
 */

import { useEffect, useState } from "react";

const STORAGE_BADGES = "m360:badges";

function readBadges() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_BADGES);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

const colorByType = {
  weekly:  "bg-[#ffd8e6] text-[#1A2240]",
  special: "bg-white ring-1 ring-black/10 text-[#1A2240]",
  streak:  "bg-[#ff005e] text-white",
};

export default function BadgesLastFive() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const list = readBadges();
    setItems(list.slice(-5).reverse());
  }, []);

  if (!items.length) return null;

  return (
    <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 md:p-5">
      <h2 className="text-base md:text-lg font-semibold text-[#1A2240] mb-3">
        Conquistas recentes
      </h2>
      <div className="flex gap-2">
        {items.map((b) => (
          <div
            key={b.id}
            className={`h-12 w-12 rounded-full flex items-center justify-center ${colorByType[b.type] || "bg-white"}`}
            title={new Date(b.earnedAt).toLocaleDateString("pt-BR")}
          >
            💗
          </div>
        ))}
      </div>
    </section>
  );
}
