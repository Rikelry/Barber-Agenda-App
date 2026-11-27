// Barbearia: foto em largura total no topo com voltar e informações sobrepostas, trabalhos da
// equipe em galeria horizontal, abas Serviços e Profissionais (cards com foto, preço e Agendar)
// e a barra de navegação inferior fixa.

import { useState } from "react";
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { BarbershopHero, ProfessionalCard, ServiceCard } from "@/view/components/barbershopDetail";
import { Button } from "@/view/components/button";
import { formatDuration, formatPhone, formatPrice } from "@/view/components/format";
import { SectionHeader } from "@/view/components/home";
import { Icon } from "@/view/components/icon";
import { MainTabBar } from "@/view/components/mainTabBar";
import { ScreenState } from "@/view/components/screenState";
import { SegmentedButton } from "@/view/components/segmentedButton";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import { useDetalheBarbeariaViewModel } from "@/viewmodel/useDetalheBarbeariaViewModel";
import { useTabBarViewModel } from "@/viewmodel/useTabBarViewModel";

const DetalheBarbearia = () => {
  const [state, actions] = useDetalheBarbeariaViewModel();
  const tabs = useTabBarViewModel("inicio", undefined, false);
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const detalhe = state.status === "content" ? state.detail : null;
  const escolhido = state.selectedProfessional;
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  // A faixa atrás da barra de status só aparece quando o conteúdo passa por baixo dela.
  const limiteFaixa = height * componentSizes.barbershopDetail.heroRatio - insets.top * 2;
  const [faixa, setFaixa] = useState(false);

  const aviso = (texto: string) => (
    <View style={{ padding: spacing.xl, borderRadius: theme.shapes.large, backgroundColor: colors.surfaceContainer }}>
      <Typography variant="bodyMedium" color="onSurfaceVariant" align="center">
        {texto}
      </Typography>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {!detalhe ? (
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <View style={{ padding: spacing.lg }}>
            <Button variant="text" size="xs" onPress={actions.goBack} style={{ alignSelf: "flex-start" }}>
              Voltar
            </Button>
            <ScreenState
              status={state.status}
              loadingLabel="Carregando barbearia"
              errorMessage={state.errorMessage}
              onRetry={actions.retry}
              emptyTitle="Barbearia não encontrada"
            />
          </View>
        </SafeAreaView>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: spacing.huge, gap: spacing.xxl }}
          scrollEventThrottle={16}
          onScroll={(e) => {
            const passou = e.nativeEvent.contentOffset.y > limiteFaixa;
            if (passou !== faixa) setFaixa(passou);
          }}
        >
          <BarbershopHero
            name={detalhe.barbershop.name}
            imageUrl={detalhe.barbershop.avatarUrl}
            address={detalhe.barbershop.address}
            hoursLabel={
              detalhe.hoursToday ? `${detalhe.hoursToday.openTime} às ${detalhe.hoursToday.closeTime}` : "Fechada hoje"
            }
            openNow={detalhe.openNow}
            phone={detalhe.barbershop.phone ? formatPhone(detalhe.barbershop.phone) : ""}
            rating={null}
            reviewCount={null}
            onBack={actions.goBack}
          />

          {/* Trabalhos da equipe */}
          <View style={{ gap: spacing.sm }}>
            <SectionHeader
              title="Trabalhos da equipe"
              onSeeAll={state.photos.length > 0 ? actions.openAllPhotos : undefined}
              seeAllText="Ver todos"
              seeAllLabel="Ver todos os trabalhos da equipe"
            />
            {state.photos.length === 0 ? (
              <View style={{ paddingHorizontal: spacing.lg }}>{aviso("A equipe ainda não publicou trabalhos.")}</View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
              >
                {state.photos.map((foto) => (
                  <Pressable
                    key={foto.id}
                    onPress={() => actions.openPhoto(foto)}
                    accessibilityRole="button"
                    accessibilityLabel={`${foto.caption ?? "Corte"}, por ${foto.professionalName}`}
                    accessibilityHint="Abre a foto ampliada"
                    style={({ pressed }) => ({ opacity: pressed ? 1 - theme.state.pressed : 1 })}
                  >
                    <Thumbnail
                      uri={foto.imageUrl}
                      label={foto.caption ?? "Corte"}
                      width={componentSizes.barbershopDetail.workWidth}
                      height={componentSizes.barbershopDetail.workHeight}
                      radius={theme.shapes.large}
                    />
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Serviços | Profissionais */}
          <View style={{ paddingHorizontal: spacing.lg, gap: spacing.md }}>
            <SegmentedButton
              accessibilityLabel="Mostrar da barbearia"
              segments={[
                { value: "servicos", label: "Serviços" },
                { value: "profissionais", label: "Profissionais" },
              ]}
              selected={state.tab}
              onSelect={actions.setTab}
            />

            {state.tab === "servicos" ? (
              <>
                {escolhido ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.sm,
                      paddingLeft: spacing.md,
                      borderRadius: theme.shapes.medium,
                      backgroundColor: colors.secondaryContainer,
                    }}
                  >
                    <Icon name="person" size={spacing.xl} color={colors.onSecondaryContainer} />
                    <Typography variant="bodyMedium" color="onSecondaryContainer" style={{ flex: 1 }}>
                      Agendando com <Typography variant="bodyMedium" weight="700" color="onSecondaryContainer">{escolhido.name}</Typography>
                    </Typography>
                    <Button variant="text" size="xs" onPress={actions.clearProfessional} accessibilityLabel="Trocar profissional">
                      Trocar
                    </Button>
                  </View>
                ) : null}
                {detalhe.services.length === 0
                  ? aviso("Esta barbearia ainda não cadastrou serviços.")
                  : detalhe.services.map((s) => (
                      <ServiceCard
                        key={s.id}
                        name={s.name}
                        duration={formatDuration(s.durationMinutes)}
                        description={s.description}
                        price={formatPrice(s.price)}
                        imageUrl={s.imageUrl}
                        onBook={() => actions.book(s.id)}
                      />
                    ))}
              </>
            ) : detalhe.professionals.length === 0 ? (
              aviso("Nenhum profissional vinculado ainda.")
            ) : (
              detalhe.professionals.map((p) => (
                <ProfessionalCard
                  key={p.id}
                  name={p.name}
                  specialty={p.specialty}
                  avatarUrl={p.avatarUrl}
                  selected={escolhido?.id === p.id}
                  onSelect={() => actions.selectProfessional(p)}
                  onOpen={() => actions.openBarber(p)}
                />
              ))
            )}
          </View>
        </ScrollView>
      )}

      {/* Faixa atrás da barra de status: ao rolar, o conteúdo não passa sob o relógio. */}
      {detalhe && faixa ? (
        <View
          pointerEvents="none"
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: insets.top, backgroundColor: colors.primary }}
        />
      ) : null}

      <MainTabBar active={tabs[0].active} tabs={tabs[0].tabs} onNavigate={tabs[1].navigate} />
    </View>
  );
};

export default DetalheBarbearia;
