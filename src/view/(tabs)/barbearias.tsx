// Barbearias (aba Buscar, padrão 9 de 05-padroes.md): busca por nome ou endereço e a lista
// de barbearias com foto, nome e endereço.

import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/view/components/card";
import { MainTabBar } from "@/view/components/mainTabBar";
import { ScreenState } from "@/view/components/screenState";
import { SearchBar } from "@/view/components/searchBar";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import { useBarbeariasViewModel } from "@/viewmodel/useBarbeariasViewModel";
import { useTabBarViewModel } from "@/viewmodel/useTabBarViewModel";

const Barbearias = () => {
  const [state, actions] = useBarbeariasViewModel();
  const tabs = useTabBarViewModel("buscar");
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <FlatList
        data={state.status === "content" ? state.barbershops : []}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={{ gap: spacing.lg }}>
            <Typography variant="headlineSmall" accessibilityRole="header">
              Barbearias
            </Typography>
            <SearchBar
              value={state.search}
              onChangeText={actions.setSearch}
              placeholder="Buscar por nome, endereço..."
              accessibilityLabel="Buscar barbearias"
            />
            <ScreenState
              status={state.status}
              loadingLabel="Carregando barbearias"
              errorMessage={state.errorMessage}
              onRetry={actions.retry}
              emptyTitle={state.search ? "Nenhuma barbearia encontrada" : "Nenhuma barbearia cadastrada"}
              emptyMessage={state.search ? "Tente outro nome ou endereço." : undefined}
            />
          </View>
        }
        renderItem={({ item }) => (
          <Card
            variant="filled"
            onPress={() => actions.openBarbershop(item.id)}
            accessibilityLabel={`${item.name}, ${item.address}`}
            accessibilityHint="Abre os detalhes da barbearia"
            style={{ padding: spacing.none, overflow: "hidden" }}
          >
            <Thumbnail
              uri={item.avatarUrl}
              label={`Foto da ${item.name}`}
              width="100%"
              height={componentSizes.thumbnail.heroHeight * 0.75}
            />
            <View style={{ gap: spacing.xs, padding: spacing.md }}>
              <Typography variant="titleMedium" weight="700" numberOfLines={1}>
                {item.name}
              </Typography>
              <Typography variant="bodySmall" color="onSurfaceVariant" numberOfLines={2}>
                {item.address}
              </Typography>
            </View>
          </Card>
        )}
      />
      <MainTabBar active={tabs[0].active} onNavigate={tabs[1].navigate} />
    </SafeAreaView>
  );
};

export default Barbearias;
