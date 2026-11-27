# Snackbar (Snackbar)

Origem no sistema base: Material 3, Snackbar. Situação: Herdado. Código em `src/view/components/snackbar/`.

## Quando usar

- Para o resultado de uma ação ("Pedido de João aprovado.", "Atendimento finalizado.", "Sugestão enviada para João.").

## Quando não usar

- Para erros que pedem correção num campo: mostre o erro no próprio campo ou sheet.

## Anatomia

1. Contêiner `inverseSurface`, raio `shapes.extraSmall`, elevação nível 3 e altura mínima de 48 dp, sobre o conteúdo e logo acima da barra de abas. Não empurra o conteúdo.
2. Texto `bodyMedium` em `inverseOnSurface`.
3. Botão Fechar (IconButton).

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | Como na anatomia | Some sozinho em 4 s | `accessibilityRole="alert"` e live region |
| Hover | Não se aplica em toque | — | — |
| Pressionado | Estado do IconButton | Fecha | — |
| Foco | Anel do IconButton | — | "Fechar aviso" |
| Desabilitado | Não se aplica | — | — |

## Acessibilidade

- Contraste: `inverseOnSurface` sobre `inverseSurface` (`#FFF8F1` sobre `#39200F`), cerca de 14:1.
