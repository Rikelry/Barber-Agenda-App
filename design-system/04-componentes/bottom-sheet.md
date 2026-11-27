# Bottom sheet (BottomSheet)

Origem no sistema base: Material 3, Modal bottom sheet. Situação: Herdado. Código em `src/view/components/bottomSheet/`.

## Quando usar

- Detalhes e ações de um item sem sair da tela (detalhes do horário, sugerir outro horário).

## Quando não usar

- Para uma confirmação curta: use o Dialog.
- Para fluxos longos com vários passos: use uma tela.

## Anatomia

1. Scrim `overlay.scrim` a `overlay.scrimOpacity`; tocar fecha.
2. Contêiner `surfaceContainerLow`, cantos superiores `shapes.extraLargeTop` e altura máxima de 85 % da tela (`componentSizes.agenda.sheetMaxRatio`).
3. Alça de 32 × 4 dp em `onSurfaceVariant` a 38 %. Arrastar a alça ou o título para baixo mais de 96 dp fecha o sheet.
4. Título `titleLarge` e botão Fechar (IconButton).
5. Conteúdo rolável e rodapé fixo opcional com as ações.

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | Como na anatomia | Sobe com `animationType="slide"` | `accessibilityViewIsModal` |
| Hover | Não se aplica em toque | — | — |
| Pressionado | Arrastando: o sheet acompanha o dedo | Soltar antes do limite volta com mola | — |
| Foco | Anel de foco do botão Fechar | — | Fechar sempre disponível para leitor de tela |
| Desabilitado | Não se aplica | — | — |

## Acessibilidade

- O botão Fechar tem 48 dp. Voltar (Android) fecha o sheet.
- O fechamento por gesto tem alternativa pelo botão Fechar e pelo scrim.
