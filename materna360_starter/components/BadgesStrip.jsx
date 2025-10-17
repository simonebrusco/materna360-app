"use client";

import { useEffect, useState } from "react";
import { get, keys } from "../lib/storage";

export default function BadgesStrip() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const k = keys.badges || "m360:badges";
    const arr = Array.isArray(get(k, [])) ? get(k, []) : [];
    // mantém só os últimos 5
    setBadges(arr.slice(-5).reverse());
  }, []);

  if (!badges.length) {
    return (
      <div className="text-sm opacity-60">
        Suas conquistas aparecerão aqui conforme você usa o app ✨
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((b, i) => (
        <span
          key={i}
          className="px-2 py-1 rounded-full text-xs bg-[var(--brand)]/10 ring-1 ring-[var(--brand)]/20"
          title={b.name}
        >
          {b.name}
        </span>
      ))}
    </div>
  );
}
