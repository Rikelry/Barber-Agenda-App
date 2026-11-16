# Tabs (Segmented Control)

Origem no sistema base: Material 3, Primary tabs. Situação: Adaptado. Motivo da adaptação: Alternância entre grupos de conteúdo na mesma tela (ex: Serviços vs Profissionais).

## Quando usar

- Para alternar entre categorias de conteúdo relacionadas.
- Para filtrar visualizações em uma lista (ex: Próximos vs Histórico).

## Quando não usar

- Para navegação global do app (use Tab Bar).
- Para ações de comando (use Botão).

## Anatomia

1. Contêiner: (token `navigation.bg`)
2. Itens de Aba: (token `font.title-small`)
3. Indicador de Seleção: (linha inferior ou contêiner tonal)

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Linha | Telas de detalhes (Serviços/Profissionais) | `color.primary`, `color.outline-variant` |
| Tonal | Filtros de agendamento (Próximos/Histórico) | `color.secondary-container`, `color.on-secondary-container` |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Ativo | Texto `color.primary` + Indicador | Indica foco atual | `selected: true` |
| Inativo | Texto `color.on-surface-variant` | Disponível para clique | - |

## Acessibilidade

- Garantir que a aba selecionada seja claramente distinguível da inativa.
- Leitores de tela devem anunciar o número total de abas e qual está selecionada.

## Faça e evite

- **Faça:** Mantenha os rótulos curtos (uma palavra, se possível).
- **Evite:** Usar muitas abas que exijam rolagem horizontal excessiva.

## Código

```tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { tokens } from '../../theme/tokens';

export const Tabs = ({ options, selectedIndex, onChange }) => (
  <View style={{
    flexDirection: 'row',
    backgroundColor: tokens.color.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.outlineVariant
  }}>
    {options.map((option, index) => {
      const isSelected = selectedIndex === index;
      return (
        <TouchableOpacity 
          key={option}
          onPress={() => onChange(index)}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: tokens.space.md,
            borderBottomWidth: isSelected ? 3 : 0,
            borderBottomColor: tokens.color.primary
          }}
        >
          <Text style={{
            ...tokens.font.titleSmall,
            color: isSelected ? tokens.color.primary : tokens.color.onSurfaceVariant
          }}>
            {option}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);
```
