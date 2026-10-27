---
name: barber-design-system
description: Gera componentes e telas do app Barber Agenda seguindo o design system do repositório. Use quando o usuário pedir para criar, implementar ou alterar um componente ou uma tela do app. Não use para configuração de Expo/EAS nem para tarefas fora de src/.
---

# Barber Agenda · UI com o design system

Ao criar ou alterar qualquer componente ou tela deste app, siga o design system do repositório. Os valores visuais são decisões documentadas, não escolhas livres.

## Ordem de leitura (antes de escrever código)

1. `design-system/02-tokens.md` — fonte de verdade dos valores. Leia sempre.
2. `design-system/03-fundamentos.md` — cor, tipografia, espaçamento, ícone, elevação e movimento.
3. `design-system/04-componentes/` — especificação do componente (anatomia, variantes, estados). Use `_modelo-componente.md` como formato.
4. `design-system/01-principios.md` e `design-system/06-acessibilidade.md` — restrições que decidem o resultado.
5. `docs/architecture/mvvm-sofisticado.md` — consulte ao criar ou alterar telas que envolvam estado, regras de negócio, acesso a dados ou serviços.

## Regras de valores

- Antes de criar `src/theme/tokens.ts`, leia integralmente `design-system/02-tokens.md` e `design-system/03-fundamentos.md`.
- Traduza fielmente apenas os tokens cujos valores estejam definidos e sejam utilizáveis em código.
- Não invente valores para tokens semânticos, referências ilustrativas ou decisões marcadas como `TODO`.
- Se a tarefa depender de um token ainda indefinido, registre a lacuna e peça esclarecimento antes de implementar a decisão visual afetada.
- Não crie nem altere o tema visual em tarefas que não envolvam a interface, salvo se isso for necessário para corrigir um problema existente.

## Onde cada arquivo vive

- `src/app/` — telas e rotas (Expo Router). Cada arquivo é uma tela; `_layout.tsx` define navegadores.
- `src/components/` — componentes reutilizáveis. Não coloque componentes dentro de `src/app/`.
- `src/theme/` — tokens e tema.

## Integração com a arquitetura

- Consulte `AGENTS.md` e `docs/architecture/mvvm-sofisticado.md` quando a tarefa envolver telas, estado de interface, regras de negócio, serviços ou persistência.
- Mantenha `src/app/` dedicado às rotas e à composição de navegação. Componentes reutilizáveis ficam em `src/components/`; não coloque componentes de domínio ou de negócio dentro das rotas.
- A View deve renderizar o estado e encaminhar interações. Não deve implementar regras de negócio nem acessar diretamente APIs, serviços ou fontes de dados.
- Quando necessário, mantenha o estado e as ações da tela em uma ViewModel, e as regras de negócio em Use Cases ou no domínio. Não crie essas camadas artificialmente para telas estritamente visuais.
- Não importe implementações de infraestrutura diretamente para componentes visuais. Siga os contratos e a composição de dependências definidos na arquitetura.
- Ao implementar uma UI, preserve os limites entre as camadas e siga as especificações visuais documentadas. Se houver conflito ou lacuna entre as instruções, não invente uma solução silenciosamente: registre o problema e peça esclarecimento.

## Fluxo para criar um componente

1. Confirme a especificação em `design-system/04-componentes/<nome>.md`. Se não existir, crie a spec a partir de `_modelo-componente.md` antes do código.
2. Implemente em `src/components/` usando só tokens.
3. Cubra todos os estados previstos: padrão, pressionado, foco e desabilitado.
4. Aplique acessibilidade: contraste mínimo de 4,5:1, alvo de toque de 48 dp, `accessibilityLabel` e `accessibilityRole` corretos.
5. Marque a origem no relatório final: `Herdado`, `Adaptado` ou `Novo`.

## Fluxo para criar uma tela

1. Monte a tela com os componentes de `src/components/`, sem recriar estilos soltos.
2. Garanta uma única ação principal, clara e destacada (Princípio 1).
3. Respeite `design-system/05-padroes.md` quando a tela fizer parte de um fluxo (ex.: autenticação, agendamento).

## Verificação (obrigatória)

Rode antes de declarar a tarefa pronta:

```bash
npx expo lint
npx tsc --noEmit
```

## Relatório final

Liste, de forma curta: tokens usados, componentes usados ou criados, padrões seguidos e qualquer lacuna registrada.
