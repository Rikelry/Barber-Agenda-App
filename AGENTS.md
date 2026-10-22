This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Design System

O app segue o sistema de design documentado em `design-system/`. Os valores visuais são decisões documentadas, não escolhas livres.

- **Fonte de verdade dos valores:** `design-system/02-tokens.md`. Leia também `01-principios.md`, `03-fundamentos.md`, `04-componentes/` e `06-acessibilidade.md` antes de criar ou alterar qualquer UI.
- **Tokens em código:** `src/theme/tokens.ts`. Se não existir, crie-o traduzindo `02-tokens.md` fielmente (mesmos nomes e valores) — nunca invente cor, tamanho, raio ou espaçamento.
- **Componentes reutilizáveis:** `src/components/`. **Telas e rotas:** `src/app/` (Expo Router). Não deixe componentes dentro de `src/app/`.
- **Especificação de componente:** `design-system/04-componentes/<nome>.md` (use `_modelo-componente.md` como formato). Cubra os estados: padrão, pressionado, foco e desabilitado.
- **Acessibilidade:** contraste mínimo de 4,5:1, alvo de toque de 48 dp, `accessibilityLabel` e `accessibilityRole` corretos.
- **Lacunas:** se faltar token, componente ou regra, registre a lacuna e peça esclarecimento em vez de decidir por conta própria.
- **Origem:** marque cada decisão como `Herdado`, `Adaptado` ou `Novo`.
- A skill `barber-design-system` (`.trae/skills/`) detalha o fluxo de criar componente e tela. Ao concluir, liste os tokens e componentes usados.

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
