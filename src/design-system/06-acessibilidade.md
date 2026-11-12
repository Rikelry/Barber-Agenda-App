# Acessibilidade

<!-- A acessibilidade é embutida nos componentes.
     Referência normativa: WCAG 2.2 Nível AA.
     Critério 1.4.3: Contraste mínimo de 4,5:1 para texto normal (< 18 pt / 24 px ou < 14 pt / 18,66 px em negrito).
     Critério 1.4.3: Contraste mínimo de 3,0:1 para texto grande (≥ 18 pt / 24 px ou ≥ 14 pt / 18,66 px em negrito).
     Critério 1.4.11: Contraste mínimo de 3,0:1 para elementos gráficos, contornos e indicadores de foco.
     Fórmula de contraste: Razão = (L1 + 0,05) / (L2 + 0,05), onde L1 é a luminância relativa da cor mais clara e L2 a da mais escura. -->

## 1. Contraste dos pares de cor

Os pares de cores utilizam exclusivamente os nomes de tokens canônicos definidos em `02-tokens.md`. As razões calculadas utilizam a fórmula matemática de luminância relativa do padrão WCAG 2.2 AA.

Para pares cujos valores finais dependem da exportação da paleta tonal no Material Theme Builder a partir das fontes de marca da equipe, o resultado é mantido explicitamente como **Pendente de geração no MTB**, documentando exatamente qual informação falta para a validação.

### Tabela de validação de contraste

| Primeiro plano (token) | Fundo (token) | Tema | Valores reais (hex) | Razão calculada | Critério WCAG 2.2 AA | Resultado e estado |
| --- | --- | --- | --- | --- | --- | --- |
| `color.on-primary` (`button.label`) | `color.primary` (`button.bg`) | Claro | `#332E29` sobre `#FF8500` (proposta de marca da equipe) | **5,50:1** | Texto normal (≥ 4,5:1) | **Aprovado (proposta)** — *Atenção: texto branco `#FFFFFF` sobre `#FF8500` atinge apenas 2,44:1 (Reprovado). Uso obrigatório de tom escuro sobre o primário.* |
| `color.on-primary` (`button.label`) | `color.primary` (`button.bg`) | Escuro | Pendente de exportação do MTB | Pendente | Texto normal (≥ 4,5:1) | **Pendente** — Requer geração do esquema tonal escuro no MTB |
| `color.on-surface` | `color.surface` | Claro | `#1C1B1F` sobre `#FFFFFF` | **17,13:1** | Texto normal (≥ 4,5:1) | **Aprovado** (base M3 / WCAG AAA) |
| `color.on-surface` | `color.surface` | Escuro | `#E6E1E5` sobre `#1C1B1F` | **13,27:1** | Texto normal (≥ 4,5:1) | **Aprovado** (base M3 / WCAG AAA) |
| `color.on-surface-variant` | `color.surface` | Claro | Pendente de exportação do MTB | Pendente | Texto normal (≥ 4,5:1) | **Pendente** — Requer tom `onSurfaceVariant` exportado do MTB |
| `color.on-surface-variant` | `color.surface` | Escuro | Pendente de exportação do MTB | Pendente | Texto normal (≥ 4,5:1) | **Pendente** — Requer tom `onSurfaceVariant` exportado do MTB |
| `color.error` | `color.surface` | Claro | `#B3261E` sobre `#FFFFFF` | **6,54:1** | Texto normal (≥ 4,5:1) | **Aprovado** (base M3) |
| `color.error` | `color.surface` | Escuro | `#F2B8B5` sobre `#1C1B1F` | **10,03:1** | Texto normal (≥ 4,5:1) | **Aprovado** (base M3 / WCAG AAA) |
| `color.on-error-container` | `color.error-container` | Claro | Pendente de exportação do MTB | Pendente | Texto normal (≥ 4,5:1) | **Pendente** — Requer contêiner de erro exportado do MTB |
| `color.on-error-container` | `color.error-container` | Escuro | Pendente de exportação do MTB | Pendente | Texto normal (≥ 4,5:1) | **Pendente** — Requer contêiner de erro exportado do MTB |
| `color.on-primary-container` | `color.primary-container` | Claro | Pendente de exportação do MTB | Pendente | Texto normal (≥ 4,5:1) | **Pendente** — Requer contêiner primário exportado do MTB |
| `color.on-primary-container` | `color.primary-container` | Escuro | Pendente de exportação do MTB | Pendente | Texto normal (≥ 4,5:1) | **Pendente** — Requer contêiner primário exportado do MTB |
| `color.on-secondary-container` | `color.secondary-container` | Claro | Pendente de exportação do MTB | Pendente | Texto normal (≥ 4,5:1) | **Pendente** — Requer contêiner secundário exportado do MTB |
| `color.on-secondary-container` | `color.secondary-container` | Escuro | Pendente de exportação do MTB | Pendente | Texto normal (≥ 4,5:1) | **Pendente** — Requer contêiner secundário exportado do MTB |
| Texto de badge sucesso (`neutral.white`) | Fundo de badge sucesso (`#2E7D32`) | Ambos | `#FFFFFF` sobre `#2E7D32` | **5,13:1** | Texto normal em negrito (≥ 4,5:1) | **Aprovado (especificação local)** — Requer criação de token semântico oficial de sucesso |
| `color.focus` | `color.surface` | Claro | Pendente de exportação do MTB | Pendente | Indicador de foco (≥ 3,0:1) | **Pendente** — Requer anel de foco visível com contraste ≥ 3:1 |
| `color.focus` | `color.surface` | Escuro | Pendente de exportação do MTB | Pendente | Indicador de foco (≥ 3,0:1) | **Pendente** — Requer validação no fundo escuro |
| `color.outline` | `color.surface` | Claro | Pendente de exportação do MTB | Pendente | Componentes gráficos (≥ 3,0:1) | **Pendente** — Requer tom de borda/campo exportado do MTB |
| `hair.white` (amostra de domínio) | `color.surface` | Claro | `#F2F2F0` sobre `#FFFFFF` | **1,12:1** | Elementos gráficos (≥ 3,0:1) | **Reprovado sem borda** — *Regra obrigatória: amostras visuais de cabelo claro devem ter contorno com `color.outline`.* |

