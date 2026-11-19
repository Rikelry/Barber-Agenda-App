// Agendar (canvas de telas): passo 1 escolhe o profissional, o dia e o horário; passo 2 revisa
// o resumo e confirma; no fim, a tela de horário reservado. Também reagenda quando aberto com
// appointmentId (aí o profissional fica fixo).

import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar } from "@/view/components/avatar";
import { Button } from "@/view/components/button";
import { formatDuration, formatPrice } from "@/view/components/format";
import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { StepProgress } from "@/view/components/stepProgress";

import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes, statusColors } from "@/view/theme";
import { useNovoAgendamentoViewModel } from "@/viewmodel/useNovoAgendamentoViewModel";

const DIAS_CURTOS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MESES_LONGOS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

/** "Terça, 18 nov" */
const diaCurto = (d: Date) => {
  const nome = DIAS[d.getDay()] ?? "";
  return `${nome.charAt(0).toUpperCase()}${nome.slice(1)}, ${d.getDate()} ${MESES[d.getMonth()]}`;
};

const NovoAgendamento = () => {
  const [state, actions] = useNovoAgendamentoViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const pronto = state.status === "content" && state.barbershop && state.service;
  const profissional = state.professionals.find((p) => p.id === state.professionalId) ?? null;
  const diaEscolhido = state.week.find((d) => d.selected)?.date ?? new Date(`${state.date}T12:00:00`);

  const passos = (atual: 1 | 2) => <StepProgress current={atual} total={2} />;

  if (pronto && state.step === "sucesso") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, padding: spacing.lg, paddingTop: spacing.giant, gap: spacing.md }}>
          <View accessibilityRole="summary" accessibilityLiveRegion="polite" style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.lg }}>
            <View
              style={{
                width: componentSizes.avatar.large,
                height: componentSizes.avatar.large,
                borderRadius: theme.shapes.full,
                backgroundColor: statusColors.confirmed.container,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="checkmark" size={spacing.massive} color={statusColors.confirmed.content} />
            </View>
            <Typography variant="titleLarge" weight="500" align="center" accessibilityRole="header">
              {state.rescheduling ? "Horário remarcado" : "Horário reservado"}
            </Typography>
            <Typography variant="bodyLarge" color="onSurfaceVariant" align="center">
              {diaCurto(diaEscolhido)}, às {state.time}
              {profissional ? ` com ${profissional.name.split(" ")[0]}` : ""}
              {"\n"}
              {state.barbershop?.name}
            </Typography>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
                padding: spacing.md,
                borderRadius: theme.shapes.large,
                backgroundColor: colors.surfaceContainer,
              }}
            >
              <Icon name="calendar" size={spacing.xl} color={colors.primary} />
              <Typography variant="labelLarge">
                {state.service?.name} · {formatPrice(state.service?.price ?? 0)}
              </Typography>
            </View>
          </View>
          <Button variant="filled" size="medium" fullWidth onPress={actions.openAppointments}>
            Ver meus agendamentos
          </Button>
          <Button variant="outlined" size="medium" fullWidth onPress={actions.goHome}>
            Voltar ao início
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (pronto && state.step === "revisao") {
    const linhas: [string, string][] = [
      ["Barbearia", state.barbershop?.name ?? ""],
      ["Serviço", state.service?.name ?? ""],
      ["Profissional", profissional?.name ?? ""],
      ["Data", diaCurto(diaEscolhido)],
      ["Horário", `${state.time ?? ""} às ${state.endTime ?? ""}`],
      ["Endereço", state.barbershop?.address ?? ""],
    ];
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title="Revisar" onBack={actions.editChoice} />
        {passos(2)}
        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}>
          <View
            accessible
            accessibilityLabel={`Resumo: ${state.service?.name} com ${profissional?.name}, ${DIAS[diaEscolhido.getDay()]} ${diaEscolhido.getDate()} de ${MESES_LONGOS[diaEscolhido.getMonth()]} às ${state.time}, ${formatDuration(state.service?.durationMinutes ?? 0)}, ${formatPrice(state.service?.price ?? 0)}`}
          >
            {linhas.map(([rotulo, valor]) => (
              <View
                key={rotulo}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: spacing.md,
                  paddingVertical: spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.outlineVariant,
                }}
              >
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  {rotulo}
                </Typography>
                <Typography variant="labelLarge" align="right" style={{ flexShrink: 1 }}>
                  {valor}
                </Typography>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Typography variant="titleMedium" style={{ flex: 1 }}>
              Total
            </Typography>
            <Typography variant="titleLarge" weight="500" color="primary">
              {formatPrice(state.service?.price ?? 0)}
            </Typography>
          </View>
          <Typography variant="bodyMedium" color="onSurfaceVariant">
            Confira os dados antes de confirmar.
          </Typography>
        </ScrollView>
        <View style={{ padding: spacing.lg, gap: spacing.sm }}>
          {state.errorMessage ? (
            <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
              {state.errorMessage}
            </Typography>
          ) : null}
          <Button variant="filled" size="medium" fullWidth onPress={actions.confirm} disabled={state.saving}>
            {state.saving ? "Confirmando..." : state.rescheduling ? "Confirmar novo horário" : "Confirmar agendamento"}
          </Button>
          <Button variant="text" size="medium" fullWidth onPress={actions.editChoice}>
            Alterar profissional ou horário
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={state.rescheduling ? "Reagendar" : "Agendar"} onBack={actions.goBack} />

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
          {passos(1)}
          <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md }}>
            {/* Resumo do serviço */}
            <View
              accessible
              accessibilityLabel={`${state.barbershop?.name}, ${state.service?.name}, ${formatDuration(state.service?.durationMinutes ?? 0)}, ${formatPrice(state.service?.price ?? 0)}`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                padding: spacing.md,
                borderRadius: theme.shapes.large,
                backgroundColor: colors.surfaceContainer,
              }}
            >
              <Thumbnail
                uri={state.barbershop?.avatarUrl}
                label={`Foto da ${state.barbershop?.name}`}
                width={componentSizes.thumbnail.summary}
                height={componentSizes.thumbnail.summary}
              />
              <View style={{ flex: 1 }}>
                <Typography variant="labelLarge" weight="700">
                  {state.barbershop?.name}
                </Typography>
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  {state.service?.name} · {formatDuration(state.service?.durationMinutes ?? 0)} · {formatPrice(state.service?.price ?? 0)}
                </Typography>
              </View>
            </View>

            {/* Com quem? */}
            {!state.rescheduling && (
              <View style={{ gap: spacing.sm }}>
                <Typography variant="titleLarge" weight="500" accessibilityRole="header">
                  Com quem?
                </Typography>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
                  {state.professionals.map((p) => {
                    const ativo = p.id === state.professionalId;
                    return (
                      <Pressable
                        key={p.id}
                        onPress={() => actions.selectProfessional(p.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`${p.name}, ${p.specialty ?? "Barbeiro"}`}
                        accessibilityState={{ selected: ativo }}
                        style={{
                          width: componentSizes.professionalCard.width,
                          alignItems: "center",
                          gap: spacing.xs,
                          paddingVertical: spacing.md,
                          paddingHorizontal: spacing.xs,
                          borderRadius: theme.shapes.large,
                          borderWidth: ativo ? 2 : 1,
                          borderColor: ativo ? colors.primary : colors.outlineVariant,
                          backgroundColor: ativo ? colors.surfaceContainer : colors.surface,
                        }}
                      >
                        <Avatar name={p.name} uri={p.avatarUrl} />
                        <Typography variant="labelLarge" weight="700" numberOfLines={1}>
                          {p.name.split(" ")[0]}
                        </Typography>
                        <Typography variant="bodySmall" color="onSurfaceVariant" align="center" numberOfLines={2}>
                          {p.specialty ?? "Barbeiro"}
                        </Typography>
                      </Pressable>
                    );
                  })}
                </ScrollView>
                {state.fieldErrors.professionalId ? (
                  <Typography variant="bodySmall" color="error" accessibilityLiveRegion="polite">
                    {state.fieldErrors.professionalId}
                  </Typography>
                ) : null}
              </View>
            )}

            {/* Quando? */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Typography variant="titleLarge" weight="500" accessibilityRole="header" style={{ flex: 1 }}>
                Quando?
              </Typography>
              <IconButton
                accessibilityLabel="Semana anterior"
                onPress={actions.previousWeek}
                disabled={!state.canGoToPreviousWeek}
                icon={(cor) => <Icon name="chevronLeft" color={cor} />}
              />
              <IconButton accessibilityLabel="Próxima semana" onPress={actions.nextWeek} icon={(cor) => <Icon name="chevronRight" color={cor} />} />
            </View>
            <View style={{ flexDirection: "row", gap: spacing.xs }}>
              {state.week.map((d) => (
                <Pressable
                  key={d.iso}
                  onPress={() => actions.selectDate(d.iso)}
                  disabled={d.disabled}
                  accessibilityRole="button"
                  accessibilityLabel={`${DIAS[d.date.getDay()]}, ${d.date.getDate()} de ${MESES_LONGOS[d.date.getMonth()]}${d.today ? ", hoje" : ""}`}
                  accessibilityState={{ selected: d.selected, disabled: d.disabled }}
                  style={{
                    flex: 1,
                    minHeight: componentSizes.dayButton.height,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: theme.shapes.small,
                    borderWidth: d.selected ? 0 : 1,
                    borderColor: colors.outlineVariant,
                    backgroundColor: d.selected ? colors.primary : colors.surface,
                    opacity: d.disabled ? theme.state.disabledContent : 1,
                  }}
                >
                  <Typography variant="bodySmall" style={{ color: d.selected ? colors.onPrimary : colors.onSurface }}>
                    {DIAS_CURTOS[d.date.getDay()]}
                  </Typography>
                  <Typography variant="titleMedium" weight="700" style={{ color: d.selected ? colors.onPrimary : colors.onSurface }}>
                    {d.date.getDate()}
                  </Typography>
                </Pressable>
              ))}
            </View>
            {state.fieldErrors.date ? (
              <Typography variant="bodySmall" color="error">
                {state.fieldErrors.date}
              </Typography>
            ) : null}

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
              <View style={{ alignItems: "center", gap: spacing.sm, padding: spacing.lg, borderRadius: theme.shapes.large, backgroundColor: colors.surfaceContainer }}>
                <Icon name="blocked" size={spacing.xxxl} color={colors.onSurfaceVariant} />
                <Typography variant="titleSmall" weight="700" align="center">
                  Nenhum horário livre nesse dia
                </Typography>
                <Typography variant="bodyMedium" color="onSurfaceVariant" align="center">
                  Escolha outro dia ou outro profissional.
                </Typography>
              </View>
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
              <>
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  Horários livres{profissional ? ` de ${profissional.name.split(" ")[0]}` : ""} na {DIAS[diaEscolhido.getDay()]}, {diaEscolhido.getDate()} {MESES[diaEscolhido.getMonth()]}
                </Typography>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
                  {state.slots.map((hora) => {
                    const ativo = hora === state.time;
                    return (
                      <Pressable
                        key={hora}
                        onPress={() => actions.selectTime(hora)}
                        accessibilityRole="button"
                        accessibilityLabel={`${hora}, ${ativo ? "selecionado" : "disponível"}`}
                        accessibilityState={{ selected: ativo }}
                        style={{
                          width: "23%",
                          minHeight: componentSizes.touchTarget,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: theme.shapes.small,
                          borderWidth: ativo ? 0 : 1,
                          borderColor: colors.outlineVariant,
                          backgroundColor: ativo ? colors.primary : "transparent",
                        }}
                      >
                        <Typography variant="labelLarge" style={{ color: ativo ? colors.onPrimary : colors.onSurface }}>
                          {hora}
                        </Typography>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}
            {state.fieldErrors.time ? (
              <Typography variant="bodySmall" color="error" accessibilityLiveRegion="polite">
                {state.fieldErrors.time}
              </Typography>
            ) : null}
          </ScrollView>

          <View style={{ padding: spacing.lg, gap: spacing.sm }}>
            {state.errorMessage ? (
              <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
                {state.errorMessage}
              </Typography>
            ) : null}
            <Button variant="filled" size="medium" fullWidth onPress={actions.review}>
              Revisar agendamento
            </Button>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default NovoAgendamento;
