# Calendário (Date Picker)

Origem no sistema base: Material 3, Date picker. Situação: Herdado. Motivo da adaptação: Seleção de datas para agendamentos e visualização de agenda.

## Quando usar

- Para selecionar uma data específica para um novo agendamento.
- Para navegar pelos dias na agenda do profissional.

## Quando não usar

- Para entrada de datas de nascimento (considere campo de texto com máscara).
- Para intervalos de tempo muito curtos (use Chips de horários).

## Anatomia

1. Cabeçalho de Mês/Ano: (token `font.title-medium`)
2. Grade de Dias: (token `font.body-medium`)
3. Indicador de Dia Selecionado: (token `radius.full`, `color.primary`)

## Variantes

| Variante | Uso | Comportamento |
| --- | --- | --- |
| Inline | Exibido diretamente na tela de agendamento | Seleção única de dia |
| Modal | Abre ao clicar em um campo de data | Seleção e confirmação |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Disponível | Texto `color.on-surface` | Selecionável | - |
| Selecionado | Fundo `color.primary` + Texto `color.on-primary` | Indica escolha ativa | - |
| Indisponível | Texto cinza claro | Não clicável | - |

## Acessibilidade

- Permitir navegação por teclado/controle (se aplicável).
- Anunciar claramente o dia, mês e ano selecionados.

## Faça e evite

- **Faça:** Destaque visualmente o dia atual ("Hoje").
- **Evite:** Permitir a seleção de datas no passado para agendamentos futuros.

## Código

```tsx
// Exemplo conceitual usando biblioteca de calendário comum no React Native
import { View, Text } from 'react-native';
import { tokens } from '../../theme/tokens';
import { Calendar } from 'react-native-calendars'; // Biblioteca comum

export const CustomCalendar = ({ onDayPress, markedDates }) => (
  <Calendar
    theme={{
      backgroundColor: tokens.color.surface,
      calendarBackground: tokens.color.surface,
      selectedDayBackgroundColor: tokens.color.primary,
      selectedDayTextColor: tokens.color.onPrimary,
      todayTextColor: tokens.color.primary,
      dayTextColor: tokens.color.onSurface,
      textDisabledColor: tokens.color.outlineVariant,
      monthTextColor: tokens.color.onSurface,
      textDayFontFamily: 'Roboto',
      textMonthFontFamily: 'Roboto',
      textDayHeaderFontFamily: 'Roboto',
      textDayFontSize: 16,
      textMonthFontSize: 18,
      textDayHeaderFontSize: 14
    }}
    onDayPress={onDayPress}
    markedDates={markedDates}
  />
);
```
