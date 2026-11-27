// Meus agendamentos (padrão 7 de 05-padroes.md): abas Próximos e Histórico; nos próximos,
// Reagendar e Cancelar (com confirmação no próprio card). Quando o barbeiro sugere outro
// horário, o card mostra a sugestão com Aceitar e Recusar.

import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/view/components/button";
import { Card } from "@/view/components/card";
import { formatDayLabel, formatTime } from "@/view/components/format";
import { Icon } from "@/view/components/icon";
import { MainTabBar } from "@/view/components/mainTabBar";
import { SegmentedButton } from "@/view/components/segmentedButton";
import { ScreenState } from "@/view/components/screenState";
import { STATUS_LABEL, StatusBadge } from "@/view/components/statusBadge";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { useAgendamentosViewModel } from "@/viewmodel/useAgendamentosViewModel";
import { useTabBarViewModel } from "@/viewmodel/useTabBarViewModel";

const Agendamentos = () => {
  const [state, actions] = useAgendamentosViewModel();
  const tabs = useTabBarViewModel("agendas");
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const proximos = state.tab === "proximos";
  const lista = proximos ? state.appointments.upcoming : state.appointments.history;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <FlatList
        data={state.status === "content" ? lista : []}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md }}
        ListHeaderComponent={
          <View style={{ gap: spacing.md, paddingTop: spacing.xl }}>
            <Typography variant="headlineSmall" weight="700" accessibilityRole="header">
              Meus agendamentos
            </Typography>
            <SegmentedButton
              accessibilityLabel="Mostrar agendamentos"
              segments={[
                { value: "proximos", label: "Próximos" },
                { value: "historico", label: "Histórico" },
              ]}
              selected={state.tab}
              onSelect={actions.setTab}
            />
            {state.status !== "content" ? (
              <ScreenState
                status={state.status}
                loadingLabel="Carregando agendamentos"
                errorMessage={state.errorMessage}
                onRetry={actions.retry}
                emptyTitle=""
              />
            ) : lista.length === 0 ? (
              <View style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.xxxl }}>
                <Icon name="calendar" size={spacing.huge} color={colors.onSurfaceVariant} />
                <Typography variant="titleMedium" align="center">
                  {proximos ? "Nenhum agendamento marcado" : "Nada no histórico ainda"}
                </Typography>
                {proximos ? (
                  <Button variant="tonal" onPress={actions.findBarbershop}>
                    Encontrar uma barbearia
                  </Button>
                ) : null}
              </View>
            ) : state.errorMessage ? (
              <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
                {state.errorMessage}
              </Typography>
            ) : null}
          </View>
        }
        renderItem={({ item }) => {
          const confirmando = state.confirmingCancelId === item.id;
          return (
            <Card variant="outlined" style={{ gap: spacing.sm, padding: spacing.lg }}>
              <View
                accessible
                accessibilityLabel={`${item.barbershopName}, ${item.serviceName} com ${item.professionalName}, ${formatDayLabel(item.startsAt)} às ${formatTime(item.startsAt)}, ${STATUS_LABEL[item.status]}`}
                style={{ gap: spacing.sm }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                  <Typography variant="titleMedium" style={{ flex: 1 }}>
                    {item.barbershopName}
                  </Typography>
                  <StatusBadge status={item.status} />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <Icon name="calendar" size={spacing.lg + spacing.xs / 2} color={colors.onSurfaceVariant} />
                  <Typography variant="bodyMedium" color="onSurfaceVariant">
                    {formatDayLabel(item.startsAt)} · {formatTime(item.startsAt)}
                  </Typography>
                </View>
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  {item.serviceName} com {item.professionalName}
                </Typography>
                {item.status === "rejected" && item.rejectionReason ? (
                  <Typography variant="bodySmall" color="onSurfaceVariant">
                    Motivo: {item.rejectionReason}
                  </Typography>
                ) : null}
              </View>

              {proximos && item.status === "awaiting_client" && item.proposal ? (
                <View
                  accessibilityLiveRegion="polite"
                  style={{ gap: spacing.sm, padding: spacing.md, borderRadius: theme.shapes.medium, backgroundColor: colors.surfaceContainer }}
                >
                  <Typography variant="labelLarge">{item.professionalName} sugeriu outro horário</Typography>
                  <Typography variant="bodyMedium" weight="700">
                    {formatDayLabel(item.proposal.startsAt)} · {formatTime(item.proposal.startsAt)}
                  </Typography>
                  <View style={{ flexDirection: "row", gap: spacing.sm }}>
                    <Button
                      variant="outlined"
                      size="small"
                      style={{ flex: 1 }}
                      onPress={() => actions.rejectProposal(item)}
                      disabled={state.answeringId === item.id}
                      accessibilityLabel="Recusar o horário sugerido e cancelar o pedido"
                    >
                      Recusar
                    </Button>
                    <Button
                      variant="filled"
                      size="small"
                      style={{ flex: 1 }}
                      onPress={() => actions.acceptProposal(item)}
                      disabled={state.answeringId === item.id}
                      accessibilityLabel={`Aceitar ${formatDayLabel(item.proposal.startsAt)} às ${formatTime(item.proposal.startsAt)}`}
                    >
                      Aceitar
                    </Button>
                  </View>
                </View>
              ) : null}

              {proximos && !confirmando && item.status !== "awaiting_client" && item.status !== "in_progress" && (
                <View style={{ flexDirection: "row", gap: spacing.sm }}>
                  <Button variant="outlined" size="small" style={{ flex: 1 }} onPress={() => actions.reschedule(item)}>
                    Reagendar
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    style={{ flex: 1, borderColor: colors.error }}
                    onPress={() => actions.askCancel(item.id)}
                    accessibilityLabel={`Cancelar agendamento na ${item.barbershopName}`}
                  >
                    <Typography variant="labelLarge" color="error">
                      Cancelar
                    </Typography>
                  </Button>
                </View>
              )}

              {confirmando && (
                <View style={{ gap: spacing.sm }} accessibilityLiveRegion="polite">
                  <Typography variant="bodyMedium" weight="700">
                    Cancelar este agendamento?
                  </Typography>
                  <View style={{ flexDirection: "row", gap: spacing.sm }}>
                    <Button variant="text" size="small" style={{ flex: 1 }} onPress={actions.dismissCancel}>
                      Voltar
                    </Button>
                    <Button
                      variant="filled"
                      size="small"
                      style={{ flex: 1, backgroundColor: colors.error }}
                      onPress={actions.confirmCancel}
                      disabled={state.cancellingId === item.id}
                    >
                      <Typography variant="labelLarge" color="onError">
                        {state.cancellingId === item.id ? "Cancelando..." : "Sim, cancelar"}
                      </Typography>
                    </Button>
                  </View>
                </View>
              )}
            </Card>
          );
        }}
        ListFooterComponent={
          state.status === "content" && proximos && lista.length > 0 ? (
            <Card
              variant="filled"
              onPress={actions.findBarbershop}
              accessibilityLabel="Quer agendar outro? Encontre uma barbearia"
              style={{ backgroundColor: colors.surfaceContainer }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <Icon name="search" color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Typography variant="labelLarge">Quer agendar outro?</Typography>
                  <Typography variant="bodyMedium" color="onSurfaceVariant">
                    Encontre uma barbearia.
                  </Typography>
                </View>
                <Icon name="chevronRight" size={spacing.xl} color={colors.onSurfaceVariant} />
              </View>
            </Card>
          ) : undefined
        }
      />
      <MainTabBar active={tabs[0].active} tabs={tabs[0].tabs} onNavigate={tabs[1].navigate} />
    </SafeAreaView>
  );
};

export default Agendamentos;
