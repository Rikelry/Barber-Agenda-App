# Tokens

<!-- Camada 2: decisões com nome.
     Três níveis: primitivo → semântico → componente.
     Projeto: aplicativo de barbearia em Expo / React Native.
     Referência: Material Design 3 Expressive.
     Origem permitida: Herdado | Adaptado | Novo.
     Dimensões de layout: dp (unidades independentes de densidade no React Native).
     Tipografia: sp como referência de design; implementar com fontSize/lineHeight numéricos no React Native.
     Valores M3 dependentes de geração tonal ou especificação de componente devem ser validados antes de produção. -->

## 1. Primitivos (o valor bruto)

### Cor

#### Cores da marca (equipe)

| Token | Valor | Origem |
| --- | --- | --- |
| `orange-500` | `#FF8500` | Herdado |
| `amber-700` | `#CC7D29` | Herdado |
| `ochre-700` | `#996D3D` | Herdado |
| `brown-700` | `#66523D` | Herdado |
| `brown-900` | `#332E29` | Herdado |

As cinco cores originais da marca da equipe (Perypery Solutions), definidas na versão 0.1.0 inicial e recuperadas do histórico de commits do repositório (`1941542`), permanecem preservadas como valores primitivos de referência de marca.

#### Cores naturais de cabelo

| Token | Valor | Origem |
| --- | --- | --- |
| `hair.black` | `#1B1B1B` | Herdado |
| `hair.dark-brown` | `#3B2214` | Herdado |
| `hair.brown` | `#6F4E37` | Herdado |
| `hair.light-brown` | `#A67B50` | Herdado |
| `hair.dark-blonde` | `#B89B6A` | Herdado |
| `hair.golden-blonde` | `#D4A843` | Herdado |
| `hair.light-blonde` | `#F0D8A8` | Herdado |
| `hair.redhead` | `#C2622D` | Herdado |
| `hair.copper` | `#B4510E` | Herdado |
| `hair.dark-red` | `#922724` | Herdado |
| `hair.gray` | `#8B8B8B` | Herdado |
| `hair.white` | `#F2F2F0` | Herdado |

As cores de cabelo são dados visuais de domínio. Não devem ser utilizadas como cores de interface (ação, texto, superfície, erro ou foco) nem como substitutas das cores da marca.

#### Cores neutras e fontes de marca

| Token | Valor | Origem |
| --- | --- | --- |
| `neutral.white` | `#FFFFFF` | Novo |
| `neutral.black` | `#000000` | Novo |
| `brand.source.primary` | Proposta como `orange-500` (`#FF8500`), pendente de geração de paleta tonal no Material Theme Builder | Adaptado |
| `brand.source.secondary` | Pendente de definição pelo grupo entre as cores da marca | Novo |
| `brand.source.tertiary` | Pendente de definição pelo grupo entre as cores da marca | Novo |

As fontes de marca devem ser confirmadas pelo grupo e convertidas em paletas tonais completas no Material Theme Builder antes da fixação dos papéis semânticos derivados. As cores naturais de cabelo não constituem paleta tonal de interface.

### Espaço (grade de 8 pontos, com ajustes de 4 dp)

| Token | Valor | Origem |
| --- | --- | --- |
| `space-0` | 0 dp | Novo |
| `space-4` | 4 dp | Adaptado |
| `space-8` | 8 dp | Adaptado |
| `space-12` | 12 dp | Novo |
| `space-16` | 16 dp | Adaptado |
| `space-24` | 24 dp | Adaptado |
| `space-32` | 32 dp | Adaptado |
| `space-48` | 48 dp | Novo |
| `space-64` | 64 dp | Novo |

Os espaçamentos primitivos são decisões de grade do projeto, medidos em dp (unidades independentes de densidade no React Native).

### Forma (raio de arredondamento primitivo)

| Token | Valor | Origem |
| --- | --- | --- |
| `radius-0` | 0 dp | Novo |
| `radius-4` | 4 dp | Adaptado |
| `radius-8` | 8 dp | Adaptado |
| `radius-12` | 12 dp | Adaptado |
| `radius-16` | 16 dp | Adaptado |
| `radius-28` | 28 dp | Adaptado |
| `radius-full` | 9999 dp (circular) | Adaptado |

