# Arquitetura MVVM Sofisticado

## Objetivo

Aplicar ao Barber Agenda os princípios de MVVM Sofisticado, Clean Architecture e Dependency Inversion Principle (DIP), mantendo o projeto compatível com React Native, TypeScript e Expo Router.

Este documento adapta os princípios do capítulo 10 ao projeto real. Não autoriza reescrever funcionalidades existentes sem necessidade.

## 1. Organização das camadas

A estrutura de referência é:

```text
src/
├── app/                  # Rotas Expo Router, layouts e composição de navegação
├── view/                 # Telas e componentes específicos de tela
├── viewmodel/            # Hooks de estado, ações e navegação
├── usecase/              # Contratos e implementações dos casos de uso
├── model/
│   ├── entities/         # Entidades puras do domínio
│   ├── datasources/      # Contratos de acesso a dados
│   ├── services/         # Contratos de serviços
│   └── errors.ts         # Erros de domínio
├── infra/
│   ├── datasources/      # Implementações concretas de acesso a dados
│   └── services/         # Implementações concretas de serviços
├── di/
│   └── container.ts      # Ponto central de composição de dependências
├── components/           # Componentes visuais reutilizáveis
└── theme/                # Tokens e tema visual
```

Essa estrutura é uma referência, não uma ordem para criar todas as pastas imediatamente. Adicione somente o necessário para a funcionalidade em questão e respeite os arquivos existentes.

## 2. Responsabilidades

### View

- Renderiza estado e encaminha interações para ações disponibilizadas pela ViewModel.
- Não implementa regras de negócio.
- Não acessa diretamente Use Cases, Services ou DataSources.
- Não contém chamadas diretas a APIs ou lógica de persistência.
- Pode manter estado estritamente visual e temporário, como o texto digitado em um campo.
- Segue a skill `barber-design-system` e os documentos de design system.

### ViewModel

- Expõe estado e ações para a View.
- Gerencia estados de carregamento, sucesso e erro apresentados na interface.
- Coordena a navegação usando Expo Router quando necessário.
- Depende de contratos de Use Cases, não de implementações de infraestrutura.
- Não implementa regras de negócio que pertencem aos Use Cases.
- Deve permitir a substituição de dependências por implementações de teste.

### Use Cases

- Representam ações ou operações de negócio.
- Centralizam validações e regras de negócio.
- Coordenam os Services e DataSources necessários.
- Recebem dependências por injeção de construtor.
- Devem poder ser testados sem Firebase, rede ou interface gráfica.

### Model

- Contém entidades, contratos e erros de domínio.
- Não depende de React, React Native, Expo, Firebase ou bibliotecas específicas de infraestrutura.
- Mantém os contratos independentes das implementações concretas.

### Infraestrutura

- Implementa os contratos definidos pelo domínio.
- Isola SDKs, APIs externas, persistência e detalhes técnicos.
- Converte erros específicos da tecnologia em erros de domínio apropriados.
- Mapeia dados externos para entidades do domínio.
- Não deve espalhar detalhes de implementação para as camadas superiores.

### Container de dependências

- Centraliza a criação e a conexão das implementações concretas.
- É o ponto de composição das dependências.
- Permite substituir uma implementação sem alterar as regras de negócio.
- Deve compartilhar instâncias quando isso for necessário para manter estado consistente.

## 3. Direção das dependências

A direção lógica principal é:

```text
View → ViewModel → Use Cases → Contratos do domínio
                                  ↑
                           Infraestrutura
                                  ↑
                           Container DI
```

A infraestrutura implementa os contratos do domínio. O container conecta essas implementações às dependências utilizadas pelos Use Cases.

Nenhuma camada de domínio deve importar infraestrutura. A View não deve importar Services ou DataSources.

Uma ViewModel pode obter uma implementação padrão de Use Cases pelo container, desde que continue dependendo de uma abstração e permita injeção de uma alternativa nos testes.

## 4. Contratos e implementações

