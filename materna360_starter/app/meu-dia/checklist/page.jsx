// materna360_starter/app/meu-dia/checklist/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import AppBar from "../../../components/AppBar.jsx";
import GlassCard from "../../../components/GlassCard.jsx";
import { get, set } from "../../../lib/storage.js";

/* ------------------------- storage helpers ------------------------- */
const DEFS_KEY = "m360:checklist_defs";

// chave diária do log (ex.: m360:checklist_log:2025-10-16)
function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}
const tid = () => `m360:checklist_log:${todayStr()}`;

const DEFAULT_ITEMS = [
  { id: "agua", title: "Beber água 6–8 copos" },
  { id: "respirar", title: "1 min de respiração consciente" },
  { id: "momento-filho", title: "Um momento de presença com meu filho" },
  { id: "movimento", title: "5 min de alongamento/movimento" },
  { id: "gentileza", title: "Uma gentileza comigo hoje" },
];

function slugify(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 40) || "item";
}

/* ---------------------------- Modal simples ---------------------------- */
function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* card */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white ring-1 ring-black/10 shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <h3 className="text-base font-semibold">{title}</h3>
          <button
            className="px-3 py-1.5 rounded-lg text-sm bg-black/5 hover:bg-black/10"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* --------------------------- Página principal --------------------------- */
