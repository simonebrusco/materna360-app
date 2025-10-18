"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useScrollHide
 * - Esconde quando o usuário rola para baixo além de um threshold
 * - Mostra quando rola para cima
 * - Útil para TabBar/AppBar
 */
export default function useScrollHide(threshold = 64) {
  const lastY = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const diff = y - lastY.current;

      if (y < threshold) {
        setHidden(false);
      } else {
        if (diff > 4) setHidden(true);  // rolando para baixo
        if (diff < -4) setHidden(false); // rolando para cima
      }
      lastY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return hidden;
}
