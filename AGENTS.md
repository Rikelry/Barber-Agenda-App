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

After code changes, run lint and typecheck before declaring the task complete. For documentation-only changes, validate the affected documents and run code checks only when relevant.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Design System

O app segue o sistema de design documentado em `design-system/`. Os valores visuais são decisões documentadas, não escolhas livres.

- **Fonte de verdade dos valores:** `design-system/02-tokens.md`. Leia também `01-principios.md`, `03-fundamentos.md`, `04-componentes/` e `06-acessibilidade.md` antes de criar ou alterar qualquer UI.
- **Tokens em código:** `src/theme/tokens.ts`. Crie ou altere esse arquivo somente quando a tarefa exigir. Antes disso, leia integralmente `design-system/02-tokens.md` e `design-system/03-fundamentos.md`. Traduza fielmente os valores definidos e utilizáveis em código. Não invente valores nem trate referências ilustrativas ou decisões marcadas como `TODO` como especificações concluídas. Se uma decisão visual necessária ainda estiver indefinida, registre a lacuna e peça esclarecimento.
- **Componentes reutilizáveis:** `src/components/`. **Telas e rotas:** `src/app/` (Expo Router). Não deixe componentes dentro de `src/app/`.
- **Especificação de componente:** `design-system/04-componentes/<nome>.md` (use `_modelo-componente.md` como formato). Cubra os estados: padrão, pressionado, foco e desabilitado.
- **Acessibilidade:** respeite os critérios de contraste aplicáveis ao texto e aos componentes, garanta alvos de toque de pelo menos 48 dp quando possível e use `accessibilityLabel` e `accessibilityRole` adequados. Considere leitores de tela, escala de fonte e indicadores de foco. Registre limitações ou conflitos com as especificações existentes.
- **Lacunas:** se faltar token, componente ou regra, registre a lacuna e peça esclarecimento em vez de decidir por conta própria.
- **Origem:** marque cada decisão como `Herdado`, `Adaptado` ou `Novo`.
- A skill `barber-design-system` (`.agents/skills/barber-design-system/SKILL.md`) detalha o fluxo de criar componente e tela. Ao concluir, liste os tokens e componentes usados.
- Quando os tokens definirem valores primitivos, mas os fundamentos ou as especificações de componentes deixarem seu uso em aberto, preserve os valores documentados e não invente a regra de aplicação. Consulte o responsável pelo produto quando essa decisão for necessária para a tarefa.

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Arquitetura e organização do código

A arquitetura de referência do projeto está documentada em `docs/architecture/mvvm-sofisticado.md`. Consulte esse documento antes de criar funcionalidades ou reorganizar código que envolva regras de negócio, estado de tela, acesso a dados ou serviços.

### Regras obrigatórias

- Preserve o comportamento existente e faça alterações pequenas e direcionadas. Não reescreva módulos sem necessidade demonstrável.
- Separe responsabilidades entre View, ViewModel, Use Cases, Model, Infraestrutura e injeção de dependências conforme a necessidade real da funcionalidade.
- Views e componentes visuais não devem conter regras de negócio nem acessar diretamente serviços, APIs ou fontes de dados.
- ViewModels coordenam o estado apresentado à interface e as ações do usuário. Regras de negócio pertencem aos Use Cases ou ao domínio.
- Use Cases devem depender de contratos, não de implementações concretas de infraestrutura.
- Contratos de domínio não devem importar React, React Native, Expo, Firebase ou implementações de infraestrutura.
- Implemente acesso a dados e integrações externas na infraestrutura, isolando detalhes técnicos e traduzindo erros externos quando necessário.
- Centralize a composição das dependências em `src/di/` quando houver dependências concretas a conectar. Evite criar um contêiner ou abstrações sem necessidade.
- Permita substituir dependências por implementações falsas nos testes, sem exigir Firebase, rede ou persistência real para testar regras de negócio.
- Mantenha as rotas de `src/app/` focadas na navegação e na composição de telas. Coloque componentes reutilizáveis fora de `src/app/`.
- Não adicione Firebase, AsyncStorage, bibliotecas de teste ou outras dependências apenas porque aparecem no material de referência. Confirme a necessidade e consulte a documentação compatível com as versões instaladas antes de alterar dependências.
- Não crie todas as pastas da arquitetura antecipadamente. Introduza apenas as camadas necessárias para a funcionalidade atual e siga os padrões existentes quando forem adequados.
- Não invente decisões ausentes do design system. Registre lacunas e peça esclarecimentos quando elas afetarem a implementação visual.

### Validação

Ao concluir alterações de código, execute `npx expo lint` e `npx tsc --noEmit`, além dos testes relevantes disponíveis no projeto. Informe quais verificações foram executadas e seus resultados. Nunca declare uma verificação aprovada sem tê-la executado.
