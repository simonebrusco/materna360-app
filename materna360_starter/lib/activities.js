// materna360_starter/lib/activities.js

// Buckets de idade e locais usados nos filtros
export const AGE_BUCKETS = [
  { id: "0-1", label: "0–1" },
  { id: "2-3", label: "2–3" },
  { id: "4-5", label: "4–5" },
  { id: "6-7", label: "6–7" },
  { id: "8+",  label: "8+"  },
];

export const PLACES = [
  { id: "casa",        label: "Casa" },
  { id: "parque",      label: "Parque" },
  { id: "escola",      label: "Escola" },
  { id: "ao-ar-livre", label: "Ao ar livre" },
];

// Catálogo semente (10 atividades com detalhes)
// Campos: slug, title, subtitle, ages, places, duration, tags, steps, benefits
export const ACTIVITIES = [
  {
    slug: "bolhas-sabao",
    title: "Pintura com Bolhas de Sabão",
    subtitle: "Mistura arte e ciência, com cuidado e diversão",
    ages: ["2-3", "4-5"],
    places: ["casa", "ao-ar-livre"],
    duration: 15,
    tags: ["sensorial", "cores", "coordenação"],
    steps: [
      "Misture água com um pouco de detergente e corante alimentício.",
      "Assopre bolhas sobre o papel e observe os padrões.",
      "Deixe secar e pendure a arte."
    ],
    benefits: ["Coordenação motora fina", "Curiosidade científica", "Criatividade"]
  },
  {
    slug: "musica-toque-resposta",
    title: "Músicas de Toque e Resposta",
    subtitle: "Batucar em objetos e repetir padrões simples",
    ages: ["2-3", "4-5", "6-7"],
    places: ["casa", "escola"],
    duration: 10,
    tags: ["ritmo", "audição", "vínculo"],
    steps: [
      "Escolha dois objetos que façam som (potes, colheres).",
      "Um bate um ritmo curto; o outro repete.",
      "Troquem os papéis e inventem novos ritmos."
    ],
    benefits: ["Atenção compartilhada", "Controle inibitório", "Expressão musical"]
  },
  {
    slug: "caixa-tesouros",
    title: "Caixa de Tesouros",
    subtitle: "Explorar texturas e sons com objetos do dia a dia",
    ages: ["0-1", "2-3"],
    places: ["casa"],
    duration: 10,
    tags: ["sensorial", "exploração"],
    steps: [
      "Separe 5–7 objetos seguros com texturas diferentes.",
      "Coloque em uma cesta e deixe a criança explorar.",
      "Nomeie as sensações: macio, áspero, frio…"
    ],
    benefits: ["Integração sensorial", "Vocabulário", "Autonomia"]
  },
  {
    slug: "casinha-panos",
    title: "Casinha de Panos",
    subtitle: "Cabaninha rápida com lençóis",
    ages: ["2-3", "4-5", "6-7"],
    places: ["casa"],
    duration: 20,
    tags: ["faz-de-conta", "arquitetura"],
    steps: [
      "Use cadeiras e um lençol para montar uma cabana.",
      "Levem livros e brinquedos para dentro.",
      "Brinquem de faz de conta (piquenique, consulta, acampamento)."
    ],
    benefits: ["Imaginação", "Planejamento", "Vínculo afetivo"]
  },
  {
    slug: "caca-cores",
    title: "Caça às Cores",
    subtitle: "Procure objetos de uma cor pela casa",
    ages: ["2-3", "4-5"],
    places: ["casa", "ao-ar-livre", "escola"],
    duration: 12,
    tags: ["atenção", "movimento"],
    steps: [
      "Escolham uma cor (ex.: amarelo).",
      "Encontrem 5 objetos dessa cor.",
      "Contem e alinhem os achados."
    ],
    benefits: ["Atenção visual", "Classificação", "Coordenação"]
  },
  {
    slug: "pistas-carros",
    title: "Pista de Carros com Fita",
    subtitle: "Ruas de fita crepe pelo chão",
    ages: ["2-3", "4-5", "6-7"],
    places: ["casa", "escola"],
    duration: 15,
    tags: ["engenharia", "coordenação"],
    steps: [
      "Cole fita no chão formando ruas e curvas.",
      "Crie sinais simples (pare, siga).",
      "Conduza carrinhos seguindo as pistas."
    ],
    benefits: ["Coordenação motora", "Regras simples", "Raciocínio espacial"]
  },
  {
    slug: "labirinto-corda",
    title: "Labirinto de Corda",
    subtitle: "Monte obstáculos no quintal ou sala",
    ages: ["4-5", "6-7", "8+"],
    places: ["ao-ar-livre", "casa", "parque"],
    duration: 20,
    tags: ["grossa", "equilíbrio"],
    steps: [
      "Prenda barbante entre cadeiras/pilares (baixo e seguro).",
      "Desafie a passar por baixo/por cima sem encostar.",
      "Cronometre e tente melhorar o tempo."
    ],
    benefits: ["Equilíbrio", "Planejamento motor", "Confiança corporal"]
  },
  {
    slug: "historia-maluca",
    title: "História Maluca",
    subtitle: "Contem uma história alternando frases",
    ages: ["4-5", "6-7", "8+"],
    places: ["casa", "escola"],
    duration: 10,
    tags: ["linguagem", "imaginação"],
    steps: [
      "Uma pessoa começa com uma frase curta.",
      "A outra continua com mais uma frase.",
      "Incluam reviravoltas e um final engraçado."
    ],
    benefits: ["Narrativa", "Escuta ativa", "Criatividade"]
  },
  {
    slug: "memoria-figuras",
    title: "Memória de Figuras",
    subtitle: "Jogo da memória com tampinhas/figurinhas",
    ages: ["4-5", "6-7"],
    places: ["casa", "escola"],
    duration: 15,
    tags: ["memória", "atenção"],
    steps: [
      "Faça pares de figuras (desenhe ou use adesivos).",
      "Vire de cabeça para baixo e joguem alternando.",
      "Conversem sobre estratégias (lembrar posições)."
    ],
    benefits: ["Memória de trabalho", "Atenção", "Regras sociais"]
  },
  {
    slug: "jardim-vasinho",
    title: "Jardim no Vasinho",
    subtitle: "Plante feijão/ervilha e observe crescer",
    ages: ["2-3", "4-5", "6-7", "8+"],
    places: ["casa", "escola", "ao-ar-livre"],
    duration: 15,
    tags: ["natureza", "ciência"],
    steps: [
      "Encha um copo transparente com algodão úmido.",
      "Coloque um grão de feijão encostado na parede do copo.",
      "Observe diariamente e registre mudanças."
    ],
    benefits: ["Curiosidade científica", "Responsabilidade", "Observação"]
  },
];

// Busca por slug
export function getBySlug(slug) {
  return ACTIVITIES.find((a) => a.slug === slug) || null;
}

// Filtro defensivo por idade e local
export function filterActivities({ age, place }) {
  return ACTIVITIES.filter((a) => {
    const okAge   = !a.ages   || a.ages.includes(age);
    const okPlace = !a.places || a.places.includes(place);
    return okAge && okPlace;
  });
}
