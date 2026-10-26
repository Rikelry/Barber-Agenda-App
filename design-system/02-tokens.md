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

As cores de cabelo são dados visuais de domínio. Não devem ser utilizadas automaticamente como cores de ação, texto, erro ou foco.

#### Cores neutras e fontes de marca

| Token | Valor | Origem |
| --- | --- | --- |
| `neutral.white` | `#FFFFFF` | Novo |
| `neutral.black` | `#000000` | Novo |
| `brand.source.primary` | A definir no Material Theme Builder | Novo |
| `brand.source.secondary` | A definir no Material Theme Builder | Novo |
| `brand.source.tertiary` | A definir no Material Theme Builder | Novo |

As fontes de marca devem ser escolhidas e convertidas em paletas tonais antes da definição dos papéis semânticos finais. As cores naturais dos cabelos não são, por si só, um esquema tonal de interface.

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

Os espaçamentos são decisões do sistema do projeto, não valores exclusivos ou obrigatórios do Material 3 Expressive.

### Forma

| Token | Valor | Origem |
| --- | --- | --- |
| `radius.none` | 0 dp | Novo |
| `radius.xs` | 4 dp | Adaptado |
| `radius.sm` | 8 dp | Adaptado |
| `radius.md` | 12 dp | Adaptado |
| `radius.lg` | 16 dp | Adaptado |
| `radius.xl` | 28 dp | Adaptado |
| `radius.full` | Forma circular, conforme dimensões do componente | Adaptado |

A escala é uma convenção de implementação inicial. O raio definitivo de cada componente deve corresponder à variante M3 adotada. `radius.full` é semântico, não um valor literal universal.

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

Os papéis semânticos seguem a nomenclatura do Material 3. Os valores finais devem ser preenchidos com a exportação do Material Theme Builder, depois de escolher as fontes de marca e gerar os esquemas claro e escuro.

| Token | Claro | Escuro | Uso | Origem |
| --- | --- | --- | --- | --- |
| `color.primary` | `primary` do esquema tonal claro | `primary` do esquema tonal escuro | Ações principais | Adaptado |
| `color.on-primary` | `onPrimary` do esquema claro | `onPrimary` do esquema escuro | Conteúdo sobre primário | Adaptado |
| `color.primary-container` | `primaryContainer` do esquema claro | `primaryContainer` do esquema escuro | Destaques e ações secundárias | Adaptado |
| `color.on-primary-container` | `onPrimaryContainer` do esquema claro | `onPrimaryContainer` do esquema escuro | Conteúdo sobre contêiner primário | Adaptado |
| `color.secondary` | `secondary` do esquema claro | `secondary` do esquema escuro | Ações de apoio | Adaptado |
| `color.on-secondary` | `onSecondary` do esquema claro | `onSecondary` do esquema escuro | Conteúdo sobre secundário | Adaptado |
| `color.secondary-container` | `secondaryContainer` do esquema claro | `secondaryContainer` do esquema escuro | Seleções e ações tonais | Adaptado |
| `color.on-secondary-container` | `onSecondaryContainer` do esquema claro | `onSecondaryContainer` do esquema escuro | Conteúdo sobre contêiner secundário | Adaptado |
| `color.tertiary` | `tertiary` do esquema claro | `tertiary` do esquema escuro | Acentos complementares | Adaptado |
| `color.on-tertiary` | `onTertiary` do esquema claro | `onTertiary` do esquema escuro | Conteúdo sobre terciário | Adaptado |
| `color.tertiary-container` | `tertiaryContainer` do esquema claro | `tertiaryContainer` do esquema escuro | Destaques complementares | Adaptado |
| `color.on-tertiary-container` | `onTertiaryContainer` do esquema claro | `onTertiaryContainer` do esquema escuro | Conteúdo sobre contêiner terciário | Adaptado |
| `color.surface` | `surface` do esquema claro | `surface` do esquema escuro | Superfícies de tela | Adaptado |
| `color.on-surface` | `onSurface` do esquema claro | `onSurface` do esquema escuro | Texto e ícones principais | Adaptado |
| `color.surface-variant` | `surfaceVariant` ou papel equivalente exportado | `surfaceVariant` ou papel equivalente exportado | Superfícies diferenciadas | Adaptado |
| `color.on-surface-variant` | `onSurfaceVariant` ou papel equivalente exportado | `onSurfaceVariant` ou papel equivalente exportado | Conteúdo secundário | Adaptado |
| `color.surface-container-low` | `surfaceContainerLow` do esquema claro | `surfaceContainerLow` do esquema escuro | Cartões discretos | Adaptado |
| `color.surface-container` | `surfaceContainer` do esquema claro | `surfaceContainer` do esquema escuro | Agrupamentos de conteúdo | Adaptado |
| `color.surface-container-high` | `surfaceContainerHigh` do esquema claro | `surfaceContainerHigh` do esquema escuro | Diálogos e superfícies elevadas | Adaptado |
| `color.outline` | `outline` do esquema claro | `outline` do esquema escuro | Bordas e campos | Adaptado |
| `color.outline-variant` | `outlineVariant` do esquema claro | `outlineVariant` do esquema escuro | Divisores e contornos sutis | Adaptado |
| `color.error` | `error` do esquema claro | `error` do esquema escuro | Erros e ações destrutivas | Adaptado |
| `color.on-error` | `onError` do esquema claro | `onError` do esquema escuro | Conteúdo sobre erro | Adaptado |
| `color.error-container` | `errorContainer` do esquema claro | `errorContainer` do esquema escuro | Fundo de mensagens de erro | Adaptado |
| `color.on-error-container` | `onErrorContainer` do esquema claro | `onErrorContainer` do esquema escuro | Conteúdo sobre contêiner de erro | Adaptado |
| `color.inverse-surface` | `inverseSurface` do esquema claro | `inverseSurface` do esquema escuro | Superfícies invertidas | Adaptado |
| `color.inverse-on-surface` | `inverseOnSurface` do esquema claro | `inverseOnSurface` do esquema escuro | Conteúdo em superfícies invertidas | Adaptado |
| `color.inverse-primary` | `inversePrimary` do esquema claro | `inversePrimary` do esquema escuro | Primário em contexto invertido | Adaptado |
| `color.focus` | Papel de contorno ou foco validado para o esquema claro | Papel de contorno ou foco validado para o esquema escuro | Indicador de foco acessível | Novo |

