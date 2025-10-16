"use client";
import { useEffect, useState } from "react";

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function onToast(e) {
      const t = e.detail || { message: "Ação concluída 💛" };
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, ...t }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, t.duration ?? 2800);
    }
    window.addEventListener("m360:toast", onToast);
    return () => window.removeEventListener("m360:toast", onToast);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto glass shadow-raise px-4 py-3 text-sm text-[var(--brand-navy)]"
          role="status"
        >
          {t.icon ? <span className="mr-2">{t.icon}</span> : null}
          {t.message}
        </div>
      ))}
    </div>
  );
}
