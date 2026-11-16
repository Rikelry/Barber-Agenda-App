# Badge (Etiqueta de Status)

Origem no sistema base: Material 3, Badge/Assist Chip. Situação: Adaptado. Motivo da adaptação: Uso específico para estados de agendamento e barbearias.

## Quando usar

- Para indicar o status de um agendamento (Confirmado, Pendente, Cancelado).
- Para indicar se uma barbearia está Aberta ou Fechada.
- Para destacar informações curtas e importantes (ex: "Novo").

## Quando não usar

- Para ações interativas (use Botão ou Chip).
- Para textos longos.

## Anatomia

1. Contêiner: (token `radius.xs`)
2. Rótulo: (token `font.label-small`)

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Sucesso | Status "Confirmado" ou "Aberto" | `neutral.white` sobre fundo `#2E7D32` (pendente de token semântico de status) |
| Alerta | Status "Pendente" | `color.secondary-container`, `color.on-secondary-container` |
| Erro | Status "Cancelado" ou "Fechado" | `color.error`, `color.on-error` |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | Conforme variante | Estático | Contraste de cor |

## Acessibilidade

- Garantir contraste mínimo de 4,5:1 entre o texto e o fundo da badge.
- Leitores de tela devem anunciar o texto da badge como parte do contexto do item pai.

## Faça e evite

- **Faça:** Use cores semânticas que reforcem o significado do status.
- **Evite:** Usar badges com muitas cores diferentes na mesma tela, o que pode confundir o usuário.

## Código

```tsx
import { View, Text } from 'react-native';
import { tokens } from '../../theme/tokens';

export const Badge = ({ label, variant = 'sucesso' }) => {
  const getStyles = () => {
    switch (variant) {
      case 'sucesso': return { bg: '#2E7D32', text: '#FFFFFF' };
      case 'alerta': return { bg: tokens.color.secondaryContainer, text: tokens.color.onSecondaryContainer };
      case 'erro': return { bg: tokens.color.error, text: tokens.color.onError };
      default: return { bg: tokens.color.surfaceVariant, text: tokens.color.onSurfaceVariant };
    }
  };

  const styles = getStyles();

  return (
    <View style={{
      backgroundColor: styles.bg,
      borderRadius: tokens.radius.xs,
      paddingHorizontal: tokens.space.sm,
      paddingVertical: 2,
      alignSelf: 'flex-start'
    }}>
      <Text style={{ color: styles.text, ...tokens.font.labelSmall, fontWeight: 'bold' }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
};
```
