# Acessibilidade

<!-- A acessibilidade é embutida nos componentes. Contraste mínimo de 4,5:1 para texto comum (WCAG).
     Razão de contraste = (L1 + 0,05) / (L2 + 0,05), com L1 a luminância relativa da cor mais clara e L2 a da mais escura.
     Use uma calculadora de contraste e registre o resultado. -->

## Contraste dos pares de cor

Os pares de cores devem ser verificados nos temas claro e escuro do Barber Agenda. Os valores finais dependem da definição da paleta semântica em `02-tokens.md`.

| Par (texto sobre fundo) | Modo | Cores | Razão | Mínimo | Resultado |
| --- | --- | --- | --- | --- | --- |
| `color.on-action` sobre `color.action` | Claro | Pendente de definição da paleta | Pendente | 4,5:1 | Pendente de validação |
| `color.on-action` sobre `color.action` | Escuro | Pendente de definição da paleta | Pendente | 4,5:1 | Pendente de validação |
| `color.on-surface` sobre `color.surface` | Claro | Pendente de definição da paleta | Pendente | 4,5:1 | Pendente de validação |
| `color.on-surface` sobre `color.surface` | Escuro | Pendente de definição da paleta | Pendente | 4,5:1 | Pendente de validação |

Não definir valores de contraste antes de escolher as cores finais. Após definir a paleta, calcular e registrar as razões de contraste. Não usar somente a cor para indicar estados, como horários disponíveis, indisponíveis ou selecionados.

## Alvos de toque

- Mínimo de 48 dp (Material) ou 44 pt (HIG) em todo elemento tocável. Priorizar alvos de pelo menos 48 dp nos componentes do aplicativo.
- Confirmar os alvos de toque de botões, campos de texto, chips, abas, controles do calendário e horários disponíveis para agendamento.
- Quando um ícone for visualmente pequeno, manter uma área de toque adequada ao redor dele.

## Foco

- Usar o token `color.focus` para indicar o foco visível, após sua definição em `02-tokens.md`.
- Manter uma ordem de foco lógica, acompanhando a sequência de interação da tela.
- Garantir que o foco seja perceptível e não dependa exclusivamente da cor.

## Leitor de tela

- Botões que exibem somente ícones devem possuir rótulos acessíveis que descrevam sua ação.
- Campos de texto devem ter rótulos claros, instruções quando necessárias e mensagens de erro associadas ao campo correspondente.
- Informar semanticamente os estados selecionado, desabilitado e indisponível.
- No calendário de agendamento, comunicar a data selecionada e a disponibilidade dos horários por texto acessível.
- Nas confirmações de agendamento, identificar o serviço, o profissional, a data e o horário.
- Testar a navegação com VoiceOver no iOS e TalkBack no Android.

## Texto ampliado e movimento

- Respeitar o tamanho de fonte configurado pelo usuário no sistema, considerando Dynamic Type no iOS e a escala de fonte no Android.
- Permitir que textos maiores sejam exibidos sem cortes, sobreposições ou perda de informações importantes.
- Evitar alturas fixas em componentes que contenham texto variável ou ampliado.
- Respeitar a opção do sistema para reduzir movimento, quando disponível na plataforma e na implementação.
- Manter as informações e funcionalidades disponíveis mesmo quando animações forem reduzidas ou desativadas.
