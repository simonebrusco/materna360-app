"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // ✅ export nomeado

export default function BrincarPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const { data, error } = await supabase
          .from("atividades")
          .select("*")
          .limit(20);
        if (error) throw error;
        if (active) setItems(data || []);
      } catch (err) {
        if (active) setErrorMsg(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <div className="p-4">Carregando...</div>;

  if (errorMsg)
    return <div className="p-4 text-red-600">Erro: {errorMsg}</div>;

  if (items.length === 0)
    return (
      <div className="p-4 text-gray-500">Nenhuma atividade encontrada.</div>
    );

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Brincar</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((it) => (
          <li
            key={it.id}
            className="rounded-xl border border-black/10 p-3 bg-white shadow-sm"
          >
            <h3 className="font-medium">{it.titulo || "Atividade"}</h3>
            {it.descricao && (
              <p className="text-sm text-gray-600 mt-1">{it.descricao}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
