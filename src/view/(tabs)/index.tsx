// Início: cabeçalho marrom (nome do app, foto e pesquisa de barbearias), próximo agendamento, chips de categoria que filtram
// as barbearias, barbearias em destaque em lista vertical, galeria de Inspirações e a barra de
// navegação fixa. Usa os componentes de src/view/components/home.

import { FlatList, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/view/components/button";
import { formatDayLabel, formatTime } from "@/view/components/format";
import {
  BarbershopCard,
  CategoryChip,
  HomeHeader,
  InspirationCard,
  NextAppointmentCard,
  NextAppointmentEmpty,
  SectionHeader,
} from "@/view/components/home";
import { MainTabBar } from "@/view/components/mainTabBar";
import { ScreenState } from "@/view/components/screenState";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import type { ServiceCategory } from "@/model/entities/highlight";
import { useHomeViewModel } from "@/viewmodel/useHomeViewModel";
import { useTabBarViewModel } from "@/viewmodel/useTabBarViewModel";

// Filtros de categoria; "Tudo" (null) remove o filtro.
const CATEGORIAS: { valor: ServiceCategory | null; rotulo: string }[] = [
  { valor: null, rotulo: "Tudo" },
  { valor: "cabelo", rotulo: "Cabelo" },
  { valor: "barba", rotulo: "Barba" },
  { valor: "combo", rotulo: "Combo" },
  { valor: "sobrancelha", rotulo: "Sobrancelha" },
];

const Home = () => {
  const [state, actions] = useHomeViewModel();
  const tabs = useTabBarViewModel("inicio");
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const insets = useSafeAreaInsets();
  const proximo = state.nextAppointment;
  const categoria = state.category ? CATEGORIAS.find((c) => c.valor === state.category) : undefined;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* A barra inferior fica fora da rolagem (fixa); o respiro final evita que o último card
          encoste nela. A área segura de baixo é tratada pela própria barra. */}
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.huge, gap: spacing.xxl }}>
        <HomeHeader
          userName={state.user?.name ?? null}
          avatarUrl={state.user?.avatarUrl ?? null}
          onProfile={actions.goProfile}
          search={state.search}
          onSearchChange={actions.setSearch}
        />

        {state.status !== "content" ? (
          <View style={{ paddingHorizontal: spacing.lg }}>
            <ScreenState
              status={state.status}
              loadingLabel="Carregando o início"
              errorMessage={state.errorMessage}
              onRetry={actions.retry}
              emptyTitle=""
            />
          </View>
        ) : (
          <>
            {/* Seção 2: próximo agendamento */}
            <View style={{ paddingHorizontal: spacing.lg, marginTop: -spacing.sm }}>
              {proximo ? (
                <NextAppointmentCard
                  barbershopName={proximo.barbershopName}
                  imageUrl={state.nextAppointmentImageUrl}
                  dateLabel={formatDayLabel(proximo.startsAt)}
                  time={formatTime(proximo.startsAt)}
                  serviceName={proximo.serviceName}
                  professionalName={proximo.professionalName}
                  status={proximo.status}
                  onPress={actions.openAppointments}
                />
              ) : (
                <NextAppointmentEmpty />
              )}
            </View>

            {/* Seção 3: categorias (filtram as barbearias em destaque) */}
            <View style={{ gap: spacing.sm }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: spacing.lg, gap: spacing.sm, alignItems: "center" }}
                accessibilityLabel="Filtrar barbearias por categoria"
              >
                {CATEGORIAS.map((c) => (
                  <CategoryChip
                    key={c.rotulo}
                    label={c.rotulo}
                    selected={state.category === c.valor}
                    onPress={() => actions.selectCategory(c.valor)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Seção 4: barbearias em destaque, uma abaixo da outra */}
            <View style={{ gap: spacing.sm }}>
              <View style={{ paddingHorizontal: spacing.lg, gap: spacing.md }}>
                {state.highlights.length === 0 ? (
                  <View
                    style={{
                      alignItems: "center",
                      gap: spacing.sm,
                      padding: spacing.xl,
                      borderRadius: theme.shapes.large,
                      backgroundColor: colors.surfaceContainer,
                    }}
                  >
                    <Typography variant="titleSmall" align="center">
                      {state.search.trim()
                        ? `Nenhuma barbearia encontrada para "${state.search.trim()}"`
                        : categoria
                          ? `Nenhuma barbearia com ${categoria.rotulo.toLowerCase()} por enquanto`
                          : "Nenhuma barbearia cadastrada ainda"}
                    </Typography>
                    {state.search.trim() ? (
                      <Button variant="tonal" size="small" onPress={() => actions.setSearch("")}>
                        Limpar pesquisa
                      </Button>
                    ) : categoria ? (
                      <Button variant="tonal" size="small" onPress={() => actions.selectCategory(null)}>
                        Ver todas as categorias
                      </Button>
                    ) : null}
                  </View>
                ) : (
                  state.highlights.map((b) => (
                    <BarbershopCard
                      key={b.id}
                      name={b.name}
                      location={b.location}
                      imageUrl={b.imageUrl}
                      rating={b.rating}
                      reviewCount={b.reviewCount}
                      distanceKm={b.distanceKm}
                      isOpen={b.isOpen}
                      onPress={() => actions.openHighlight(b.id)}
                    />
                  ))
                )}
              </View>
            </View>

            {/* Seção 5: inspirações em galeria horizontal */}
            {state.inspirations.length > 0 && (
              <View style={{ gap: spacing.sm }}>
                <SectionHeader
                  title="Inspirações"
                  onSeeAll={actions.openAllInspirations}
                  seeAllLabel="Ver todas as inspirações"
                />
                <FlatList
                  horizontal
                  data={state.inspirations}
                  keyExtractor={(foto) => foto.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
                  renderItem={({ item }) => (
                    <InspirationCard
                      title={item.caption ?? item.serviceName ?? "Corte"}
                      imageUrl={item.imageUrl}
                      author={`por ${item.professionalName}`}
                      onPress={() => actions.openInspiration(item)}
                    />
                  )}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Faixa marrom fixa atrás da barra de status: ao rolar, o conteúdo não passa sob o relógio. */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: insets.top, backgroundColor: colors.primary }}
      />

      <MainTabBar active={tabs[0].active} tabs={tabs[0].tabs} onNavigate={tabs[1].navigate} />
    </View>
  );
};

export default Home;
