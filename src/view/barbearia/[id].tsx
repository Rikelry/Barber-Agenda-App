// Detalhe da barbearia: capa, endereço e telefone, serviços (preço e duração) e barbeiros.

import { Pressable, ScrollView, View } from "react-native";

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
import { useDetalheBarbeariaViewModel } from "@/viewmodel/useDetalheBarbeariaViewModel";

const DetalheBarbearia = () => {
  const [state, actions] = useDetalheBarbeariaViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const detalhe = state.status === "content" ? state.detail : null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.xxl }}
    >
      {!detalhe ? (
        <ScreenState
          status={state.status}
          loadingLabel="Carregando barbearia"
          errorMessage={state.errorMessage}
          onRetry={actions.retry}
          emptyTitle="Barbearia não encontrada"
        />
      ) : (
        <>
          <View style={{ gap: spacing.lg }}>
            <Thumbnail
              uri={detalhe.barbershop.avatarUrl}
              label={`Foto da ${detalhe.barbershop.name}`}
              width="100%"
              height={componentSizes.thumbnail.heroHeight}
            />
            <Typography variant="headlineSmall" accessibilityRole="header">
              {detalhe.barbershop.name}
            </Typography>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <Icon name="location" size={spacing.xl} />
              <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ flex: 1 }}>
                {detalhe.barbershop.address}
              </Typography>
            </View>
            <Pressable
              onPress={actions.callBarbershop}
              accessibilityRole="button"
              accessibilityLabel={`Ligar para ${formatPhone(detalhe.barbershop.phone)}`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
                minHeight: componentSizes.touchTarget,
              }}
            >
              <Icon name="phone" size={spacing.xl} />
              <Typography variant="labelLarge" color="primary">
                {formatPhone(detalhe.barbershop.phone)}
              </Typography>
            </Pressable>
          </View>

          <View style={{ gap: spacing.md }}>
            <Typography variant="titleMedium" accessibilityRole="header">
              Serviços
            </Typography>
            {detalhe.services.length === 0 ? (
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                Esta barbearia ainda não cadastrou serviços.
              </Typography>
            ) : (
              <Card variant="outlined">
                {detalhe.services.map((servico, i) => (
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
                        {servico.description ? (
                          <Typography variant="bodySmall" color="onSurfaceVariant">
                            {servico.description}
                          </Typography>
                        ) : null}
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

          <View style={{ gap: spacing.md }}>
            <Typography variant="titleMedium" accessibilityRole="header">
              Barbeiros
            </Typography>
            {detalhe.professionals.length === 0 ? (
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                Nenhum barbeiro vinculado ainda.
              </Typography>
            ) : (
              detalhe.professionals.map((p) => (
                <Card
                  key={p.id}
                  variant="filled"
                  onPress={() => actions.openBarber(p)}
                  accessibilityLabel={`${p.name}, ${p.specialty ?? "Barbeiro"}`}
                  accessibilityHint="Abre o perfil do barbeiro"
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.lg }}>
                    <Avatar name={p.name} uri={p.avatarUrl} />
                    <View style={{ flex: 1, gap: spacing.xs }}>
                      <Typography variant="titleSmall">{p.name}</Typography>
                      <Typography variant="bodySmall" color="onSurfaceVariant">
                        {p.specialty ?? "Barbeiro"}
                      </Typography>
                    </View>
                    <Icon name="chevronRight" color={colors.onSurfaceVariant} />
                  </View>
                </Card>
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default DetalheBarbearia;
