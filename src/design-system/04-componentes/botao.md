# Botão (Button)

Origem no sistema base: Material 3, Filled and Outlined button. Situação: Adaptado. Motivo da adaptação: Ajuste de cores para a marca Barber Agenda e foco em mobile-first.

## Quando usar

- Para ações principais e secundárias na interface.
- Para submissão de formulários (Login, Cadastro).
- Para confirmação de agendamentos.

## Quando não usar

- Para navegação simples entre páginas (use Links).
- Quando a ação for secundária demais (considere um botão de texto ou ícone).

## Anatomia

1. Contêiner: (token `button.radius`)
2. Rótulo: (token `font.label-large`)
3. Ícone opcional: (alinhado à esquerda ou direita do rótulo)

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Primário | Ação principal da tela (ex: Confirmar) | `button.bg`, `button.label` |
| Secundário | Ações de apoio (ex: Cancelar, Voltar) | `color.outline`, `color.primary` (texto) |
| Ícone | Ações compactas (ex: Voltar no header) | `color.on-surface` |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | `button.bg` | Interativo | Contraste 4,5:1 |
| Hover | Não se aplica em toque | - | - |
| Pressionado | `button.bg-pressed` | Feedback visual imediato | - |
| Foco | `color.focus` | Borda de destaque | Indicador visual |
| Desabilitado | `button.bg-disabled` | Não interativo | Opacidade reduzida |

## Acessibilidade

- Alvo de toque mínimo: 48 dp (Material).
- Contraste: `color.on-primary` sobre `color.primary` com razão mínima de 4,5:1.
- Leitor de tela: Rótulo descritivo e papel de "button".

## Faça e evite

- **Faça:** Use verbos de ação claros no rótulo (ex: "Confirmar", "Entrar").
- **Evite:** Usar mais de um botão primário na mesma seção visual.

## Código

```tsx
import { TouchableOpacity, Text } from 'react-native';
import { tokens } from '../../theme/tokens';

export const Button = ({ label, onPress, disabled, variant = 'primary' }) => (
  <TouchableOpacity 
    onPress={onPress} 
    disabled={disabled}
    style={{
      backgroundColor: variant === 'primary' ? tokens.button.bg : 'transparent',
      borderRadius: tokens.radius.md,
      padding: tokens.space.md,
      alignItems: 'center',
      opacity: disabled ? 0.5 : 1
    }}
  >
    <Text style={{ color: tokens.button.label, ...tokens.font.labelLarge }}>
      {label}
    </Text>
  </TouchableOpacity>
);
```