### Memória de cálculo reproduzível

A luminância relativa $L$ de uma cor no espaço sRGB é calculada normalizando os canais $R, G, B \in [0, 255]$:
- Se $C_{srgb} \le 0{,}04045$, então $c = C_{srgb} / 12{,}92$.
- Senão, $c = ((C_{srgb} + 0{,}055) / 1{,}055)^{2{,}4}$.
- $L = 0{,}2126 \cdot r + 0{,}7152 \cdot g + 0{,}0722 \cdot b$.

A razão de contraste entre duas luminâncias $L_1$ (mais clara) e $L_2$ (mais escura) é:
$$\text{Razão} = \frac{L_1 + 0{,}05}{L_2 + 0{,}05}$$

Valores de luminância relativa calculados para as cores do projeto:
- `#FFFFFF` (`neutral.white` / superfície clara): $L = 1{,}0000$
- `#E6E1E5` (`color.on-surface` escuro): $L = 0{,}7633$
- `#F2F2F0` (`hair.white`): $L = 0{,}8867$
- `#F2B8B5` (`color.error` escuro): $L = 0{,}5649$
- `#FF8500` (`orange-500` / primário proposto): $L = 0{,}3804$
- `#2E7D32` (verde badge sucesso): $L = 0{,}1548$
- `#B3261E` (`color.error` claro): $L = 0{,}1106$
- `#332E29` (`brown-900` / on-primary proposto): $L = 0{,}0282$
- `#1C1B1F` (`color.surface` escuro / `color.on-surface` claro): $L = 0{,}0113$
- `#000000` (`neutral.black`): $L = 0{,}0000$

## 2. Alvos de toque

### Requisitos documentados
- Mínimo de 48 dp (Material) ou 44 pt (HIG) em todo elemento tocável. Priorizar alvos de pelo menos 48 dp nos componentes do aplicativo.
- Aplicar a botões, campos de texto, chips, abas, controles do calendário e horários disponíveis para agendamento.
- Quando um ícone for visualmente pequeno (ex.: 24 dp), estender a área clicável com preenchimento interno (`padding` mínimo) até atingir pelo menos 48 × 48 dp.

### Estado dos testes
- **Pendente de execução física:** Os tamanhos de alvos de toque foram definidos na especificação de componentes (`04-componentes/`), mas a medição em tela real com as ferramentas de acessibilidade da plataforma (Accessibility Scanner no Android e Accessibility Inspector no iOS) está pendente da implementação das telas.

## 3. Foco

### Requisitos documentados
- Usar o token `color.focus` para indicar o anel de foco visível, com contraste mínimo de 3,0:1 em relação à superfície subjacente (WCAG 1.4.11).
- Manter ordem de foco lógica, acompanhando a sequência linear de leitura e interação da tela.
- Não depender exclusivamente da cor para comunicar o estado de foco; utilizar borda de espessura destacada ou duplo indicador visual.

### Estado dos testes
- **Pendente de execução física:** A navegação assistida por teclado físico e controles direcionais (D-pad) está documentada como diretriz arquitetural, pendente de validação nos componentes compilados.

## 4. Leitor de tela

### Requisitos documentados
- Botões que exibem somente ícones devem obrigatoriamente possuir `accessibilityLabel` descritivo da ação (ex.: "Voltar para tela anterior", "Fechar diálogo").
- Campos de texto devem possuir rótulos acessíveis associados, mensagens de ajuda e anúncio imediato de erros via `accessibilityLiveRegion` ou atributos equivalentes.
- Indicar semanticamente os estados selecionado (`accessibilityState={{ selected: true }}`), desabilitado (`disabled: true`) e ocupado/carregando.
- No calendário de agendamento, comunicar a data selecionada e a disponibilidade dos horários por texto acessível audível (ex.: "14 horas, horário disponível").
- Nas confirmações de agendamento, agrupar e anunciar de forma contígua serviço, profissional, data, horário e valor.

### Estado dos testes
- **Pendente de homologação manual:** Os requisitos semânticos estão documentados nos componentes, mas as sessões de teste interativo com VoiceOver (iOS) e TalkBack (Android) em aparelhos físicos ainda não foram realizadas.

## 5. Texto ampliado e movimento reduzido

### Requisitos documentados
- Respeitar as configurações de acessibilidade do sistema: Dynamic Type no iOS e escala de fonte no Android (até 200% sem perda de conteúdo).
- Evitar alturas fixas em contêineres que contenham texto, prevenindo truncamento ou sobreposição.
- Respeitar a preferência de redução de movimento do sistema (`prefers-reduced-motion`), desativando transições supérfluas e mantendo confirmações instantâneas.

### Estado dos testes
- **Pendente de homologação em dispositivos:** Testes com aumento de fonte até 200% e ativação da opção de movimento reduzido no sistema operacional estão pendentes de execução após a montagem das telas.
