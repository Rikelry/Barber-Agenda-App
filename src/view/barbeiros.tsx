// Lista de barbeiros de todas as barbearias, com busca por nome, especialidade ou barbearia.

import { FlatList, View } from "react-native";

import { Avatar } from "@/view/components/avatar";
import { Card } from "@/view/components/card";
import { Icon } from "@/view/components/icon";
import { ScreenState } from "@/view/components/screenState";
import { SearchBar } from "@/view/components/searchBar";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { useBarbeirosViewModel } from "@/viewmodel/useBarbeirosViewModel";

const Barbeiros = () => {
  const [state, actions] = useBarbeirosViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.background }}
      data={state.status === "content" ? state.barbers : []}
      keyExtractor={(b) => `${b.barbershop.id}-${b.professional.id}`}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={{ gap: spacing.lg, paddingBottom: spacing.lg }}>
          <SearchBar
            value={state.search}
            onChangeText={actions.setSearch}
            placeholder="Nome, especialidade ou barbearia..."
            accessibilityLabel="Buscar barbeiros"
          />
          <ScreenState
            status={state.status}
            loadingLabel="Carregando barbeiros"
            errorMessage={state.errorMessage}
            onRetry={actions.retry}
            emptyTitle={state.search ? "Nenhum barbeiro encontrado" : "Nenhum barbeiro cadastrado"}
            emptyMessage={state.search ? "Tente outro nome ou especialidade." : undefined}
          />
        </View>
      }
      renderItem={({ item }) => {
        const { professional, barbershop } = item;
        const especialidade = professional.specialty ?? "Barbeiro";
        return (
          <Card
            variant="outlined"
            onPress={() => actions.openBarber(item)}
            accessibilityLabel={`${professional.name}, ${especialidade}, na ${barbershop.name}`}
            accessibilityHint="Abre o perfil do barbeiro"
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.lg }}>
              <Avatar name={professional.name} uri={professional.avatarUrl} />
              <View style={{ flex: 1, gap: spacing.xs }}>
                <Typography variant="titleMedium" numberOfLines={1}>
                  {professional.name}
                </Typography>
                <Typography variant="bodyMedium" color="primary" numberOfLines={1}>
                  {especialidade}
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant" numberOfLines={1}>
                  {barbershop.name}
                </Typography>
              </View>
              <Icon name="chevronRight" color={colors.onSurfaceVariant} />
            </View>
          </Card>
        );
      }}
    />
  );
};

export default Barbeiros;
