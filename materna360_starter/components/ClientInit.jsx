"use client";

import { useEffect } from "react";

export default function ClientInit() {
  useEffect(() => {
    try {
      // qualquer bootstrap leve do lado do cliente
      const onBadge = (ev) => {
        // ev.detail: { type: 'badge', name: '...'}
        // dá pra plugar um toast aqui no futuro
        // console.debug("m360:event", ev.detail);
      };

      if (typeof window !== "undefined") {
        window.addEventListener("m360:win", onBadge);
      }

      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("m360:win", onBadge);
        }
      };
    } catch {
      // nunca quebrar a render
    }
  }, []);

  return null;
}
