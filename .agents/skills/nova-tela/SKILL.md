---
name: nova-tela
description: Cria uma tela nova no Barber Agenda com rota fina, tela e ViewModel, seguindo o design system. Use quando o usuário pedir para criar ou implementar uma tela nova.
---

# Nova tela

1. Leia o design system (`design-system/01-principios.md`, `02-tokens.md`, `03-fundamentos.md`, `06-acessibilidade.md`) e a skill `.agents/skills/barber-design-system/SKILL.md`.
2. Localize o padrão de fluxo aplicável em `design-system/05-padroes.md`.
3. Crie a **rota fina** em `src/app/<nome>.tsx` (import da tela + `export default`).
4. Crie a **tela** em `src/view/<nome>.tsx`, espelhando `src/app/` 1:1. A View só renderiza e encaminha interações.
5. Crie a **ViewModel** em `src/viewmodel/use<Tela>ViewModel.ts`. O estado são tipos dependentes da tela (ex.: `LoginState` e `LoginActions`), implementados com `useState` do React e retornados na tupla `[state, actions]`. Toda navegação e todos os dados ficam aqui.
6. Cubra os estados: **carregando, erro, vazio e conteúdo**.
7. Use só componentes de `src/view/components/` e tokens de `src/view/theme.ts`.
8. Rode `npm run check` e corrija tudo até passar.
