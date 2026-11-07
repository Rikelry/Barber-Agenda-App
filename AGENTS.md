# AGENTS.md

Aplicativo mobile Expo/React Native. Priorize padrões mobile-first, performance e compatibilidade entre plataformas.

## 1. Antes de escrever: o que ler em cada tipo de tarefa

Leia nesta ordem antes de começar:

1. `docs/harness/01-arquitetura-mvvm.md` — camadas, direção de dependências e exemplos.
2. `docs/harness/02-convencoes-de-codigo.md` — nomenclatura, proibições e verificações.
3. `docs/harness/03-expo-e-react-native.md` — regras de Expo/React Native.
4. `docs/harness/04-views-e-design-system.md` — views, tokens e componentes.

Leituras adicionais por tipo de tarefa:

- **UI / design system:** leia também `design-system/01-principios.md`, `design-system/02-tokens.md`, `design-system/03-fundamentos.md`, `design-system/04-componentes/` e `design-system/06-acessibilidade.md`. Para fluxos, consulte `design-system/05-padroes.md`.
- **Arquitetura / negócio** (regras de negócio, estado de tela, acesso a dados, serviços): leia `docs/architecture/mvvm-sofisticado.md` antes de criar funcionalidades ou reorganizar código.
- **Expo / EAS / React Native:** não confie na memória. Leia a major do pacote `expo` no `package.json` e consulte a doc versionada `https://docs.expo.dev/versions/v<major>.0.0/`. Para o restante, use `https://docs.expo.dev/llms.txt`, siga os links da página necessária e nunca responda de memória.
- **Componente ou tela:** consulte a skill `barber-design-system` (`.agents/skills/barber-design-system/SKILL.md`).

## 2. Estrutura de pastas de src/

```text
src/
├── app/                      # rotas finas do Expo Router
├── view/
│   ├── components/           # componentes reutilizáveis
│   └── theme.ts              # tokens em código
├── viewmodel/                # useXViewModel.ts (tipos <Tela>State / <Tela>Actions)
├── usecase/                  # casos de uso
├── model/
│   ├── entities/
│   ├── datasources/
│   ├── services/
│   └── errors.ts
├── infra/
│   ├── datasources/
│   └── services/
└── di/
    └── container.ts
```

Nenhuma outra pasta. Não crie pastas da arquitetura antecipadamente — só o necessário para a funcionalidade atual. Mantenha componentes reutilizáveis e qualquer código que não seja rota fora de `src/app/`.

## 3. Regras de ouro (12)

1. `app/` só tem rotas finas (import da tela + `export default`).
2. `view/` espelha `app/` 1:1.
3. A View só renderiza: sem `expo-router`, `try/catch`, `fetch` ou dados.
4. Toda navegação fica na ViewModel.
5. ViewModel: `useXViewModel.ts` com tipos `<Tela>State` e `<Tela>Actions` (ex.: `LoginState`/`LoginActions`) via `useState`, retornando a tupla `[state, actions]`.
6. Regras de negócio e validações ficam nos Use Cases.
7. Domínio puro: entidade é `type`, contrato é `interface`, sem bibliotecas.
8. Infra implementa as interfaces e converte erros em `DomainError`.
9. Só `di/container.ts` importa `@/infra` (e os testes).
10. Estilos só com tokens do `theme.ts`; faltou token, pergunte.
11. Imports sempre com `@/`, nunca `./` ou `../`.
12. Proibido `any`, `React.FC`, `export default function`, `interface` em props.

### Regras adicionais do projeto

- Preserve o comportamento existente e faça alterações pequenas e direcionadas. Não reescreva módulos sem necessidade demonstrável.
- Use Cases dependem de contratos, não de implementações concretas de infraestrutura.
- Permita substituir dependências por implementações falsas nos testes, sem exigir Firebase, rede ou persistência real para testar regras de negócio.
- Centralize a composição das dependências em `src/di/` quando houver dependências concretas a conectar. Evite criar contêiner ou abstrações sem necessidade.
- Não adicione Firebase, AsyncStorage, bibliotecas de teste ou outras dependências só porque aparecem em material de referência. Confirme a necessidade e consulte a documentação compatível com as versões instaladas antes de alterar dependências.

## 4. Quem importa quem

| Camada | Pode importar | Nunca importa |
|---|---|---|
| `app/` | `view/` (a tela) | dados, lógica, `usecase/`, `infra/` |
| `view/` | `viewmodel/`, `view/components/`, `theme.ts`, `react-native` | `expo-router`, `usecase/`, `infra/`, `fetch` |
| `viewmodel/` | `usecase/`, `@/di/container`, `expo-router` | `infra/` (direto) |
| `usecase/` | `model/` | React, React Native, Expo, `infra/` |
| `model/` | apenas TypeScript puro | React, React Native, Expo, `infra/`, bibliotecas |
| `infra/` | `model/` (implementa contratos), SDKs | `view/`, `viewmodel/`, `usecase/` |
| `di/container.ts` | `infra/`, `usecase/` | `view/`, `viewmodel/` |

