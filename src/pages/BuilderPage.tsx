// src/pages/BuilderPage.tsx
import React, { useEffect } from "react";
import { BuilderComponent } from "@builder.io/react";
import { useLocation, useNavigate } from "react-router-dom";
// Importação por efeito colateral para garantir que builder.init rode
import "../lib/builder";

export default function BuilderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Intercepta cliques em QUALQUER <a> e usa o React Router p/ navegar
    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (!href) return;

      // Deixa externos seguirem normal
      if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) return;

      // Internos: navegação SPA
      e.preventDefault();
      const path = href.startsWith("/") ? href : `/${href}`;
      navigate(path);
    };

    document.addEventListener("click", onAnchorClick);

    // Evento que o Builder dispara para links internos
    const onBuilderLink = (ev: any) => {
      const url: string | undefined = ev?.detail?.url || ev?.detail?.href;
      if (!url) return;

      if (/^https?:\/\//i.test(url)) {
        window.location.href = url;
      } else {
        navigate(url.startsWith("/") ? url : `/${url}`);
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
