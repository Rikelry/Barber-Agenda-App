// Trabalho do barbeiro (rota agenda): "Agenda e solicitações" com o seletor compacto da
// barbearia (quem atende em mais de uma troca por ele), o calendário da semana, o resumo do dia,
// as solicitações e a linha do tempo. Folgas e bloqueios ficam no ícone do topo.

import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { WorkAgenda, WorkplaceSelector } from "@/view/components/agenda";
import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { MainTabBar } from "@/view/components/mainTabBar";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { Snackbar } from "@/view/components/snackbar";
import { useDesignSystem } from "@/view/components/themeProvider";
import { useMinhaAgendaViewModel } from "@/viewmodel/useMinhaAgendaViewModel";
import { useTabBarViewModel } from "@/viewmodel/useTabBarViewModel";

const MinhaAgenda = () => {
  const [state, actions] = useMinhaAgendaViewModel();
  const tabs = useTabBarViewModel("agenda");
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <ScreenHeader
        title="Agenda e solicitações"
        right={
          <IconButton
            accessibilityLabel="Folgas e bloqueios"
            onPress={actions.openBlocks}
            icon={(cor) => <Icon name="blocked" color={cor} />}
          />
        }
      />
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            paddingTop: spacing.none,
            gap: spacing.lg,
            paddingBottom: spacing.huge,
          }}
        >
          {state.workplacesStatus !== "content" ? (
            <ScreenState
              status={state.workplacesStatus}
              loadingLabel="Carregando suas barbearias"
              errorMessage={state.workplacesError}
              onRetry={actions.retryWorkplaces}
              emptyTitle=""
            />
          ) : (
            <View style={{ gap: spacing.lg }}>
              <WorkplaceSelector
                options={state.workplaces.map((w) => ({
                  id: w.barbershopId,
                  name: w.name,
                }))}
                selectedId={state.selectedBarbershopId}
                onSelect={actions.selectBarbershop}
              />
              <WorkAgenda state={state.agenda} actions={actions} />
            </View>
          )}
        </ScrollView>
        <Snackbar message={state.agenda.actionMessage} onDismiss={actions.dismissMessage} />
      </View>
      <MainTabBar active={tabs[0].active} tabs={tabs[0].tabs} onNavigate={tabs[1].navigate} />
    </SafeAreaView>
  );
};

export default MinhaAgenda;
