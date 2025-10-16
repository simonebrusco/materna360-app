"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // ✅ export nomeado

export default function BrincarPage() {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarAtividades() {
      try {
        const { data, error } = await supabase
          .from("atividades")
          .select("*")
          .limit(20);
        if (error) throw error;
        if (ativo) setAtividades(data || []);
      } catch (e) {
        if (ativo) setErro(e.message);
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarAtividades();
    return () => {
      ativo = false;
    };
  }, []);

  if (loading) return <div className="p-4">Carregando...</div>;
  if (erro) return <div className="p-4 text-red-600">Erro: {erro}</div>;
  if (atividades.length === 0)
    return <div className="p-4 text-gray-500">Nenhuma atividade encontrada.</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Brincar</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {atividades.map((atv) => (
          <li key={atv.id} className="rounded-xl border border-black/10 p-3 bg-white shadow-sm">
            <h3 className="font-medium">{atv.titulo || "Atividade"}</h3>
            {atv.descricao && (
              <p className="text-sm text-gray-600 mt-1">{atv.descricao}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
