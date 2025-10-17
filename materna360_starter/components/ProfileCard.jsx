// materna360_starter/components/ProfileCard.jsx
"use client";

import { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { get, set, keys } from "../lib/storage";

const PROFILE_KEY = (keys && keys.profile) || "m360:profile";

export default function ProfileCard() {
  const [motherName, setMotherName] = useState("");
  const [kids, setKids] = useState([""]);

  // carregar do localStorage
  useEffect(() => {
    const p = get(PROFILE_KEY, { motherName: "", kids: [] });
    setMotherName(p.motherName || "");
    setKids(Array.isArray(p.kids) && p.kids.length ? p.kids : [""]);
  }, []);

  function addKid() {
    setKids((arr) => [...arr, ""]);
  }
  function updKid(i, v) {
    setKids((arr) => {
      const copy = [...arr];
      copy[i] = v;
      return copy;
    });
  }
  function rmKid(i) {
    setKids((arr) => (arr.length <= 1 ? [""] : arr.filter((_, idx) => idx !== i)));
  }

  function save() {
    const cleanKids = kids.map((k) => (k || "").trim()).filter(Boolean);
    const payload = { motherName: (motherName || "").trim(), kids: cleanKids };
    set(PROFILE_KEY, payload);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:toast", { detail: { message: "Preferências salvas 💛" } })
      );
      window.dispatchEvent(
        new CustomEvent("m360:profile:changed", { detail: payload })
      );
    }
  }

  return (
    <GlassCard className="p-4">
      <div className="font-medium">Personalização</div>
      <p className="text-sm opacity-60">
        Seu nome e o(s) nome(s) do(s) filho(s) deixam o app mais acolhedor 💛
      </p>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs uppercase tracking-wide text-[#1A2240]/60">Seu nome</span>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
            placeholder="ex.: Simone"
            value={motherName}
            onChange={(e) => setMotherName(e.target.value)}
          />
        </label>

        <div>
          <div className="text-xs uppercase tracking-wide text-[#1A2240]/60">Filhos</div>
          <div className="mt-1 space-y-2">
            {kids.map((k, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
                  placeholder={`Nome do filho ${i + 1}`}
                  value={k}
                  onChange={(e) => updKid(i, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => rmKid(i)}
                  className="px-3 rounded-xl bg-white border border-slate-200 text-sm"
                  title="Remover"
                >
                  −
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addKid}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-sm"
            >
              + Adicionar filho
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button onClick={save} className="btn btn-primary">Salvar</button>
      </div>
    </GlassCard>
  );
}
