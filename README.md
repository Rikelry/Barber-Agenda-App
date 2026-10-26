# Barber Agenda · Sistema de design do app Barber Agenda
> `Welcome to your Expo app 👋`

> Versão: 0.1.0 (rascunho) · Grupo: Perypery Solutions · Disciplinas: IHC e PDM · IFPI Piripiri
>
> **Integrantes:** Afonso, Geovany, Rikelry e Gabriel.

## 1. Visão geral

O **Barber Agenda** é um aplicativo mobile de agendamento de serviços para barbearias, conectando clientes, profissionais e proprietários em uma única plataforma. O sistema de design deve proporcionar uma experiência simples, consistente, acessível e confiável, facilitando a descoberta de barbearias, a contratação de serviços e a organização das agendas.

- **App:** Barber Agenda.
- **Plataforma e stack:** Android, com React Native + Expo e TypeScript. O backend será integrado por API, utilizando a infraestrutura existente do projeto quando compatível.
- **Sistema base:** Material Design 3, adaptado à identidade visual e às necessidades do Barber Agenda.

## 2. Por que este sistema base (as cinco forças)

| Força | Justificativa em uma linha |
| --- | --- |
| Usuários | Clientes precisam agendar com poucos passos; profissionais e proprietários precisam consultar e gerenciar horários, serviços e atendimentos com clareza. |
| Acessibilidade | O Material Design 3 oferece diretrizes para contraste, tipografia, componentes e interação; o projeto complementará essas diretrizes com testes de acessibilidade. |
| Marca | A interface deve transmitir confiança, profissionalismo, organização e praticidade, com identidade visual consistente em todas as telas. |
| Plataforma | O foco inicial é Android, com publicação planejada na Google Play Store e padrões de interação adequados a dispositivos móveis. |
| Tecnologia | Os tokens serão centralizados e aplicados aos componentes reutilizáveis em React Native, mantendo consistência visual e facilitando a manutenção. |

## 3. Inventário: telas × componentes

Manter integralmente a tabela de telas e componentes da versão anterior, sem alterações.

## 4. Mapa dos arquivos

| Arquivo | Conteúdo |
| --- | --- |
| `01-principios.md` | Valores que guiam as decisões de design. |
| `02-tokens.md` | Tokens primitivos, semânticos e de componente, incluindo temas claro e escuro. |
| `03-fundamentos.md` | Regras de cor, tipografia, espaçamento, ícones, elevação e movimento. |
| `04-componentes/` | Especificações dos componentes reutilizáveis. |
| `05-padroes.md` | Fluxos e padrões de interação, como autenticação e agendamento. |
| `06-acessibilidade.md` | Contraste, alvos de toque, leitor de tela, foco e ampliação de texto. |
| `07-teste-com-ia.md` | Registro dos testes realizados com um assistente de IA. |
| `CHANGELOG.md` | Histórico de versões e mudanças. |

## 5. Etiquetas de origem

Cada token, componente e regra terá uma etiqueta de origem:

- **Herdado:** segue o sistema base sem alterações relevantes. A diretriz de origem deve ser identificada.
- **Adaptado:** parte do sistema base, mas foi ajustado para atender ao contexto do aplicativo. O motivo deve ser documentado.
- **Novo:** foi criado para uma necessidade específica do Barber Agenda que não é atendida diretamente pelo sistema base.

## 6. Glossário

| Termo | Significado |
| --- | --- |
| Token | Decisão de design identificada por nome e valor, como `color.action.primary`. |
| Componente | Elemento reutilizável da interface, como botão, campo de texto ou cartão de agendamento. |
| Fluxo | Sequência de telas e ações que permite concluir uma tarefa. |
| Estado | Condição de um componente ou tela, como padrão, pressionado, desabilitado, carregando ou com erro. |
| Design system | Conjunto documentado de princípios, tokens, componentes e padrões de interface. |
| TODO | Indicação temporária de informação ou decisão ainda pendente. |

## 7. Quem mantém

- **Modelo de governança:** híbrido. O grupo define e mantém os padrões comuns, enquanto cada integrante pode propor melhorias seguindo as regras documentadas.
- **Responsável por revisar mudanças:** grupo Perypery Solutions, com revisão compartilhada entre os quatro integrantes.
- **Como propor uma mudança:** registrar a justificativa, atualizar os arquivos afetados e o `CHANGELOG.md`, revisar acessibilidade e consistência e submeter as alterações para revisão do grupo.

## 8. Uso de IA na redação

A IA foi utilizada como apoio na elaboração e revisão inicial deste documento. O grupo deve revisar as sugestões, validar as decisões com os requisitos do projeto e registrar o uso de IA nos demais arquivos quando aplicável. As decisões finais e a validação do conteúdo são responsabilidade dos integrantes.

## 9. Instruções para assistentes de IA

Ao gerar ou alterar a interface do Barber Agenda:

1. Leia `01-principios.md`, `02-tokens.md` e `03-fundamentos.md` antes de implementar telas.
2. Use os tokens definidos no sistema de design. Não introduza cores, tamanhos ou raios arbitrários sem documentar a decisão.
3. Siga as especificações de `04-componentes/`, incluindo estados e comportamento.
4. Respeite `06-acessibilidade.md`, incluindo contraste mínimo de 4,5:1 para texto comum, alvos de toque adequados e suporte a leitores de tela.
5. Se faltar um token, componente ou regra, registre a lacuna e peça esclarecimento em vez de inventar uma decisão definitiva.
6. Diferencie decisões herdadas, adaptadas e novas.
7. Ao concluir uma implementação, liste os tokens, componentes e padrões utilizados.
8. Priorize a consistência com React Native + Expo e com os padrões de interação do Android.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **example** directory and create a blank **src/app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
