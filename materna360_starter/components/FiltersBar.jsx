'use client';
export default function FiltersBar({ zeroMat, setZeroMat, short, setShort, indoorOnly, setIndoorOnly, q, setQ }) {
  return (
    <div className="sticky top-12 z-10 bg-white/90 backdrop-blur-xs -mx-4 px-4 pt-3 pb-2 border-b border-white/60">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={()=>setZeroMat(v=>!v)}
          className={`px-3 py-1 rounded-full border text-sm ${zeroMat ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white border-brand-secondary/60'}`}>
          Zero material
        </button>
        <button
          onClick={()=>setShort(v=>!v)}
          className={`px-3 py-1 rounded-full border text-sm ${short ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white border-brand-secondary/60'}`}>
          ≤ 10 min
        </button>
        <button
          onClick={()=>setIndoorOnly(v=>!v)}
          className={`px-3 py-1 rounded-full border text-sm ${indoorOnly ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white border-brand-secondary/60'}`}>
          Dentro de casa
        </button>
      </div>
      <input
        value={q}
        onChange={e=>setQ(e.target.value)}
        placeholder="Buscar por nome ou objetivo…"
        className="mt-2 w-full rounded-xl border border-brand-secondary/60 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-primary/30"
      />
    </div>
  );
}
