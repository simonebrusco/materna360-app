"use client";

import { useEffect, useMemo, useState } from "react";

/** Peek compacto das notas + checklist da semana atual (somente leitura) */
const K_NOTES = "m360:planner_notes";
const K_HISTORY = "m360:checklist_history";
const WD = ["D","S","T","Q","Q","S","S"];

function isBrowser(){ return typeof window !== "undefined"; }
function readJSON(key, fb){ if(!isBrowser()) return fb; try{ const raw=localStorage.getItem(key); return raw?JSON.parse(raw):fb; }catch{ return fb; } }
function mondayOf(d=new Date()){ const t=new Date(d); const day=(t.getDay()+6)%7; t.setHours(12,0,0,0); t.setDate(t.getDate()-day); return t; }
function weekKeys(base=new Date()){
  const mon = mondayOf(base);
  return Array.from({length:7},(_,i)=>{ const x=new Date(mon); x.setDate(mon.getDate()+i); return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`; });
}
function infer(entry){ if(!entry?.items?.length) return 0; const d=entry.items.filter(i=>i?.done).length; return Math.round(d/entry.items.length*100); }

export default function PlannerNotesPeek(){
  const [notes, setNotes] = useState(()=>readJSON(K_NOTES,{}));
  const [history, setHistory] = useState(()=>readJSON(K_HISTORY,{}));
  const keys = useMemo(()=>weekKeys(new Date()),[]);

  useEffect(()=>{
    const onPlanner = ()=> setNotes(readJSON(K_NOTES,{}));
    const onChecklist = ()=> setHistory(readJSON(K_HISTORY,{}));
    window.addEventListener("m360:planner:changed", onPlanner);
    window.addEventListener("m360:checklist:changed", onChecklist);
    return ()=> {
      window.removeEventListener("m360:planner:changed", onPlanner);
      window.removeEventListener("m360:checklist:changed", onChecklist);
    };
  },[]);

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm font-medium mb-2">Semana em um olhar</div>
      <div className="grid grid-cols-7 gap-2">
        {keys.map((k,i)=>{
          const hasNote = Boolean(notes[k]);
          const prog = history[k]?.progress ?? infer(history[k]);
          return (
            <div key={k} className="rounded-lg border p-2 text-center">
              <div className="text-[10px] text-slate-500">{WD[i]}</div>
              <div className="mt-1 h-1 w-full bg-black/10 rounded">
                <div className="h-1 rounded bg-[#ff005e]" style={{width:`${prog||0}%`}} />
              </div>
              <div className={`mt-1 text-[10px] ${hasNote?"text-emerald-600":"text-slate-400"}`}>
                {hasNote ? "nota" : "—"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