Os valores numéricos brutos de curvatura constituem os primitivos de forma. A aplicação deles na interface é mediada pelos papéis semânticos (`radius.none`, `radius.xs`, `radius.sm`, `radius.md`, `radius.lg`, `radius.xl`, `radius.full`).

### Elevação

| Token | Valor | Origem |
| --- | --- | --- |
| `elevation.level0` | 0 dp | Adaptado |
| `elevation.level1` | 1 dp | Adaptado |
| `elevation.level2` | 3 dp | Adaptado |
| `elevation.level3` | 6 dp | Adaptado |
| `elevation.level4` | 8 dp | Adaptado |
| `elevation.level5` | 12 dp | Adaptado |

Os níveis são referências para mapear componentes. Elevação tonal e sombra devem ser tratadas conforme o componente e a plataforma. Não se deve interpretar estes números como especificação universal de todos os componentes Expressive.

## 2. Semânticos (o significado)

### Cor

Os papéis semânticos seguem a nomenclatura do Material 3 Expressive. Os valores canônicos de ação (`color.primary`) e conteúdo sobre ação (`color.on-primary`) substituem os termos legados `color.action` e `color.on-action`. Os valores definitivos de produção devem ser confirmados com a exportação do Material Theme Builder a partir das cores de marca da equipe.

| Token | Claro | Escuro | Uso | Origem |
| --- | --- | --- | --- | --- |
| `color.primary` | `primary` do esquema tonal claro (proposta base: `orange-500` / `#FF8500`)* | `primary` do esquema tonal escuro* | Ações principais (substitui `color.action`) | Adaptado |
| `color.on-primary` | `onPrimary` do esquema claro (proposta base: `brown-900` / `#332E29`)* | `onPrimary` do esquema escuro* | Conteúdo sobre primário (substitui `color.on-action`) | Adaptado |
| `color.primary-container` | `primaryContainer` do esquema claro* | `primaryContainer` do esquema escuro* | Destaques e ações secundárias | Adaptado |
| `color.on-primary-container` | `onPrimaryContainer` do esquema claro* | `onPrimaryContainer` do esquema escuro* | Conteúdo sobre contêiner primário | Adaptado |
| `color.secondary` | `secondary` do esquema claro* | `secondary` do esquema escuro* | Ações de apoio | Adaptado |
| `color.on-secondary` | `onSecondary` do esquema claro* | `onSecondary` do esquema escuro* | Conteúdo sobre secundário | Adaptado |
| `color.secondary-container` | `secondaryContainer` do esquema claro* | `secondaryContainer` do esquema escuro* | Seleções e ações tonais | Adaptado |
| `color.on-secondary-container` | `onSecondaryContainer` do esquema claro* | `onSecondaryContainer` do esquema escuro* | Conteúdo sobre contêiner secundário | Adaptado |
| `color.tertiary` | `tertiary` do esquema claro* | `tertiary` do esquema escuro* | Acentos complementares | Adaptado |
| `color.on-tertiary` | `onTertiary` do esquema claro* | `onTertiary` do esquema escuro* | Conteúdo sobre terciário | Adaptado |
| `color.tertiary-container` | `tertiaryContainer` do esquema claro* | `tertiaryContainer` do esquema escuro* | Destaques complementares | Adaptado |
| `color.on-tertiary-container` | `onTertiaryContainer` do esquema claro* | `onTertiaryContainer` do esquema escuro* | Conteúdo sobre contêiner terciário | Adaptado |
| `color.surface` | `#FFFFFF` (base M3, sujeito a tom gerado) | `#1C1B1F` (base M3, sujeito a tom gerado) | Superfícies de tela | Adaptado |
| `color.on-surface` | `#1C1B1F` (base M3, sujeito a tom gerado) | `#E6E1E5` (base M3, sujeito a tom gerado) | Texto e ícones principais | Adaptado |
| `color.surface-variant` | `surfaceVariant` do esquema claro* | `surfaceVariant` do esquema escuro* | Superfícies diferenciadas | Adaptado |
| `color.on-surface-variant` | `onSurfaceVariant` do esquema claro* | `onSurfaceVariant` do esquema escuro* | Conteúdo secundário | Adaptado |
| `color.surface-container-low` | `surfaceContainerLow` do esquema claro* | `surfaceContainerLow` do esquema escuro* | Cartões discretos | Adaptado |
| `color.surface-container` | `surfaceContainer` do esquema claro* | `surfaceContainer` do esquema escuro* | Agrupamentos de conteúdo | Adaptado |
| `color.surface-container-high` | `surfaceContainerHigh` do esquema claro* | `surfaceContainerHigh` do esquema escuro* | Diálogos e superfícies elevadas | Adaptado |
| `color.outline` | `outline` do esquema claro* | `outline` do esquema escuro* | Bordas e campos | Adaptado |
| `color.outline-variant` | `outlineVariant` do esquema claro* | `outlineVariant` do esquema escuro* | Divisores e contornos sutis | Adaptado |
| `color.error` | `#B3261E` (base M3)* | `#F2B8B5` (base M3)* | Erros e ações destrutivas | Adaptado |
| `color.on-error` | `#FFFFFF` (base M3)* | `#601410` (base M3)* | Conteúdo sobre erro | Adaptado |
| `color.error-container` | `errorContainer` do esquema claro* | `errorContainer` do esquema escuro* | Fundo de mensagens de erro | Adaptado |
| `color.on-error-container` | `onErrorContainer` do esquema claro* | `onErrorContainer` do esquema escuro* | Conteúdo sobre contêiner de erro | Adaptado |
| `color.inverse-surface` | `inverseSurface` do esquema claro* | `inverseSurface` do esquema escuro* | Superfícies invertidas | Adaptado |
| `color.inverse-on-surface` | `inverseOnSurface` do esquema claro* | `inverseOnSurface` do esquema escuro* | Conteúdo em superfícies invertidas | Adaptado |
| `color.inverse-primary` | `inversePrimary` do esquema claro* | `inversePrimary` do esquema escuro* | Primário em contexto invertido | Adaptado |
| `color.focus` | Papel de contorno ou foco validado para o esquema claro* | Papel de contorno ou foco validado para o esquema escuro* | Indicador de foco acessível | Novo |

