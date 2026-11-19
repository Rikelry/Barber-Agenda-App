// Barbearia (canvas de telas): foto, nome, endereço, horário de hoje com selo Aberta/Fechada,
// telefone, abas Serviços e Profissionais e o botão Agendar em cada serviço.

import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar } from "@/view/components/avatar";
import { Button } from "@/view/components/button";
import { formatDuration, formatPhone, formatPrice } from "@/view/components/format";
import { Icon } from "@/view/components/icon";
import { OpenBadge } from "@/view/components/statusBadge";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Tabs } from "@/view/components/tabs";
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      <ScreenHeader title="Barbearia" onBack={actions.goBack} />

      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        {!detalhe ? (
          <View style={{ padding: spacing.lg }}>
            <ScreenState
              status={state.status}
              loadingLabel="Carregando barbearia"
              errorMessage={state.errorMessage}
              onRetry={actions.retry}
              emptyTitle="Barbearia não encontrada"
            />
          </View>
        ) : (
          <View style={{ gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.sm }}>
            <Thumbnail
              uri={detalhe.barbershop.avatarUrl}
              label={`Foto da ${detalhe.barbershop.name}`}
              width="100%"
              height={componentSizes.thumbnail.heroHeight}
              radius={theme.shapes.large}
            />

            <Typography variant="titleLarge" weight="500" accessibilityRole="header">
              {detalhe.barbershop.name}
            </Typography>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <Icon name="location" size={spacing.xl} color={colors.onSurfaceVariant} />
              <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ flex: 1 }}>
                {detalhe.barbershop.address}
              </Typography>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <Icon name="clock" size={spacing.xl} color={colors.onSurfaceVariant} />
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                {detalhe.hoursToday ? `Hoje, ${detalhe.hoursToday.openTime} às ${detalhe.hoursToday.closeTime}` : "Fechada hoje"}
              </Typography>
              <OpenBadge open={Boolean(detalhe.hoursToday)} />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <Icon name="phone" size={spacing.xl} color={colors.onSurfaceVariant} />
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                {formatPhone(detalhe.barbershop.phone)}
              </Typography>
            </View>

            <Tabs
              items={[
                { key: "servicos", label: "Serviços" },
                { key: "profissionais", label: "Profissionais" },
              ]}
              selected={state.tab}
              onSelect={actions.setTab}
            />

            {state.tab === "servicos" ? (
              detalhe.services.length === 0 ? (
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  Esta barbearia ainda não cadastrou serviços.
                </Typography>
              ) : (
                <View>
                  {detalhe.services.map((s) => (
                    <View
                      key={s.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.md,
                        paddingVertical: spacing.md,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.outlineVariant,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Typography variant="titleMedium">{s.name}</Typography>
                        <Typography variant="bodyMedium" color="onSurfaceVariant">
                          {s.description ? `${s.description} · ` : ""}
                          {formatDuration(s.durationMinutes)}
                        </Typography>
                      </View>
                      <View style={{ alignItems: "flex-end", gap: spacing.xs }}>
                        <Typography variant="titleMedium" color="primary">
                          {formatPrice(s.price)}
                        </Typography>
                        <Button variant="tonal" size="xs" onPress={() => actions.book(s.id)} accessibilityLabel={`Agendar ${s.name}`}>
                          Agendar
                        </Button>
                      </View>
                    </View>
                  ))}
                </View>
              )
            ) : detalhe.professionals.length === 0 ? (
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                Nenhum profissional vinculado ainda.
              </Typography>
            ) : (
              <View>
                {detalhe.professionals.map((p) => (
                  <Pressable
                    key={p.id}
                    onPress={() => actions.openBarber(p)}
                    accessibilityRole="button"
                    accessibilityLabel={`${p.name}, ${p.specialty ?? "Barbeiro"}`}
                    accessibilityHint="Abre o perfil do profissional"
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.lg,
                      minHeight: componentSizes.listItem.twoLine,
                      paddingVertical: spacing.sm,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.outlineVariant,
                    }}
                  >
                    <Avatar name={p.name} uri={p.avatarUrl} />
                    <View style={{ flex: 1 }}>
                      <Typography variant="titleMedium">{p.name}</Typography>
                      <Typography variant="bodyMedium" color="onSurfaceVariant">
                        {p.specialty ?? "Barbeiro"}
                      </Typography>
                    </View>
                    <Icon name="chevronRight" size={spacing.xl} color={colors.onSurfaceVariant} />
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetalheBarbearia;
