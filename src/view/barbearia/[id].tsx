// Detalhe da barbearia (padrão 2 de 05-padroes.md): foto, nome, endereço e telefone, horário
// de hoje, abas Serviços e Profissionais e o botão Agendar em cada serviço.

import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar } from "@/view/components/avatar";
import { Button } from "@/view/components/button";
import { Card } from "@/view/components/card";
import { Chip } from "@/view/components/chip";
import { formatDuration, formatPhone, formatPrice } from "@/view/components/format";
import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { MainTabBar } from "@/view/components/mainTabBar";
import { ScreenState } from "@/view/components/screenState";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import { useDetalheBarbeariaViewModel } from "@/viewmodel/useDetalheBarbeariaViewModel";
import { useTabBarViewModel } from "@/viewmodel/useTabBarViewModel";

const DetalheBarbearia = () => {
  const [state, actions] = useDetalheBarbeariaViewModel();
  const tabs = useTabBarViewModel("buscar");
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const detalhe = state.status === "content" ? state.detail : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.sm }}>
        <IconButton accessibilityLabel="Voltar" onPress={actions.goBack} icon={(cor) => <Icon name="back" color={cor} />} />
        <Typography variant="titleLarge" numberOfLines={1} accessibilityRole="header" style={{ flex: 1 }}>
          {detalhe?.barbershop.name ?? "Barbearia"}
        </Typography>
      </View>

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
          <>
            <Thumbnail
              uri={detalhe.barbershop.avatarUrl}
              label={`Foto da ${detalhe.barbershop.name}`}
              width="100%"
              height={componentSizes.thumbnail.heroHeight}
            />

            <View
              style={{
                gap: spacing.xs,
                padding: spacing.lg,
                backgroundColor: colors.surfaceContainerHigh,
              }}
            >
              <Typography variant="titleLarge" weight="700">
                {detalhe.barbershop.name}
              </Typography>
              <Typography variant="bodySmall" color="onSurfaceVariant">
                {detalhe.barbershop.address} • {formatPhone(detalhe.barbershop.phone)}
              </Typography>
              <Typography variant="labelMedium" color="primary">
                {detalhe.hoursToday
                  ? `Aberto hoje • ${detalhe.hoursToday.openTime} - ${detalhe.hoursToday.closeTime}`
                  : "Fechado hoje"}
              </Typography>
            </View>

            <View style={{ gap: spacing.lg, padding: spacing.lg }}>
              <View style={{ flexDirection: "row", gap: spacing.sm }} accessibilityRole="tablist">
                <Chip
                  variant="filter"
                  label="Serviços"
                  selected={state.tab === "servicos"}
                  onPress={() => actions.setTab("servicos")}
                />
                <Chip
                  variant="filter"
                  label="Profissionais"
                  selected={state.tab === "profissionais"}
                  onPress={() => actions.setTab("profissionais")}
                />
              </View>

              {state.tab === "servicos" ? (
                <>
                  {detalhe.professionals.length > 0 && (
                    <View style={{ gap: spacing.md }}>
                      <Typography variant="titleSmall" weight="700" accessibilityRole="header">
                        Profissionais disponíveis
                      </Typography>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.xl }}>
                        {detalhe.professionals.map((p) => (
                          <Pressable
                            key={p.id}
                            onPress={() => actions.openBarber(p)}
                            accessibilityRole="button"
                            accessibilityLabel={`Ver perfil de ${p.name}`}
                            style={{ alignItems: "center", gap: spacing.xs }}
                          >
                            <Avatar name={p.name} uri={p.avatarUrl} outlined />
                            <Typography variant="labelMedium">{p.name.split(" ")[0]}</Typography>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  <View style={{ gap: spacing.md }}>
                    <Typography variant="titleSmall" weight="700" accessibilityRole="header">
                      Serviços
                    </Typography>
                    {detalhe.services.length === 0 ? (
                      <Typography variant="bodyMedium" color="onSurfaceVariant">
                        Esta barbearia ainda não cadastrou serviços.
                      </Typography>
                    ) : (
                      detalhe.services.map((s) => (
                        <Card key={s.id} variant="outlined">
                          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                            <View style={{ flex: 1, gap: spacing.xs }}>
                              <Typography variant="titleSmall" weight="700">
                                {s.name}
                              </Typography>
                              <Typography variant="bodySmall" color="onSurfaceVariant">
                                Duração: {formatDuration(s.durationMinutes)} • {formatPrice(s.price)}
                              </Typography>
                            </View>
                            <Button
                              variant="filled"
                              size="xs"
                              onPress={() => actions.book(s.id)}
                              accessibilityLabel={`Agendar ${s.name}`}
                            >
                              Agendar
                            </Button>
                          </View>
                        </Card>
                      ))
                    )}
                  </View>
                </>
              ) : detalhe.professionals.length === 0 ? (
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  Nenhum profissional vinculado ainda.
                </Typography>
              ) : (
                detalhe.professionals.map((p) => (
                  <Card
                    key={p.id}
                    variant="outlined"
                    onPress={() => actions.openBarber(p)}
                    accessibilityLabel={`${p.name}, ${p.specialty ?? "Barbeiro"}`}
                    accessibilityHint="Abre o perfil do profissional"
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.lg }}>
                      <Avatar name={p.name} uri={p.avatarUrl} />
                      <View style={{ flex: 1, gap: spacing.xs }}>
                        <Typography variant="titleSmall" weight="700">
                          {p.name}
                        </Typography>
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
      <MainTabBar active={tabs[0].active} onNavigate={tabs[1].navigate} />
    </SafeAreaView>
  );
};

export default DetalheBarbearia;
