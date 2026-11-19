// Minhas barbearias (padrão 5 de 05-padroes.md): busca, cards com foto, nome, endereço e
// selo Aberta/Fechada agora, e o botão + para criar uma nova.

import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/view/components/card";
import { FAB } from "@/view/components/fab";
import { Icon } from "@/view/components/icon";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { SearchBar } from "@/view/components/searchBar";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes, statusColors } from "@/view/theme";
import { useMinhasBarbeariasViewModel } from "@/viewmodel/useMinhasBarbeariasViewModel";

const MinhasBarbearias = () => {
  const [state, actions] = useMinhasBarbeariasViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Minhas Barbearias" onBack={actions.goBack} />
      <FlatList
        data={state.status === "content" ? state.barbershops : []}
        keyExtractor={(b) => b.barbershop.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.giant * 2 }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={{ gap: spacing.lg }}>
            <SearchBar
              value={state.search}
              onChangeText={actions.setSearch}
              placeholder="Buscar unidade..."
              accessibilityLabel="Buscar minhas barbearias"
            />
            <ScreenState
              status={state.status}
              loadingLabel="Carregando suas barbearias"
              errorMessage={state.errorMessage}
              onRetry={actions.retry}
              emptyTitle={state.search ? "Nenhuma unidade encontrada" : "Você ainda não tem barbearias"}
              emptyMessage={state.search ? undefined : "Toque no + para cadastrar a primeira."}
            />
          </View>
        }
        renderItem={({ item: { barbershop, openNow } }) => (
          <Card
            variant="outlined"
            onPress={() => actions.open(barbershop.id)}
            accessibilityLabel={`${barbershop.name}, ${openNow ? "aberta" : "fechada"} agora, ${barbershop.address}`}
            accessibilityHint="Abre a edição da barbearia"
            style={{ padding: spacing.none, overflow: "hidden" }}
          >
            <Thumbnail
              uri={barbershop.avatarUrl}
              label={`Foto da ${barbershop.name}`}
              width="100%"
              height={componentSizes.thumbnail.heroHeight * 0.7}
            />
            <View style={{ gap: spacing.xs, padding: spacing.md }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <Typography variant="titleSmall" weight="700" numberOfLines={1} style={{ flex: 1 }}>
                  {barbershop.name}
                </Typography>
                <View
                  style={{
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: theme.shapes.small,
                    backgroundColor: openNow ? statusColors.confirmed.container : colors.inverseSurface,
                  }}
                >
                  <Typography
                    variant="labelSmall"
                    weight="700"
                    style={{ color: openNow ? statusColors.confirmed.content : colors.inverseOnSurface }}
                  >
                    {openNow ? "Aberta" : "Fechada"}
                  </Typography>
                </View>
              </View>
              <Typography variant="bodySmall" color="onSurfaceVariant" numberOfLines={2}>
                {barbershop.address}
              </Typography>
            </View>
          </Card>
        )}
      />
      <FAB
        accessibilityLabel="Cadastrar nova barbearia"
        onPress={actions.create}
        icon={(cor) => <Icon name="plus" color={cor} />}
        style={{ position: "absolute", right: spacing.lg, bottom: spacing.xxl }}
      />
    </SafeAreaView>
  );
};

export default MinhasBarbearias;
