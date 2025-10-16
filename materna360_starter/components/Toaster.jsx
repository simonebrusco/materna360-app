// components/Toaster.jsx
"use client";
import { useEffect, useState } from "react";

export default function Toaster() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    function onWin(e) {
      const { name } = e.detail || {};
      setQueue((q) => [...q, { id: crypto.randomUUID(), text: `Selo conquistado: ${pt(name)} 🏅` }]);
    }
    window.addEventListener("m360:win", onWin);
    return () => window.removeEventListener("m360:win", onWin);
  }, []);

  useEffect(() => {
    if (queue.length === 0) return;
    const t = setTimeout(() => setQueue((q) => q.slice(1)), 3000);
    return () => clearTimeout(t);
  }, [queue]);

  function pt(name) {
    switch (name) {
      case "CuidarDeMim": return "Cuidar de Mim";
      case "MaePresente": return "Mãe Presente";
      case "Exploradora": return "Exploradora";
      case "Organizada":  return "Organizada";
      case "Conectada":   return "Conectada";
      default: return name;
    }
  }

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 space-y-2">
      {queue.map((t) => (
        <div key={t.id} className="bg-white shadow-card rounded-xl px-4 py-2 text-sm">
          {t.text}
        </div>
      ))}
    </div>
  );
}
