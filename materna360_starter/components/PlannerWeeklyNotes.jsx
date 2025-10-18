"use client";

import { useEffect, useMemo, useState } from "react";
import PlannerQuickIdeas from "./PlannerQuickIdeas";

/** ========= Helpers locais (sem dependências externas) ========= */
const K_NOTES = "m360:planner_notes";
const K_HISTORY = "m360:checklist_history";
const WD = ["domingo","segunda","terça","quarta","quinta","sexta","sábado"];
const MONTHS = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

function cap(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : s; }
function fmtFull(d){ return `${cap(WD[d.getDay()])}, ${String(d.getDate()).padStart(2,"0")} de ${MONTHS[d.getMonth()]}`; }
function keyOf(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function isBrowser(){ return typeof window !== "undefined"; }

function readJSON(key, fb){
  if(!isBrowser()) return fb;
  try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fb; }catch{ return fb; }
}
function writeJSON(key, val){
  if(!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(val));
  try{ window.dispatchEvent(new CustomEvent("m360:planner:changed")); }catch{}
}

function mondayOf(d=new Date()){
  const t = new Date(d); const day = (t.getDay()+6)%7; // 0=mon .. 6=sun
  t.setHours(12,0,0,0); t.setDate(t.getDate()-day); return t;
}
function weekDays(base=new Date()){
  const mon = mondayOf(base);
  return Array.from({length:7}, (_,i)=>{ const x=new Date(mon); x.setDate(mon.getDate()+i); return x; });
}

function inferProgress(entry){
  if(!entry || !Array.isArray(entry.items) || !entry.items.length) return 0;
  const done = entry.items.filter(i=>i?.done).length;
  return Math.round(done/entry.items.length*100);
}
/** ============================================================= */

export default function PlannerWeeklyNotes(){
  const today = useMemo(()=>new Date(),[]);
  const days = useMemo(()=>weekDays(today),[today]);
  const todayKey = useMemo(()=>keyOf(today),[today]);

  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [notes, setNotes] = useState(()=> readJSON(K_NOTES, {}));
  const [history, setHistory] = useState(()=> readJSON(K_HISTORY, {}));
  const [text, setText] = useState(notes[todayKey] ?? "");

  // sincroniza quando houver mudanças externas
  useEffect(()=>{
    const onPlanner = ()=> setNotes(readJSON(K_NOTES, {}));
    const onChecklist = ()=> setHistory(readJSON(K_HISTORY, {}));
    window.addEventListener("m360:planner:changed", onPlanner);
    window.addEventListener("m360:checklist:changed", onChecklist);
    return ()=> {
      window.removeEventListener("m360:planner:changed", onPlanner);
      window.removeEventListener("m360:checklist:changed", onChecklist);
    };
  },[]);

  // trocar de dia: persiste o texto anterior e carrega o novo
  function selectDay(k){
    if(k===selectedKey) return;
    const nextNotes = { ...notes, [selectedKey]: text };
    setNotes(nextNotes);
    writeJSON(K_NOTES, nextNotes);
    setSelectedKey(k);
    setText(nextNotes[k] ?? "");
  }

  function save(){
    const next = { ...notes, [selectedKey]: text };
    setNotes(next);
    writeJSON(K_NOTES, next);
  }
  function clearDay(){
    if(!confirm("Limpar as anotações deste dia?")) return;
    const next = { ...notes };
    delete next[selectedKey];
    setNotes(next);
    writeJSON(K_NOTES, next);
    setText("");
  }
  async function copyDay(){
    try{
      await navigator.clipboard.writeText(text || "");
      alert("Copiado!");
    }catch{ alert("Não foi possível copiar."); }
  }

  // ⤵️ novo: adicionar texto ao bloco de notas de hoje (usado pelo PlannerQuickIdeas)
  function appendToNotes(extra){
    const current = text ? (text.endsWith("\n") ? text : text + "\n") : "";
    const nextText = current + String(extra || "");
    setText(nextText);
    const next = { ...notes, [selectedKey]: nextText };
    setNotes(next);
    writeJSON(K_NOTES, next);
  }

  const selectedDate = useMemo(()=>{
    const [y,m,d] = selectedKey.split("-").map(n=>parseInt(n,10));
    return new Date(y, m-1, d, 12,0,0,0);
  },[selectedKey]);

  const entry = history[selectedKey] || null;
  const progress = entry?.progress ?? inferProgress(entry);

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      {/* abas da semana */}
      <div className="flex gap-2 overflow-x-auto p-2">
        {days.map(d=>{
          const k = keyOf(d);
          const sel = k===selectedKey;
          return (
            <button
              key={k}
              onClick={()=>selectDay(k)}
              className={`px-3 py-2 rounded-full border ${sel ? "bg-[#ffd8e6] border-[#ff99bf]" : "bg-slate-50"}`}
              title={fmtFull(d)}
            >
              <div className="text-[10px] leading-none">{WD[d.getDay()].slice(0,3)}</div>
              <div className="text-sm font-medium leading-tight">{d.getDate()}</div>
            </button>
          );
        })}
      </div>

      {/* cabeçalho do dia */}
      <div className="px-4 pb-2">
        <div className="text-sm text-slate-500">{fmtFull(selectedDate)}</div>
      </div>

      {/* bloco de notas */}
      <div className="px-4 pb-4">
        <label className="text-sm text-slate-600">Bloco de notas</label>
        <textarea
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder="Anote compromissos, lembretes ou ideias…"
          className="mt-1 w-full min-h-[110px] rounded-lg border p-2"
        />
        <div className="flex gap-2 justify-end mt-2">
          <button onClick={clearDay} className="px-3 py-2 rounded-lg border border-rose-200 text-rose-600">Limpar</button>
          <button onClick={copyDay}  className="px-3 py-2 rounded-lg border">Copiar</button>
          <button onClick={save}     className="px-3 py-2 rounded-lg bg-[#ff005e] text-white">Salvar</button>
        </div>

        {/* 🔮 IA: Gerar ideias e adicionar ao bloco de notas */}
        <PlannerQuickIdeas dayKey={selectedKey} onAppend={appendToNotes} />
      </div>

      {/* resumo do checklist do dia */}
      <div className="px-4 pb-4">
        <div className="text-sm font-medium mb-2">Checklist do dia</div>
        <div className="h-2 w-full rounded-full bg-black/5 overflow-hidden">
          <div className="h-full bg-[#ff005e] rounded-full" style={{width:`${progress||0}%`}} />
        </div>
        {Array.isArray(entry?.items) && entry.items.length ? (
          <ul className="mt-3 grid grid-cols-1 gap-1 text-sm text-slate-700">
            {entry.items.map((it)=>(
              <li key={it.id} className="flex items-center gap-2">
                <span className={`inline-block h-2 w-2 rounded-full ${it.done ? "bg-green-500" : "bg-slate-300"}`} />
                <span className={it.done ? "line-through text-slate-400" : ""}>{it.label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-2 text-xs text-slate-500">Ainda não há checklist salvo para este dia.</div>
        )}
      </div>
    </div>
  );
}
