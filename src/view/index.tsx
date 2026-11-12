// Home: busca de barbearias, atalho para a lista de barbeiros e a lista de barbearias.

import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/view/components/card";
import { Icon } from "@/view/components/icon";
import { ScreenState } from "@/view/components/screenState";
import { SearchBar } from "@/view/components/searchBar";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import { useHomeViewModel } from "@/viewmodel/useHomeViewModel";

const Home = () => {
  const [state, actions] = useHomeViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;

  const cabecalho = (
    <View style={{ gap: spacing.lg, paddingBottom: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <Typography variant="headlineSmall" accessibilityRole="header">
          Encontre sua barbearia
        </Typography>
        <Typography variant="bodyMedium" color="onSurfaceVariant">
          Escolha onde cortar e com quem.
        </Typography>
      </View>

      <SearchBar
        value={state.search}
        onChangeText={actions.setSearch}
        placeholder="Buscar barbearia ou endereço..."
        accessibilityLabel="Buscar barbearias"
      />

      <Card
        variant="filled"
        onPress={actions.openBarbers}
        accessibilityLabel="Ver todos os barbeiros"
        style={{ backgroundColor: colors.primaryContainer }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.lg }}>
          <Icon name="person" size={spacing.xxxl} color={colors.onPrimaryContainer} />
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Typography variant="titleMedium" color="onPrimaryContainer">
              Barbeiros
            </Typography>
            <Typography variant="bodyMedium" color="onPrimaryContainer">
              Veja os profissionais e escolha o seu.
            </Typography>
          </View>
          <Icon name="chevronRight" color={colors.onPrimaryContainer} />
        </View>
      </Card>

      <Typography variant="titleMedium" accessibilityRole="header">
        Barbearias
      </Typography>

      <ScreenState
        status={state.status}
        loadingLabel="Carregando barbearias"
        errorMessage={state.errorMessage}
        onRetry={actions.retry}
        emptyTitle={state.search ? "Nenhuma barbearia encontrada" : "Nenhuma barbearia cadastrada"}
        emptyMessage={state.search ? "Tente outro nome ou endereço." : undefined}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <FlatList
        data={state.status === "content" ? state.barbershops : []}
        keyExtractor={(b) => b.id}
        ListHeaderComponent={cabecalho}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Card
            variant="outlined"
            onPress={() => actions.openBarbershop(item.id)}
            accessibilityLabel={`${item.name}, ${item.address}`}
            accessibilityHint="Abre os detalhes da barbearia"
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.lg }}>
              <Thumbnail
                uri={item.avatarUrl}
                label={`Foto da ${item.name}`}
                width={componentSizes.thumbnail.card}
                height={componentSizes.thumbnail.card}
              />
              <View style={{ flex: 1, gap: spacing.xs }}>
                <Typography variant="titleMedium" numberOfLines={1}>
                  {item.name}
                </Typography>
                <Typography variant="bodyMedium" color="onSurfaceVariant" numberOfLines={2}>
                  {item.address}
                </Typography>
              </View>
              <Icon name="chevronRight" color={colors.onSurfaceVariant} />
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
