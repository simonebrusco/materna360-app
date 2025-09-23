// src/pages/BuilderPage.tsx
import { useEffect } from "react";
import { BuilderComponent, builder } from "@builder.io/react";
import { useLocation, useNavigate } from "react-router-dom";

// Inicializa o Builder com a sua API Key (via Vite)
builder.init(import.meta.env.VITE_BUILDER_API_KEY || "");

export default function BuilderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Intercepta cliques em <a> para navegar via SPA (React Router)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;

      const a = t.closest("a") as HTMLAnchorElement | null;
      if (!a) return;

      // Permite abrir nova aba / downloads / atalhos
      if (
        a.target === "_blank" ||
        a.hasAttribute("download") ||
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const url = new URL(a.href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      e.preventDefault();
      navigate(url.pathname + url.search + url.hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 16px" }}>
      <BuilderComponent
        model="page"
        options={{ includeRefs: true }}
        data={{}}
