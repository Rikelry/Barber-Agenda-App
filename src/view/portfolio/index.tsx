// Meu portfólio (canvas de telas): grade com as fotos do profissional, "Adicionar" no começo
// e uma dica de como fotografar.

import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Icon } from "@/view/components/icon";
import { PortfolioGrid } from "@/view/components/portfolioGrid";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { useMeuPortfolioViewModel } from "@/viewmodel/useMeuPortfolioViewModel";

const MeuPortfolio = () => {
  const [state, actions] = useMeuPortfolioViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const total = state.photos.length;
  const destaques = state.photos.filter((f) => f.featured).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Meu portfólio" onBack={actions.goBack} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.md }}>
        {state.status !== "content" ? (
          <ScreenState
            status={state.status}
            loadingLabel="Carregando seu portfólio"
            errorMessage={state.errorMessage}
            onRetry={actions.retry}
            emptyTitle=""
          />
        ) : (
          <>
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              {total === 0
                ? "Mostre seus cortes: os clientes veem as fotos no seu perfil."
                : `${total} ${total === 1 ? "foto" : "fotos"} · ${destaques} nas Inspirações do Início.`}
            </Typography>
            <PortfolioGrid
              photos={state.photos}
              onAdd={actions.add}
              onOpen={(id) => {
                const foto = state.photos.find((f) => f.id === id);
                if (foto) actions.open(foto);
              }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
                padding: spacing.md,
                borderRadius: theme.shapes.large,
                backgroundColor: colors.surfaceDim,
              }}
            >
              <Icon name="camera" size={spacing.xl} color={colors.primary} />
              <Typography variant="bodyMedium" color="primary" style={{ flex: 1 }}>
                Dica: fotos com luz natural, de frente e de lado, mostram melhor o acabamento.
              </Typography>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MeuPortfolio;
