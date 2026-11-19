// Minha agenda (padrão 6 de 05-padroes.md): semana no topo e a linha do tempo do dia com os
// agendamentos por status e as faixas livres; tocar num confirmado mostra Concluir e Cancelar. A API não manda o nome do cliente: o card mostra
// o serviço e o horário.

import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/view/components/button";
import { formatTime } from "@/view/components/format";
import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { MainTabBar } from "@/view/components/mainTabBar";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { StatusBadge } from "@/view/components/statusBadge";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import { useMinhaAgendaViewModel } from "@/viewmodel/useMinhaAgendaViewModel";
import { useTabBarViewModel } from "@/viewmodel/useTabBarViewModel";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const MinhaAgenda = () => {
  const [state, actions] = useMinhaAgendaViewModel();
  const tabs = useTabBarViewModel("agenda");
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const hoje = state.week.find((d) => d.selected)?.today ?? false;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <ScreenHeader
        title="Minha agenda"
        right={
          <IconButton
            accessibilityLabel="Indisponibilidades"
            onPress={actions.openBlocks}
            icon={(cor) => <Icon name="lock" color={cor} />}
          />
        }
      />

      <View style={{ flexDirection: "row", gap: spacing.xs, paddingHorizontal: spacing.lg, paddingBottom: spacing.md }}>
        {state.week.map((d) => (
          <Pressable
            key={d.iso}
            onPress={() => actions.selectDate(d.iso)}
            accessibilityRole="button"
            accessibilityLabel={`${DIAS[d.date.getDay()]} ${d.date.getDate()}${d.today ? ", hoje" : ""}`}
            accessibilityState={{ selected: d.selected }}
            style={{
              flex: 1,
              minHeight: componentSizes.dayButton.height,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: spacing.xs,
              borderRadius: theme.shapes.small,
              borderWidth: 1,
              borderColor: d.selected ? colors.primary : colors.outlineVariant,
              backgroundColor: d.selected ? colors.primary : colors.surface,
            }}
          >
            <Typography variant="labelSmall" style={{ color: d.selected ? colors.onPrimary : colors.onSurfaceVariant }}>
              {DIAS[d.date.getDay()]}
            </Typography>
            <Typography variant="titleSmall" weight="700" style={{ color: d.selected ? colors.onPrimary : colors.onSurface }}>
              {d.date.getDate()}
            </Typography>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Typography variant="titleLarge" weight="500" accessibilityRole="header" style={{ flex: 1 }}>
            {hoje ? "Hoje" : "Horários do dia"}
          </Typography>
          <Button variant="text" size="xs" onPress={actions.openWorkplace}>
            Horário da barbearia
          </Button>
        </View>
        {state.actionMessage ? (
          <Typography variant="bodyMedium" color="primary" accessibilityLiveRegion="polite">
            {state.actionMessage}
          </Typography>
        ) : null}
        {state.status !== "content" ? (
          <ScreenState
            status={state.status}
            loadingLabel="Carregando agenda"
            errorMessage={state.errorMessage}
            onRetry={actions.retry}
            emptyTitle=""
          />
        ) : state.items.length === 0 ? (
          <Typography variant="bodyMedium" color="onSurfaceVariant">
            {state.closed ? "A barbearia não abre neste dia." : "Nenhum horário neste dia."}
          </Typography>
        ) : (
          state.items.map((item) => (
            <View key={`${item.kind}-${item.startsAt.getTime()}`} style={{ flexDirection: "row", gap: spacing.md }}>
              <Typography variant="labelLarge" weight="700" style={{ width: spacing.huge + spacing.md, paddingTop: spacing.sm }}>
                {formatTime(item.startsAt)}
              </Typography>
              {item.kind === "free" ? (
                <View
                  accessible
                  accessibilityLabel={`Disponível das ${formatTime(item.startsAt)} às ${formatTime(item.endsAt)}`}
                  style={{
                    flex: 1,
                    padding: spacing.md,
                    borderRadius: theme.shapes.small,
                    borderWidth: 1,
                    borderStyle: "dashed",
                    borderColor: colors.outline,
                  }}
                >
                  <Typography variant="bodySmall" color="onSurfaceVariant">
                    Disponível para agendamento • até {formatTime(item.endsAt)}
                  </Typography>
                </View>
              ) : (
                <View style={{ flex: 1, gap: spacing.sm }}>
                  <Pressable
                    onPress={() => actions.select(item.id)}
                    disabled={item.status !== "confirmed"}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.serviceName}, das ${formatTime(item.startsAt)} às ${formatTime(item.endsAt)}`}
                    accessibilityHint={item.status === "confirmed" ? "Mostra as ações Concluir e Cancelar" : undefined}
                    accessibilityState={{ expanded: state.selectedId === item.id }}
                    style={{
                      gap: spacing.xs,
                      padding: spacing.md,
                      borderRadius: theme.shapes.small,
                      borderWidth: state.selectedId === item.id ? 2 : 0,
                      borderColor: colors.primary,
                      backgroundColor: item.status === "completed" ? colors.secondaryContainer : colors.primaryContainer,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                      <Typography
                        variant="titleSmall"
                        weight="700"
                        color={item.status === "completed" ? "onSecondaryContainer" : "onPrimaryContainer"}
                        style={{ flex: 1 }}
                      >
                        {item.serviceName}
                      </Typography>
                      <StatusBadge status={item.status} />
                    </View>
                    <Typography
                      variant="bodySmall"
                      color={item.status === "completed" ? "onSecondaryContainer" : "onPrimaryContainer"}
                    >
                      {formatTime(item.startsAt)} - {formatTime(item.endsAt)}
                    </Typography>
                  </Pressable>
                  {state.selectedId === item.id ? (
                    state.confirmingCancel ? (
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
                            disabled={state.acting}
                          >
                            <Typography variant="labelLarge" color="onError">
                              {state.acting ? "Cancelando..." : "Sim, cancelar"}
                            </Typography>
                          </Button>
                        </View>
                      </View>
                    ) : (
                      <View style={{ flexDirection: "row", gap: spacing.sm }}>
                        <Button variant="filled" size="small" style={{ flex: 1 }} onPress={actions.complete} disabled={state.acting}>
                          {state.acting ? "Salvando..." : "Concluir"}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          style={{ flex: 1, borderColor: colors.error }}
                          onPress={actions.askCancel}
                        >
                          <Typography variant="labelLarge" color="error">
                            Cancelar
                          </Typography>
                        </Button>
                      </View>
                    )
                  ) : null}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
      <MainTabBar active={tabs[0].active} tabs={tabs[0].tabs} onNavigate={tabs[1].navigate} />
    </SafeAreaView>
  );
};

export default MinhaAgenda;
