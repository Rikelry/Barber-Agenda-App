// Perfil do barbeiro: foto, especialidade, barbearia onde trabalha, contato e serviços.

import { ScrollView, View } from "react-native";

import { Avatar } from "@/view/components/avatar";
import { Card } from "@/view/components/card";
import { Divider } from "@/view/components/divider";
import { formatDuration, formatPhone, formatPrice } from "@/view/components/format";
import { Icon } from "@/view/components/icon";
import { ScreenState } from "@/view/components/screenState";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import { usePerfilBarbeiroViewModel } from "@/viewmodel/usePerfilBarbeiroViewModel";

const PerfilBarbeiro = () => {
  const [state, actions] = usePerfilBarbeiroViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const perfil = state.status === "content" ? state.profile : null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.xxl }}
    >
      {!perfil ? (
        <ScreenState
          status={state.status}
          loadingLabel="Carregando perfil do barbeiro"
          errorMessage={state.errorMessage}
          onRetry={actions.retry}
          emptyTitle="Barbeiro não encontrado"
        />
      ) : (
        <>
          <View style={{ alignItems: "center", gap: spacing.sm }}>
            <Avatar name={perfil.professional.name} uri={perfil.professional.avatarUrl} size="large" />
            <Typography variant="headlineSmall" align="center" accessibilityRole="header">
              {perfil.professional.name}
            </Typography>
            <View
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: theme.shapes.full,
                backgroundColor: colors.secondaryContainer,
              }}
            >
              <Typography variant="labelLarge" color="onSecondaryContainer">
                {perfil.professional.specialty ?? "Barbeiro"}
              </Typography>
            </View>
          </View>

          <View style={{ gap: spacing.md }}>
            <Typography variant="titleMedium" accessibilityRole="header">
              Onde atende
            </Typography>
            <Card
              variant="outlined"
              onPress={actions.openBarbershop}
              accessibilityLabel={`${perfil.barbershop.name}, ${perfil.barbershop.address}`}
              accessibilityHint="Abre os detalhes da barbearia"
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.lg }}>
                <Thumbnail
                  uri={perfil.barbershop.avatarUrl}
                  label={`Foto da ${perfil.barbershop.name}`}
                  width={componentSizes.thumbnail.card}
                  height={componentSizes.thumbnail.card}
                />
                <View style={{ flex: 1, gap: spacing.xs }}>
                  <Typography variant="titleSmall">{perfil.barbershop.name}</Typography>
                  <Typography variant="bodySmall" color="onSurfaceVariant" numberOfLines={2}>
                    {perfil.barbershop.address}
                  </Typography>
                </View>
                <Icon name="chevronRight" color={colors.onSurfaceVariant} />
              </View>
            </Card>
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              Contato: {formatPhone(perfil.professional.phone)}
            </Typography>
          </View>

          <View style={{ gap: spacing.md }}>
            <Typography variant="titleMedium" accessibilityRole="header">
              Serviços
            </Typography>
            {perfil.services.length === 0 ? (
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                A barbearia ainda não cadastrou serviços.
              </Typography>
            ) : (
              <Card variant="outlined">
                {perfil.services.map((servico, i) => (
                  <View key={servico.id}>
                    {i > 0 && <Divider />}
                    <View
                      accessible
                      accessibilityLabel={`${servico.name}, ${formatDuration(servico.durationMinutes)}, ${formatPrice(servico.price)}`}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.lg,
                        paddingVertical: spacing.md,
                      }}
                    >
                      <View style={{ flex: 1, gap: spacing.xs }}>
                        <Typography variant="titleSmall">{servico.name}</Typography>
                        <Typography variant="bodySmall" color="onSurfaceVariant">
                          {formatDuration(servico.durationMinutes)}
                        </Typography>
                      </View>
                      <Typography variant="titleMedium" color="primary">
                        {formatPrice(servico.price)}
                      </Typography>
                    </View>
                  </View>
                ))}
              </Card>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default PerfilBarbeiro;
