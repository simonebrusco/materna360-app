// src/pages/BuilderPage.tsx
import React, { useEffect } from "react";
import { BuilderComponent } from "@builder.io/react";
import { useLocation, useNavigate } from "react-router-dom";
import builder from "../lib/builder"; // ajustamos antes

export default function BuilderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1) Intercepta cliques em QUALQUER <a> dentro do app
    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (!href) return;

      // Externos (http/https, mailto, tel) — deixar seguir normal
      if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) return;

      // SPA: navegação interna com React Router
      e.preventDefault();
      const path = href.startsWith("/") ? href : `/${href}`;
      navigate(path);
    };

    document.addEventListener("click", onAnchorClick);

    // 2) Também escuta o evento do Builder (quando eles disparam navegação)
    const onBuilderLink = (ev: any) => {
      const url: string | undefined = ev?.detail?.url || ev?.detail?.href;
      if (!url) return;

      if (/^https?:\/\//i.test(url)) {
        window.location.href = url; // externos
      } else {
        navigate(url.startsWith("/") ? url : `/${url}`); // internos
      }
    };

    window.addEventListener("builder:linkClick", onBuilderLink as EventListener);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("builder:linkClick", onBuilderLink as EventListener);
    };
  }, [navigate]);

  return (
    <BuilderComponent
      model="page"
      urlPath={location.pathname + location.search}
      options={{ includeRefs: true }}
      data={{}}
    />
  );
}
