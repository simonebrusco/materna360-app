"use client";

import { useEffect, useMemo, useState } from "react";
import supabase from "@/lib/supabaseClient";
import ActivityCard from "@/components/ActivityCard";
import SectionTitle from "@/components/SectionTitle";

// tags que viram seções
const GROUPS = [
  { key: "rapidas",   title: "Brincadeiras rápidas",       where: (a) => a.duration_min && a.duration_min <= 10 },
  { key: "zero",      title: "Zero material",              where: (a) => a.zero_material === true },
  { key: "dentro",    title: "Dentro de casa",             where: (a) => a.indoor === true },
  { key: "movimento", title: "Para gastar energia",        where: (a) => (a.tags || []).includes("motora") || (a.tags || []).includes("coordenação") },
  { key: "criativas", title: "Imaginação & linguagem",     where: (a) => (a.tags || []).some(t => ["criatividade","linguagem","socioemocional"].includes(t)) },
];

export default function BrincarPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    zero: false,
    rapidas: false,
    dentro: false,
  });

  // carrega atividades (só as que são de brincar; exclui “selfcare”)
  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("priority", { ascending: true });

      const cleaned = (data || [])
        .filter(a => !(a.tags || []).includes("selfcare")) // não é lugar do "Momento para Mim"
        .map(a => ({
          id: a.id,
          title: a.title,
          desc: a.short_desc || a.content || "",
          tags: a.tags || [],
          duration_min: a.duration_min || null,
          indoor: a.indoor === true,
          zero_material: a.zero_material === true,
          emoji: a.emoji || "🎯"
        }));

      setItems(cleaned);
      setLoading(false);
    }
    load();
  }, []);

  // aplica filtros do header
  const filtered = useMemo(() => {
    return items.filter(a => {
      if (filters.zero && !a.zero_material) return false;
      if (filters.rapidas && !(a.duration_min && a.duration_min <= 10)) return false;
      if (filters.dentro && !a.indoor) return false;
      return true;
    });
  }, [items, filters]);

  // separa por seções
  const sections = useMemo(() => {
    return GROUPS.map(g => ({
      key: g.key,
      title: g.title,
      list: filtered.filter(g.where).slice(0, 8), // até 8 por seção (fica leve)
    })).filter(s => s.list.length > 0);
  }, [filtered]);

  return (
    <div className="mx-auto max-w-screen-sm px-4 pb-28">
      {/* Header + filtros fixos */}
      <div className="pt-4">
        <h1 className="text-[22px] font-semibold text-brand-ink">Brincar</h1>
        <p className="text-brand-ink/70 text-[14px] mt-1">
          Ideias rápidas para momentos especiais em família.
        </p>
      </div>

      <div
        className="
          sticky top-[60px] z-10 -mx-4 px-4 py-3 mt-3 mb-2
          bg-gradient-to-b from-white/65 to-white/30 backdrop-blur supports-[backdrop-filter]:bg-white/55
          border-y border-white/60
        "
      >
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilters(f => ({ ...f, zero: !f.zero }))}
            className={`chip-lg ${filters.zero ? "chip-active" : ""}`}
          >
            🧰 Zero material
          </button>
          <button
            onClick={() => setFilters(f => ({ ...f, rapidas: !f.rapidas }))}
            className={`chip-lg ${filters.rapidas ? "chip-active" : ""}`}
          >
            ⏱ ≤ 10 min
          </button>
          <button
            onClick={() => setFilters(f => ({ ...f, dentro: !f.dentro }))}
            className={`chip-lg ${filters.dentro ? "chip-active" : ""}`}
          >
            🏠 Dentro de casa
          </button>
        </div>
      </div>

      {/* Atividade do dia (primeiro item da lista já filtrada) */}
      {!loading && filtered.length > 0 ? (
        <section className="mb-6">
          <SectionTitle>Atividade do dia</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ActivityCard
              icon="🎯"
              title={filtered[0].title}
              desc={filtered[0].desc}
              tags={filtered[0].tags}
              duration={filtered[0].duration_min}
              indoor={filtered[0].indoor}
              zero={filtered[0].zero_material}
            />
          </div>
        </section>
      ) : null}

      {/* Seções automáticas */}
      {loading ? (
        <SkeletonGrid />
      ) : (
        sections.map(sec => (
          <section key={sec.key} className="mb-8">
            <SectionTitle>{sec.title}</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sec.list.map(a => (
                <ActivityCard
                  key={a.id}
                  icon={a.emoji}
                  title={a.title}
                  desc={a.desc}
                  tags={a.tags}
                  duration={a.duration_min}
                  indoor={a.indoor}
                  zero={a.zero_material}
                />
              ))}
            </div>
          </section>
        ))
      )}

      {/* Empty state */}
      {!loading && sections.length === 0 ? (
        <div className="text-center text-brand-ink/60 py-16">
          Nenhuma atividade encontrada com os filtros atuais.
        </div>
      ) : null}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-2xl h-[120px] bg-brand-secondary/20 animate-pulse" />
      ))}
    </div>
  );
}