**Nota de conformidade:** os nomes acima representam papéis semânticos, não valores hexadecimais. A nomenclatura exata deve acompanhar a versão do esquema M3 exportado. `color.focus` é uma abstração do projeto: use um papel de cor adequado e valide sua visibilidade em cada componente. Não o considere automaticamente um papel oficial independente do esquema.

### Tipografia

| Token | Família | Tamanho | Peso | Altura de linha | Uso | Origem |
| --- | --- | --- | --- | --- | --- | --- |
| `font.display-large` | Roboto | 57 sp | 400 | 64 sp | Destaques excepcionais | Adaptado |
| `font.display-medium` | Roboto | 45 sp | 400 | 52 sp | Destaques de tela | Adaptado |
| `font.display-small` | Roboto | 36 sp | 400 | 44 sp | Títulos de destaque | Adaptado |
| `font.headline-large` | Roboto | 32 sp | 400 | 40 sp | Cabeçalhos principais | Adaptado |
| `font.headline-medium` | Roboto | 28 sp | 400 | 36 sp | Cabeçalhos de seção | Adaptado |
| `font.headline-small` | Roboto | 24 sp | 400 | 32 sp | Títulos de tela | Adaptado |
| `font.title-large` | Roboto | 22 sp | 500 | 28 sp | Títulos de cartões | Adaptado |
| `font.title-medium` | Roboto | 16 sp | 500 | 24 sp | Títulos de componentes | Adaptado |
| `font.title-small` | Roboto | 14 sp | 500 | 20 sp | Títulos compactos | Adaptado |
| `font.body-large` | Roboto | 16 sp | 400 | 24 sp | Texto corrido principal | Adaptado |
| `font.body-medium` | Roboto | 14 sp | 400 | 20 sp | Texto corrido padrão | Adaptado |
| `font.body-small` | Roboto | 12 sp | 400 | 16 sp | Texto auxiliar | Adaptado |
| `font.label-large` | Roboto | 14 sp | 500 | 20 sp | Rótulos de botões | Adaptado |
| `font.label-medium` | Roboto | 12 sp | 500 | 16 sp | Rótulos e indicadores | Adaptado |
| `font.label-small` | Roboto | 11 sp | 500 | 16 sp | Metadados compactos | Adaptado |

A escala de referência segue a tipografia Material 3. O peso numérico `500` depende da disponibilidade da fonte e deve ser validado na plataforma. No Expo, os valores numéricos de `fontSize` e `lineHeight` são usados no React Native; `sp` documenta a intenção de design, não uma unidade literal aceita pelo StyleSheet.

### Espaço, forma e elevação

