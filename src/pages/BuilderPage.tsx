import { useEffect } from "react";
import { BuilderComponent } from "@builder.io/react";
import { useLocation, useNavigate } from "react-router-dom";
import builder from "../lib/builder";

export default function BuilderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Intercepta cliques em <a> internos para usar SPA em vez de reload
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      // atalhos/condições que devem manter o comportamento padrão
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        e.defaultPrevented ||
        e.button !== 0 || // apenas botão esquerdo
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
      ) {
        return;
      }

      // só intercepta se for link da mesma origem
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      // Evita reload e navega com o Router
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
        apiKey={builder.apiKey!}
        locale="pt-BR"
        urlPath={location.pathname}
      />
    </div>
  );
}
