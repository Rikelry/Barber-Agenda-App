// Minha agenda (padrão 6 de 05-padroes.md): semana no topo e a linha do tempo do dia com os
// agendamentos por status e as faixas livres. A API não manda o nome do cliente: o card mostra
// o serviço e o horário.

import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatTime } from "@/view/components/format";
import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { StatusBadge } from "@/view/components/statusBadge";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import { useMinhaAgendaViewModel } from "@/viewmodel/useMinhaAgendaViewModel";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const MinhaAgenda = () => {
  const [state, actions] = useMinhaAgendaViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const hoje = state.week.find((d) => d.selected)?.today ?? false;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title="Minha Agenda"
        onBack={actions.goBack}
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
              minHeight: componentSizes.touchTarget,
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
        <Typography variant="titleSmall" weight="700" accessibilityRole="header">
          {hoje ? "Horários de Hoje" : "Horários do dia"}
        </Typography>
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
                <View
                  accessible
                  accessibilityLabel={`${item.serviceName}, das ${formatTime(item.startsAt)} às ${formatTime(item.endsAt)}`}
                  style={{
                    flex: 1,
                    gap: spacing.xs,
                    padding: spacing.md,
                    borderRadius: theme.shapes.small,
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
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MinhaAgenda;
