# Acessibilidade

<!-- A acessibilidade é embutida nos componentes. Contraste mínimo de 4,5:1 para texto comum (WCAG).
     Razão de contraste = (L1 + 0,05) / (L2 + 0,05), com L1 a luminância relativa da cor mais clara e L2 a da mais escura.
     Use uma calculadora de contraste e registre o resultado. -->

## Contraste dos pares de cor

| Par (texto sobre fundo) | Modo | Cores | Razão | Mínimo | Resultado |
| --- | --- | --- | --- | --- | --- |
| `color.on-action` sobre `color.action` | Claro | TODO sobre TODO | TODO:1 | 4,5:1 | TODO: aprovado ou reprovado |
| `color.on-action` sobre `color.action` | Escuro | TODO sobre TODO | TODO:1 | 4,5:1 | TODO |
| `color.on-surface` sobre `color.surface` | Claro | TODO | TODO:1 | 4,5:1 | TODO |
| `color.on-surface` sobre `color.surface` | Escuro | TODO | TODO:1 | 4,5:1 | TODO |

## Alvos de toque

- Mínimo de 48 dp (Material) ou 44 pt (HIG) em todo elemento tocável. TODO: confirme para cada componente.

## Foco

- TODO: aparência do foco visível (token `color.focus`) e a ordem de foco nas telas.

## Leitor de tela

- TODO: regras de rótulo para botões só com ícone, campos de texto, mensagens de erro e estados (selecionado, desabilitado).

## Texto ampliado e movimento

- TODO: o que acontece quando o usuário aumenta o tamanho da fonte do sistema.
- TODO: o que acontece com a opção "reduzir movimento".