## 5. Vocabulário

- **Entidade** — tipo do domínio (`type`), sem dependências de framework.
- **DataSource** — contrato de acesso/persistência de dados.
- **Service** — contrato de uma responsabilidade específica.
- **Use Case** — ação de negócio que coordena DataSources/Services.
- **Proibido**: `Repository`, "repositório" e `Connector`.

## 6. Verificação (npm run check)

- Ao terminar qualquer alteração, rode `npm run check` e corrija tudo antes de dizer que terminou.
- Nunca declare uma verificação aprovada sem tê-la executado.
- Nunca mexa no verificador, no `AGENTS.md` ou no design system para fazer um erro sumir.
- Para alterações apenas de documentação, valide os documentos afetados e rode os checks de código só quando fizer sentido.

## 7. Expo

- Use **Expo Router** para toda navegação. As rotas ficam em `src/app/`: todo arquivo ali é uma tela e `_layout.tsx` define navegadores.
- Importe `Link`, `router` e `useLocalSearchParams` de `expo-router` (na ViewModel; a View não importa `expo-router`).
- Se `ios/` e `android/` não existem, são gerados por Continuous Native Generation. Nunca crie nem edite essas pastas à mão — configure o comportamento nativo em `app.json` e config plugins.
- O Expo Go inclui apenas os módulos nativos empacotados. Ao adicionar uma biblioteca com código nativo, o app exige um development build: `npx expo run:ios|android` localmente, ou `eas build --profile development`.
- Prefira módulos Expo recomendados a bibliotecas de terceiros e verifique as skills disponíveis antes de adicionar dependências.
- Use EAS para build, assinatura, submissão (`eas build`, `eas submit`) e atualizações OTA (`eas update`). Em projetos Bun, rode `bunx eas-cli <command>`; caso contrário, `npx eas-cli@latest <command>`.
- Use `bunx` no lugar de `npx` se o projeto usar bun (`bun.lock` presente).

Comandos:

- `npx expo install <package>` — sempre use no lugar de npm/yarn/pnpm/bun add, resolve versões compatíveis com o SDK.
- `npx expo start` — inicia o servidor de desenvolvimento.
- `npx expo lint` — lint.
- `npx tsc --noEmit` — typecheck.
- `npx expo-doctor` — diagnostica problemas de dependências e configuração.
- `npx expo install --fix` — corrige versões de pacotes incompatíveis.

Docs: `https://docs.expo.dev/router/introduction.md`, `https://docs.expo.dev/eas/index.md`, `https://docs.expo.dev/versions/latest/index.md`.

## 8. Design System

O app segue o sistema de design documentado em `design-system/`. Os valores visuais são decisões documentadas, não escolhas livres.

- **Fonte de verdade dos valores:** `design-system/02-tokens.md`. Leia também `01-principios.md`, `03-fundamentos.md`, `04-componentes/` e `06-acessibilidade.md` antes de criar ou alterar qualquer UI.
- **Tokens em código:** `src/view/theme.ts`. Crie ou altere esse arquivo somente quando a tarefa exigir. Antes, leia integralmente `design-system/02-tokens.md` e `design-system/03-fundamentos.md`, traduza fielmente os valores definidos e utilizáveis em código, não invente valores e não trate referências ilustrativas ou decisões marcadas como `TODO` como especificações concluídas.
- **Componentes reutilizáveis:** `src/view/components/`. **Telas e rotas:** `src/app/`. Não deixe componentes dentro de `src/app/`.
- **Especificação de componente:** `design-system/04-componentes/<nome>.md` (use `_modelo-componente.md` como formato). Cubra os estados padrão, pressionado, foco e desabilitado.
- **Acessibilidade:** respeite os critérios de contraste aplicáveis a texto e componentes, garanta alvos de toque de pelo menos 48 dp quando possível e use `accessibilityLabel` e `accessibilityRole` adequados. Considere leitores de tela, escala de fonte e indicadores de foco. Registre limitações ou conflitos com as especificações existentes.
- **Lacunas:** se faltar token, componente ou regra, registre a lacuna e peça esclarecimento em vez de decidir por conta própria. Quando os tokens definirem valores primitivos, mas os fundamentos ou as especificações deixarem o uso em aberto, preserve os valores documentados e não invente a regra de aplicação.
- **Origem:** marque cada decisão como `Herdado`, `Adaptado` ou `Novo`.
- A skill `barber-design-system` (`.agents/skills/barber-design-system/SKILL.md`) detalha o fluxo de criar componente e tela. Ao concluir, liste os tokens e componentes usados.

## 9. Como se comportar

- Faça uma tarefa por vez.
- Se algo estiver ambíguo, pergunte antes de decidir.
- Liste os arquivos criados/alterados por camada.
- Explique de forma didática e concisa.
