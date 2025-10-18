// app/cuidar/alegrar/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SaveToPlannerButton from "@/components/SaveToPlannerButton";

const PROFILE_KEY = "m360:profile";

function getProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function AlegrarPage() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const profile = useMemo(() => getProfile(), []);
  const name = profile?.motherName || "mãe";
  const kidsCount = Array.isArray(profile?.kids) ? profile.kids.length : 0;
  const mood = profile?.mood || ""; // se você salvar isso no Eu360 depois, já será usado aqui

  async function loadPositives() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/positives", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, kidsCount, mood }),
      });
      const data = await res.json();
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPositives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-100 to-rose-50">
      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
        <Link href="/meu-dia" className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm">
          ← Meu Dia
        </Link>
        <div className="text-sm md:text-base font-medium text-[#1A2240]/70">
          Cuidar
        </div>
        <Link href="/cuidar" className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm">
          Voltar
        </Link>
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-6 pb-28">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A2240]">
            Alegrar
          </h1>
          <p className="mt-1 text-[#1A2240]/60">
            Mensagens positivas personalizadas para você, {name.split(" ")[0]}.
          </p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={loadPositives}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-[#ff005e] text-white disabled:opacity-60"
            >
              {loading ? "Gerando..." : "Gerar novas"}
            </button>
          </div>

          {/* lista de pílulas */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 flex flex-col justify-between"
              >
                <div className="text-2xl mb-2">{it.emoji || "💛"}</div>
                <p className="text-[#1A2240]">{it.text}</p>

                <div className="mt-3 flex gap-2">
                  <SaveToPlannerButton
                    title={it.text}
                    label="Guardar no Planner"
                    className="bg-white text-[#1A2240] border border-slate-200"
                  />
                  <button
                    onClick={() => {
                      try {
                        const shareText = `${it.text} ${it.emoji || "💛"}`;
                        if (navigator.share) {
                          navigator.share({ text: shareText });
                        } else {
                          navigator.clipboard.writeText(shareText);
                          alert("Copiado!");
                        }
                      } catch {}
                    }}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                  >
                    Compartilhar
                  </button>
                </div>
              </div>
            ))}

            {!loading && items.length === 0 && (
              <div className="col-span-full text-sm text-slate-600">
                Sem mensagens no momento. Clique em “Gerar novas”.
              </div>
            )}
          </div>

          <hr className="my-6 border-black/10" />

          <div className="text-sm text-slate-600 space-y-1">
            <p>
              Dica: quando gostar de uma frase, <strong>guarde no Planner</strong> para ver mais tarde.
            </p>
            <p>
              Se quiser, registre seu humor no Eu360 para personalizar ainda mais.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
