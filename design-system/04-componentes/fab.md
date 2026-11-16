# FAB (Botão Flutuante)

Origem no sistema base: Material 3, Floating Action Button. Situação: Herdado. Motivo da adaptação: Ação principal de criação em telas de gestão.

## Quando usar

- Para a ação mais importante e frequente de uma tela (ex: Adicionar novo Profissional/Serviço).
- Em telas de lista onde a criação de um novo item é o objetivo principal.

## Quando não usar

- Para ações secundárias ou de menor importância.
- Se houver mais de uma ação principal concorrente.

## Anatomia

1. Contêiner Circular: (token `radius.full`, `elevation.level3`)
2. Ícone Central: (token `color.on-primary-container`)

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Padrão | Adicionar itens em listas | `color.primary-container`, `color.on-primary-container` |
| Pequeno | Ações secundárias agrupadas | Tamanho 40x40 dp |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | `elevation.level3` | Interativo | `accessibilityLabel` obrigatório |
| Pressionado | `elevation.level4` | Feedback de profundidade | - |

## Acessibilidade

- Deve possuir um rótulo de acessibilidade claro (ex: "Adicionar nova barbearia").
- O contraste entre o ícone e o fundo deve ser no mínimo 4,5:1.

## Faça e evite

- **Faça:** Coloque o FAB no canto inferior direito da tela (padrão Android).
- **Evite:** Mudar a posição do FAB entre telas diferentes.

## Código

```tsx
import { TouchableOpacity } from 'react-native';
import { tokens } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';

export const FAB = ({ iconName, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={{
      position: 'absolute',
      right: tokens.space.lg,
      bottom: tokens.space.lg,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: tokens.color.primaryContainer,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 6, // Level 3
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
    }}
  >
    <Ionicons name={iconName} size={24} color={tokens.color.onPrimaryContainer} />
  </TouchableOpacity>
);
```
