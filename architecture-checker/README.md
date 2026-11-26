# Architecture Checker

CLI em TypeScript para analisar dependências entre camadas de projetos React
Native com Expo e TypeScript, seguindo a arquitetura MVVM Sofisticada.

O checker combina regras estruturais, heurísticas com warnings, resolução de
imports baseada no `tsconfig.json` e análise sintática com a API do TypeScript.

## Requisitos

- Node.js e npm instalados.
- Um projeto-alvo com arquivos TypeScript ou TSX. A configuração do projeto,
  incluindo `paths` e `moduleResolution`, é lida do `tsconfig.json` quando
  disponível.

## Instalação e desenvolvimento local

Na pasta `architecture-checker`:

```bash
npm install
```

Execute sem gerar a pasta `dist`:

```bash
npm run dev -- ../caminho/para/meu-app
```

Para compilar e executar a versão compilada:

```bash
npm run build
npm start -- ../caminho/para/meu-app
```

Use um caminho relativo ou absoluto para o projeto analisado. As opções
disponíveis são:

```text
--help       Exibe ajuda
--version    Exibe a versão
--json       Emite o relatório como JSON
```

Exemplo de relatório JSON:

```bash
npm run dev -- ../caminho/para/meu-app --json > architecture-report.json
```

No modo JSON, o `stdout` contém somente o relatório. Erros de execução são
escritos no `stderr`.

## Camadas

O checker identifica as camadas pelos segmentos de caminho:

| Camada | Diretório reconhecido |
|---|---|
| `view` | `view` |
| `viewmodel` | `viewmodel` ou `viewmodels` |
| `usecase` | `usecase` ou `usecases` |
| `model` | `model` ou `models` |
| `infra` | `infra` |
| `di` | `di` |
| `routes` | `app` ou `routes` |
| `unknown` | Nenhuma correspondência |

Os separadores `/` e `\` são normalizados antes da identificação da camada.

## Matriz de dependências

As dependências abaixo são proibidas pela regra estrutural. Imports de tipo não
são uma exceção geral a essa matriz. Além dela, heurísticas podem emitir
warnings; por exemplo, um ViewModel que importa valores de Use Cases.

| Origem | Dependências proibidas |
|---|---|
| View | Use Case, Infra, DI |
| ViewModel | View, Infra |
| Use Case | View, ViewModel, DI, Infra |
| Model | Infra |
| Infra | View, ViewModel, Use Case, DI |
| DI | View, ViewModel |
| Routes | ViewModel, Use Case, Infra, DI, Model |

Assim, o domínio não depende de Infra; Infra pode depender de contratos do
Model; e Routes pode encaminhar para Views.

## Regras

| Código | Severidade | Verificação |
|---|---|---|
| `LAYER_DEPENDENCY_001` | error | Import interno entre camadas proibidas pela matriz. |
| `DI_COMPOSITION_001` | error | Use Case importado por um container DI sem evidência de composição ou instância não exportada em variável de topo. |
| `HEUR_VM_DI_001` | warning | ViewModel instancia diretamente uma classe de Use Case com `new`. |
| `HEUR_VM_USECASE_001` | warning | ViewModel importa valores de um módulo de Use Case. |
| `HEUR_DOMAIN_001` | warning | Model declara classes, exceto arquivos de erro de domínio reconhecidos pelo padrão `error` no caminho. |
| `HEUR_VIEW_001` | warning | View não possui import resolvido de um ViewModel; pastas `components` são ignoradas. |
| `HEUR_VIEW_BUSINESS_001` | warning | View cria objetos `Date`, o que pode indicar regra temporal na apresentação. |
| `HEUR_ERROR_001` | warning | Infra instancia `Error` genérico em vez de um erro de domínio. |

As heurísticas indicam possíveis problemas, não provas definitivas. Ajuste de
severidade não é configurável pela CLI nesta versão.

## Saída e códigos de saída

A saída em texto mostra camadas, estatísticas, resolução de imports e
violações agrupadas por severidade, incluindo arquivo, linha e sugestão quando
disponível.

Com `--json`, o relatório contém:

- `rootPath` e `detectedLayers`;
- estatísticas de arquivos, imports, declarações, arquivos por camada e
  resolução de imports;
- contagem de violações em `summary`;
- lista de `violations`.

Os códigos de saída são apropriados para uso em automações:

| Código | Significado |
|---|---|
| `0` | Nenhum erro ou warning. |
| `1` | Uma ou mais violações do tipo warning, sem erros. |
| `2` | Uma ou mais violações do tipo error. |

## CI/CD

Exemplo de comandos para um job de CI:

```bash
npm ci
npm run typecheck
npm test
npm run build
npm start -- ./caminho/para/meu-app --json > architecture-report.json
```

O job falha com código `1` para warnings ou `2` para erros. O arquivo JSON
continua disponível para ser publicado como artefato do pipeline.

## Fixtures e testes

Os projetos de exemplo usados pela suíte ficam em `tests/fixtures/`, incluindo
casos válidos, inválidos, composição DI e resolução de alias/import ausente.

Execute as verificações do próprio checker com:

```bash
npm run typecheck
npm test
```

## Limitações conhecidas

- A análise é estática e sintática; não executa o app nem prova o fluxo de
  dependências em runtime.
- A identificação de regras de negócio em Views é heurística; nesta versão, a
  regra específica detecta construções `new Date`.
- A extração de declarações e variáveis é focada nas declarações de topo.
- A regra DI reconhece padrões de import e instanciação representados pela AST;
  factories e outras composições indiretas podem não ser conclusivas.
- A resolução de aliases depende das opções TypeScript carregadas do projeto.
- O projeto Barber Agenda ainda precisa de uma execução de validação
  fim-a-fim; até lá, a cobertura de comportamento vem das fixtures e testes.

## Distribuição

O `package.json` define um executável chamado `architecture-checker`, mas o
pacote está marcado como `private`. Ele pode ser compilado e usado localmente;
publicação no npm ou distribuição para outros projetos requer preparação
adicional, incluindo rever a configuração `private`, licença, versão e arquivos
publicados.

