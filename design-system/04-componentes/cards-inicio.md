# Cards do Início (HomeHeader, NextAppointmentCard, CategoryChip, BarbershopCard, InspirationCard)

Origem no sistema base: Material 3, Card e Top app bar. Situação: Novo. Motivo: redesign da tela Início (24/11/26), com imagem de referência aprovada pelo time. Código em `src/view/components/home/`.

## Quando usar

- Somente na tela Início, que é a composição dos blocos: cabeçalho, próximo agendamento, categorias, barbearias em destaque e inspirações.

## Quando não usar

- Em listas completas, como Barbearias e Inspirações. Nelas, use `lista.md` e `PortfolioGrid`.

## Anatomia

1. **HomeHeader:** contêiner `color.action` com cantos inferiores `radius` 28. Ao fundo, arcos finos concêntricos (SVG próprio `assets/images/home/cabecalho-arcos.svg`) em `overlay.header-pattern`, à direita e ao centro, sem receber toque nem leitura. Título "Barber Agenda" (`headlineMedium` 700 em `color.on-action`), avatar com alvo de 48 dp e, embaixo, a barra de busca (`barra-busca.md`), que filtra as barbearias do Início por nome ou endereço, junto com os chips de categoria.
2. **NextAppointmentCard:** contêiner `color.container`, raio 16, `elevation.card`. Tem cabeçalho com ícone, título e status em pílula `color.success`, foto de 88 dp, nome, data · hora, serviço · profissional e a pílula "Ver detalhes" em `color.secondary-container`.
3. **CategoryChip:** linha única de chips no estilo das abas de filtro do WhatsApp: Tudo, Cabelo, Barba, Combo e Sobrancelha. Cápsula de 36 dp, raio total, largura do texto (esticando para preencher a linha), sem título de seção, rótulo `labelLarge` e sem ícone. Selecionado: fundo `color.action` e texto `color.surface`. Demais: fundo transparente, borda de 1 dp `outlineVariant` e texto `color.secondary`. Só um fica selecionado; "Tudo" remove o filtro. Rola na horizontal sem comprimir os chips.
4. **BarbershopCard:** contêiner `color.surface-container` com borda `outlineVariant` e raio 16. A foto cadastrada ocupa 36 % da largura, à esquerda. Sem foto, aparece um placeholder com o monograma da barbearia (por exemplo, "DC") e um ícone de loja sobre `color.secondary-container`. À direita: nome (até 2 linhas), endereço (até 2 linhas) · distância, nota (avaliações), selo "Aberto agora" e seta em círculo de 32 dp.
5. **InspirationCard:** 156 × 196 dp, raio 16. Foto com véu `overlay.scrim` na base, nome em branco e seta em círculo `color.secondary`.

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| NextAppointmentEmpty | Sem agendamento futuro | `color.container`, botão filled |
| CategoryChip selecionado | Filtro ativo | `color.action`, `color.surface` |
| OpenNowBadge aberto/fechado | Status pelos horários | `overlay.status-tint` + `color.success` / `surfaceContainerHighest` + `outline` |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | como na anatomia | o card inteiro é tocável | `accessibilityRole="button"` com rótulo completo |
| Hover | não se aplica em toque | — | — |
| Pressionado | ripple `color.action` a 12 % (Android); opacidade 88 % (iOS) | abre o destino | — |
| Foco | anel do sistema | — | ordem de leitura de cima para baixo |
| Desabilitado | não se aplica (não há card inativo) | — | — |

## Acessibilidade

- Alvo de toque: todos os botões têm pelo menos 48 dp, e os cards são maiores que isso.
- Contraste: `brown-900` sobre `beige-100` dá 12,0:1, branco sobre `green-600` dá 4,8:1 e branco sobre o véu fica acima de 4,5:1 em fotos claras.
- O texto do selo "Aberto agora" usa `color.on-surface`, e não verde, para passar de 4,5:1 (conflito registrado em `02-tokens.md`).
- Nota, avaliações e distância só aparecem quando a API tiver esses dados.

## Faça e evite

- **Faça:** liste as barbearias em coluna, uma abaixo da outra.
- **Evite:** carrossel de barbearias e botões apenas decorativos.
