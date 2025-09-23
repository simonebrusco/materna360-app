// src/pages/BuilderPage.tsx
import { useEffect } from "react";
import { BuilderComponent } from "@builder.io/react";
import { useLocation, useNavigate } from "react-router-dom";
import builder from "../lib/builder";

export default function BuilderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Intercepta cliques em links do Builder para navegar com o React Router
  useEffect(() => {
    const handler = (event: any) => {
      const href: string | undefined = event?.detail?.href;
      if (!href) return;

      // Links absolutos saem do app normalmente
      if (href.startsWith("http://") || href.startsWith("https://")) {
        window.location.href = href;
        return;
      }

      // Links internos navegam via router (sem recarregar)
      event.preventDefault?.();
      navigate(href);
    };

    window.addEventListener("builder:linkClick", handler as any);
    return () => window.removeEventListener("builder:linkClick", handler as any);
  }, [navigate]);

  return (
    <BuilderComponent
      model="page"
      // Diz ao Builder qual rota está ativa para buscar o conteúdo correto
      urlPath={location.pathname}
    />
  );
}