\* **Situação dos valores semânticos:** Os papéis marcados com asterisco dependem da exportação oficial do Material Theme Builder baseada nas fontes de marca aprovadas pelo grupo. Não se deve considerar valores provisórios ou ilustrativos como especificação definitiva de produção sem validação de contraste e tema.

### Tipografia

| Token | Família | Tamanho | Peso | Altura de linha | Uso | Origem |
| --- | --- | --- | --- | --- | --- | --- |
| `font.display-large` | Roboto | 57 sp | 400 | 64 sp | Destaques excepcionais | Adaptado |
| `font.display-medium` | Roboto | 45 sp | 400 | 52 sp | Destaques de tela | Adaptado |
| `font.display-small` | Roboto | 36 sp | 400 | 44 sp | Títulos de destaque | Adaptado |
| `font.headline-large` | Roboto | 32 sp | 400 | 40 sp | Cabeçalhos principais | Adaptado |
| `font.headline-medium` | Roboto | 28 sp | 400 | 36 sp | Cabeçalhos de seção | Adaptado |
| `font.headline-small` | Roboto | 24 sp | 400 | 32 sp | Títulos de tela (substitui `font.title`) | Adaptado |
| `font.title-large` | Roboto | 22 sp | 500 | 28 sp | Títulos de cartões | Adaptado |
| `font.title-medium` | Roboto | 16 sp | 500 | 24 sp | Títulos de componentes | Adaptado |
| `font.title-small` | Roboto | 14 sp | 500 | 20 sp | Títulos compactos | Adaptado |
| `font.body-large` | Roboto | 16 sp | 400 | 24 sp | Texto corrido principal (substitui `font.body`) | Adaptado |
| `font.body-medium` | Roboto | 14 sp | 400 | 20 sp | Texto corrido padrão | Adaptado |
| `font.body-small` | Roboto | 12 sp | 400 | 16 sp | Texto auxiliar | Adaptado |
| `font.label-large` | Roboto | 14 sp | 500 | 20 sp | Rótulos de botões (substitui `font.label`) | Adaptado |
| `font.label-medium` | Roboto | 12 sp | 500 | 16 sp | Rótulos e indicadores | Adaptado |
| `font.label-small` | Roboto | 11 sp | 500 | 16 sp | Metadados compactos | Adaptado |

A escala de referência segue a tipografia Material 3. O peso numérico `500` depende da disponibilidade da fonte e deve ser validado na plataforma. No Expo, os valores numéricos de `fontSize` e `lineHeight` são usados no React Native; `sp` documenta a intenção de design, não uma unidade literal aceita pelo StyleSheet.

