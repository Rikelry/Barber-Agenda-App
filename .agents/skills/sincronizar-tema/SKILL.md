---
name: sincronizar-tema
description: Gera src/view/theme.ts a partir de design-system/02-tokens.md e cria um componente por arquivo de design-system/04-componentes/. Use quando o tema ou os componentes precisarem ser (re)gerados a partir do design system.
---

# Sincronizar tema

1. Leia integralmente `design-system/02-tokens.md` e `design-system/03-fundamentos.md`.
2. Se houver **qualquer** decisão marcada como `TODO`, **PARE** e peça esclarecimento — não invente valores.
3. Gere `src/view/theme.ts` traduzindo fielmente apenas os tokens definidos e utilizáveis em código.
4. Para cada arquivo em `design-system/04-componentes/` (exceto `_modelo-componente.md`), crie o componente correspondente em `src/view/components/`, conforme o mapa em `docs/harness/04-views-e-design-system.md` (ex.: `botao.md` → `button.tsx`).
5. Cubra os estados padrão, pressionado, foco e desabilitado; aplique acessibilidade (contraste, alvo ≥ 48 dp, `accessibilityLabel`/`accessibilityRole`).
6. Use somente tokens do `theme.ts`.
7. Rode `npm run check` e corrija tudo até passar.
