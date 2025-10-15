# Contribuindo para o Materna360

Obrigado por colaborar 💛  
Este documento explica **como trabalhar no projeto**, o **padrão de branches/PRs**, e **boas práticas** para manter tudo estável.

---

## 1) Como rodar localmente

**Requisitos**
- Node 18+ (recomendado 20+)
- NPM ou PNPM
- Conta Supabase (projeto criado) e chaves públicas

**Passos**
```bash
# 1. instale deps
npm install

# 2. crie o arquivo de env
cp .env.local.example .env.local
# edite .env.local com:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 3. rode o app
npm run dev
# abre em http://localhost:3000
