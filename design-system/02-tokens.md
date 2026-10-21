# Tokens

<!-- Camada 2 da aula: decisões com nome. Três níveis: primitivo → semântico → componente.
     Formato do nome: categoria.papel.variação (ex.: color.action, space.md, radius.lg, font.title).
     Escreva sempre valor + unidade (px, dp ou pt). Em toda tabela, a coluna "Origem" usa: Herdado | Adaptado | Novo.
     Referência de design: Material Design 3 Expressive. As cinco cores da equipe são preservadas exatamente. -->

## 1. Primitivos (o valor bruto)

### Cor

| Token | Valor | Origem |
| --- | --- | --- |
| `orange-500` | `#FF8500` | Herdado |
| `amber-700` | `#CC7D29` | Herdado |
| `ochre-700` | `#996D3D` | Herdado |
| `brown-700` | `#66523D` | Herdado |
| `brown-900` | `#332E29` | Herdado |

### Espaço (grade de 8 pontos: múltiplos de 8, ou de 4 para ajustes finos)

| Token | Valor | Origem |
| --- | --- | --- |
| `space-4` | 4 dp | Adaptado |
| `space-8` | 8 dp | Adaptado |
| `space-16` | 16 dp | Adaptado |
| `space-24` | 24 dp | Adaptado |
| `space-32` | 32 dp | Adaptado |

## 2. Semânticos (o significado)

### Cor

| Token | Claro | Escuro | Uso | Origem |
| --- | --- | --- | --- | --- |
| `color.action` | `orange-500`* | Tom primário gerado para tema escuro* | Ações principais | Adaptado |
| `color.on-action` | `brown-900`* | Tom de conteúdo primário gerado para tema escuro* | Texto e ícone sobre `color.action` | Adaptado |
| `color.surface` | `#FFFFFF` | `#1C1B1F` | Fundo das telas | Adaptado |
| `color.on-surface` | `#1C1B1F` | `#E6E1E5` | Texto sobre `color.surface` | Adaptado |
| `color.error` | `#B3261E` | `#F2B8B5` | Erros e ações destrutivas | Adaptado |
| `color.focus` | Tom de contorno/foco validado para tema claro* | Tom de contorno/foco validado para tema escuro* | Anel de foco | Adaptado |

\* **Validação necessária para conformidade estrita com Material 3 Expressive:** as cores de marca da equipe são preservadas como primitivos, mas os papéis semânticos de produção — incluindo `primary`, `onPrimary` e foco — devem ser gerados e verificados no Material Theme Builder. Não se deve assumir que uma cor de marca atende automaticamente aos requisitos tonais e de contraste de um papel M3.

### Tipografia

| Token | Família | Tamanho | Peso | Altura de linha | Uso | Origem |
| --- | --- | --- | --- | --- | --- | --- |
| `font.title` | Roboto Flex (fallback: Roboto) | 24 sp | 400 | 32 sp | Títulos de tela | Adaptado |
| `font.body` | Roboto Flex (fallback: Roboto) | 16 sp | 400 | 24 sp | Texto corrido | Adaptado |
| `font.label` | Roboto Flex (fallback: Roboto) | 14 sp | 500 | 20 sp | Rótulos de botão e campo | Adaptado |

### Espaço, forma e elevação

| Token | Valor | Uso | Origem |
| --- | --- | --- | --- |
| `space.sm` | `space-8` | Espaço entre elementos relacionados | Adaptado |
| `space.md` | `space-16` | Margem interna padrão | Adaptado |
| `space.lg` | `space-24` | Separação entre grupos | Adaptado |
| `radius.md` | 12 dp | Campos e botões, conforme forma do componente M3 | Adaptado |
| `radius.lg` | 16 dp | Cards, conforme forma do componente M3 | Adaptado |
| `elevation.card` | Nível de elevação definido pelo componente Material 3 | Cards sobre a superfície | Adaptado |

### Movimento

| Token | Valor | Uso | Origem |
| --- | --- | --- | --- |
| `motion.duration.short` | Duração curta oficial da plataforma, em ms | Feedback de toque | Adaptado |
| `motion.duration.medium` | Duração média oficial da plataforma, em ms | Transições entre telas | Adaptado |
| `motion.easing.standard` | Curva padrão oficial Material 3 Expressive | Curva padrão | Adaptado |

## 3. Tokens de componente (onde é usado)

| Token | Aponta para | Origem |
| --- | --- | --- |
| `button.bg` | `color.action` | Adaptado |
| `button.label` | `color.on-action` | Adaptado |
| `button.radius` | Forma oficial do botão na implementação Material 3 Expressive | Adaptado |
| `button.bg-hover` | `color.action` + camada de estado hover oficial M3 | Adaptado |
| `button.bg-pressed` | `color.action` + camada de estado pressed oficial M3 | Adaptado |
| `button.bg-disabled` | Papéis de superfície e estado desabilitado da implementação M3 | Adaptado |

## 4. Modo escuro

Os componentes mantêm os mesmos tokens; mudam os valores dos tokens semânticos conforme o esquema de cores escuro gerado pelo Material Theme Builder.

- `color.action`: usa o papel primário do esquema escuro, gerado a partir das cores-fonte da equipe.
- `color.on-action`: usa o papel `onPrimary` correspondente ao primário no esquema escuro.
- `color.surface`: muda para a superfície escura do esquema.
- `color.on-surface`: muda para o papel `onSurface` do esquema escuro.
- `color.error`: muda para o papel `error` do esquema escuro.
- `color.focus`: usa o papel de foco/contorno adequado ao esquema escuro, com contraste validado.

As cinco cores de marca (`#FF8500`, `#CC7D29`, `#996D3D`, `#66523D` e `#332E29`) permanecem inalteradas na camada de primitivos. Para seguir rigorosamente o Material 3 Expressive, gerar os papéis tonais claro/escuro e validar o contraste no [Material Theme Builder](https://m3.material.io/theme-builder); não presumir que os mesmos hexadecimais funcionam em todos os papéis ou temas.

## 5. (Bônus) Versão legível por máquina

<!-- Opcional: os mesmos tokens no formato do W3C Design Tokens (designtokens.org), em JSON. -->

```json
{
  "orange-500": {
    "$type": "color",
    "$value": "#FF8500"
  },
  "amber-700": {
    "$type": "color",
    "$value": "#CC7D29"
  },
  "ochre-700": {
    "$type": "color",
    "$value": "#996D3D"
  },
  "brown-700": {
    "$type": "color",
    "$value": "#66523D"
  },
  "brown-900": {
    "$type": "color",
    "$value": "#332E29"
  },
  "space-4": {
    "$type": "dimension",
    "$value": "4dp"
  },
  "space-8": {
    "$type": "dimension",
    "$value": "8dp"
  },
  "space-16": {
    "$type": "dimension",
    "$value": "16dp"
  },
  "space-24": {
    "$type": "dimension",
    "$value": "24dp"
  },
  "space-32": {
    "$type": "dimension",
    "$value": "32dp"
  },
  "color": {
    "surface": {
      "$type": "color",
      "$value": "#FFFFFF"
    },
    "on-surface": {
      "$type": "color",
      "$value": "#1C1B1F"
    }
  }
}
```