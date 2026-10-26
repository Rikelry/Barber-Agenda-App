# Top App Bar (Header)

Origem no sistema base: Material 3, Center-aligned top app bar. Situação: Adaptado. Motivo da adaptação: Padronização da navegação de retorno e títulos de tela no app.

## Quando usar

- No topo de todas as telas para fornecer contexto (título).
- Para fornecer ação de retorno (botão voltar).
- Para ações globais da tela (ex: editar perfil).

## Quando não usar

- Em telas de splash ou modais de tela cheia que já possuam controle próprio.

## Anatomia

1. Contêiner: (token `navigation.bg`)
2. Título: (token `font.headline-small`)
3. Ação à esquerda: (geralmente ícone de voltar)
4. Ações à direita (opcional): (ícones de perfil ou configurações)

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Padrão | Maioria das telas do app | `color.surface`, `color.on-surface` |
| Transparente | Sobre imagens de fundo (ex: detalhes da barbearia) | `rgba(0,0,0,0)`, `color.neutral.white` |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Fixo | Permanece no topo | Guia de navegação | - |
| Scrolled | Pode ganhar sombra/elevação | Indica conteúdo abaixo | - |

## Acessibilidade

- Botão de voltar deve ter `accessibilityLabel="Voltar"`.
- Título deve ser anunciado como cabeçalho.

## Faça e evite

- **Faça:** Mantenha o título curto para evitar truncamento.
- **Evite:** Colocar mais de duas ações à direita.

## Código

```tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { tokens } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';

export const Header = ({ title, onBack }) => (
  <View style={{
    height: 64,
    backgroundColor: tokens.color.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.space.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.outlineVariant
  }}>
    {onBack && (
      <TouchableOpacity onPress={onBack} style={{ marginRight: tokens.space.md }}>
        <Ionicons name="arrow-back" size={24} color={tokens.color.onSurface} />
      </TouchableOpacity>
    )}
    <Text style={{ ...tokens.font.headlineSmall, color: tokens.color.onSurface }}>
      {title}
    </Text>
  </View>
);
```
