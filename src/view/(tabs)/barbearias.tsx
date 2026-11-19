// Buscar (canvas de telas): busca por nome ou endereço e a lista de barbearias em linhas
// com foto, nome, endereço e seta.

import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/view/components/card";
import { Icon } from "@/view/components/icon";
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
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={{ gap: spacing.md, paddingTop: spacing.xl }}>
            <Typography variant="headlineSmall" weight="700" accessibilityRole="header">
              Buscar
            </Typography>
            <SearchBar
              value={state.search}
              onChangeText={actions.setSearch}
              placeholder="Nome ou endereço"
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
            variant="outlined"
            onPress={() => actions.openBarbershop(item.id)}
            accessibilityLabel={`${item.name}, ${item.address}`}
            accessibilityHint="Abre os detalhes da barbearia"
            style={{ padding: spacing.md }}
          >
            {/* Canvas de telas: foto pequena à esquerda, nome e endereço, seta à direita. */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <Thumbnail
                uri={item.avatarUrl}
                label={`Foto da ${item.name}`}
                width={componentSizes.thumbnail.list}
                height={componentSizes.thumbnail.list}
              />
              <View style={{ flex: 1, gap: spacing.xs / 2 }}>
                <Typography variant="titleMedium" numberOfLines={1}>
                  {item.name}
                </Typography>
                <Typography variant="bodyMedium" color="onSurfaceVariant" numberOfLines={2}>
                  {item.address}
                </Typography>
              </View>
              <Icon name="chevronRight" size={spacing.xl} color={colors.onSurfaceVariant} />
            </View>
          </Card>
        )}
      />
      <MainTabBar active={tabs[0].active} tabs={tabs[0].tabs} onNavigate={tabs[1].navigate} />
    </SafeAreaView>
  );
};

export default Barbearias;
