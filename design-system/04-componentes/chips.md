# Chips

Origem no sistema base: Material 3, Filter and Input chips. Situação: Adaptado. Motivo da adaptação: Otimização para seleção de filtros rápidos e horários em mobile.

## Quando usar

- Seleção de filtros (ex: Cabelo, Barba).
- Seleção de horários de agendamento.
- Indicação de tags ou categorias.

## Quando não usar

- Para ações principais (use Botão).
- Para entrada de texto livre.

## Anatomia

1. Contêiner: (token `radius.full`)
2. Rótulo: (token `font.label-medium`)
3. Ícone opcional: (ex: checkmark quando selecionado)

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Filtro | Categorias na Home | `color.surface-variant`, `color.on-surface-variant` |
| Seleção | Escolha de horários | `color.primary-container`, `color.on-primary-container` |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | Borda sutíl ou fundo neutro | Interativo | - |
| Selecionado | Fundo colorido (primary) | Indica escolha ativa | Contraste de cor |
| Desabilitado | Texto cinza | Não selecionável | - |

## Acessibilidade

- Alvo de toque mínimo: 48 dp (pode incluir área externa de respiro).
- Leitor de tela: Anuncia o estado de "selecionado" ou "não selecionado".

## Faça e evite

- **Faça:** Use rótulos curtos e objetivos.
- **Evite:** Usar chips para ações que abram novas telas complexas.

## Código

```tsx
import { TouchableOpacity, Text } from 'react-native';
import { tokens } from '../../theme/tokens';

export const Chip = ({ label, selected, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={{
      backgroundColor: selected ? tokens.color.primaryContainer : tokens.color.surfaceVariant,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.space.md,
      paddingVertical: tokens.space.sm,
      borderWidth: selected ? 0 : 1,
      borderColor: tokens.color.outlineVariant
    }}
  >
    <Text style={{ 
      color: selected ? tokens.color.onPrimaryContainer : tokens.color.onSurfaceVariant,
      ...tokens.font.labelMedium 
    }}>
      {label}
    </Text>
  </TouchableOpacity>
);
```
