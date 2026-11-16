// Novo agendamento (padrão 2 de 05-padroes.md): resumo com preço e duração, escolha do
// profissional, data no calendário da semana, horários disponíveis e Confirmar. Também
// reagenda quando aberto com appointmentId.

import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar } from "@/view/components/avatar";
import { Button } from "@/view/components/button";
import { Chip } from "@/view/components/chip";
import { formatDuration, formatPrice } from "@/view/components/format";
import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { ScreenState } from "@/view/components/screenState";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { WeekCalendar } from "@/view/components/weekCalendar";
import { useNovoAgendamentoViewModel } from "@/viewmodel/useNovoAgendamentoViewModel";

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const INICIAIS = ["D", "S", "T", "Q", "Q", "S", "S"];
const DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

const NovoAgendamento = () => {
  const [state, actions] = useNovoAgendamentoViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const pronto = state.status === "content" && state.barbershop && state.service;
  const profissional = state.professionals.find((p) => p.id === state.professionalId) ?? null;
  const meio = state.week[3]?.date ?? new Date();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.sm }}>
        <IconButton accessibilityLabel="Voltar" onPress={actions.goBack} icon={(cor) => <Icon name="back" color={cor} />} />
        <Typography variant="titleLarge" accessibilityRole="header" style={{ flex: 1 }}>
          {state.rescheduling ? "Reagendar" : "Novo Agendamento"}
        </Typography>
      </View>

      {!pronto ? (
        <View style={{ padding: spacing.lg }}>
          <ScreenState
            status={state.status === "content" ? "error" : state.status}
            loadingLabel="Carregando agendamento"
            errorMessage={state.errorMessage}
            onRetry={actions.retry}
            emptyTitle=""
          />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl }}>
            <View
              accessible
              accessibilityLabel={`Resumo: ${state.barbershop?.name}, ${state.service?.name}, ${formatPrice(state.service?.price ?? 0)}, ${formatDuration(state.service?.durationMinutes ?? 0)}`}
              style={{
                gap: spacing.xs,
                padding: spacing.lg,
                borderRadius: theme.shapes.medium,
                backgroundColor: colors.secondaryContainer,
              }}
            >
              <Typography variant="labelSmall" weight="700" color="onSecondaryContainer">
                RESUMO DO AGENDAMENTO
              </Typography>
              <Typography variant="titleMedium" weight="700" color="onSecondaryContainer">
                {state.barbershop?.name}
              </Typography>
              <Typography variant="bodySmall" color="onSecondaryContainer">
                Serviço: {state.service?.name}
              </Typography>
              <Typography variant="bodySmall" color="onSecondaryContainer">
                Profissional: {profissional?.name ?? "escolha abaixo"}
              </Typography>
              <Typography variant="labelLarge" weight="700" color="primary">
                Preço: {formatPrice(state.service?.price ?? 0)} • {formatDuration(state.service?.durationMinutes ?? 0)}
              </Typography>
            </View>

            {state.professionals.length > 1 && !state.rescheduling && (
              <View style={{ gap: spacing.md }}>
                <Typography variant="titleSmall" weight="700" accessibilityRole="header">
                  Escolha o profissional
                </Typography>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
                  {state.professionals.map((p) => (
                    <Chip
                      key={p.id}
                      variant="filter"
                      label={p.name}
                      selected={p.id === state.professionalId}
                      leadingIcon={<Avatar name={p.name} uri={p.avatarUrl} size="small" />}
                      onPress={() => actions.selectProfessional(p.id)}
                    />
                  ))}
                </View>
                {state.fieldErrors.professionalId ? (
                  <Typography variant="bodySmall" color="error">
                    {state.fieldErrors.professionalId}
                  </Typography>
                ) : null}
              </View>
            )}

            <View style={{ gap: spacing.md }}>
              <Typography variant="titleSmall" weight="700" accessibilityRole="header">
                Selecione a data
              </Typography>
              <WeekCalendar
                monthLabel={`${MESES[meio.getMonth()]} ${meio.getFullYear()}`}
                canGoBack={state.canGoToPreviousWeek}
                onPrevious={actions.previousWeek}
                onNext={actions.nextWeek}
                onSelect={actions.selectDate}
                days={state.week.map((d) => ({
                  iso: d.iso,
                  weekday: INICIAIS[d.date.getDay()] ?? "",
                  fullLabel: `${DIAS[d.date.getDay()]}, ${d.date.getDate()} de ${MESES[d.date.getMonth()]?.toLowerCase()} de ${d.date.getFullYear()}`,
                  day: d.date.getDate(),
                  selected: d.selected,
                  today: d.today,
                  disabled: d.disabled,
                }))}
              />
              {state.fieldErrors.date ? (
                <Typography variant="bodySmall" color="error">
                  {state.fieldErrors.date}
                </Typography>
              ) : null}
            </View>

            <View style={{ gap: spacing.md }}>
              <Typography variant="titleSmall" weight="700" accessibilityRole="header">
                Horários disponíveis
              </Typography>
              {state.slotsStatus === "idle" && (
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  Escolha o profissional para ver os horários.
                </Typography>
              )}
              {state.slotsStatus === "loading" && (
                <Typography variant="bodyMedium" color="onSurfaceVariant" accessibilityLiveRegion="polite">
                  Carregando horários...
                </Typography>
              )}
              {state.slotsStatus === "empty" && (
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  Não há horários livres nesse dia. Escolha outra data.
                </Typography>
              )}
              {state.slotsStatus === "error" && (
                <View style={{ alignItems: "flex-start", gap: spacing.sm }}>
                  <Typography variant="bodyMedium" color="error">
                    Não foi possível carregar os horários.
                  </Typography>
                  <Button variant="tonal" size="xs" onPress={actions.retrySlots}>
                    Tentar de novo
                  </Button>
                </View>
              )}
              {state.slotsStatus === "content" && (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
                  {state.slots.map((hora) => (
                    <Chip
                      key={hora}
                      variant="filter"
                      label={hora}
                      selected={hora === state.time}
                      onPress={() => actions.selectTime(hora)}
                      accessibilityLabel={`Horário ${hora}`}
                    />
                  ))}
                </View>
              )}
              {state.fieldErrors.time ? (
                <Typography variant="bodySmall" color="error">
                  {state.fieldErrors.time}
                </Typography>
              ) : null}
            </View>
          </ScrollView>

          <View style={{ padding: spacing.lg, gap: spacing.sm }}>
            {state.errorMessage ? (
              <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
                {state.errorMessage}
              </Typography>
            ) : null}
            <Button variant="filled" size="medium" fullWidth onPress={actions.confirm} disabled={state.saving}>
              {state.saving ? "Confirmando..." : state.rescheduling ? "Confirmar novo horário" : "Confirmar Agendamento"}
            </Button>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default NovoAgendamento;
