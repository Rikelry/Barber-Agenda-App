# Barra de Busca (Search Bar)

Origem no sistema base: Material 3, Search bar. Situação: Adaptado. Motivo da adaptação: Ponto central de descoberta de barbearias e serviços.

## Quando usar

- No topo da Home ou da lista de barbearias.
- Para filtrar grandes conjuntos de dados em tempo real.

## Quando não usar

- Em telas de formulário simples.

## Anatomia

1. Contêiner: (token `radius.full`, `color.surface-container-high`)
2. Ícone de Lupa: (à esquerda)
3. Placeholder: (token `font.body-large`)

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Padrão | Busca na Home | `color.surface-container-high`, `elevation.level1` |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Inativo | Texto placeholder | Abre teclado ao tocar | `hint="Buscar barbearia..."` |
| Ativo | Cursor visível | Filtra resultados | Botão "limpar" à direita |

## Acessibilidade

- Deve ter um `accessibilityLabel` claro.
- Permitir que o usuário limpe a busca com um único clique (ícone de "X").

## Faça e evite

- **Faça:** Mantenha a barra de busca visível ou facilmente acessível.
- **Evite:** Esconder a barra de busca atrás de muitos menus.

## Código

```tsx
import { View, TextInput } from 'react-native';
import { tokens } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';

export const SearchBar = ({ placeholder, value, onChangeText }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.color.surfaceContainerHigh,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.space.md,
    height: 48,
    marginVertical: tokens.space.md,
    elevation: 2
  }}>
    <Ionicons name="search" size={20} color={tokens.color.onSurfaceVariant} style={{ marginRight: tokens.space.sm }} />
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={{ flex: 1, ...tokens.font.bodyLarge, color: tokens.color.onSurface }}
      placeholderTextColor={tokens.color.onSurfaceVariant}
    />
  </View>
);
```
