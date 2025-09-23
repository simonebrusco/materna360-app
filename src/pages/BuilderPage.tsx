import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BuilderComponent } from '@builder.io/react';
import { builder } from '../lib/builder';

export default function BuilderPage() {
  const { pathname } = useLocation();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    let alive = true;

    builder
      .get('page', { url: pathname })
      .toPromise()
      .then((res) => {
        if (alive) setContent(res);
      });

    return () => {
      alive = false;
    };
  }, [pathname]);

  if (!content) {
    return (
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: 16 }}>
        Carregando…
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: 16 }}>
      <BuilderComponent model="page" content={content} />
    </main>
  );
}
