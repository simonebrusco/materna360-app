'use client';
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const TABS = [
  { key: "casa",   label: "Casa" },
  { key: "filhos", label: "Filhos" },
  { key: "eu",     label: "Eu" },
];

export default function PlannerTabs() {
  const [tab, setTab] = useState("casa");
  const [items, setItems] = useState([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("planner_items")
        .select("*")
        .eq("tab", tab)
        .order("due_date", { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.warn("Erro ao carregar planner", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  async function addItem() {
    if (!newText.trim()) return;
    await supabase.from("planner_items").insert({ tab, title: newText.trim() });
    setNewText("");
    await load();
  }

  async function toggle(id, done) {
    await supabase.from("planner_items").update({ done: !done }).eq("id", id);
    setItems((list) => list.map((it) => (it.id === id ? { ...it, done: !done } : it)));
  }

  async function remove(id) {
    await supabase.from("planner_items").delete().eq("id", id);
    setItems((list) => list.filter((it) => it.id !== id));
  }

  const progress = items.length
    ? Math.round((items.filter((item) => item.done).length / items.length) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white/90 backdrop-blur-xs border border-white/60">
        <ul className="grid grid-cols-3 text-center text-sm">
          {TABS.map(t=>(
            <li key={t.key}>
              <button
                onClick={()=>setTab(t.key)}
                className={`w-full py-3 ${tab===t.key ? 'font-medium text-brand-ink' : 'text-brand-slate'}`}>
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="flex gap-2">
          <input
            value={newText}
            onChange={e=>setNewText(e.target.value)}
            placeholder="Anotar rápido…"
            className="flex-1 rounded-xl border border-brand-secondary/60 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-primary/30"
          />
          <button onClick={addItem} className="rounded-xl bg-brand-primary text-white px-4">＋</button>
        </div>
      </div>

      <div className="space-y-2">
        {loading && <div className="h-24 rounded-2xl bg-brand-secondary/60 animate-pulse" />}
        {!loading && items.map(it=>(
          <div key={it.id} className="flex items-center justify-between rounded-xl border border-brand-secondary/60 bg-white px-3 py-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={it.done} onChange={()=>toggle(it.id, it.done)} />
              <span className={it.done ? "line-through text-brand-slate" : ""}>{it.title}</span>
            </label>
            <button onClick={()=>remove(it.id)} className="text-sm text-brand-slate">Excluir</button>
          </div>
        ))}
        {!loading && items.length===0 && <p className="text-brand-slate">Sem itens nesta aba ainda.</p>}
      </div>

      <div className="mt-4">
        <div className="text-sm text-brand-slate mb-1">Progresso</div>
        <div className="h-2 rounded-full bg-brand-secondary/60">
          <div className="h-2 rounded-full bg-brand-primary" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
