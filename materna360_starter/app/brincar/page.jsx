// materna360_starter/app/brincar/page.jsx
"use client";

import { useMemo, useState } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import AppBar from "../../components/AppBar";
@@ -11,6 +11,7 @@ import * as Acts from "../../lib/activities";
import { addPlannerItem } from "../../lib/planner";
import { toast } from "../../lib/toast";

/** ------------ dados/base (defensivo) ------------ */
const ACTIVITIES = Array.isArray(Acts.ACTIVITIES) ? Acts.ACTIVITIES : (Acts.activities || []);
const AGE_BUCKETS = Acts.AGE_BUCKETS || [
  { id: "0-1", label: "0–1" },
@@ -36,6 +37,7 @@ function safeFilterActivities(params) {
  });
}

/** ------------ micro UI ------------ */
function Badge({ children }) {
  return (
    <span className="rounded-full bg-black/5 text-[13px] px-2.5 py-1">
@@ -44,35 +46,69 @@ function Badge({ children }) {
  );
}

// Ideias rápidas (geradas conforme idade/local)
// Skeleton card (shimmer)
function SkeletonCard() {
  return (
    <GlassCard className="p-4 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="w-full">
          <div className="h-4 w-2/3 rounded bg-black/10" />
          <div className="h-3 w-5/6 rounded bg-black/5 mt-2" />
          <div className="flex gap-2 mt-3">
            <div className="h-6 w-16 rounded-full bg-black/5" />
            <div className="h-6 w-20 rounded-full bg-black/5" />
            <div className="h-6 w-14 rounded-full bg-black/5" />
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <div className="h-9 w-20 rounded-xl bg-black/10" />
          <div className="h-9 w-20 rounded-xl bg-black/20" />
        </div>
      </div>
    </GlassCard>
  );
}

/** ------------ ideias rápidas ------------ */
function quickIdeas(age, place) {
  const base = {
    "0-1": ["Explorar texturas com panos", "Cantiga com toques suaves", "Olhar figuras grandes"],
    "2-3": ["Caça às cores pela casa", "Construir uma torre de 6 blocos", "Pintura com água no muro"],
    "2-3": ["Caça às cores pela casa", "Construir torre de blocos", "Pintura com água no muro"],
    "4-5": ["História maluca em 5 frases", "Pista de fita crepe", "Jogo de rimas"],
    "6-7": ["Labirinto com cordas (leve)", "Mapa do tesouro do quarto", "Teatro com bonecos"],
    "8+":  ["HQ rápida em 4 quadros", "Desafio de origami simples", "Coreografia de 30 segundos"],
    "8+":  ["HQ rápida em 4 quadros", "Origami simples", "Coreografia de 30 segundos"],
  }[age] || ["Brincadeira livre guiada", "Desenho de observação", "Jogo de mímica"];

  const localHint = {
    "casa": "que caiba no espaço da sala",
    "parque": "aproveitando gramado/bancos",
    "casa": "que caiba na sala",
    "parque": "aproveitando o gramado",
    "escola": "em duplas ou trio",
    "ao-ar-livre": "com vento/sol à vista",
  }[place];

  return base.map((t) => (localHint ? `${t} (${localHint})` : t));
}

/** ------------ página ------------ */
export default function BrincarPage() {
  const defaultAge = AGE_BUCKETS[0]?.id ?? "2-3";
  const defaultPlace = PLACES[0]?.id ?? "casa";

  const [age, setAge] = useState(defaultAge);
  const [place, setPlace] = useState(defaultPlace);

  // loading + paginação
  const [loading, setLoading] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);

  // FAB / painel
  const [showQuick, setShowQuick] = useState(false);
  const [myIdea, setMyIdea] = useState("");

  const listTopRef = useRef(null);

  // Sugestão do dia
  const suggestion = useMemo(() => {
    const len = ACTIVITIES.length || 1;
    const idx = Math.floor(0.37 * len) % len;
@@ -83,7 +119,26 @@ export default function BrincarPage() {
    };
  }, []);

  const list = useMemo(() => safeFilterActivities({ age, place }).slice(0, 12), [age, place]);
  // (novo) recálculo com shimmer
  useEffect(() => {
    setLoading(true);
    setVisibleCount(8);
    // Timeout curto: permite o re-render para exibir o shimmer com elegância
    const t = setTimeout(() => {
      const filtered = safeFilterActivities({ age, place });
      setAllItems(filtered);
      setLoading(false);
      // rola a lista para o topo (se existir)
      if (listTopRef.current) {
        listTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 220);
    return () => clearTimeout(t);
  }, [age, place]);

  const ideas = useMemo(() => quickIdeas(age, place), [age, place]);
  const pageItems = allItems.slice(0, visibleCount);
  const hasMore = visibleCount < allItems.length;

  function saveToPlanner(title) {
    if (!title) return;
@@ -94,8 +149,6 @@ export default function BrincarPage() {
    }
  }

  const ideas = useMemo(() => quickIdeas(age, place), [age, place]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-5">
      <AppBar title="Brincar" />
@@ -160,30 +213,41 @@ export default function BrincarPage() {

          <div className="shrink-0">
            <button
              onClick={() => {/* useMemo já refiltra */}}
              onClick={() => {/* useEffect já refiltra e mostra shimmer */}}
              className="rounded-xl bg-[var(--brand)] text-white px-4 py-2 text-sm"
            >
              Gerar Ideias
            </button>
          </div>
        </div>

        {!list.length && (
        {!allItems.length && !loading && (
          <p className="text-sm text-[var(--ink-soft)] mt-3">
            Use os filtros para ver ideias. Assim que você salvar uma atividade, ela aparece no Planner. 💛
          </p>
        )}
      </GlassCard>

      {/* Lista */}
      {/* Âncora para rolar ao topo quando trocar filtros */}
      <div ref={listTopRef} />

      {/* Lista com shimmer/paginação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map((a) => (
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading && pageItems.map((a) => (
          <GlassCard key={a.slug || a.title} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-base font-medium truncate">{a.title}</div>
                {a.subtitle && <div className="text-sm text-[var(--ink-soft)] mt-1 line-clamp-2">{a.subtitle}</div>}

                <div className="flex flex-wrap gap-2 mt-2">
                  {a.duration && <Badge>{a.duration} min</Badge>}
                  {Array.isArray(a.tags) && a.tags.slice(0, 3).map((t) => <Badge key={t}>{t}</Badge>)}
@@ -210,13 +274,25 @@ export default function BrincarPage() {
          </GlassCard>
        ))}

        {!list.length && (
        {!loading && !pageItems.length && (
          <GlassCard className="p-6 text-center text-[var(--ink-soft)]">
            Nenhuma atividade para esse filtro por enquanto. Tente outro recorte de idade ou local. 🌿
          </GlassCard>
        )}
      </div>

      {/* Ver mais */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setVisibleCount((v) => v + 8)}
            className="rounded-xl bg-white ring-1 ring-black/10 px-4 py-2 text-sm"
          >
            Ver mais
          </button>
        </div>
      )}

      {/* FAB */}
      <button
        aria-label="Ideias rápidas"
@@ -229,16 +305,19 @@ export default function BrincarPage() {
      {/* Painel de ideias rápidas */}
      {showQuick && (
        <div className="fixed inset-0 z-50">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowQuick(false)} />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-20 w-[min(92vw,700px)]">
            <GlassCard className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">Ideias rápidas</h3>
                  <p className="text-sm text-[var(--ink-soft)]">Geradas para {AGE_BUCKETS.find(a=>a.id===age)?.label} • {PLACES.find(p=>p.id===place)?.label}</p>
                  <p className="text-sm text-[var(--ink-soft)]">
                    Geradas para {AGE_BUCKETS.find(a=>a.id===age)?.label} • {PLACES.find(p=>p.id===place)?.label}
                  </p>
                </div>
                <button onClick={() => setShowQuick(false)} className="rounded-xl bg-white ring-1 ring-black/10 px-3 py-1.5 text-sm">Fechar</button>
                <button onClick={() => setShowQuick(false)} className="rounded-xl bg-white ring-1 ring-black/10 px-3 py-1.5 text-sm">
                  Fechar
                </button>
              </div>

              <div className="mt-3 space-y-2">
@@ -265,9 +344,13 @@ export default function BrincarPage() {
                    className="flex-1 rounded-xl bg-white ring-1 ring-black/10 px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => { saveToPlanner(myIdea); setMyIdea(""); setShowQuick(false); }}
                    onClick={() => { 
                      if (!myIdea.trim()) return;
                      saveToPlanner(myIdea);
                      setMyIdea("");
                      setShowQuick(false);
                    }}
                    className="rounded-xl bg-[var(--brand)] text-white px-4 py-2 text-sm"
                    disabled={!myIdea.trim()}
                  >
                    Adicionar
                  </button>
