# Acessibilidade

<!-- A acessibilidade é embutida nos componentes. Contraste mínimo de 4,5:1 para texto comum (WCAG).
     Razão de contraste = (L1 + 0,05) / (L2 + 0,05), com L1 a luminância relativa da cor mais clara e L2 a da mais escura.
     Use uma calculadora de contraste e registre o resultado. -->

## Contraste dos pares de cor

| Par (texto sobre fundo) | Modo | Cores | Razão | Mínimo | Resultado |
| --- | --- | --- | --- | --- | --- |
| `color.on-action` sobre `color.action` | Claro | `#FFFFFF` sobre `#63452C` | 8,68:1 | 4,5:1 | Aprovado |
| `color.on-action` sobre `color.action` | Escuro | `#241A14` sobre `#CDAB8F` | 7,96:1 | 4,5:1 | Aprovado |
| `color.on-surface` sobre `color.surface` | Claro | `#241A14` sobre `#FFF8F3` | 16,20:1 | 4,5:1 | Aprovado |
| `color.on-surface` sobre `color.surface` | Escuro | `#F5EDE6` sobre `#1D1712` | 15,33:1 | 4,5:1 | Aprovado |
| `color.on-surface-variant` sobre `color.surface` | Claro | `#865E3C` sobre `#FFF8F3` | 5,43:1 | 4,5:1 | Aprovado |
| `color.on-surface-variant` sobre `color.surface` | Escuro | `#CDAB8F` sobre `#1D1712` | 8,30:1 | 4,5:1 | Aprovado |
| `color.error` sobre `color.surface` | Claro | `#BA1A1A` sobre `#FFF8F3` | 6,14:1 | 4,5:1 | Aprovado |
| `color.error` sobre `color.surface` | Escuro | `#FFB4AB` sobre `#1D1712` | 10,45:1 | 4,5:1 | Aprovado |

**Critério de cálculo:** a razão de contraste segue a fórmula WCAG `(L1 + 0,05) / (L2 + 0,05)`, considerando a luminância relativa das cores. Os cálculos utilizam os valores hexadecimais definidos em `02-tokens.md`.

**Consistência com os tokens:** no modo escuro, `color.on-action` utiliza `neutral-900` (`#241A14`) sobre `color.action` (`brown-1`, `#CDAB8F`). Essa combinação apresenta contraste de 7,96:1 e atende ao mínimo de 4,5:1. Não utilize `brown-5` sobre `brown-1` para textos comuns.

## Alvos de toque

- Utilize alvos de toque com tamanho mínimo de 48 dp em todos os elementos interativos.
- Aplique o requisito a botões, campos, ícones interativos, seletores de horário, itens de navegação e controles de formulário.
- Utilize `space-8` para separar elementos interativos próximos.
- Amplie a área clicável de ícones pequenos sem necessariamente aumentar o desenho do ícone.
- Não utilize apenas a aparência visual para indicar que um elemento é interativo.
- Verifique o tamanho dos alvos em todas as telas e componentes antes da entrega.

**Verificação por componente:**

| Componente | Requisito |
| --- | --- |
| Botões | Mínimo de 48 × 48 dp |
| Campos de texto | Mínimo de 48 dp de altura |
| Ícones interativos | Área clicável mínima de 48 × 48 dp |
| Navegação inferior | Área clicável mínima de 48 × 48 dp por item |
| Seletores de data e horário | Área clicável mínima de 48 × 48 dp |
| Cards interativos | Área de interação mínima de 48 × 48 dp |

## Foco

- Utilize `color.focus` para indicar visualmente o elemento que recebeu foco.
- Apresente um contorno de foco visível com espessura mínima de 2 dp.
- Mantenha contraste suficiente entre o indicador de foco e as cores adjacentes.
- Preserve uma ordem de foco lógica, seguindo a sequência visual e funcional da tela.
- Permita navegação por teclado externo, incluindo Tab, Shift + Tab e Enter quando aplicável.
- Não remova o indicador de foco padrão sem fornecer uma alternativa visível.
- Direcione o foco para mensagens de erro ou resultados importantes quando necessário.
- Diferencie visualmente os estados focado, selecionado e pressionado.

## Leitor de tela

- Utilize `accessibilityLabel` para identificar a finalidade de botões, campos e elementos interativos.
- Utilize `accessibilityRole` para informar corretamente o tipo de elemento.
- Utilize `accessibilityHint` quando uma ação precisar de explicação adicional.
- Utilize `accessibilityState` para comunicar estados como selecionado, desabilitado e marcado.
- Identifique botões compostos somente por ícones com rótulos descritivos.
- Associe mensagens de erro aos respectivos campos de formulário.
- Utilize `accessibilityLiveRegion` para anunciar mensagens importantes e atualizações de estado no Android.
- Oculte elementos puramente decorativos da árvore de acessibilidade.
- Não utilize somente cores ou ícones para transmitir informações.
- Mantenha a ordem de leitura compatível com a disposição visual dos elementos.

**Exemplos de identificação acessível:**

| Elemento | Rótulo anunciado |
| --- | --- |
| Botão de voltar | Voltar |
| Botão de agendamento | Confirmar agendamento |
| Campo de e-mail | Digite seu e-mail |
| Campo de senha | Digite sua senha |
| Horário selecionado | 14 horas, selecionado |
| Botão desabilitado | Confirmar agendamento, indisponível |
| Mensagem de erro | Não foi possível realizar o agendamento |

## Texto ampliado e movimento

### Texto ampliado

- Respeite a escala de fonte configurada pelo usuário no Android.
- Utilize a propriedade `allowFontScaling` nos componentes de texto do React Native.
- Evite alturas fixas em elementos que contenham texto.
- Permita que botões, cards e campos aumentem de altura conforme necessário.
- Utilize quebra automática de linha para textos extensos.
- Preserve a legibilidade e a hierarquia tipográfica durante a ampliação.
- Não corte informações importantes quando o usuário aumentar o tamanho da fonte.
- Teste as telas com diferentes níveis de ampliação de texto.

### Redução de movimento

- Respeite a configuração de redução de movimento do sistema quando disponível.
- Remova animações decorativas quando a redução de movimento estiver ativa.
- Preserve apenas transições essenciais para comunicar mudanças de estado.
- Substitua animações complexas por mudanças visuais simples.
- Nunca dependa exclusivamente de animações para transmitir informações.
- Mantenha os tempos de animação definidos pelos tokens de movimento quando a animação estiver habilitada.

## Verificação final

Antes de considerar uma tela acessível, verifique:

- [ ] Todos os textos comuns possuem contraste mínimo de 4,5:1.
- [ ] Todos os elementos interativos possuem alvos de pelo menos 48 dp.
- [ ] O foco é visível e segue uma ordem lógica.
- [ ] Botões e campos possuem identificação acessível.
- [ ] Estados de erro, seleção e desabilitação são anunciados.
- [ ] O texto pode ser ampliado sem perda de conteúdo.
- [ ] A interface respeita a redução de movimento.
- [ ] As cores funcionam nos modos claro e escuro.
- [ ] A navegação pode ser realizada com leitor de tela.
- [ ] As telas foram verificadas em diferentes tamanhos de dispositivos.

**Referências:** WCAG 2.2 nível AA, Material Design 3 e documentação de acessibilidade do React Native e Android.