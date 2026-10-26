# Tab Bar (Navegação Inferior)

Origem no sistema base: Material 3, Navigation Bar. Situação: Adaptado. Motivo da adaptação: Navegação principal mobile-first para as 4 áreas do app.

## Quando usar

- Como navegação principal entre as seções: Home, Buscar, Agendas e Perfil.

## Quando não usar

- Em fluxos de sub-telas (ex: durante o processo de agendamento).
- Em telas de autenticação (Login/Cadastro).

## Anatomia

1. Contêiner: (token `navigation.bg`)
2. Ícone: (representação visual da seção)
3. Rótulo: (token `font.label-small`)
4. Indicador ativo: (token `navigation.selected-bg`)

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Padrão | Navegação fixa no rodapé | `color.surface`, `color.on-surface-variant` |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Inativo | Ícone outline + texto suave | Navegável | - |
| Ativo | Ícone preenchido + indicador de fundo | Indica seção atual | `accessibilityState={{ selected: true }}` |

## Acessibilidade

- Alvo de toque para cada aba: 48 dp de largura mínima.
- Cada item deve ter um rótulo claro anunciado pelo leitor de tela.

## Faça e evite

- **Faça:** Use ícones intuitivos e rótulos curtos.
- **Evite:** Usar mais de 5 abas.

## Código

```tsx
import { View, TouchableOpacity, Text } from 'react-native';
import { tokens } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';

export const TabBar = ({ state, descriptors, navigation }) => (
  <View style={{
    flexDirection: 'row',
    height: 80,
    backgroundColor: tokens.color.surface,
    borderTopWidth: 1,
    borderTopColor: tokens.color.outlineVariant,
    paddingBottom: 20
  }}>
    {state.routes.map((route, index) => {
      const isFocused = state.index === index;
      return (
        <TouchableOpacity 
          key={route.key}
          onPress={() => navigation.navigate(route.name)}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons 
            name={isFocused ? 'home' : 'home-outline'} 
            size={24} 
            color={isFocused ? tokens.color.primary : tokens.color.onSurfaceVariant} 
          />
          <Text style={{ 
            ...tokens.font.labelSmall, 
            color: isFocused ? tokens.color.primary : tokens.color.onSurfaceVariant 
          }}>
            {route.name}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);
```
