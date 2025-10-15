'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import FiltersBar from "@/components/FiltersBar";
import GlassCard from "@/components/GlassCard";

export const metadata = { title: "Brincar • Materna360" };

export default function BrincarPage() {
  const [zeroMat, setZeroMat] = useState(false);
  const [short, setShort] = useState(false);
  const [indoorOnly, setIndoorOnly] = useState(false);
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zeroMat, short, indoorOnly, q]);

  async function fetchData() {
    setLoading(true);
    let query = supabase
      .from("activities")
      .select("title, subtitle, icon, duration_min, zero_material, indoor, age_min, age_max, slug")
      .order("sort", { ascending: true });

    if (zeroMat) query = query.eq("zero_material", true);
    if (short) query = query.lte("duration_min", 10);
    if (indoorOnly) query = query.eq("indoor", true);
    if (q?.trim()) query = query.ilike("title", `%${q.trim()}%`);

    const { data } = await query;
    setItems(data || []);
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-md px-4">
      <div className="py-4">
        <h1 className="text-2xl font-semibold">Brincar</h1>
        <p className="text-brand-slate">Ideias rápidas com filtros de tempo e materiais.</p>
      </div>

      <FiltersBar
        zeroMat={zeroMat} setZeroMat={setZeroMat}
        short={short} setShort={setShort}
        indoorOnly={indoorOnly} setIndoorOnly={setIndoorOnly}
        q={q} setQ={setQ}
      />

      <div className="py-4 space-y-3">
        {loading && <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_,i)=> <div key={i} className="h-20 rounded-2xl bg-brand-secondary/60" />)}
        </div>}

        {!loading && items.length === 0 && (
          <GlassCard className="p-4 text-brand-slate">
            Nada por aqui com esses filtros. Tente remover algum filtro ou limpar a busca.
          </GlassCard>
        )}

        {!loading && items.map((a,i)=>(
          <Link key={i} href={`/brincar/${a.slug || '#'}`}>
            <div className="rounded-2xl border border-brand-secondary/60 bg-white p-4 shadow-soft">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{a.icon || "🎯"}</div>
                <div className="flex-1">
                  <div className="font-medium">{a.title}</div>
                  {a.subtitle && <div className="text-sm text-brand-slate">{a.subtitle}</div>}
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    {a.zero_material && <span className="px-2 py-0.5 rounded-full bg-brand-secondary/60">0 materiais</span>}
                    {a.duration_min && <span className="px-2 py-0.5 rounded-full bg-brand-secondary/60">{a.duration_min} min</span>}
                    {(a.age_min || a.age_max) && <span className="px-2 py-0.5 rounded-full bg-brand-secondary/60">
                      {a.age_min ?? "?"}–{a.age_max ?? "?"} anos
                    </span>}
                    {a.indoor && <span className="px-2 py-0.5 rounded-full bg-brand-secondary/60">dentro de casa</span>}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
