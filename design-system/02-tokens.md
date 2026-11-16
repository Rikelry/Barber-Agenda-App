# Tokens

\<!-- Camada 2 da aula: decisões com nome. Três níveis: primitivo → semântico → componente.      Formato do nome: categoria.papel.variação (ex.: color.action, space.md, radius.lg, font.title).      Escreva sempre valor + unidade (px, dp ou pt). Em toda tabela, a coluna "Origem" usa: Herdado | Adaptado | Novo. -->

## 1. Primitivos (o valor bruto)

### Cor

| Token                 | Valor     | Origem   |
| --------------------- | --------- | -------- |
| `brown-1`             | `#CDAB8F` | Adaptado |
| `brown-2`             | `#B5835A` | Adaptado |
| `brown-3`             | `#986A44` | Adaptado |
| `brown-4`             | `#865E3C` | Adaptado |
| `brown-5`             | `#63452C` | Adaptado |
| `neutral-0`           | `#FFFFFF` | Herdado  |
| `neutral-50`          | `#FFF8F3` | Adaptado |
| `neutral-100`         | `#F5EDE6` | Adaptado |
| `neutral-200`         | `#E7DED6` | Adaptado |
| `neutral-600`         | `#756B63` | Adaptado |
| `neutral-900`         | `#241A14` | Adaptado |
| `neutral-950`         | `#1D1712` | Adaptado |
| `error-600`           | `#BA1A1A` | Herdado  |
| `error-300`           | `#FFB4AB` | Herdado  |
| `brown-hover`         | `#563B26` | Novo     |
| `brown-pressed`       | `#4A321F` | Novo     |
| `brown-light-hover`   | `#D8BBA3` | Novo     |
| `brown-light-pressed` | `#B5835A` | Novo     |

### Espaço (grade de 8 pontos)

| Token      | Valor | Origem  |
| ---------- | ----- | ------- |
| `space-4`  | 4 dp  | Herdado |
| `space-8`  | 8 dp  | Herdado |
| `space-16` | 16 dp | Herdado |
| `space-24` | 24 dp | Herdado |
| `space-32` | 32 dp | Herdado |
| `space-48` | 48 dp | Herdado |
| `space-64` | 64 dp | Herdado |

### Tipografia

| Token                 | Valor  | Origem  |
| --------------------- | ------ | ------- |
| `font-family`         | Roboto | Herdado |
| `font-size-12`        | 12 dp  | Herdado |
| `font-size-14`        | 14 dp  | Herdado |
| `font-size-16`        | 16 dp  | Herdado |
| `font-size-20`        | 20 dp  | Herdado |
| `font-size-24`        | 24 dp  | Herdado |
| `font-size-32`        | 32 dp  | Herdado |
| `font-weight-regular` | 400    | Herdado |
| `font-weight-medium`  | 500    | Herdado |
| `font-weight-bold`    | 700    | Herdado |

### Forma e elevação

| Token         | Valor  | Origem   |
| ------------- | ------ | -------- |
| `radius-4`    | 4 dp   | Herdado  |
| `radius-8`    | 8 dp   | Herdado  |
| `radius-12`   | 12 dp  | Adaptado |
| `radius-16`   | 16 dp  | Herdado  |
| `radius-full` | 999 dp | Herdado  |
| `elevation-0` | 0 dp   | Herdado  |
| `elevation-1` | 1 dp   | Herdado  |
| `elevation-2` | 3 dp   | Herdado  |
| `elevation-3` | 6 dp   | Herdado  |

## 2. Semânticos (o significado)

### Cor

| Token                      | Claro           | Escuro                | Uso                       | Origem   |
| -------------------------- | --------------- | --------------------- | ------------------------- | -------- |
| `color.action`             | `brown-5`       | `brown-1`             | Ações principais          | Adaptado |
| `color.on-action`          | `neutral-0`     | `neutral-900`         | Texto e ícone sobre ação  | Adaptado |
| `color.secondary`          | `brown-3`       | `brown-2`             | Ações secundárias         | Adaptado |
| `color.surface`            | `neutral-50`    | `neutral-950`         | Fundo das telas           | Adaptado |
| `color.surface-container`  | `neutral-100`   | `neutral-900`         | Cards e áreas agrupadas   | Adaptado |
| `color.on-surface`         | `neutral-900`   | `neutral-100`         | Texto principal           | Adaptado |
| `color.on-surface-variant` | `brown-4`       | `brown-1`             | Texto secundário          | Adaptado |
| `color.outline`            | `brown-3`       | `brown-2`             | Bordas e divisores        | Adaptado |
| `color.error`              | `error-600`     | `error-300`           | Erros e ações destrutivas | Herdado  |
| `color.focus`              | `brown-5`       | `brown-1`             | Anel de foco              | Adaptado |
| `color.action-hover`       | `brown-hover`   | `brown-light-hover`   | Ação sob foco do ponteiro | Novo     |
| `color.action-pressed`     | `brown-pressed` | `brown-light-pressed` | Ação pressionada          | Novo     |
| `color.disabled`           | `neutral-200`   | `neutral-600`         | Elementos desabilitados   | Adaptado |
| `color.on-disabled`        | `neutral-600`   | `neutral-200`         | Texto desabilitado        | Adaptado |

### Tipografia