| Token | Valor | Uso | Origem |
| --- | --- | --- | --- |
| `space.sm` | `space-8` = 8 dp | Elementos relacionados | Adaptado |
| `space.md` | `space-16` = 16 dp | Preenchimento padrão | Adaptado |
| `space.lg` | `space-24` = 24 dp | Separação entre grupos | Adaptado |
| `space.xl` | `space-32` = 32 dp | Separação entre seções | Novo |
| `radius.sm` | `radius.sm` = 8 dp | Controles compactos | Adaptado |
| `radius.md` | `radius.md` = 12 dp | Campos e componentes compatíveis | Adaptado |
| `radius.lg` | `radius.lg` = 16 dp | Cartões conforme variante | Adaptado |
| `radius.xl` | `radius.xl` = 28 dp | Superfícies maiores, quando aplicável | Adaptado |
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
| `button.radius` | Forma da variante de botão M3 escolhida | Adaptado |
| `button.bg-hover` | `color.primary` + camada de estado hover do componente | Adaptado |
| `button.bg-pressed` | `color.primary` + camada de estado pressed do componente | Adaptado |
| `button.bg-disabled` | Papel de superfície e estado desabilitado da implementação M3 | Adaptado |
| `button.label-disabled` | Papel de conteúdo desabilitado da implementação M3 | Adaptado |
| `field.bg` | Papel de superfície definido pela variante de campo | Adaptado |
| `field.label` | `color.on-surface-variant` | Adaptado |
| `field.outline` | `color.outline` | Adaptado |
| `field.outline-focused` | Papel de foco validado | Adaptado |
| `card.bg` | `color.surface-container-low` | Adaptado |
| `card.label` | `color.on-surface` | Adaptado |
| `card.elevation` | Nível de elevação da variante de cartão | Adaptado |
| `navigation.bg` | `color.surface` | Adaptado |
| `navigation.label` | `color.on-surface-variant` | Adaptado |
| `navigation.selected-bg` | Papel de contêiner da variante de navegação | Adaptado |
| `navigation.selected-label` | Papel de conteúdo correspondente ao contêiner selecionado | Adaptado |
| `booking.confirm-bg` | `button.bg` | Novo |
| `booking.confirm-label` | `button.label` | Novo |
| `booking.cancel-label` | Papel de ação textual ou destrutiva conforme o contexto | Novo |
| `hair-selector.option` | `hair.*` correspondente à opção escolhida | Novo |
| `hair-selector.selected-outline` | Papel de foco ou contorno validado | Novo |

Os estados hover, pressed e disabled devem ser implementados com as camadas e regras de estado da biblioteca adotada. Não inventar hexadecimais para cada estado. Em telas sensíveis ao toque, hover não deve ser requisito para compreender ou executar uma ação.

Os tokens de agendamento e seleção de cabelo são extensões do produto. Eles reutilizam o sistema semântico, mas não são componentes oficiais do Material 3 por si só.

## 4. Modo escuro

Os componentes mantêm os mesmos nomes de tokens e a mesma estrutura. O tema escuro altera os valores dos tokens semânticos.

- `color.primary` e `color.on-primary`: passam a apontar para os papéis correspondentes do esquema tonal escuro.
- `color.primary-container` e `color.on-primary-container`: utilizam os papéis de contêiner do esquema escuro.
- `color.secondary`, `color.on-secondary`, `color.tertiary` e seus respectivos contêineres: recebem os valores do esquema escuro.
- `color.surface`, `color.on-surface`, `color.surface-variant` e `color.on-surface-variant`: passam para os papéis de superfície e conteúdo do esquema escuro.
- `color.surface-container-low`, `color.surface-container` e `color.surface-container-high`: recebem os valores de superfície do esquema escuro.
- `color.outline` e `color.outline-variant`: recebem os contornos correspondentes ao tema escuro.
- `color.error`, `color.on-error`, `color.error-container` e `color.on-error-container`: passam para os papéis de erro do esquema escuro.
- `color.inverse-surface`, `color.inverse-on-surface` e `color.inverse-primary`: recebem os valores inversos do esquema escuro.
- `color.focus`: deve ser validado novamente para garantir visibilidade no fundo escuro.
- Os tokens derivados de cor dos componentes, como `button.bg`, `button.label`, `card.bg` e `navigation.bg`, acompanham automaticamente os papéis semânticos que referenciam.

Os primitivos de cabelo, espaçamentos, tipografia, formas e nomes dos tokens permanecem constantes. Sombras, elevação tonal, contraste e camadas de estado devem seguir a implementação do tema selecionado.

Não inverter os hexadecimais do tema claro para fabricar o tema escuro. Ambos devem ser gerados e validados como esquemas próprios. As cores naturais dos cabelos continuam inalteradas; se forem usadas sobre superfícies diferentes, deve-se validar a legibilidade do rótulo ou do indicador sem alterar a cor original da amostra.

