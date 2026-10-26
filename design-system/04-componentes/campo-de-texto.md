# Campo de Texto (TextField)

Origem no sistema base: Material 3, Outlined text field. Situação: Adaptado. Motivo da adaptação: Simplificação para telas de formulário mobile.

## Quando usar

- Captura de dados do usuário (E-mail, Senha, Nome).
- Barras de busca.
- Campos de edição de perfil.

## Quando não usar

- Para seleções de opções fixas (use Select ou Chips).
- Para ações imediatas.

## Anatomia

1. Contêiner: (token `field.radius`)
2. Rótulo/Label: (token `font.body-small`)
3. Texto de entrada: (token `font.body-large`)
4. Ícone de suporte (opcional): (ex: Olho para senha)

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Padrão | Campos de formulário comuns | `color.outline`, `color.surface` |
| Com Ícone | Busca ou campos específicos | `color.on-surface-variant` |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | `color.outline` | Pronto para entrada | - |
| Foco | `color.primary` (borda 2dp) | Cursor ativo | Destaque visual |
| Erro | `color.error` | Mensagem de erro abaixo | Contraste de erro |
| Desabilitado | `color.surface-variant` | Entrada bloqueada | Baixo contraste |

## Acessibilidade

- Alvo de toque mínimo: 48 dp de altura.
- Contraste: Texto sobre fundo com razão > 4,5:1.
- Leitor de tela: Anuncia o rótulo e o texto inserido.

## Faça e evite

- **Faça:** Use placeholders que exemplifiquem o dado esperado (ex: "ex: Joao Silva").
- **Evite:** Esconder o rótulo quando o campo estiver preenchido.

## Código

```tsx
import { TextInput, View, Text } from 'react-native';
import { tokens } from '../../theme/tokens';

export const TextField = ({ label, error, ...props }) => (
  <View style={{ marginBottom: tokens.space.md }}>
    <Text style={{ ...tokens.font.labelMedium, color: tokens.color.onSurfaceVariant }}>
      {label}
    </Text>
    <TextInput 
      {...props}
      style={{
        borderWidth: 1,
        borderColor: error ? tokens.color.error : tokens.color.outline,
        borderRadius: tokens.radius.sm,
        padding: tokens.space.md,
        ...tokens.font.bodyLarge
      }}
    />
    {error && <Text style={{ color: tokens.color.error, fontSize: 12 }}>{error}</Text>}
  </View>
);
```