**Mapeamento de compatibilidade histórica:**
- `font.title` (24 sp, versão 0.1.0) mapeia para `font.headline-small` (títulos de tela) ou `font.title-large` (títulos de seções e cards).
- `font.body` (16 sp, versão 0.1.0) mapeia para `font.body-large` (texto principal) ou `font.body-medium` (texto padrão).
- `font.label` (14 sp, versão 0.1.0) mapeia para `font.label-large` (rótulos de botões) ou `font.label-medium` (rótulos de campos/chips).

### Espaço, forma e elevação

| Token | Valor | Uso | Origem |
| --- | --- | --- | --- |
| `space.sm` | `space-8` = 8 dp | Elementos relacionados | Adaptado |
| `space.md` | `space-16` = 16 dp | Preenchimento padrão | Adaptado |
| `space.lg` | `space-24` = 24 dp | Separação entre grupos | Adaptado |
| `space.xl` | `space-32` = 32 dp | Separação entre seções | Novo |
| `radius.none` | `radius-0` = 0 dp | Sem arredondamento de cantos | Novo |
| `radius.xs` | `radius-4` = 4 dp | Badges, tags e etiquetas de status | Adaptado |
| `radius.sm` | `radius-8` = 8 dp | Controles compactos e campos de texto | Adaptado |
| `radius.md` | `radius-12` = 12 dp | Botões e campos padrão M3 | Adaptado |
| `radius.lg` | `radius-16` = 16 dp | Cartões e superfícies médias M3 | Adaptado |
| `radius.xl` | `radius-28` = 28 dp | Diálogos e superfícies maiores | Adaptado |
| `radius.full` | `radius-full` = circular | Pílula ou círculo completo (Avatares, Chips, FAB, Switch) | Adaptado |
| `elevation.card` | `elevation.level1` = 1 dp, como mapeamento inicial | Cartões sobre superfícies | Adaptado |
| `elevation.dialog` | Nível definido pela variante de diálogo adotada | Diálogos | Adaptado |

Os valores de forma e elevação devem ser ajustados à especificação concreta dos componentes selecionados. O mapeamento acima é uma convenção inicial de projeto, não uma regra universal do Expressive.

### Movimento

| Token | Valor | Uso | Origem |
| --- | --- | --- | --- |
| `motion.duration.short` | Faixa curta definida pela especificação de movimento adotada, em ms | Feedback de toque | Adaptado |
| `motion.duration.medium` | Faixa média definida pela especificação de movimento adotada, em ms | Transições de interface | Adaptado |
| `motion.duration.long` | Faixa longa definida pela especificação de movimento adotada, em ms | Transições expressivas que a exijam | Adaptado |
| `motion.easing.standard` | Curva padrão da implementação M3 selecionada | Movimento cotidiano | Adaptado |
| `motion.easing.emphasized` | Curva enfatizada da implementação M3 selecionada | Transições com destaque | Adaptado |

As durações e curvas finais devem ser copiadas da especificação correspondente à biblioteca e à variante do componente utilizadas. Não definir um único tempo para todas as animações: entrada, saída, feedback e transições entre estados têm objetivos diferentes.

## 3. Tokens de componente (onde é usado)

| Token | Aponta para | Origem |
| --- | --- | --- |
| `button.bg` | `color.primary` | Adaptado |
| `button.label` | `color.on-primary` | Adaptado |
| `button.radius` | `radius.md` (12 dp, forma padrão do botão M3) | Adaptado |
| `button.bg-hover` | `color.primary` + camada de estado hover do componente | Adaptado |
| `button.bg-pressed` | `color.primary` + camada de estado pressed do componente | Adaptado |
| `button.bg-disabled` | Papel de superfície e estado desabilitado da implementação M3 | Adaptado |
| `button.label-disabled` | Papel de conteúdo desabilitado da implementação M3 | Adaptado |
| `field.bg` | Papel de superfície definido pela variante de campo | Adaptado |
| `field.label` | `color.on-surface-variant` | Adaptado |
| `field.outline` | `color.outline` | Adaptado |
| `field.outline-focused` | `color.focus` / papel de foco validado | Adaptado |
| `field.radius` | `radius.sm` (8 dp, raio padrão de campos de texto) | Adaptado |
| `card.bg` | `color.surface-container-low` | Adaptado |
| `card.label` | `color.on-surface` | Adaptado |
| `card.elevation` | `elevation.card` (1 dp) | Adaptado |
| `card.radius` | `radius.lg` (16 dp, raio padrão de cartões M3) | Adaptado |
| `navigation.bg` | `color.surface` | Adaptado |
| `navigation.label` | `color.on-surface-variant` | Adaptado |
| `navigation.selected-bg` | Papel de contêiner da variante de navegação | Adaptado |
| `navigation.selected-label` | Papel de conteúdo correspondente ao contêiner selecionado | Adaptado |
| `booking.confirm-bg` | `button.bg` (`color.primary`) | Novo |
| `booking.confirm-label` | `button.label` (`color.on-primary`) | Novo |
| `booking.cancel-label` | Papel de ação textual ou destrutiva conforme o contexto | Novo |
| `hair-selector.option` | `hair.*` correspondente à opção escolhida | Novo |
| `hair-selector.selected-outline` | `color.focus` / papel de contorno validado | Novo |

