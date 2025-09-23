// src/pages/BuilderPage.tsx
import React, { useEffect } from "react";
import { BuilderComponent, builder } from "@builder.io/react";
import { useLocation, useNavigate } from "react-router-dom";

// inicializa o Builder com sua API Key pública
builder.init(import.meta.env.VITE_BUILDER_API_KEY || "");

export default function BuilderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1) Diz para o Builder qual é a URL atual (chave para ele buscar a página certa)
  useEffect(() => {
    builder.setUserAttributes({ urlPath: location.pathname });
    // scroll para o topo ao trocar de rota (opcional)
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  // 2) Intercepta cliques em links "internos" do Builder para usar o React Router
  useEffect(() => {
    const handler = (event: any) => {
      const href: string | undefined = event?.detail?.href;
      if (!href) return;

      // Links absolutos (http/https) seguem o fluxo normal do navegador
      if (href.startsWith("http://") || href.startsWith("https://")) {
        window.location.href = href;
        return;
      }

      // Navegação SPA sem recarregar
      event.preventDefault?.();
      navigate(href);
    };

    window.addEventListener("builder:linkClick", handler as any);
    return () => window.removeEventListener("builder:linkClick", handler as any);
  }, [navigate]);

  return (
    <BuilderComponent
      // 3) Força o remount quando a rota muda (garante novo fetch)
      key={location.pathname}
      model="page"
      options={{ includeRefs: true }}
      // 4) Também passamos a urlPath via data (reforça a seleção do conteúdo)
      data={{ urlPath: location.pathname }}
    />
  );
}
