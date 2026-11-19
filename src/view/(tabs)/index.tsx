// Início (canvas de telas): saudação com busca e foto, próximo agendamento, destaques da
// semana com filtro por categoria e a barra de navegação inferior. Usa os componentes de src/view/components.

import { Image } from "expo-image";
import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/view/components/avatar";
import { Button } from "@/view/components/button";
import { Card } from "@/view/components/card";
import { Chip } from "@/view/components/chip";
import { formatDayLabel, formatTime } from "@/view/components/format";
import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { MainTabBar } from "@/view/components/mainTabBar";
import { STATUS_LABEL, StatusBadge } from "@/view/components/statusBadge";
import { Typography } from "@/view/components/typography";
import { useDesignSystem } from "@/view/components/themeProvider";
import { componentSizes } from "@/view/theme";
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
const DESTAQUE = { largura: 200, alturaImagem: 96 };

const Home = () => {
  const [state, actions] = useHomeViewModel();
  const tabs = useTabBarViewModel("inicio");
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const insets = useSafeAreaInsets();
  const primeiroNome = state.user?.name.split(" ")[0] ?? "";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl, gap: spacing.lg }}>
        {/* Cabeçalho marrom com saudação, busca e foto */}
        <View
          style={{
            backgroundColor: colors.primary,
            paddingTop: insets.top + spacing.lg,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.xl,
            borderBottomLeftRadius: theme.shapes.extraLarge,
            borderBottomRightRadius: theme.shapes.extraLarge,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Typography variant="bodyMedium" color="onPrimary">
                {primeiroNome ? `Olá, ${primeiroNome}!` : "Olá!"}
              </Typography>
              <Typography variant="headlineSmall" weight="700" color="onPrimary" accessibilityRole="header">
                Escolha o seu estilo
              </Typography>
            </View>
            <IconButton
              accessibilityLabel="Buscar barbearia, serviço ou barbeiro"
              onPress={actions.openSearch}
              icon={() => <Icon name="search" color={colors.onPrimary} />}
            />
            {state.user ? (
              <Pressable
                onPress={actions.goProfile}
                accessibilityRole="button"
                accessibilityLabel="Abrir meu perfil"
                style={{ minWidth: componentSizes.touchTarget, minHeight: componentSizes.touchTarget, justifyContent: "center" }}
              >
                <Avatar name={state.user.name} uri={state.user.avatarUrl} />
              </Pressable>
            ) : null}
          </View>
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
            {/* Próximo agendamento (canvas de telas: primeiro bloco do Início) */}
            <View style={{ paddingHorizontal: spacing.lg }}>
              {state.nextAppointment ? (
                <Card
                  variant="filled"
                  onPress={actions.openAppointments}
                  accessibilityLabel={`Próximo agendamento: ${state.nextAppointment.barbershopName}, ${formatDayLabel(state.nextAppointment.startsAt)} às ${formatTime(state.nextAppointment.startsAt)}, ${STATUS_LABEL[state.nextAppointment.status]}`}
                  accessibilityHint="Abre seus agendamentos"
                  style={{ gap: spacing.sm, backgroundColor: colors.primaryContainer }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                    <View style={{ flex: 1 }}>
                      <Typography variant="labelMedium" color="onPrimaryContainer">
                        Próximo agendamento
                      </Typography>
                      <Typography variant="titleMedium" weight="700" color="onPrimaryContainer">
                        {state.nextAppointment.barbershopName}
                      </Typography>
                    </View>
                    <StatusBadge status={state.nextAppointment.status} />
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    <Icon name="calendar" size={spacing.lg} color={colors.onPrimaryContainer} />
                    <Typography variant="labelLarge" color="onPrimaryContainer" style={{ flex: 1 }}>
                      {formatDayLabel(state.nextAppointment.startsAt)} · {formatTime(state.nextAppointment.startsAt)}
                    </Typography>
                    <Icon name="chevronRight" size={spacing.xl} color={colors.onPrimaryContainer} />
                  </View>
                  <Typography variant="bodyMedium" color="onPrimaryContainer">
                    {state.nextAppointment.serviceName} com {state.nextAppointment.professionalName}
                  </Typography>
                </Card>
              ) : (
                <Card variant="outlined" onPress={actions.openSearch} accessibilityLabel="Você não tem agendamentos. Encontrar uma barbearia">
                  <Typography variant="titleSmall" weight="700">
                    Nenhum agendamento marcado
                  </Typography>
                  <Typography variant="bodyMedium" color="onSurfaceVariant">
                    Encontre uma barbearia e escolha seu horário.
                  </Typography>
                </Card>
              )}
            </View>

            {/* Destaques da semana com filtro por categoria */}
            <View style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.lg }}>
                <Typography variant="titleLarge" weight="500" accessibilityRole="header" style={{ flex: 1 }}>
                  Destaques da semana
                </Typography>
                <Button variant="text" size="xs" onPress={actions.openSearch}>
                  Ver tudo
                </Button>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
                accessibilityLabel="Filtrar destaques por categoria"
              >
                {CATEGORIAS.map((c) => (
                  <Chip
                    key={c.valor}
                    variant="filter"
                    label={c.rotulo}
                    selected={state.category === c.valor}
                    onPress={() => actions.selectCategory(c.valor)}
                    accessibilityHint={`Mostra barbearias com ${c.rotulo.toLowerCase()}`}
                  />
                ))}
              </ScrollView>
              {state.highlights.length === 0 ? (
                <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ paddingHorizontal: spacing.lg }}>
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
                    <Pressable
                      onPress={() => actions.openHighlight(item.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`${item.name}, ${item.neighborhood}, nota ${item.rating.toLocaleString("pt-BR")}`}
                      accessibilityHint="Abre os detalhes da barbearia"
                      style={{ width: DESTAQUE.largura, gap: spacing.xs }}
                    >
                      <View
                        style={{
                          height: DESTAQUE.alturaImagem,
                          borderRadius: theme.shapes.medium,
                          overflow: "hidden",
                          backgroundColor: colors.primaryFixedDim,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon name="scissors" size={spacing.xxl} color={colors.onPrimaryContainer} />
                        {item.imageUrl ? (
                          <Image
                            source={{ uri: item.imageUrl }}
                            style={StyleSheet.absoluteFill}
                            contentFit="cover"
                            accessibilityIgnoresInvertColors
                          />
                        ) : null}
                      </View>
                      <Typography variant="titleMedium" numberOfLines={1}>
                        {item.name}
                      </Typography>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <Typography variant="bodyMedium" color="onSurfaceVariant" numberOfLines={1} style={{ flexShrink: 1 }}>
                          {item.neighborhood}
                        </Typography>
                        <Icon name="star" size={spacing.md + spacing.xs / 2} color={colors.primary} />
                        <Typography variant="labelLarge" weight="700">
                          {item.rating.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
                        </Typography>
                      </View>
                    </Pressable>
                  )}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>

      <MainTabBar active={tabs[0].active} tabs={tabs[0].tabs} onNavigate={tabs[1].navigate} />
    </View>
  );
};

export default Home;
