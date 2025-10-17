// materna360_starter/components/ChecklistEditorModal.jsx
"use client";

import { useEffect, useState } from "react";
import { get, set } from "../lib/storage.js";

/** chaves e helpers — mesmas do /meu-dia/checklist */
const DEFS_KEY = "m360:checklist_defs";
const DEFAULT_ITEMS = [
  { id: "agua", title: "Beber água 6–8 copos" },
  { id: "respirar", title: "1 min de respiração consciente" },
  { id: "momento-filho", title: "Um momento de presença com meu filho" },
  { id: "movimento", title: "5 min de alongamento/movimento" },
  { id: "gentileza", title: "Uma gentileza comigo hoje" },
];

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}
const tid = () => `m360:checklist_log:${todayStr()}`;

function slugify(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 40) || "item";
}

function ModalFrame({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose}/>
      <div className="relative w-full max-w-xl rounded-2xl bg-white ring-1 ring-black/10 shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <h3 className="text-base font-semibold">{title}</h3>
          <button className="px-3 py-1.5 rounded-lg text-sm bg-black/5 hover:bg-black/10" onClick={onClose}>Fechar</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/** Componente principal */
export default function ChecklistEditorModal({ open, onClose }) {
  const [draft, setDraft] = useState([]);

  useEffect(() => {
    if (!open) return;
    // garantir defs base
    const defs = get(DEFS_KEY, null);
    if (!defs || !Array.isArray(defs) || defs.length === 0) {
      set(DEFS_KEY, DEFAULT_ITEMS);
      setDraft(DEFAULT_ITEMS.map((i) => ({ ...i })));
    } else {
      setDraft(defs.map((i) => ({ ...i })));
    }
  }, [open]);

  function changeTitle(idx, title) {
    setDraft((prev) => {
      const copy = prev.slice();
      const current = copy[idx] || {};
      const idBase = slugify(title);
      // IDs únicos
      let id = idBase || `item-${Date.now().toString(36)}`;
      let n = 2;
      const exists = new Set(copy.map((x, j) => (j === idx ? "" : x.id)));
      while (exists.has(id)) id = `${idBase}-${n++}`;
      copy[idx] = { ...current, title, id };
      return copy;
    });
  }
  function addRow() {
    setDraft((p) => [...p, { id: `novo-${Date.now().toString(36)}`, title: "Novo item" }]);
  }
  function removeRow(idx) {
    setDraft((p) => p.filter((_, i) => i !== idx));
  }
  function move(idx, dir) {
    setDraft((p) => {
      const c = p.slice();
      const j = idx + dir;
      if (j < 0 || j >= c.length) return p;
      const tmp = c[idx]; c[idx] = c[j]; c[j] = tmp;
      return c;
    });
  }

  function toast(msg) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("m360:toast", { detail: { message: msg } }));
    }
  }

  function saveDraft() {
    const clean = draft
      .map((i) => ({ id: slugify(i.id || i.title), title: (i.title || "").trim() }))
      .filter((i) => i.title.length > 0);

    if (!clean.length) {
      toast("Adicione pelo menos um item.");
      return;
    }
    // salva definições
    set(DEFS_KEY, clean);

    // poda o log de hoje para conter apenas IDs válidos
    const log = get(tid(), []);
    const allowed = new Set(clean.map((i) => i.id));
    const pruned = (log || []).filter((id) => allowed.has(id));
    set(tid(), pruned);

    toast("Checklist atualizado ✨");
    onClose?.();
  }

  return (
    <ModalFrame open={open} title="Editar itens do Checklist" onClose={onClose}>
      <div className="space-y-3">
        {draft?.length ? draft.map((row, idx) => (
          <div key={row.id + idx} className="flex items-center gap-2 p-2 rounded-xl ring-1 ring-black/5 bg-black/[0.02]">
            <input
              className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm"
              value={row.title}
              onChange={(e) => changeTitle(idx, e.target.value)}
              placeholder="Nome do item"
            />
            <div className="flex items-center gap-1">
              <button title="Cima" onClick={() => move(idx, -1)} className="px-2 py-1 rounded-lg text-sm bg-white ring-1 ring-black/10">↑</button>
              <button title="Baixo" onClick={() => move(idx, +1)} className="px-2 py-1 rounded-lg text-sm bg-white ring-1 ring-black/10">↓</button>
              <button title="Remover" onClick={() => removeRow(idx)} className="px-2 py-1 rounded-lg text-sm bg-white ring-1 ring-black/10 text-rose-600">Remover</button>
            </div>
          </div>
        )) : (
          <div className="text-sm text-[var(--brand-navy-t60)]">Nenhum item. Adicione abaixo.</div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button onClick={addRow} className="px-3 py-2 rounded-xl bg-[var(--brand)] text-white text-sm">+ Adicionar item</button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-2 rounded-xl bg-white ring-1 ring-black/10 text-sm">Cancelar</button>
            <button onClick={saveDraft} className="px-3 py-2 rounded-xl bg-[var(--brand)] text-white text-sm">Salvar alterações</button>
          </div>
        </div>

        <p className="text-[12px] text-[var(--brand-navy-t60)]">
          Dica: nomes curtos e claros funcionam melhor no dia a dia.
        </p>
      </div>
    </ModalFrame>
  );
}