## 5. (Bônus) Versão legível por máquina

O exemplo abaixo usa o formato W3C Design Tokens (DTCG). Os tokens de cabelo, espaçamento e algumas dimensões já possuem valores definidos. Os papéis semânticos de cor são referências a serem preenchidas com os valores exportados do Material Theme Builder.

```json
{
  "$description": "Design tokens para app de barbearia Expo, com referência ao Material Design 3 Expressive.",
  "hair": {
    "black": {
      "$type": "color",
      "$value": "#1B1B1B"
    },
    "darkBrown": {
      "$type": "color",
      "$value": "#3B2214"
    },
    "brown": {
      "$type": "color",
      "$value": "#6F4E37"
    },
    "lightBrown": {
      "$type": "color",
      "$value": "#A67B50"
    },
    "darkBlonde": {
      "$type": "color",
      "$value": "#B89B6A"
    },
    "goldenBlonde": {
      "$type": "color",
      "$value": "#D4A843"
    },
    "lightBlonde": {
      "$type": "color",
      "$value": "#F0D8A8"
    },
    "redhead": {
      "$type": "color",
      "$value": "#C2622D"
    },
    "copper": {
      "$type": "color",
      "$value": "#B4510E"
    },
    "darkRed": {
      "$type": "color",
      "$value": "#922724"
    },
    "gray": {
      "$type": "color",
      "$value": "#8B8B8B"
    },
    "white": {
      "$type": "color",
      "$value": "#F2F2F0"
    }
  },
  "space": {
    "4": {
      "$type": "dimension",
      "$value": "4dp"
    },
    "8": {
      "$type": "dimension",
      "$value": "8dp"
    },
    "12": {
      "$type": "dimension",
      "$value": "12dp"
    },
    "16": {
      "$type": "dimension",
      "$value": "16dp"
    },
    "24": {
      "$type": "dimension",
      "$value": "24dp"
    },
    "32": {
      "$type": "dimension",
      "$value": "32dp"
    },
    "48": {
      "$type": "dimension",
      "$value": "48dp"
    },
    "64": {
      "$type": "dimension",
      "$value": "64dp"
    }
  },
  "radius": {
    "sm": {
      "$type": "dimension",
      "$value": "8dp"
    },
    "md": {
      "$type": "dimension",
      "$value": "12dp"
    },
    "lg": {
      "$type": "dimension",
      "$value": "16dp"
    },
    "xl": {
      "$type": "dimension",
      "$value": "28dp"
    }
  },
  "color": {
    "$description": "Preencher os valores de light e dark com a exportação validada do Material Theme Builder.",
    "light": {
      "primary": {
        "$type": "color",
        "$value": "{generated.light.primary}"
      },
      "onPrimary": {
        "$type": "color",
        "$value": "{generated.light.onPrimary}"
      },
      "surface": {
        "$type": "color",
        "$value": "{generated.light.surface}"
      },
      "onSurface": {
        "$type": "color",
        "$value": "{generated.light.onSurface}"
      },
      "error": {
        "$type": "color",
        "$value": "{generated.light.error}"
      }
    },
    "dark": {
      "primary": {
        "$type": "color",
        "$value": "{generated.dark.primary}"
      },
      "onPrimary": {
        "$type": "color",
        "$value": "{generated.dark.onPrimary}"
      },
      "surface": {
        "$type": "color",
        "$value": "{generated.dark.surface}"
      },
      "onSurface": {
        "$type": "color",
        "$value": "{generated.dark.onSurface}"
      },
      "error": {
        "$type": "color",
        "$value": "{generated.dark.error}"
      }
    }
  }
}
```

As referências `{generated.*}` são marcadores ilustrativos, não valores exportados nem um arquivo pronto para consumo direto em produção. Devem ser substituídas pelos valores reais do esquema gerado e validadas com a ferramenta de tokens adotada. Os campos de movimento também devem ser materializados a partir da especificação de animação da implementação selecionada.

### Critérios de aceite

- As 12 cores naturais de cabelo são preservadas sem alteração.
- Todos os tokens possuem nomes consistentes e uma única responsabilidade.
- Os valores semânticos claro e escuro são gerados a partir de esquemas tonais validados.
- Os componentes reutilizam tokens semânticos, sem hexadecimais arbitrários.
- A escala tipográfica é implementada com suporte ao ajuste de texto.
- Formas, elevação, estados e movimento são mapeados às variantes reais dos componentes.
- Contraste, foco, leitor de tela e movimento reduzido são testados em Android e iOS.
- Nenhum valor ainda pendente de geração é apresentado como especificação oficial concluída.