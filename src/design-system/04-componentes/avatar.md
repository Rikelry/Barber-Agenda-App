# Avatar

Origem no sistema base: Material 3, Avatar. Situação: Herdado. Motivo da adaptação: Padrão para identificação de usuários e profissionais.

## Quando usar

- Para representar visualmente um usuário (tela de Perfil).
- Para identificar profissionais de uma barbearia (tela de Detalhes).
- Em listas de chats ou comentários, se aplicável.

## Quando não usar

- Para logos de empresas (use o componente de Logo ou Imagem).
- Para imagens que não representem pessoas.

## Anatomia

1. Imagem ou Iniciais: (token `radius.full`)
2. Contêiner circular: (token `color.surface-variant`)

## Variantes

| Variante | Uso | Dimensões |
| --- | --- | --- |
| Pequeno | Listas e cabeçalhos compactos | 32x32 dp |
| Médio | Listas de profissionais e Home | 48x48 dp |
| Grande | Tela de Perfil | 96x96 dp |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | Imagem carregada ou placeholder | Estático | `accessibilityRole="image"` |

## Acessibilidade

- Fornecer um `accessibilityLabel` com o nome da pessoa representada.
- Usar um placeholder neutro quando a imagem falhar ao carregar.

## Faça e evite

- **Faça:** Use imagens circulares para manter a consistência do sistema.
- **Evite:** Usar avatares muito pequenos que dificultem a identificação da pessoa.

## Código

```tsx
import { Image, View, Text } from 'react-native';
import { tokens } from '../../theme/tokens';

export const Avatar = ({ source, name, size = 48 }) => (
  <View style={{
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: tokens.color.surfaceVariant,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    {source ? (
      <Image source={source} style={{ width: '100%', height: '100%' }} />
    ) : (
      <Text style={{ ...tokens.font.titleMedium, color: tokens.color.onSurfaceVariant }}>
        {name?.charAt(0).toUpperCase()}
      </Text>
    )}
  </View>
);
```
