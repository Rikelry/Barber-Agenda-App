# Agenda — aba Trabalho (WorkAgenda, WorkplaceSelector, DayStrip, AgendaRequestCard, AgendaTimeline, AppointmentSheet, ProposeSheet, RejectDialog)

Origem no sistema base: Material 3 — Menu, Cards, Buttons, Bottom sheets, Dialogs, Snackbar. Situação: Novo. Motivo: agenda e solicitações por barbeiro e por barbearia (redesenho de 27/11/26). Código em `src/view/components/agenda/`. Usada na aba Trabalho do barbeiro (rota `agenda`) e do dono (rota `gestao`).

## Quando usar

- Na aba Trabalho, para o barbeiro ver e administrar os próprios horários, ou o dono, os da barbearia.

## Quando não usar

- Na lista de agendamentos do cliente (Agendas), que usa cards próprios.

## Anatomia

A tela tem três seções, nessa ordem, sob o título "Agenda e solicitações":

1. **WorkplaceSelector:** botão compacto de 40 dp com borda `outlineVariant`, ícone de loja, nome da barbearia e seta. Abre um menu M3 logo abaixo (`surfaceContainer`, nível 2), com a escolhida marcada em `secondaryContainer`. Com uma barbearia só, mostra o nome sem toque.
2. **DayStrip (calendário semanal):** mês e ano, setas de semana e os 7 dias em botões de 56 dp.
   - Selecionado: `color.action`.
   - Hoje: borda `color.action`.
   - Dia com horários: ponto de 4 dp (`componentSizes.agenda.dayMark`).
3. **Solicitações** (do dia escolhido), com contador em `color.action`. Cada **AgendaRequestCard** fica em `surfaceContainer`, com raio 12:
   - **Linha 1:** iniciais, nome em `titleSmall` e chip de status.
   - **Linha 2:** serviço · horário (e o profissional, só na agenda da barbearia).
   - **Pendente:** "Sugerir outro horário" (texto, secundária) e Recusar (outlined, texto `error`) e Aprovar (filled) lado a lado, todos no tamanho `xs`.
   - **Aguardando cliente:** só "Horário sugerido: hoje às 19:30. Aguardando resposta do cliente."
   - **Sem pedidos no dia:** uma linha discreta. Com pedidos em outros dias, o botão "+N solicitações em outros dias" leva ao mais próximo.
4. **Agenda do dia (AgendaTimeline):**
   - Hora de início numa coluna de 48 dp, trilho de 2 dp em `outlineVariant` e ponto na cor do status.
   - Card compacto com cliente, serviço e o chip de status. O profissional aparece só na agenda da barbearia.
   - Faixas livres (só na agenda do profissional) com borda tracejada `outline`.
5. **AppointmentSheet:** bottom sheet de detalhes. Mostra cliente, telefone, serviço e duração, profissional (na barbearia), dia e faixa, horário sugerido e motivo da recusa. As ações dependem do estado (abaixo).
6. **ProposeSheet:** bottom sheet de sugerir outro horário. Tem o resumo do pedido, um DayStrip (sem dias passados), os horários realmente livres do profissional e "Enviar sugestão".
7. **RejectDialog:** diálogo de recusa com o campo "Motivo (opcional)" (até 200 caracteres), Voltar e Recusar.
8. **Snackbar** (fora deste módulo): aviso temporário do resultado de cada ação, acima da barra de abas.

## Estados do agendamento

| Status | Chip | Ocupa o horário | Ações no sheet |
| --- | --- | --- | --- |
| Pendente (`pending`) | `color.pending` + `amber-900` | Sim | Aprovar, Sugerir outro horário, Recusar |
| Aguardando cliente (`awaiting_client`) | `color.pending` + `amber-900` | Sim (o horário pedido e o sugerido) | Cancelar pedido |
| Confirmado (`confirmed`) | `color.success` + branco | Sim | Iniciar atendimento (a partir de 15 min antes); Não compareceu (depois do horário); Cancelar horário |
| Em andamento (`in_progress`) | `color.action` + `on-action` | Sim | Finalizar atendimento |
| Concluído (`completed`) | `secondaryContainer` | Sim | Só detalhes |
| Não compareceu (`no_show`) | `surfaceContainerHighest` + `onSurfaceVariant` | Não | Só detalhes |
| Recusado / Cancelado | `errorContainer` + `onErrorContainer` | Não | Só detalhes |

Todo chip tem texto, então o estado não depende só da cor.

## Estados dos componentes

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | Como na anatomia | Tocar num card abre os detalhes | Card = botão com rótulo completo |
| Hover | Não se aplica em toque | — | — |
| Pressionado | Card da linha do tempo em `surfaceContainerHighest`; botões com o estado do Button | — | — |
| Foco | Anel de foco do Button e do IconButton | — | Ordem: seletor, semana, solicitações, agenda |
| Desabilitado | Botões com `state.disabledContent` durante a ação | Evita toque duplo | `accessibilityState.disabled` |

A tela tem ainda os estados de carregamento, de erro (com Tentar de novo), de dia vazio e de barbearia fechada.

## Regras

- Cada barbeiro vê só os próprios horários e pedidos na barbearia escolhida. O backend filtra por usuário e vínculo (`GET /agendamentos/minha-agenda?barbershopId=`) e confere a permissão em toda ação. O dono vê a barbearia inteira.
- Recusar e cancelar pedem confirmação. Sugerir outro horário leva o pedido a "Aguardando cliente", e o cliente aceita (vira Confirmado no novo horário) ou recusa (vira Cancelado) na aba Agendas.

## Acessibilidade

- Alvo de toque mínimo: 48 dp. Os botões `xs` (32 dp) ganham `hitSlop` automático.
- Contraste do chip Pendente: `amber-900` sobre `amber-200` 9,1:1. O de Confirmado: branco sobre `green-600` 4,8:1.
- Os dias anunciam "hoje" e "com horários". O Snackbar usa `accessibilityRole="alert"` e live region.

## Faça e evite

- **Faça:** deixar as ações dentro do bottom sheet, conforme o estado.
- **Evite:** repetir data e profissional em cada card da agenda individual.
- **Evite:** cards de indicadores fixos ocupando a primeira dobra.

## Código

```tsx
<WorkplaceSelector options={opcoes} selectedId={state.selectedBarbershopId} onSelect={actions.selectBarbershop} />
<WorkAgenda state={state.agenda} actions={actions} />
<Snackbar message={state.agenda.actionMessage} onDismiss={actions.dismissMessage} />
```
