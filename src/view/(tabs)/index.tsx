// Home: saudação com foto, busca, acesso rápido por categoria, destaques da semana, próximo
// agendamento e a barra de navegação inferior. Usa os componentes de src/view/components.

import { Image } from "expo-image";
import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/view/components/avatar";
import { Button } from "@/view/components/button";
import { Card } from "@/view/components/card";
import { Chip } from "@/view/components/chip";
import { formatDayLabel, formatTime } from "@/view/components/format";
import { Icon } from "@/view/components/icon";
import { MainTabBar } from "@/view/components/mainTabBar";
import { STATUS_LABEL, StatusBadge } from "@/view/components/statusBadge";
import { Typography } from "@/view/components/typography";
import { useDesignSystem } from "@/view/components/themeProvider";
import type { ServiceCategory } from "@/model/entities/highlight";
import { useHomeViewModel } from "@/viewmodel/useHomeViewModel";
import { useTabBarViewModel } from "@/viewmodel/useTabBarViewModel";

const CATEGORIAS: { valor: ServiceCategory; rotulo: string }[] = [
  { valor: "cabelo", rotulo: "Cabelo" },
  { valor: "barba", rotulo: "Barba" },
  { valor: "combo", rotulo: "Combo" },
  { valor: "sobrancelha", rotulo: "Sobrancelha" },
];

/** Card do carrossel de destaques. */
const DESTAQUE = { largura: 220, alturaImagem: 120 };