- Contratos de Services e DataSources pertencem ao domínio.
- Implementações concretas pertencem à infraestrutura.
- Prefira interfaces TypeScript para definir contratos.
- Siga a convenção do capítulo para novos contratos: nomes como `IUserDataSource` e arquivos como `iUserDataSource.ts`, quando esse padrão for adotado de forma consistente.
- Não renomeie arquivos existentes em massa apenas para aplicar a convenção. Faça migrações pequenas e justificadas.
- Um Service representa uma responsabilidade específica. Um DataSource representa acesso e persistência de dados.
- Os Use Cases coordenam as operações de negócio e não devem ser substituídos por chamadas diretas de infraestrutura nas ViewModels.

## 5. Erros

O fluxo esperado é:

1. A infraestrutura trata erros específicos da tecnologia.
2. A infraestrutura converte esses erros para erros de domínio apropriados.
3. Os Use Cases lançam erros de domínio para violações de regras de negócio.
4. A ViewModel converte erros conhecidos em estado apresentável na interface.
5. A View exibe o estado recebido.

A View não implementa regras de negócio nem assume o tratamento de erros dos Use Cases. O tratamento de falhas operacionais e a conversão para estados de interface pertencem à ViewModel. Tratamentos estritamente visuais podem permanecer na View quando necessários.

## 6. Testabilidade

- Teste regras de negócio nos Use Cases.
- Substitua dependências por fakes ou mocks que satisfaçam os contratos.
- Teste ViewModels com Use Cases falsos, sem exigir serviços externos.
- Verifique validações, resultados, erros e efeitos observáveis.
- Teste integrações com infraestrutura separadamente.
- Antes de adicionar bibliotecas de teste, verifique as dependências e convenções existentes.

Os testes devem cobrir comportamento relevante, não apenas confirmar que um método foi chamado.

## 7. Evolução de funcionalidades

Para uma nova funcionalidade, siga esta sequência quando aplicável:

1. Definir ou reutilizar entidades e contratos de domínio.
2. Implementar as regras no Use Case.
3. Criar ou adaptar implementações de infraestrutura necessárias.
4. Registrar as dependências no container.
5. Expor estado e ações na ViewModel.
6. Construir a interface com os componentes e tokens documentados.
7. Adicionar testes de domínio e ViewModel.
8. Executar as verificações do projeto.

A sequência pode ser ajustada quando a funcionalidade não exigir todas as camadas. Não crie abstrações sem uma responsabilidade real.

## 8. Expo Router

- Mantenha as rotas em `src/app/`.
- Preserve `_layout.tsx` e a configuração atual de navegação, salvo quando a tarefa exigir uma alteração.
- Prefira rotas finas que deleguem a telas localizadas fora de `src/app/`.
- Não coloque componentes reutilizáveis, entidades ou regras de negócio em `src/app/`.
- Consulte a documentação correspondente à versão instalada do Expo antes de usar ou alterar APIs do framework.

## 9. Compatibilidade com o design system

- Leia `.agents/skills/barber-design-system/SKILL.md` ao criar ou modificar interfaces.
- Consulte os tokens e as especificações de componentes relevantes antes de implementar UI.
- Não invente cores, tamanhos, espaçamentos ou raios para preencher lacunas documentais.
- Registre lacunas no design system e solicite esclarecimento quando uma decisão necessária não estiver especificada.
- Preserve os requisitos de acessibilidade e o suporte a diferentes tamanhos de tela.

## 10. Restrições de implementação

- Não instalar Firebase só porque o capítulo o utiliza como exemplo.
- Não adicionar persistência, bibliotecas ou serviços externos sem necessidade funcional confirmada.
- Não alterar dependências ou configurações do Expo sem verificar compatibilidade com a versão instalada.
- Não reescrever arquivos existentes sem compreender sua responsabilidade.
- Não duplicar regras de negócio entre View, ViewModel e Use Cases.
- Não afirmar que testes ou verificações passaram sem executá-los.

## 11. Verificação antes de concluir

Execute, quando aplicável:

```bash
npx expo lint
npx tsc --noEmit
```

Execute também os testes automatizados disponíveis e relevantes para a alteração.

Se uma verificação não puder ser executada, informe qual falhou ou ficou pendente e por quê.

## 12. Relatório final

Ao concluir uma tarefa, informe brevemente:

- O que foi implementado.
- Quais camadas e arquivos foram alterados.
- Quais testes e verificações foram executados e seus resultados.
- Quais tokens e componentes do design system foram usados, se houve alteração de UI.
- Quais lacunas ou decisões pendentes permanecem.
