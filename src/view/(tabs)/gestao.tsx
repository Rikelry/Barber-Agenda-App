// Trabalho do dono (rota gestao): agenda e solicitações da barbearia, com os pedidos de todos os
// profissionais (inclusive do dono que atende) e os horários do dia. Com mais de uma barbearia,
// o seletor compacto abaixo do título troca entre elas.

import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { WorkAgenda, WorkplaceSelector } from "@/view/components/agenda";
import { Button } from "@/view/components/button";
import { Icon } from "@/view/components/icon";
import { MainTabBar } from "@/view/components/mainTabBar";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { Snackbar } from "@/view/components/snackbar";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { useGestaoViewModel } from "@/viewmodel/useGestaoViewModel";
import { useTabBarViewModel } from "@/viewmodel/useTabBarViewModel";

const Gestao = () => {
  const [state, actions] = useGestaoViewModel();
  const tabs = useTabBarViewModel("gestao");
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <ScreenHeader title="Agenda e solicitações" />
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            paddingTop: spacing.none,
            gap: spacing.lg,
            paddingBottom: spacing.huge,
          }}
        >
          {state.barbershopsStatus === "empty" ? (
            <View
              style={{
                alignItems: "center",
                gap: spacing.md,
                paddingVertical: spacing.xxxl,
              }}
            >
              <Icon name="store" size={spacing.huge} color={colors.onSurfaceVariant} />
              <Typography variant="titleMedium" align="center">
                Você ainda não tem barbearia
              </Typography>
              <Typography variant="bodyMedium" color="onSurfaceVariant" align="center">
                Cadastre a sua para receber pedidos de horário.
              </Typography>
              <Button variant="filled" size="medium" onPress={actions.createBarbershop}>
                Cadastrar minha barbearia
              </Button>
            </View>
          ) : state.barbershopsStatus !== "content" ? (
            <ScreenState
              status={state.barbershopsStatus}
              loadingLabel="Carregando sua barbearia"
              errorMessage={state.barbershopsError}
              onRetry={actions.retryBarbershops}
              emptyTitle=""
            />
          ) : (
            <View style={{ gap: spacing.lg }}>
              <WorkplaceSelector
                options={state.barbershops.map((b) => ({
                  id: b.id,
                  name: b.name,
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

export default Gestao;