const Home = () => {
  const [state, actions] = useHomeViewModel();
  const tabs = useTabBarViewModel("inicio");
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const insets = useSafeAreaInsets();
  const primeiroNome = state.user?.name.split(" ")[0] ?? "";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl, gap: spacing.xxl }}>
        {/* Cabeçalho roxo com saudação, foto e busca */}
        <View
          style={{
            backgroundColor: colors.primary,
            paddingTop: insets.top + spacing.lg,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.xl,
            borderBottomLeftRadius: theme.shapes.extraLarge,
            borderBottomRightRadius: theme.shapes.extraLarge,
            gap: spacing.lg,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.lg }}>
            <View style={{ flex: 1, gap: spacing.xs }}>
              <Typography variant="bodyMedium" color="onPrimary">
                {primeiroNome ? `Olá, ${primeiroNome}!` : "Olá!"}
              </Typography>
              <Typography variant="headlineSmall" weight="700" color="onPrimary" accessibilityRole="header">
                Escolha o seu estilo
              </Typography>
            </View>
            {state.user ? (
              <Pressable
                onPress={actions.goProfile}
                accessibilityRole="button"
                accessibilityLabel="Abrir meu perfil"
                hitSlop={spacing.sm}
              >
                <Avatar name={state.user.name} uri={state.user.avatarUrl} />
              </Pressable>
            ) : null}
          </View>

          <Pressable
            onPress={actions.openSearch}
            accessibilityRole="button"
            accessibilityLabel="Buscar barbearia, serviços ou profissionais"
            accessibilityHint="Abre a busca"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
              minHeight: spacing.massive,
              paddingHorizontal: spacing.lg,
              borderRadius: theme.shapes.full,
              backgroundColor: colors.surface,
            }}
          >
            <Icon name="search" size={spacing.xl} color={colors.onSurfaceVariant} />
            <Typography variant="bodyMedium" color="onSurfaceVariant" numberOfLines={2} style={{ flex: 1 }}>
              Buscar barbearia, serviços ou profissionais...
            </Typography>
          </Pressable>
        </View>

        {state.status === "loading" && (
          <Typography
            variant="bodyMedium"
            color="onSurfaceVariant"
            align="center"
            accessibilityLiveRegion="polite"
          >
            Carregando...
          </Typography>
        )}

        {state.status === "error" && (
          <View style={{ alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg }}>
            <Typography variant="titleMedium" color="error" align="center">
              Não foi possível carregar
            </Typography>
            <Typography variant="bodyMedium" color="onSurfaceVariant" align="center">
              {state.errorMessage}
            </Typography>
            <Button variant="tonal" onPress={actions.retry}>
              Tentar de novo
            </Button>
          </View>
        )}

        {state.status === "content" && (
          <>
            {/* Acesso rápido */}
            <View style={{ gap: spacing.md, paddingHorizontal: spacing.lg }}>
              <Typography variant="titleMedium" weight="700" accessibilityRole="header">
                Acesso rápido
              </Typography>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
                {CATEGORIAS.map((c) => (
                  <Chip
                    key={c.valor}
                    variant="filter"
                    label={c.rotulo}
                    selected={state.category === c.valor}
                    leadingIcon={(cor) => <Icon name="scissors" size={spacing.lg} color={cor} />}
                    onPress={() => actions.selectCategory(c.valor)}
                    accessibilityHint={`Mostra barbearias com ${c.rotulo.toLowerCase()}`}
                  />
                ))}
              </View>
            </View>

            {/* Destaques da semana */}
            <View style={{ gap: spacing.md }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: spacing.lg,
                }}
              >
                <Typography variant="titleMedium" weight="700" accessibilityRole="header">
                  Destaques da semana
                </Typography>
                <Button variant="text" size="xs" onPress={actions.openSearch}>
                  Ver tudo
                </Button>
              </View>
              {state.highlights.length === 0 ? (
                <Typography
                  variant="bodyMedium"
                  color="onSurfaceVariant"
                  style={{ paddingHorizontal: spacing.lg }}
                >
                  {state.loadingHighlights ? "Carregando..." : "Nenhuma barbearia com essa categoria."}
                </Typography>
              ) : (
                <FlatList
                  horizontal
                  data={state.highlights}
                  keyExtractor={(h) => h.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
                  style={{ opacity: state.loadingHighlights ? theme.state.disabledContent : 1 }}
                  renderItem={({ item }) => (
                    <Card
                      variant="filled"
                      onPress={() => actions.openHighlight(item.id)}
                      accessibilityLabel={`${item.name}, ${item.neighborhood}, nota ${item.rating.toLocaleString("pt-BR")}`}
                      accessibilityHint="Abre os detalhes da barbearia"
                      style={{ width: DESTAQUE.largura, padding: spacing.none, overflow: "hidden" }}
                    >
                      <View
                        style={{
                          height: DESTAQUE.alturaImagem,
                          backgroundColor: colors.primaryContainer,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon name="scissors" size={spacing.xxxl} color={colors.onPrimaryContainer} />
                        {item.imageUrl ? (
                          <Image
                            source={{ uri: item.imageUrl }}
                            style={StyleSheet.absoluteFill}
                            contentFit="cover"
                            accessibilityIgnoresInvertColors
                          />
                        ) : null}
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-end",
                          gap: spacing.sm,
                          padding: spacing.md,
                        }}
                      >
                        <View style={{ flex: 1, gap: spacing.xs }}>
                          <Typography variant="titleSmall" weight="700" numberOfLines={1}>
                            {item.name}
                          </Typography>
                          <Typography variant="bodySmall" color="onSurfaceVariant" numberOfLines={1}>
                            {item.neighborhood}
                          </Typography>
                        </View>
                        <Typography variant="labelLarge" weight="700">
                          ★ {item.rating.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
                        </Typography>
                      </View>
                    </Card>
                  )}
                />
              )}
            </View>

            {/* Próximos agendamentos */}
            <View style={{ gap: spacing.md, paddingHorizontal: spacing.lg }}>
              <Typography variant="titleMedium" weight="700" accessibilityRole="header">
                Próximos agendamentos
              </Typography>
              {state.nextAppointment ? (
                <Card
                  variant="outlined"
                  accessible
                  accessibilityLabel={`${state.nextAppointment.barbershopName}, ${formatDayLabel(state.nextAppointment.startsAt)} às ${formatTime(state.nextAppointment.startsAt)}, ${STATUS_LABEL[state.nextAppointment.status]}`}
                  style={{
                    gap: spacing.sm,
                    backgroundColor: colors.primaryContainer,
                    borderColor: colors.primary,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    <Typography variant="titleSmall" weight="700" color="onPrimaryContainer" style={{ flex: 1 }}>
                      {state.nextAppointment.barbershopName}
                    </Typography>
                    <StatusBadge status={state.nextAppointment.status} />
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.lg }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                      <Icon name="calendar" size={spacing.lg} color={colors.onPrimaryContainer} />
                      <Typography variant="labelLarge" color="onPrimaryContainer">
                        {formatDayLabel(state.nextAppointment.startsAt)}
                      </Typography>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                      <Icon name="clock" size={spacing.lg} color={colors.onPrimaryContainer} />
                      <Typography variant="labelLarge" color="onPrimaryContainer">
                        {formatTime(state.nextAppointment.startsAt)}
                      </Typography>
                    </View>
                  </View>
                  <Typography variant="bodySmall" color="onPrimaryContainer">
                    Profissional: {state.nextAppointment.professionalName} ({state.nextAppointment.serviceName})
                  </Typography>
                </Card>
              ) : (
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  Você não tem agendamentos marcados.
                </Typography>
              )}
            </View>
          </>
        )}
      </ScrollView>

      <MainTabBar active={tabs[0].active} onNavigate={tabs[1].navigate} />
    </View>
  );
};

export default Home;
