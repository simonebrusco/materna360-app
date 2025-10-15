insert into public.activities (title, emoji, short_desc, tags, duration_min, zero_material, indoor, age_min, age_max)
values
  ('Caça ao Tesouro do Sofá', '🛋️', 'Esconda pequenos objetos pelo sofá para a criança encontrar.', '{"observação","atenção"}', 8, true, true, 3, 6),
  ('Dança das Cadeiras Imaginária', '💃', 'Coloquem uma música e dancem, congelando quando a música parar.', '{"movimento","música"}', 10, true, true, 2, 6),
  ('História a Quatro Mãos', '📖', 'Cada um inventa uma parte da história com o mesmo personagem.', '{"criatividade","fala"}', 12, true, true, 4, 7),
  ('Pista de Carrinhos com Fita', '🚗', 'Use fita adesiva no chão para criar ruas e pistas de corrida.', '{"coordenação","imaginação"}', 15, false, true, 3, 6),
  ('Bolhas de Sabão Gigantes', '🫧', 'Faça bolhas com argolas ou cabides e corra para estourá-las.', '{"ar livre","diversão"}', 12, false, false, 2, 6),
  ('Chef de Cozinha', '👩‍🍳', 'Preparem juntos um lanche simples, separando ingredientes.', '{"culinária","organização"}', 20, false, true, 4, 7),
  ('Ioga Mirim', '🧘', 'Imitem posições de ioga e respirem juntos contando até cinco.', '{"respiração","calma"}', 7, true, true, 3, 6),
  ('Corrida do Equilíbrio', '🤹', 'Equilibrem livros ou almofadas na cabeça até a linha de chegada.', '{"equilíbrio","risadas"}', 6, true, false, 3, 6),
  ('Oficina de Fantoches', '🧵', 'Use meias ou sacolas de papel para criar personagens.', '{"arte","contação"}', 18, false, true, 4, 7),
  ('Caixa dos Sentidos', '🎁', 'Coloque objetos secretos em uma caixa e adivinhem pelo toque.', '{"sensações","jogo"}', 9, true, true, 2, 5)
on conflict (title) do update set
  emoji = excluded.emoji,
  short_desc = excluded.short_desc,
  tags = excluded.tags,
  duration_min = excluded.duration_min,
  zero_material = excluded.zero_material,
  indoor = excluded.indoor,
  age_min = excluded.age_min,
  age_max = excluded.age_max;
