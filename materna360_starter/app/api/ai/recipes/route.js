// app/api/ai/recipes/route.js
// Mock IA — Gera até 3 receitas simples por faixa etária e ingredientes disponíveis
// POST JSON: { ageRange?: "6-12m"|"1-2"|"2-4"|"4-6"|"6-9", pantry?: string[] }
// Resposta: { recipes: Array<{ title, ageRange, prepTime, ingredients, steps, notes }> }

import { NextResponse } from "next/server";

function hashSeed(input) {
  const str = JSON.stringify(input || {});
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 33 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function pick(arr, seed = 0) {
  if (!arr?.length) return null;
  return arr[Math.abs(seed) % arr.length];
}

const AGE_BANK = {
  "6-12m": [
    {
      title: "Papinha de Batata Doce",
      base: ["batata doce", "água"],
      steps: [
        "Descasque e corte a batata doce.",
        "Cozinhe até ficar macia e amasse com um pouco de água de cozimento.",
      ],
      notes: "Textura adequada à fase. Sem sal/açúcar."
    },
    {
      title: "Purê de Abóbora",
      base: ["abóbora", "água"],
      steps: [
        "Cozinhe os cubos de abóbora no vapor.",
        "Amasse até obter consistência lisa.",
      ],
      notes: "Introduza um alimento por vez e observe reações."
    }
  ],
  "1-2": [
    {
      title: "Omelete Macio",
      base: ["ovo"],
      steps: [
        "Bata o ovo e cozinhe em fogo baixo.",
        "Corte em tiras para BLW ou em pedacinhos.",
      ],
      notes: "Acompanhe com legumes macios."
    },
    {
      title: "Arroz Cremoso com Legumes",
      base: ["arroz", "legumes"],
      steps: [
        "Refogue legumes bem picados.",
        "Junte arroz cozido e um fio de azeite.",
      ],
      notes: "Consistência úmida, fácil de mastigar."
    }
  ],
  "2-4": [
    {
      title: "Panquequinhas de Banana",
      base: ["banana", "ovo", "aveia"],
      steps: [
        "Amasse a banana, misture ovo e aveia.",
        "Faça disquinhos na frigideira antiaderente.",
      ],
      notes: "Sirva morno; pode polvilhar canela."
    },
    {
      title: "Macarrão Colorido",
      base: ["macarrão", "legumes"],
      steps: [
        "Cozinhe o macarrão.",
        "Salteie legumes em cubinhos e misture.",
      ],
      notes: "Cores convidam a experimentar."
    }
  ],
  "4-6": [
    {
      title: "Pizza de Pão de Forma",
      base: ["pão de forma", "molho de tomate", "queijo"],
      steps: [
        "Monte com molho e queijo.",
        "Leve ao forno até gratinar.",
      ],
      notes: "Deixe a criança montar a própria mini pizza."
    },
    {
      title: "Bolinhos de Arroz",
      base: ["arroz", "ovo", "queijo"],
      steps: [
        "Misture sobras de arroz com ovo e queijo.",
        "Asse em forminhas até firmar.",
      ],
      notes: "Aproveitamento de sobras; assado."
    }
  ],
  "6-9": [
    {
      title: "Wrap Colorido",
      base: ["tortilha", "frango", "alface", "cenoura"],
      steps: [
        "Recheie a tortilha e enrole.",
        "Corte em rolinhos para lancheira.",
      ],
      notes: "Inclua uma fruta como sobremesa."
    },
    {
      title: "Iogurte com Granola Caseira",
      base: ["iogurte", "aveia", "mel"], // mel apenas >1 ano
      steps: [
        "Misture iogurte com granola de aveia tostada.",
        "Finalize com fruta picada.",
      ],
      notes: "Ajuste açúcar conforme idade; mel apenas >1 ano."
    }
  ],
};

function buildFromPantry(base, pantry = []) {
  const have = new Set((pantry || []).map((s) => s.toLowerCase().trim()));
  const ings = [];
  base.forEach((b) => {
    ings.push(b);
    // adições simples quando disponíveis
    if (have.has("fruta") && /iogurte|panqueca|aveia|banana/.test(b)) ings.push("fruta da estação");
    if (have.has("queijo") && !ings.includes("queijo")) ings.push("queijo");
    if (have.has("legumes") && !ings.includes("legumes")) ings.push("legumes");
    if (have.has("azeite") && !ings.includes("azeite")) ings.push("azeite");
  });
  return Array.from(new Set(ings));
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const ageRange = body.ageRange || "2-4";
  const pantry = Array.isArray(body.pantry) ? body.pantry : [];

  const seed = hashSeed({ ageRange, pantry });
  const pool = AGE_BANK[ageRange] || AGE_BANK["2-4"];
  const count = Math.min(3, pool.length);

  const recipes = [];
  for (let i = 0; i < count; i++) {
    const base = pick(pool, seed + i * 13) || pool[0];
    recipes.push({
      title: base.title,
      ageRange,
      prepTime: 10 + (i * 5), // 10, 15, 20 (aprox.)
      ingredients: buildFromPantry(base.base, pantry),
      steps: base.steps,
      notes: base.notes,
    });
  }

  return NextResponse.json({ recipes }, { status: 200 });
}

export const runtime = "edge";
