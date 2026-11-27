# Diálogo (Dialog)

Origem no sistema base: Material 3, Basic dialog. Situação: Herdado. Código em `src/view/components/dialog/`.

## Quando usar

- Confirmações que interrompem a tarefa e pedem uma decisão, com ou sem um campo (ex.: recusar pedido com motivo).

## Quando não usar

- Para avisos de sucesso: use o Snackbar.

## Anatomia

1. Scrim `overlay.scrim` a `overlay.scrimOpacity`.
2. Contêiner `surfaceContainerHigh`, raio `shapes.extraLarge` e padding 24.
3. Título `headlineSmall`, texto de apoio `bodyMedium` em `onSurfaceVariant`, conteúdo opcional.
4. Ações em botões de texto, alinhadas à direita. A destrutiva tem texto `color.error`.

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | Como na anatomia | Abre com fade | `accessibilityViewIsModal` |
| Hover | Não se aplica em toque | — | — |
| Pressionado | Estado do Button | — | — |
| Foco | Anel de foco do Button | — | O título é `header` |
| Desabilitado | Ações desabilitadas durante o envio | — | `accessibilityState.disabled` |

## Acessibilidade

- Tocar fora ou Voltar fecha. Dentro do diálogo, o campo de texto usa `labelBackgroundColor` igual ao contêiner.
