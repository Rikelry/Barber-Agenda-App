// Meus agendamentos (padrão 7 de 05-padroes.md): abas Próximos e Histórico; nos próximos,
// Reagendar e Cancelar (com confirmação no próprio card).

import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/view/components/button";
import { Card } from "@/view/components/card";
import { formatDayLabel, formatTime } from "@/view/components/format";
import { Icon } from "@/view/components/icon";
import { MainTabBar } from "@/view/components/mainTabBar";
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

  const aba = (valor: "proximos" | "historico", rotulo: string) => {
    const ativa = state.tab === valor;
    return (
      <Button
        variant={ativa ? "elevated" : "text"}
        size="small"
        onPress={() => actions.setTab(valor)}
        accessibilityRole="tab"
        accessibilityState={{ selected: ativa }}
        style={{ flex: 1 }}
      >
        {rotulo}
      </Button>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <FlatList
        data={state.status === "content" ? lista : []}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
        ListHeaderComponent={
          <View style={{ gap: spacing.lg, paddingBottom: spacing.xs }}>
            <Typography variant="headlineSmall" accessibilityRole="header">
              Meus Agendamentos
            </Typography>
            <View
              accessibilityRole="tablist"
              style={{
                flexDirection: "row",
                gap: spacing.xs,
                padding: spacing.xs,
                borderRadius: theme.shapes.medium,
                backgroundColor: colors.surfaceContainerHigh,
              }}
            >
              {aba("proximos", "Próximos")}
              {aba("historico", "Histórico")}
            </View>
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
            <Card variant="outlined" style={{ gap: spacing.sm }}>
              <View
                accessible
                accessibilityLabel={`${item.barbershopName}, ${item.serviceName} com ${item.professionalName}, ${formatDayLabel(item.startsAt)} às ${formatTime(item.startsAt)}, ${STATUS_LABEL[item.status]}`}
                style={{ gap: spacing.xs }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <Typography variant="titleSmall" weight="700" style={{ flex: 1 }}>
                    {item.barbershopName}
                  </Typography>
                  <StatusBadge status={item.status} />
                </View>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  Serviço: {item.serviceName}
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  Profissional: {item.professionalName}
                </Typography>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <Icon name="calendar" size={spacing.lg} color={colors.primary} />
                  <Typography variant="labelLarge" color="primary">
                    {formatDayLabel(item.startsAt)} às {formatTime(item.startsAt)}
                  </Typography>
                </View>
              </View>

              {proximos && !confirmando && (
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
      />
      <MainTabBar active={tabs[0].active} onNavigate={tabs[1].navigate} />
    </SafeAreaView>
  );
};

export default Agendamentos;
