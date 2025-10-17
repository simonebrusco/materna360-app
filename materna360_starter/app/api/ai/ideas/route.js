// app/api/ai/ideas/route.js
// Mock IA — Gera até 3 ideias de brincadeiras personalizadas
// POST JSON: { ageRange?: "0-1"|"1-2"|"2-3"|"3-5"|"5-7"|"7-9", location?: "casa"|"arLivre", time?: number(min) }
// Resposta: { ideas: Array<{ title, type, duration, materials, description }> }

import { NextResponse } from "next/server";

function pick(arr, seed = 0) {
  if (!arr?.length) return null;
  const idx = Math.abs(seed) % arr.length;
  return arr[idx];
}

function hashSeed(input) {
  const str = JSON.stringify(input || {});
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const BANK = {
  base: [
    { title: "Caça aos Tesouros", type: "movimento", materials: ["post-its", "objetinhos"], min: 10, max: 20,
      desc: "Esconda 5 ‘tesouros’ pela casa. Dê pistas simples e celebre cada descoberta com um abraço." },
    { title: "História Maluca", type: "linguagem", materials: ["papel", "lápis"], min: 8, max: 15,
      desc: "Cada um fala uma frase e vocês montam uma história divertida. Desenhem a cena final." },
    { title: "Dança das Cores", type: "coordenação", materials: ["papéis coloridos"], min: 5, max: 10,
      desc: "Espalhe cores no chão. Toque uma música e diga ‘pule no azul’, ‘toque o verde com o cotovelo’." },
    { title: "Cozinha Cientista", type: "exploração", materials: ["água", "farinha", "corante"], min: 12, max: 20,
      desc: "Misturem água e farinha para massa sensorial. Testem cores e texturas com segurança." },
    { title: "Circuito de Almofadas", type: "motricidade", materials: ["almofadas"], min: 8, max: 15,
      desc: "Monte um percurso com almofadas para pular, rastejar e equilibrar." },
    { title: "Bingo dos Sons", type: "atenção", materials: ["lista de sons"], min: 6, max: 12,
      desc: "Fechem os olhos e identifiquem sons da casa/rua. Marquem cada som na lista." },
  ],
  porIdade: {
    "0-1": [
      { title: "Saco de Texturas", type: "sensorial", materials: ["panos macios"], min: 5, max: 8,
        desc: "Apresente diferentes texturas e nomeie as sensações com voz calma." },
      { title: "Música e Toque", type: "vínculo", materials: ["música suave"], min: 5, max: 10,
        desc: "Cante com contato pele a pele e movimentos lentos." }
    ],
    "1-2": [
      { title: "Esconde-Brinquedo", type: "permanência", materials: ["brinquedo"], min: 5, max: 8,
        desc: "Esconda parcialmente um brinquedo e incentive a procurar." },
      { title: "Empilhar Copinhos", type: "coordenação", materials: ["copos plásticos"], min: 6, max: 10,
        desc: "Façam torres e derrubem juntos. Conte as peças." }
    ],
    "2-3": [
      { title: "Pintura com Esponja", type: "arte", materials: ["esponja", "guache"], min: 8, max: 12,
        desc: "Use esponjas para carimbar formas. Nomeiem as cores." },
      { title: "Mini Mercado", type: "faz-de-conta", materials: ["itens da despensa"], min: 10, max: 15,
        desc: "Simulem compras: escolha, conte itens e ‘pague’ com tampinhas." }
    ],
    "3-5": [
      { title: "Caixa da Imaginação", type: "criatividade", materials: ["caixa", "fantasias"], min: 10, max: 20,
        desc: "Escolham personagens e criem uma pequena cena." },
      { title: "Mapa do Tesouro", type: "espacial", materials: ["papel", "caneta"], min: 12, max: 18,
        desc: "Desenhem um mapa do quarto/sala e sigam pistas simples." }
    ],
    "5-7": [
      { title: "Desafio dos 20 Passos", type: "motor", materials: ["fita no chão"], min: 10, max: 15,
        desc: "Crie 5 estações (pular, rolar, girar, equilibrar, alongar)." },
      { title: "Laboratório de Papel", type: "STEM", materials: ["papel", "fita"], min: 12, max: 20,
        desc: "Construa pontes/aviões e compare qual dura mais/voa mais." }
    ],
    "7-9": [
      { title: "Roteiro Stop Motion", type: "mídia", materials: ["celular", "massinha"], min: 15, max: 25,
        desc: "Crie um mini-filme fotografando quadro a quadro." },
      { title: "Repórter por um Dia", type: "comunicação", materials: ["papel", "caneta"], min: 10, max: 20,
        desc: "Entrevistem-se e escrevam uma ‘matéria’ com título e foto." }
    ],
  }
};

function fitDuration(item, wish) {
  if (!wish) return Math.max(item.min, 5);
  return Math.min(Math.max(wish, item.min), item.max);
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const ageRange = body.ageRange || null; // ex: "3-5"
  const location = body.location || "casa"; // "casa" | "arLivre"
  const time = Number(body.time || 0); // minutos desejados

  const seed = hashSeed({ ageRange, location, time });
  const bankAge = (ageRange && BANK.porIdade[ageRange]) || [];
  const pool = [...bankAge, ...BANK.base];

  // gere 3 ideias pseudo-determinísticas
  const ideas = [];
  for (let i = 0; i < 3 && pool.length; i++) {
    const item = pick(pool, seed + i * 17) || pool[0];
    const duration = fitDuration(item, time);
    ideas.push({
      title: item.title + (location === "arLivre" ? " (ao ar livre)" : ""),
      type: item.type,
      duration,
      materials: item.materials,
      description: item.desc,
    });
  }

  return NextResponse.json({ ideas }, { status: 200 });
}

export const runtime = "edge";
