# Segmented button (SegmentedButton)

Origem no sistema base: Material 3, [Segmented buttons](https://m3.material.io/components/segmented-buttons/overview) (variante outlined). Situação: Herdado. Valores dos tokens oficiais do Material Web (`md-comp-outlined-segmented-button`). Código em `src/view/components/segmentedButton/`.

## Quando usar

- Para escolher entre **2 a 5** opções relacionadas que mudam o que a tela mostra: Próximos | Histórico, Serviços | Profissionais, Recorrente | Pontual.
- **Seleção única:** uma opção sempre fica escolhida.
- **Seleção múltipla:** quando faz sentido marcar várias opções do mesmo grupo (até 5).

## Quando não usar

- Mais de 5 opções ou rótulos longos: use **chips** (ex.: dias da semana, categorias, serviços).
- Filtros que se somam a uma lista: use **filter chips** (categorias do Início).
- Navegação entre áreas do app: use a **Tab Bar**.
- Ações (salvar, enviar): use **Botão**.

## Anatomia

1. **Contêiner:** altura de 40 dp, pontas totalmente arredondadas (`radius.full`) e contorno de 1 dp em `color.outline`.
2. **Segmentos:** todos com a mesma largura, separados por um divisor de 1 dp em `color.outline`.
3. **Rótulo:** `labelLarge`, em uma linha.
4. **Ícone opcional:** 18 dp. No segmento selecionado, ele dá lugar ao ✓, que aparece à esquerda do rótulo.

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Não selecionado | fundo transparente, rótulo e ícone `color.on-surface` | toque seleciona | `radio` (única) ou `checkbox` (múltipla), `checked: false` |
| Selecionado | fundo `color.secondary-container`, rótulo e ✓ `color.on-secondary-container` | na seleção única, tocar de novo não desmarca | `checked: true` |
| Hover | não se aplica em toque | — | — |
| Pressionado | camada `on-surface` (ou `on-secondary-container`, se selecionado) a 12 % | — | — |
| Foco | anel do sistema | — | ordem da esquerda para a direita |
| Desabilitado | rótulo, ícone e contorno `on-surface` a 38 % e 12 % | sem toque | `disabled: true` |

## Acessibilidade

- O segmento tem 40 dp de altura e ganha `hitSlop` de 4 dp em cima e embaixo, chegando ao alvo de 48 dp.
- O grupo usa `accessibilityRole="radiogroup"` na seleção única.
- O ✓ reforça a seleção além da cor, como pede o Material.
- Contraste: `on-surface` (`brown-900`) sobre `cream-50` dá 13,7:1; `on-secondary-container` (`brown-950`) sobre `beige-300` dá 10,3:1.

## Onde é usado

| Tela | Segmentos |
| --- | --- |
| Agendamentos (cliente) | Próximos, Histórico |
| Detalhe da barbearia | Serviços, Profissionais |
| Folgas e bloqueios (barbeiro) | Recorrente, Pontual |

## Faça e evite

- **Faça:** rótulos curtos, de uma a duas palavras.
- **Evite:** misturar segmentos com ícone e sem ícone no mesmo grupo, ou passar de 5 segmentos.
