'use client';
import { useEffect, useState } from "react";

function Row({ children }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

export default function AdminHome() {
  // states
  const [quote, setQuote] = useState({ id:null, text:"", author:"", starts_at:"", ends_at:"" });
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [msg, setMsg] = useState("");

  // load data
  useEffect(() => {
    (async () => {
      const q = await fetch("/api/admin/quotes").then(r=>r.json());
      if (q?.data?.[0]) setQuote(q.data[0]);
      const a = await fetch("/api/admin/activities").then(r=>r.json());
      if (a?.data) setActivities(a.data);
      const g = await fetch("/api/admin/goals").then(r=>r.json());
      if (g?.data) setGoals(g.data);
    })();
  }, []);

  async function saveQuote() {
    setMsg("Salvando Mensagem do Dia...");
    const res = await fetch("/api/admin/quotes", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(quote),
    });
    setMsg(res.ok ? "Mensagem salva ✔︎" : "Erro ao salvar ❌");
  }

  async function saveActivities() {
    setMsg("Salvando Atividades...");
    const res = await fetch("/api/admin/activities", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(activities),
    });
    setMsg(res.ok ? "Atividades salvas ✔︎" : "Erro ao salvar ❌");
  }

  async function saveGoals() {
    setMsg("Salvando Metas...");
    const res = await fetch("/api/admin/goals", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(goals),
    });
    setMsg(res.ok ? "Metas salvas ✔︎" : "Erro ao salvar ❌");
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Admin • Materna360</h1>
        <form action="/api/admin/logout" method="post">
          <button className="rounded-xl border px-3 py-1">Sair</button>
        </form>
      </div>

      {msg && <div className="text-sm text-brand-slate">{msg}</div>}

      {/* Mensagem do Dia */}
      <section className="space-y-3 bg-white border border-brand-secondary/60 rounded-2xl p-4">
        <h2 className="font-semibold">Mensagem do Dia</h2>
        <textarea
          className="w-full rounded-xl border p-2 border-brand-secondary/70"
          rows={3}
          value={quote.text || ""}
          onChange={(e)=>setQuote(q=>({ ...q, text: e.target.value }))}
          placeholder="Texto da mensagem"
        />
        <Row>
          <input className="rounded-xl border p-2 border-brand-secondary/70" placeholder="Autor"
            value={quote.author || ""} onChange={e=>setQuote(q=>({ ...q, author: e.target.value }))}/>
          <input className="rounded-xl border p-2 border-brand-secondary/70" placeholder="Início (YYYY-MM-DD HH:MM)"
            value={quote.starts_at ? quote.starts_at.slice(0,16).replace('T',' ') : "" }
            onChange={e=>setQuote(q=>({ ...q, starts_at: new Date(e.target.value) }))}/>
        </Row>
        <Row>
          <input className="rounded-xl border p-2 border-brand-secondary/70" placeholder="Fim (YYYY-MM-DD HH:MM)"
            value={quote.ends_at ? quote.ends_at.slice(0,16).replace('T',' ') : "" }
            onChange={e=>setQuote(q=>({ ...q, ends_at: new Date(e.target.value) }))}/>
          <div />
        </Row>
        <button onClick={saveQuote} className="rounded-xl bg-brand-primary text-white px-4 py-2">Salvar Mensagem</button>
      </section>

      {/* Atividades */}
      <section className="space-y-3 bg-white border border-brand-secondary/60 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Atividades (cards)</h2>
          <button onClick={()=>setActivities(a=>[...a, { title:"Nova", subtitle:"", icon:"✨", highlight:false, sort:(a[a.length-1]?.sort ?? 0)+1 }])}
            className="rounded-xl border px-3 py-1">+ Adicionar</button>
        </div>
        <div className="space-y-3">
          {activities.map((a,idx)=>(
            <div key={idx} className="grid sm:grid-cols-5 gap-2">
              <input className="rounded-xl border p-2 border-brand-secondary/70" value={a.title} onChange={e=>update(idx,{ title:e.target.value })} placeholder="Título"/>
              <input className="rounded-xl border p-2 border-brand-secondary/70" value={a.subtitle||""} onChange={e=>update(idx,{ subtitle:e.target.value })} placeholder="Subtítulo"/>
              <input className="rounded-xl border p-2 border-brand-secondary/70" value={a.icon||"✨"} onChange={e=>update(idx,{ icon:e.target.value })} placeholder="Ícone (emoji)"/>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!a.highlight} onChange={e=>update(idx,{ highlight:e.target.checked })}/>
                Destaque
              </label>
              <input type="number" className="rounded-xl border p-2 border-brand-secondary/70" value={a.sort??0} onChange={e=>update(idx,{ sort:Number(e.target.value) })} placeholder="Ordem"/>
            </div>
          ))}
        </div>
        <button onClick={saveActivities} className="rounded-xl bg-brand-primary text-white px-4 py-2">Salvar Atividades</button>
      </section>

      {/* Metas */}
      <section className="space-y-3 bg-white border border-brand-secondary/60 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Metas</h2>
          <button onClick={()=>setGoals(g=>[...g, { label:"Nova meta", sort:(g[g.length-1]?.sort ?? 0)+1 }])}
            className="rounded-xl border px-3 py-1">+ Adicionar</button>
        </div>
        <div className="space-y-3">
          {goals.map((g,idx)=>(
            <div key={idx} className="grid sm:grid-cols-2 gap-2">
              <input className="rounded-xl border p-2 border-brand-secondary/70" value={g.label} onChange={e=>setGoals(arr=>arr.map((it,i)=>i===idx?{...it,label:e.target.value}:it))} placeholder="Rótulo"/>
              <input type="number" className="rounded-xl border p-2 border-brand-secondary/70" value={g.sort??0} onChange={e=>setGoals(arr=>arr.map((it,i)=>i===idx?{...it,sort:Number(e.target.value)}:it))} placeholder="Ordem"/>
            </div>
          ))}
        </div>
        <button onClick={saveGoals} className="rounded-xl bg-brand-primary text-white px-4 py-2">Salvar Metas</button>
      </section>
    </div>
  );

  function update(index, patch) {
    setActivities(arr => arr.map((it,i)=> i===index ? {...it, ...patch} : it));
  }
}