Os estados hover, pressed e disabled devem ser implementados com as camadas e regras de estado da biblioteca adotada. Não inventar hexadecimais para cada estado. Em telas sensíveis ao toque, hover não deve ser requisito para compreender ou executar uma ação.

Os tokens de agendamento e seleção de cabelo são extensões do produto. Eles reutilizam o sistema semântico, mas não são componentes oficiais do Material 3 por si só.

## 4. Modo escuro

Os componentes mantêm os mesmos nomes de tokens e a mesma estrutura. O tema escuro altera os valores resolvidos pelos tokens semânticos:

- `color.primary` e `color.on-primary`: passam a apontar para os papéis correspondentes do esquema tonal escuro gerado no Material Theme Builder.
- `color.primary-container` e `color.on-primary-container`: utilizam os papéis de contêiner do esquema escuro.
- `color.secondary`, `color.on-secondary`, `color.tertiary` e seus respectivos contêineres: recebem os valores do esquema escuro.
- `color.surface`, `color.on-surface`, `color.surface-variant` e `color.on-surface-variant`: passam para os papéis de superfície e conteúdo do esquema escuro (`#1C1B1F` e `#E6E1E5` como base).
- `color.surface-container-low`, `color.surface-container` e `color.surface-container-high`: recebem os valores de superfície do esquema escuro.
- `color.outline` e `color.outline-variant`: recebem os contornos correspondentes ao tema escuro.
- `color.error`, `color.on-error`, `color.error-container` e `color.on-error-container`: passam para os papéis de erro do esquema escuro (`#F2B8B5` e `#601410` como base).
- `color.inverse-surface`, `color.inverse-on-surface` e `color.inverse-primary`: recebem os valores inversos do esquema escuro.
- `color.focus`: deve ser validado novamente para garantir visibilidade e contraste mínimo de 3:1 no fundo escuro.
- Os tokens derivados de cor dos componentes, como `button.bg`, `button.label`, `card.bg` e `navigation.bg`, acompanham automaticamente os papéis semânticos que referenciam.

As cores da marca (`orange-500` a `brown-900`), as 12 cores de cabelo, os espaçamentos primitivos, a escala tipográfica, os raios de curvatura e os nomes canônicos dos tokens permanecem inalterados. Sombras, elevação tonal, contraste e camadas de estado devem seguir a implementação do tema selecionado.

Não inverter os hexadecimais do tema claro para fabricar o tema escuro. Ambos devem ser gerados e validados como esquemas próprios no Material Theme Builder.

## 5. (Bônus) Versão legível por máquina

<!-- Exemplo parcial ilustrativo no formato W3C Design Tokens Community Group (DTCG).
     Não é um arquivo de exportação final nem substitui a geração pelo Material Theme Builder. -->