export default function ChecklistPage() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [done, setDone] = useState([]);
  const [editing, setEditing] = useState(false);

  // init
  useEffect(() => {
    // defs
    const defs = get(DEFS_KEY, null);
    if (!defs || !Array.isArray(defs) || defs.length === 0) {
      set(DEFS_KEY, DEFAULT_ITEMS);
      setItems(DEFAULT_ITEMS);
    } else {
      setItems(defs);
    }
    // log de hoje
    const log = get(tid(), null);
    if (!log || !Array.isArray(log)) {
      set(tid(), []);
      setDone([]);
    } else {
      setDone(log);
    }
  }, []);

  const total = items.length;
  const count = done.length;
  const percent = total ? Math.round((count / total) * 100) : 0;

  function toast(msg) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("m360:toast", { detail: { message: msg } }));
    }
  }

  function toggle(id) {
    let next;
    if (done.includes(id)) {
      next = done.filter((x) => x !== id);
    } else {
      next = [id, ...done];
      toast("Feito! ✅");
    }
    setDone(next);
    set(tid(), next);

    // badge “Organizada” quando completa 3
    if (next.length === 3 && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Organizada" },
        })
      );
    }
  }

  /* ------------------------- Editor de Itens ------------------------- */
  const [draft, setDraft] = useState(items);

  // quando abrir o modal, carrega rascunho
  useEffect(() => {
    if (editing) setDraft(items.map((i) => ({ ...i })));
  }, [editing]); // eslint-disable-line

  function changeTitle(idx, title) {
    setDraft((prev) => {
      const copy = prev.slice();
      const current = copy[idx] || {};
      const idBase = slugify(title);
      // garante ids únicos (id, id-2, id-3, ...)
      let id = idBase;
      let n = 2;
      const exists = new Set(copy.map((x, j) => (j === idx ? "" : x.id)));
      while (exists.has(id)) {
        id = `${idBase}-${n++}`;
      }
      copy[idx] = { ...current, title, id };
      return copy;
    });
  }

  function addRow() {
    setDraft((prev) => [
      ...prev,
      { id: `novo-${Date.now().toString(36)}`, title: "Novo item" },
    ]);
  }

  function removeRow(idx) {
    setDraft((prev) => prev.filter((_, i) => i !== idx));
  }

  function move(idx, dir) {
    setDraft((prev) => {
      const copy = prev.slice();
      const j = idx + dir;
      if (j < 0 || j >= copy.length) return prev;
      const tmp = copy[idx];
      copy[idx] = copy[j];
      copy[j] = tmp;
      return copy;
    });
  }

  function saveDraft() {
    // limpa vazios
    const clean = draft
      .map((i) => ({ id: slugify(i.id || i.title), title: (i.title || "").trim() }))
      .filter((i) => i.title.length > 0);

    if (clean.length === 0) {
      toast("Adicione pelo menos um item.");
      return;
    }

    set(DEFS_KEY, clean);
    setItems(clean);

    // remove do log ids que não existem mais
    const log = get(tid(), []);
    const allowed = new Set(clean.map((i) => i.id));
    const pruned = (log || []).filter((id) => allowed.has(id));
    set(tid(), pruned);
    setDone(pruned);

    setEditing(false);
    toast("Checklist atualizado ✨");
  }

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <AppBar title="Checklist do Dia" backHref="/meu-dia" />

      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Hoje</h1>
            <p className="subtitle mt-0.5">
              {count}/{total} concluídos — {percent}%
            </p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1.5 rounded-xl text-sm bg-white ring-1 ring-black/10 hover:ring-black/20"
          >
            Editar lista
          </button>
        </div>

        <div className="mt-3 h-2 rounded-full bg-black/5 overflow-hidden">
          <div
            className="h-full bg-[var(--brand)] rounded-full transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        <ul className="mt-4 space-y-2">
          {items.map((it) => {
            const checked = done.includes(it.id);
            return (
              <li
                key={it.id}
                className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-black/[0.03]"
              >
                <button
                  onClick={() => toggle(it.id)}
                  aria-pressed={checked}
                  className={`h-6 w-6 grid place-items-center rounded-md ring-1 transition
                    ${checked ? "bg-[var(--brand)] text-white ring-[var(--brand)]" : "bg-white ring-black/10"}`}
                >
                  {checked ? "✓" : ""}
                </button>
                <span className={`text-sm ${checked ? "line-through opacity-60" : ""}`}>
                  {it.title}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="text-[12px] text-[var(--brand-navy-t60)] mt-4">
          Dica: 3/5 concluídos já é excelente — celebre 💛
        </p>
      </GlassCard>

      {/* ---------------------------- Modal Editor ---------------------------- */}
      <Modal
        open={editing}
        title="Editar itens do Checklist"
        onClose={() => setEditing(false)}
      >
        <div className="space-y-3">
          {draft?.length ? (
            draft.map((row, idx) => (
              <div
                key={row.id + idx}
                className="flex items-center gap-2 p-2 rounded-xl ring-1 ring-black/5 bg-black/[0.02]"
              >
                <input
                  className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm"
                  value={row.title}
                  onChange={(e) => changeTitle(idx, e.target.value)}
                  placeholder="Nome do item"
                />
                <div className="flex items-center gap-1">
                  <button
                    title="Mover para cima"
                    onClick={() => move(idx, -1)}
                    className="px-2 py-1 rounded-lg text-sm bg-white ring-1 ring-black/10"
                  >
                    ↑
                  </button>
                  <button
                    title="Mover para baixo"
                    onClick={() => move(idx, +1)}
                    className="px-2 py-1 rounded-lg text-sm bg-white ring-1 ring-black/10"
                  >
                    ↓
                  </button>
                  <button
                    title="Remover"
                    onClick={() => removeRow(idx)}
                    className="px-2 py-1 rounded-lg text-sm bg-white ring-1 ring-black/10 text-rose-600"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-[var(--brand-navy-t60)]">
              Nenhum item. Adicione abaixo.
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={addRow}
              className="px-3 py-2 rounded-xl bg-[var(--brand)] text-white text-sm"
            >
              + Adicionar item
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-2 rounded-xl bg-white ring-1 ring-black/10 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={saveDraft}
                className="px-3 py-2 rounded-xl bg-[var(--brand)] text-white text-sm"
              >
                Salvar alterações
              </button>
            </div>
          </div>

          <p className="text-[12px] text-[var(--brand-navy-t60)]">
            Dica: nomes curtos e claros funcionam melhor no dia a dia.
          </p>
        </div>
      </Modal>
    </main>
  );
}
