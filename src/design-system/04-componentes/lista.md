# Lista (List Item)

Origem no sistema base: Material 3, List item. Situação: Adaptado. Motivo da adaptação: Estrutura base para exibição de profissionais, serviços e horários.

## Quando usar

- Para exibir uma coleção de itens semelhantes (ex: Lista de Profissionais).
- Para menus de configuração.

## Quando não usar

- Quando os itens precisam de muito destaque visual (use Card).
- Para conteúdos não repetitivos.

## Anatomia

1. Contêiner: (altura mínima 56 dp)
2. Leading (Opcional): (Avatar ou Ícone)
3. Headline: (token `font.body-large`)
4. Supporting text (Opcional): (token `font.body-small`)
5. Trailing (Opcional): (Ícone de seta, Switch ou Botão)

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Simples | Lista de horários | `color.on-surface` |
| Com Avatar | Lista de profissionais | `avatar`, `font.title-small` |
| Interativa | Menu de configurações | Inclui seta à direita |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | Fundo `color.surface` | Interativo | - |
| Pressionado | Overlay de estado tonal | Feedback de toque | - |

## Acessibilidade

- Alvo de toque mínimo: 48 dp de altura.
- Leitores de tela devem agrupar o título e a descrição como um único item.

## Faça e evite

- **Faça:** Use divisores sutis entre os itens da lista.
- **Evite:** Colocar muitas informações em uma única linha da lista.

## Código

```tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { tokens } from '../../theme/tokens';

export const ListItem = ({ title, subtitle, leading, trailing, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: tokens.space.md,
      backgroundColor: tokens.color.surface,
      borderBottomWidth: 1,
      borderBottomColor: tokens.color.outlineVariant
    }}
  >
    {leading && <View style={{ marginRight: tokens.space.md }}>{leading}</View>}
    <View style={{ flex: 1 }}>
      <Text style={tokens.font.bodyLarge}>{title}</Text>
      {subtitle && <Text style={{ ...tokens.font.bodySmall, color: tokens.color.onSurfaceVariant }}>{subtitle}</Text>}
    </View>
    {trailing && <View style={{ marginLeft: tokens.space.md }}>{trailing}</View>}
  </TouchableOpacity>
);
```
