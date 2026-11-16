# Card

Origem no sistema base: Material 3, Elevated Card. Situação: Adaptado. Motivo da adaptação: Foco em exibição de barbearias e agendamentos com hierarquia visual clara.

## Quando usar

- Para agrupar informações relacionadas sobre uma única entidade (ex: uma Barbearia).
- Para itens de lista interativos (ex: Agendamentos na Home).

## Quando não usar

- Para elementos puramente decorativos sem conteúdo agrupado.
- Quando a informação for muito simples (use uma Lista).

## Anatomia

1. Contêiner: (token `radius.lg`, `elevation.card`)
2. Mídia/Imagem (opcional): (foto da barbearia)
3. Título: (token `font.title-large`)
4. Subtítulo/Descrição: (token `font.body-medium`)
5. Ações (opcional): (botões dentro do card)

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Elevado | Destaque na Home e listas | `elevation.level1`, `color.surface-container-low` |
| Outline | Itens secundários ou em superfícies já elevadas | `color.outline-variant`, `color.surface` |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | `elevation.level1` | Interativo (se aplicável) | - |
| Pressionado | `elevation.level2` | Feedback de profundidade | - |
| Desabilitado | Opacidade 50% | Interação bloqueada | - |

## Acessibilidade

- Alvo de toque: Se o card for clicável, deve respeitar os 48 dp.
- Hierarquia: Título deve ser o elemento principal para leitores de tela.

## Faça e evite

- **Faça:** Use imagens de alta qualidade para representar as barbearias.
- **Evite:** Colocar muitas ações dentro de um único card.

## Código

```tsx
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { tokens } from '../../theme/tokens';

export const Card = ({ title, subtitle, imageSource, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={{
      backgroundColor: tokens.color.surfaceContainerLow,
      borderRadius: tokens.radius.lg,
      elevation: 2, // Mapeado para level1
      overflow: 'hidden',
      marginBottom: tokens.space.md
    }}
  >
    {imageSource && <Image source={imageSource} style={{ height: 150, width: '100%' }} />}
    <View style={{ padding: tokens.space.md }}>
      <Text style={tokens.font.titleLarge}>{title}</Text>
      <Text style={tokens.font.bodyMedium}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);
```
