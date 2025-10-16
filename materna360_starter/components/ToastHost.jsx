"use client";

import { useEffect, useState } from "react";

export default function ToastHost() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    function onToast(e) {
      const id = crypto.randomUUID();
      setQueue((q) => [...q, { id, msg: e.detail?.msg ?? "" }]);
      setTimeout(() => {
        setQueue((q) => q.filter((t) => t.id !== id));
      }, 2600);
    }
    window.addEventListener("m360:toast", onToast);
    return () => window.removeEventListener("m360:toast", onToast);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2">
      {queue.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto rounded-xl bg-[#1A2240] text-white px-4 py-2 shadow-lg ring-1 ring-black/10"
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
