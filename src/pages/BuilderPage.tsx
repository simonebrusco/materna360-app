// src/pages/BuilderPage.tsx
import { useEffect, useState } from "react";
import { BuilderComponent } from "@builder.io/react";
import { useLocation, useNavigate } from "react-router-dom";
import builder from "../lib/builder";

export default function BuilderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [hasContent, setHasContent] = useState<boolean | null>(null);
  const [lastError, setLastError] = useState<unknown>(null);

  // Verifica se existe conteúdo publicado no Builder para a URL atual
  useEffect(() => {
    let mounted = true;
    setHasContent(null);
    setLastError(null);

    console.log("[BuilderPage] checking content for", location.pathname);

    builder
      .get("page", { url: location.pathname, cachebust: true })
      .toPromise()
      .then((res) => {
        if (!mounted) return;
        console.log("[BuilderPage] get('page') result:", res);
        setHasContent(!!res);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("[BuilderPage] get('page') error:", err);
        setLastError(err);
        setHasContent(false);
      });

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  // Intercepta cliques em links internos renderizados pelo Builder
  useEffect(() => {
    const handler = (event: Event) => {
      const href: string | undefined = (event as CustomEvent<any>).detail?.href;
      if (!href) return;

      const url = new URL(href, window.location.origin);

      // link externo → navega normal
      if (url.origin !== window.location.origin) {
        console.log("[BuilderPage] external link →", href);
        window.location.href = href;
        return;
      }

      // link interno → navega via Router
      event.preventDefault?.();
      const next = `${url.pathname}${url.search}${url.hash}`;
      console.log("[BuilderPage] internal link → navigate:", next);
      navigate(next);
    };

    window.addEventListener("builder:linkClick", handler as any);
    return () => window.removeEventListener("builder:linkClick", handler as any);
  }, [navigate]);

  // estados de carregamento/fallback visíveis
  if (hasContent === null) {
    return <div style={{ padding: 24 }}>Carregando conteúdo do Builder…</div>;
  }

  if (!hasContent) {
    return (
      <div style={{ padding: 24 }}>
        <h3>Nenhum conteúdo encontrado para “{location.pathname}”.</h3>
        {lastError && (
          <pre style={{ whiteSpace: "pre-wrap", color: "tomato" }}>
            {String(lastError)}
          </pre>
        )}
        <ul>
          <li>
            No Builder.io, confirme que existe uma entrada <b>model: "page"</b>{" "}
            publicada para essa URL.
          </li>
          <li>
            Na Vercel, confira a variável <code>VITE_BUILDER_API_KEY</code> no
            projeto atual (Settings → Environment Variables).
          </li>
        </ul>
      </div>
    );
  }

  return (
    <BuilderComponent
      model="page"
      urlPath={location.pathname}
      options={{ includeRefs: true }}
      data={{}}
    />
  );
}
