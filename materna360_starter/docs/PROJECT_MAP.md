# Materna360 — Project Map

## Stack
- Next.js 14 (App Router) + Tailwind
- Deploy: Vercel
- DB: Supabase (Postgres) — RLS leitura pública
- UI tokens (tailwind.config):
  - brand-primary: #ff005e
  - brand-secondary: #ffd8e6
  - brand-ink: #2f3a56
  - brand-slate: #59636f

## Estrutura relevante
- materna360_starter/app/page.jsx → Home (“Meu Dia”)
- materna360_starter/app/brincar/* → atividades
- materna360_starter/app/cuidar/* → bem-estar
- materna360_starter/app/eu360/* → perfil/Planner
- components/GlassCard, ActionCard, Goal, DailyMessage
- lib/supabaseClient.js

## Rotas planejadas
- `/brincar` (filtros: zero material, ≤10 min, etc.)
- `/cuidar` (respiros, áudios, mini-rotinas)
- `/eu360` (planner, resumo, badges)

## Tabelas Supabase (mínimo)
- activities(title, subtitle, icon, highlight, sort, href, inserted_at, updated_at)
- goals(label, sort)
- daily_quotes(text, author, starts_at, ends_at)
- mood_checkins(mood, inserted_at)
- planner_tasks(id, title, due_date, status, scope) [planejado]

## Env / chaves
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- ADMIN_PASSWORD (Vercel env)

## Backlog próximo (curto prazo)
- [ ] Check-in completo (salvar humor + sugestões)
- [ ] Filtros em `/brincar` (zero material, ≤10 min)
- [ ] Programas 7D (Calma, Brincar, Sono) com progresso
- [ ] Planner: CRUD simples de tarefas
- [ ] Kits do Clube (descobrir) — 2 kits demo
