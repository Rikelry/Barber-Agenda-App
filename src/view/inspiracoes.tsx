// Inspirações ("Ver todas" do Início) e Trabalhos da equipe ("Ver todos" do detalhe da
// barbearia): grade de fotos do portfólio. Cada foto abre os detalhes.

import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PortfolioGrid } from "@/view/components/portfolioGrid";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { useInspiracoesViewModel } from "@/viewmodel/useInspiracoesViewModel";

const Inspiracoes = () => {
  const [state, actions] = useInspiracoesViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={state.title} onBack={actions.goBack} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.md }}>
        {state.status !== "content" ? (
          <ScreenState
            status={state.status}
            loadingLabel="Carregando as inspirações"
            errorMessage={state.errorMessage}
            onRetry={actions.retry}
            emptyTitle="Nenhuma inspiração ainda"
            emptyMessage="Quando os profissionais destacarem cortes do portfólio, eles aparecem aqui."
          />
        ) : (
          <>
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              {state.title === "Inspirações"
                ? "Cortes e estilos feitos pelos profissionais das barbearias."
                : "Cortes e barbas feitos pelos profissionais desta barbearia."}
            </Typography>
            <PortfolioGrid
              photos={state.photos}
              onOpen={(id) => {
                const foto = state.photos.find((f) => f.id === id);
                if (foto) actions.open(foto);
              }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Inspiracoes;
