# CONTEXTO DO PROJETO

Ferramenta CLI "architecture-checker" (TypeScript) que analisa projetos React Native + Expo e valida a arquitetura MVVM Sofisticado (capítulo 10 do material de referência). Issue #10 do repositório Rikelry/Barber-Agenda-App. Pasta: architecture-checker.

## Camadas e direção das dependências

Fluxo: View → ViewModel → Container DI → Use Case → contratos do domínio ← Infra

Regra central: o domínio NÃO depende da infraestrutura. A Infra implementa os contratos definidos pelo domínio.

(✅ pode importar, ❌ não pode)

| Origem ↓ / Destino → | View | ViewModel | Container DI | Use Case | Domínio (contratos) | Infra |
|---|---|---|---|---|---|---|
| View | ✅ | ✅ | ❌ | ❌ | ✅ (só tipos) | ❌ |
| ViewModel | ❌ | ✅ | ✅ | ✅ (só tipos) | ✅ | ❌ |
| Use Case | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Infra | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Container DI | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Rotas Expo | ✅ (só Views) | ❌ | ❌ | ❌ | ❌ | ❌ |

ATENÇÃO: esta matriz é uma interpretação e ainda precisa ser confirmada com o capítulo 10 e com o Rikelry. Se algo for ambíguo, pergunte antes de implementar.

## Estado atual (validação)

- `npm run typecheck`: passa.
- `npm test`: 141 testes passam.
- `npm run build`: passa.
- Execução no Barber Agenda: 236 arquivos e 1025 imports; 0 erros estruturais,
  0 erros de composição DI e 10 warnings heurísticos documentados no README.
- Ambiente de desenvolvimento: Windows, projeto dentro do OneDrive.

## Regras de trabalho

- Uma tarefa por vez, só o que for pedido.
- Não inventar regras de arquitetura; seguir a matriz acima.
- Não alterar testes existentes para fazê-los passar.
- Seguir o estilo de código e de testes já existentes.
- Explicar o que mudou e por quê.

---

# ISSUE #10: [FEATURE] Finalizar o Architecture Checker

## Descrição

Concluir o desenvolvimento do Architecture Checker, uma ferramenta CLI desenvolvida em TypeScript para analisar projetos React Native com Expo e TypeScript, verificando se a estrutura e as dependências seguem os princípios da arquitetura MVVM Sofisticado, apresentada no capítulo 10 do material de referência.

A ferramenta já possui uma estrutura funcional de análise, leitura da AST, resolução de imports e validação de dependências entre camadas. Entretanto, ainda existem validações, testes, melhorias e documentação necessários para considerar o projeto concluído.

## Estado atual do projeto

O projeto está localizado em: Barber-Agenda-App/architecture-checker

Tecnologias utilizadas:

- Node.js
- TypeScript
- TypeScript Compiler API
- fast-glob
- Vitest
- tsx

Funcionalidades já implementadas:

- [x] Estrutura inicial da ferramenta CLI.
- [x] Scanner de arquivos e diretórios do projeto.
- [x] Identificação das camadas arquiteturais.
- [x] Extração de informações da AST do TypeScript.
- [x] Identificação de imports, declarações, construtores e instanciações.
- [x] Carregamento da configuração TypeScript do projeto analisado.
- [x] Resolução de imports internos, externos, aliases e recursos.
- [x] Construção do modelo de análise do projeto.
- [x] Validação das dependências entre camadas.
- [x] Primeira implementação da validação da composição de dependências no container DI.
- [x] Testes unitários das regras arquiteturais.
- [x] Testes de integração para dependências entre camadas.

## Tarefas pendentes

### 1. Finalizar a validação da composição do container DI

A regra DI_COMPOSITION_001 já possui uma primeira implementação em: src/analyzer/diCompositionRules.ts

Atualmente, ela verifica se classes de Use Cases importadas pelo container são instanciadas e se suas instâncias são exportadas.

- [x] Criar testes de integração para a composição do container.
- [x] Validar um container com os oito Use Cases utilizados no projeto Barber Agenda.
- [x] Validar o cenário de Use Case importado, mas não instanciado.
- [x] Validar o cenário de Use Case instanciado, mas não exportado.
- [x] Avaliar suporte a imports com aliases.
- [x] Avaliar imports default e namespace.
- [x] Avaliar declarações e instanciações que não seguem o padrão direto `new Classe()`.
- [x] Avaliar possíveis falsos positivos e falsos negativos nos cenários cobertos.

A regra deve identificar problemas reais de composição sem exigir uma única forma rígida de implementação.

### 2. Revisar as regras de dependência arquitetural

Arquivo: src/analyzer/layerDependencyRules.ts

- [x] Revisar a matriz de dependências permitidas e proibidas.
- [x] Garantir que View não dependa diretamente de Use Cases ou Infra.
- [x] Garantir que ViewModel não dependa diretamente de Infra.
- [x] Permitir que ViewModel acesse o container DI para obter Use Cases.
- [x] Garantir que Use Cases dependam apenas de contratos e elementos do domínio.
- [x] Garantir que Infra implemente contratos do domínio, sem criar dependência inversa.
- [x] Garantir que o container DI possa importar implementações de Infra e Use Cases.
- [x] Garantir que as rotas do Expo permaneçam finas, encaminhando para Views.
- [x] Criar testes para os cenários arquiteturais cobertos.