| Token           | Família | Tamanho | Peso | Altura de linha | Uso                      | Origem  |
| --------------- | ------- | ------- | ---- | --------------- | ------------------------ | ------- |
| `font.title`    | Roboto  | 24 dp   | 700  | 32 dp           | Títulos de tela          | Herdado |
| `font.subtitle` | Roboto  | 20 dp   | 500  | 28 dp           | Subtítulos               | Herdado |
| `font.body`     | Roboto  | 16 dp   | 400  | 24 dp           | Texto corrido            | Herdado |
| `font.caption`  | Roboto  | 12 dp   | 400  | 16 dp           | Informações auxiliares   | Herdado |
| `font.label`    | Roboto  | 14 dp   | 500  | 20 dp           | Rótulos de botão e campo | Herdado |

### Espaço, forma e elevação

| Token              | Valor         | Uso                                 | Origem   |
| ------------------ | ------------- | ----------------------------------- | -------- |
| `space.sm`         | `space-8`     | Espaço entre elementos relacionados | Herdado  |
| `space.md`         | `space-16`    | Margem interna padrão               | Herdado  |
| `space.lg`         | `space-24`    | Separação entre grupos              | Herdado  |
| `space.xl`         | `space-32`    | Separação entre seções              | Herdado  |
| `radius.sm`        | `radius-4`    | Pequenos elementos e etiquetas      | Herdado  |
| `radius.md`        | `radius-8`    | Campos e botões                     | Herdado  |
| `radius.lg`        | `radius-16`   | Cards e painéis                     | Adaptado |
| `radius.full`      | `radius-full` | Elementos circulares                | Herdado  |
| `elevation.card`   | `elevation-1` | Cards sobre a superfície            | Herdado  |
| `elevation.dialog` | `elevation-3` | Diálogos e janelas sobrepostas      | Herdado  |

### Movimento

| Token                      | Valor                        | Uso                            | Origem   |
| -------------------------- | ---------------------------- | ------------------------------ | -------- |
| `motion.duration.short`    | 100 ms                       | Feedback de toque              | Herdado  |
| `motion.duration.medium`   | 250 ms                       | Transições entre telas         | Adaptado |
| `motion.duration.long`     | 350 ms                       | Abertura de diálogos e painéis | Adaptado |
| `motion.easing.standard`   | `cubic-bezier(0.2, 0, 0, 1)` | Curva padrão                   | Herdado  |
| `motion.easing.decelerate` | `cubic-bezier(0, 0, 0, 1)`   | Entrada de elementos           | Herdado  |

## 3. Tokens de componente (onde é usado)

| Token                   | Aponta para               | Origem   |
| ----------------------- | ------------------------- | -------- |
| `button.bg`             | `color.action`            | Adaptado |
| `button.label`          | `color.on-action`         | Adaptado |
| `button.radius`         | `radius.md`               | Herdado  |
| `button.bg-hover`       | `color.action-hover`      | Novo     |
| `button.bg-pressed`     | `color.action-pressed`    | Novo     |
| `button.bg-disabled`    | `color.disabled`          | Adaptado |
| `button.label-disabled` | `color.on-disabled`       | Adaptado |
| `button.focus`          | `color.focus`             | Adaptado |
| `card.bg`               | `color.surface-container` | Adaptado |
| `card.radius`           | `radius.lg`               | Adaptado |
| `card.elevation`        | `elevation.card`          | Herdado  |
| `input.bg`              | `color.surface`           | Herdado  |
| `input.label`           | `color.on-surface`        | Herdado  |
| `input.border`          | `color.outline`           | Herdado  |
| `input.focus`           | `color.focus`             | Adaptado |
| `input.error`           | `color.error`             | Herdado  |

## 4. Modo escuro

O modo escuro mantém a mesma estrutura de componentes, dimensões e hierarquia visual. Apenas os valores dos tokens semânticos são alterados.

As principais mudanças são:

- `color.action`: passa de `brown-5` para `brown-1`.
- `color.on-action`: passa de `neutral-0` para `neutral-900` (`#241A14`), garantindo contraste adequado sobre `color.action`.
- `color.secondary`: passa de `brown-3` para `brown-2`.
- `color.surface`: passa de `neutral-50` para `neutral-950`.
- `color.surface-container`: passa de `neutral-100` para `neutral-900`.
- `color.on-surface`: passa de `neutral-900` para `neutral-100`.
- `color.on-surface-variant`: passa de `brown-4` para `brown-1`.
- `color.outline`: passa de `brown-3` para `brown-2`.
- `color.error`: passa de `error-600` para `error-300`.
- `color.focus`: passa de `brown-5` para `brown-1`.
- `color.action-hover`: passa de `brown-hover` para `brown-light-hover`.
- `color.action-pressed`: passa de `brown-pressed` para `brown-light-pressed`.

Não utilize `brown-5` sobre `brown-1` para textos comuns no modo escuro, pois essa combinação não atinge o contraste mínimo de 4,5:1. O texto e os ícones sobre `color.action` devem utilizar `neutral-900`.

Os tokens de componente continuam apontando para os mesmos tokens semânticos. Dessa forma, os componentes não precisam de especificações diferentes para cada tema.

## 5. Regras de utilização

1. Utilize exclusivamente tokens definidos neste arquivo para cores, tipografia, espaços, formas, elevação e movimento.
2. Não utilize valores de cores diretamente nos componentes.
3. Utilize a grade de 8 dp como padrão de espaçamento, permitindo ajustes de 4 dp quando necessário.
4. Preserve a hierarquia tipográfica definida para títulos, subtítulos, textos e rótulos.
5. Utilize `color.action` para destacar ações principais.
6. Mantenha o contraste mínimo de 4,5:1 para textos comuns.
7. Respeite o modo claro e escuro em todos os componentes.
8. Não utilize sombras excessivas nem animações que prejudiquem a navegação.
9. No React Native, utilize os valores numéricos em dp, sem converter manualmente para pixels físicos.
10. Respeite as configurações de ampliação de texto do Android.
