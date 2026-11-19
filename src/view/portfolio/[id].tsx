// Foto do portfólio (canvas de telas): a foto grande, legenda, serviço e quem fez, com
// "Quero este corte" para o cliente; no próprio portfólio, Excluir com confirmação.

import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/view/components/button";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import { useFotoPortfolioViewModel } from "@/viewmodel/useFotoPortfolioViewModel";

const FotoPortfolio = () => {
  const [state, actions] = useFotoPortfolioViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const foto = state.photo;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Foto" onBack={actions.goBack} />
      {!foto ? (
        <View style={{ padding: spacing.lg }}>
          <ScreenState status={state.status === "content" ? "error" : state.status} loadingLabel="Carregando foto" errorMessage={state.errorMessage} onRetry={actions.retry} emptyTitle="" />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.md }}>
            <Thumbnail
              uri={foto.imageUrl}
              label={foto.caption ?? "Foto do portfólio"}
              width="100%"
              height={componentSizes.portfolio.previewHeight * 1.5}
              radius={theme.shapes.large}
            />
            <Typography variant="titleLarge" weight="500" accessibilityRole="header">
              {foto.caption ?? "Corte"}
            </Typography>
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              {[foto.serviceName, foto.professionalName ? `por ${foto.professionalName}` : null].filter(Boolean).join(" · ")}
            </Typography>
            {state.errorMessage ? (
              <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
                {state.errorMessage}
              </Typography>
            ) : null}
          </ScrollView>
          <View style={{ padding: spacing.lg, gap: spacing.sm }}>
            {!state.mine ? (
              <Button variant="filled" size="medium" fullWidth onPress={actions.wantThisCut}>
                Quero este corte
              </Button>
            ) : state.confirmingRemove ? (
              <View style={{ gap: spacing.sm }} accessibilityLiveRegion="polite">
                <Typography variant="bodyMedium" weight="700">
                  Excluir esta foto do portfólio?
                </Typography>
                <View style={{ flexDirection: "row", gap: spacing.sm }}>
                  <Button variant="text" size="small" style={{ flex: 1 }} onPress={actions.dismissRemove}>
                    Voltar
                  </Button>
                  <Button
                    variant="filled"
                    size="small"
                    style={{ flex: 1, backgroundColor: colors.error }}
                    onPress={actions.confirmRemove}
                    disabled={state.removing}
                  >
                    <Typography variant="labelLarge" color="onError">
                      {state.removing ? "Excluindo..." : "Sim, excluir"}
                    </Typography>
                  </Button>
                </View>
              </View>
            ) : (
              <Button variant="outlined" size="medium" fullWidth onPress={actions.askRemove} style={{ borderColor: colors.error }}>
                <Typography variant="labelLarge" color="error">
                  Excluir foto
                </Typography>
              </Button>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default FotoPortfolio;