Importante: o domínio não deve depender da infraestrutura. A infraestrutura depende dos contratos definidos pelo domínio.

### 3. Melhorar a análise da AST

Revisar os extratores em: src/parser/typescriptParser.ts

- [x] Avaliar a identificação individual de imports `type`.
- [x] Avaliar suporte a imports e exports com aliases.
- [x] Avaliar reexports utilizando `export { ... }`.
- [x] Avaliar declarações dentro de estruturas mais complexas, incluindo escopos aninhados.
- [x] Melhorar a identificação de instanciações e injeção de dependências.
- [x] Cobrir padrões relevantes de TypeScript usados pelas regras arquiteturais.

Nota: a análise é estática e não cobre todos os padrões possíveis da linguagem;
as limitações conhecidas estão descritas no README.

As melhorias devem priorizar situações que afetem diretamente a precisão das regras arquiteturais.

### 4. Implementar validações adicionais da arquitetura

Avaliar e implementar, conforme a viabilidade:

- [x] Verificar se Views usam bindings de ViewModels; a heurística não prova a delegação de cada ação individualmente.
- [x] Identificar um padrão de regra de negócio na View (`new Date`); não é uma análise geral de toda lógica de negócio.
- [x] Sinalizar instanciação direta de Use Case em ViewModel e importação de valores de Use Case.
- [x] Identificar dependências diretas proibidas de ViewModels com Infra pela matriz.
- [x] Verificar a separação de contratos e implementações por meio da heurística de contratos na Infra.
- [x] Implementar verificações específicas de responsabilidade entre camadas; não há uma auditoria genérica de todas as responsabilidades.
- [x] Avaliar tratamento inadequado de erros: a heurística atual detecta `Error` genérico instanciado na Infra, não cobre todos os fluxos entre as camadas.

Regras heurísticas devem gerar warnings ou sugestões quando não houver evidência suficiente para apontar uma violação definitiva.

### 5. Melhorar a saída da CLI

- [x] Apresentar um resumo organizado das camadas identificadas.
- [x] Exibir estatísticas da análise.
- [x] Apresentar as violações agrupadas por severidade.
- [x] Exibir arquivo e linha da ocorrência.
- [x] Apresentar sugestões de correção quando disponíveis.
- [x] Definir códigos de saída apropriados para execução em CI/CD.
- [x] Implementar saída em JSON para integração com outras ferramentas.

### 6. Testes e qualidade

- [x] Finalizar os testes de integração da regra DI.
- [x] Ampliar a cobertura de testes das regras arquiteturais (141 testes).
- [x] Criar fixtures para projetos válidos e inválidos.
- [x] Testar projetos com aliases de importação.
- [x] Testar projetos com imports não resolvidos e pacotes externos.
- [x] Verificar falsos positivos nos cenários exercitados e corrigir o caso identificado.
- [x] Executar `npm run typecheck`.
- [x] Executar `npm test`.
- [x] Executar a ferramenta no projeto Barber Agenda.
- [x] Não foram encontrados erros estruturais ou de DI na validação real; os 10 warnings heurísticos restantes estão documentados.

### 7. Documentação e entrega

- [x] Criar documentação de instalação e configuração.
- [x] Documentar como executar a ferramenta.
- [x] Documentar as regras arquiteturais implementadas.
- [x] Documentar os códigos de violação e suas severidades.
- [x] Documentar limitações conhecidas.
- [x] Criar exemplos de projetos válidos e inválidos.
- [x] Avaliar a preparação para distribuição e utilização em outros projetos; o pacote permanece `private` e a distribuição pública não foi feita.
- [x] Documentar a integração com pipelines de CI/CD.

## Critérios de aceite

A issue poderá ser considerada concluída quando:

- [x] A ferramenta conseguir analisar um projeto React Native com Expo e TypeScript.
- [x] A identificação das camadas funcionar corretamente.
- [x] A resolução de imports funcionar com os aliases configurados no projeto.
- [x] As regras de dependência arquitetural estarem cobertas por testes.
- [x] A composição do container DI estar validada por testes de integração.
- [x] A ferramenta identificar violações reais sem falsos positivos recorrentes nos cenários validados; heurísticas e limitações estão documentadas.
- [x] A saída da CLI apresentar informações claras e úteis.
- [x] Todos os testes passarem.
- [x] O projeto estar documentado e pronto para uso local por outros desenvolvedores; publicação npm não está incluída.

## Observações importantes

O objetivo não é apenas verificar a existência de pastas ou arquivos com nomes específicos. O Architecture Checker deve analisar as dependências e responsabilidades entre as camadas, respeitando os princípios da arquitetura MVVM Sofisticado.

A implementação deve considerar os padrões reais utilizados no projeto Barber Agenda, mas evitar regras excessivamente acopladas a ele. A ferramenta deverá ser reutilizável em outros projetos React Native que adotem a mesma arquitetura.

Projeto de referência: Barber Agenda App.

Resultado esperado: uma ferramenta CLI confiável, testada, documentada e capaz de identificar violações arquiteturais em projetos React Native com TypeScript.