```json
{
  "$description": "Exemplo parcial ilustrativo de design tokens para app de barbearia Expo, seguindo a especificação W3C DTCG.",
  "brand": {
    "orange-500": {
      "$type": "color",
      "$value": "#FF8500",
      "$description": "Cor de marca primária da equipe"
    },
    "amber-700": {
      "$type": "color",
      "$value": "#CC7D29",
      "$description": "Cor de marca secundária da equipe"
    },
    "ochre-700": {
      "$type": "color",
      "$value": "#996D3D",
      "$description": "Cor de marca terciária da equipe"
    },
    "brown-700": {
      "$type": "color",
      "$value": "#66523D",
      "$description": "Tom neutro escuro da marca"
    },
    "brown-900": {
      "$type": "color",
      "$value": "#332E29",
      "$description": "Tom de contraste sobre primário da marca"
    }
  },
  "hair": {
    "black": { "$type": "color", "$value": "#1B1B1B" },
    "dark-brown": { "$type": "color", "$value": "#3B2214" },
    "brown": { "$type": "color", "$value": "#6F4E37" },
    "light-brown": { "$type": "color", "$value": "#A67B50" },
    "dark-blonde": { "$type": "color", "$value": "#B89B6A" },
    "golden-blonde": { "$type": "color", "$value": "#D4A843" },
    "light-blonde": { "$type": "color", "$value": "#F0D8A8" },
    "redhead": { "$type": "color", "$value": "#C2622D" },
    "copper": { "$type": "color", "$value": "#B4510E" },
    "dark-red": { "$type": "color", "$value": "#922724" },
    "gray": { "$type": "color", "$value": "#8B8B8B" },
    "white": { "$type": "color", "$value": "#F2F2F0" }
  },
  "neutral": {
    "white": { "$type": "color", "$value": "#FFFFFF" },
    "black": { "$type": "color", "$value": "#000000" }
  },
  "space": {
    "0": { "$type": "dimension", "$value": "0dp" },
    "4": { "$type": "dimension", "$value": "4dp" },
    "8": { "$type": "dimension", "$value": "8dp" },
    "12": { "$type": "dimension", "$value": "12dp" },
    "16": { "$type": "dimension", "$value": "16dp" },
    "24": { "$type": "dimension", "$value": "24dp" },
    "32": { "$type": "dimension", "$value": "32dp" },
    "48": { "$type": "dimension", "$value": "48dp" },
    "64": { "$type": "dimension", "$value": "64dp" }
  },
  "radius": {
    "none": { "$type": "dimension", "$value": "0dp" },
    "xs": { "$type": "dimension", "$value": "4dp" },
    "sm": { "$type": "dimension", "$value": "8dp" },
    "md": { "$type": "dimension", "$value": "12dp" },
    "lg": { "$type": "dimension", "$value": "16dp" },
    "xl": { "$type": "dimension", "$value": "28dp" },
    "full": { "$type": "dimension", "$value": "9999dp" }
  },
  "color": {
    "$description": "Papéis semânticos - Valores dependem da exportação oficial do Material Theme Builder.",
    "light": {
      "primary": {
        "$type": "color",
        "$value": "{brand.orange-500}"
      },
      "on-primary": {
        "$type": "color",
        "$value": "{brand.brown-900}"
      },
      "surface": {
        "$type": "color",
        "$value": "#FFFFFF"
      },
      "on-surface": {
        "$type": "color",
        "$value": "#1C1B1F"
      },
      "error": {
        "$type": "color",
        "$value": "#B3261E"
      }
    },
    "dark": {
      "primary": {
        "$type": "color",
        "$value": "{pending.dark.primary}"
      },
      "on-primary": {
        "$type": "color",
        "$value": "{pending.dark.on-primary}"
      },
      "surface": {
        "$type": "color",
        "$value": "#1C1B1F"
      },
      "on-surface": {
        "$type": "color",
        "$value": "#E6E1E5"
      },
      "error": {
        "$type": "color",
        "$value": "#F2B8B5"
      }
    }
  }
}
```

As referências `{pending.*}` são marcadores ilustrativos para documentar dependências pendentes de exportação do Material Theme Builder, não valores finais de produção.

### Critérios de aceite

- As cinco cores de marca da equipe (`orange-500` a `brown-900`) e as 12 cores naturais de cabelo são preservadas como primitivos.
- Todos os tokens possuem nomes canônicos consistentes e uma única responsabilidade.
- Os valores semânticos claro e escuro são derivados de esquemas tonais oficiais, sem inversões caseiras.
- Os componentes reutilizam tokens semânticos, sem valores literais arbitrários.
- A escala tipográfica é implementada com suporte ao ajuste de fonte de sistema (Dynamic Type / escala Android).
- Formas, elevação, estados e movimento são mapeados aos tokens correspondentes.
- Contraste, foco, leitor de tela e movimento reduzido possuem critérios verificáveis (WCAG 2.2 AA).
- Nenhum valor pendente de definição é apresentado falsamente como especificação oficial concluída.