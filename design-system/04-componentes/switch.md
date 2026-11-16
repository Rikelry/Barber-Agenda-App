# Switch (Chave)

Origem no sistema base: Material 3, Switch. Situação: Herdado. Motivo da adaptação: Controle binário de estados (ex: Aberto/Fechado).

## Quando usar

- Para ativar ou desativar uma funcionalidade ou estado (ex: Dia de funcionamento).
- Em telas de configurações.

## Quando não usar

- Quando o usuário precisa escolher entre múltiplas opções (use Chips ou Radio).
- Para ações de navegação.

## Anatomia

1. Trilho (Track): (token `radius.full`)
2. Polegar (Thumb): (token `radius.full`, `color.surface`)

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Padrão | Controle de horários | `color.primary` (quando ligado), `color.outline` (desligado) |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Ligado | Trilho `color.primary` | Ativo | - |
| Desligado | Trilho `color.surface-variant` | Inativo | - |

## Acessibilidade

- Anunciar o estado atual ("Ligado" ou "Desligado") para o leitor de tela.
- O trilho deve ter contraste suficiente com o fundo da tela.

## Faça e evite

- **Faça:** Use switches quando a mudança de estado tiver efeito imediato.
- **Evite:** Colocar rótulos ambíguos próximos ao switch.

## Código

```tsx
import { Switch as RNSwitch } from 'react-native';
import { tokens } from '../../theme/tokens';

export const Switch = ({ value, onValueChange }) => (
  <RNSwitch
    trackColor={{ false: tokens.color.outline, true: tokens.color.primaryContainer }}
    thumbColor={value ? tokens.color.primary : tokens.color.surface}
    ios_backgroundColor={tokens.color.outline}
    onValueChange={onValueChange}
    value={value}
  />
);
```
