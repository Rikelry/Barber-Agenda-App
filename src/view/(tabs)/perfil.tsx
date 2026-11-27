// Perfil: central da conta no formato do menu da conta Google (Material 3). Identificação no
// topo (foto, nome, "membro desde" e as etiquetas dos papéis reais), CONTA (Dados pessoais),
// TRABALHO (para profissionais), MINHA BARBEARIA (para donos; para os demais, o convite para
// cadastrar uma) e Sair da conta com confirmação no fim. A agenda fica na aba Trabalho.

import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar } from "@/view/components/avatar";
import { Button } from "@/view/components/button";
import { Icon } from "@/view/components/icon";
import { MainTabBar } from "@/view/components/mainTabBar";
import { ProfileBarbershopCard, ProfileMenuItem, ProfileSection } from "@/view/components/profileMenu";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { usePerfilViewModel } from "@/viewmodel/usePerfilViewModel";
import { useTabBarViewModel } from "@/viewmodel/useTabBarViewModel";

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const membroDesde = (data: Date) => `Membro desde ${MESES[data.getMonth()]} ${data.getFullYear()}`;

/** Etiqueta de cada papel, na ordem em que aparecem. */
const PAPEIS = [
  { role: "cliente", label: "Cliente", icon: "person" },
  { role: "profissional", label: "Profissional", icon: "scissors" },
  { role: "owner", label: "Dono", icon: "store" },
] as const;

const Perfil = () => {
  const [state, actions] = usePerfilViewModel();
  const tabs = useTabBarViewModel("perfil");
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const { user } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.huge, gap: spacing.xxl }}>
        {state.status !== "content" || !user ? (
          <ScreenState
            status={state.status === "content" ? "error" : state.status}
            loadingLabel="Carregando perfil"
            errorMessage={state.errorMessage}
            onRetry={actions.retry}
            emptyTitle=""
          />
        ) : (
          <>
            {/* Identificação */}
            <View style={{ alignItems: "center", gap: spacing.sm, paddingTop: spacing.sm }}>
              <Avatar name={user.name} uri={user.avatarUrl} size="large" />
              <Typography variant="headlineSmall" weight="500" align="center" accessibilityRole="header">
                {user.name}
              </Typography>
              <Typography variant="bodyMedium" color="onSurfaceVariant" align="center">
                {membroDesde(user.memberSince)}
              </Typography>
              <View
                accessible
                accessibilityLabel={`Funções: ${PAPEIS.filter((p) => state.roles.includes(p.role)).map((p) => p.label).join(", ")}`}
                style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: spacing.sm, paddingTop: spacing.xs }}
              >
                {PAPEIS.filter((p) => state.roles.includes(p.role)).map((p) => (
                  <View
                    key={p.role}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.xs + spacing.xs / 2,
                      paddingLeft: spacing.sm,
                      paddingRight: spacing.md,
                      paddingVertical: spacing.xs + spacing.xs / 2,
                      borderRadius: theme.shapes.small,
                      backgroundColor: colors.secondaryContainer,
                    }}
                  >
                    <Icon name={p.icon} size={spacing.lg + spacing.xs / 2} color={colors.onSecondaryContainer} />
                    <Typography variant="labelLarge" color="onSecondaryContainer">
                      {p.label}
                    </Typography>
                  </View>
                ))}
              </View>
            </View>

            {/* Conta */}
            <ProfileSection title="Conta">
              <ProfileMenuItem
                icon="person"
                title="Dados pessoais"
                description="Nome, telefone e e-mail"
                onPress={actions.openPersonalData}
              />
            </ProfileSection>

            {/* Trabalho (profissionais) */}
            {state.isProfessional ? (
              <ProfileSection title="Trabalho">
                <ProfileMenuItem
                  icon="badge"
                  title="Meu perfil profissional"
                  description="Especialidade, barbearia e informações profissionais"
                  onPress={actions.openWorkplace}
                />
                <ProfileMenuItem icon="photos" title="Meu portfólio" description="Fotos dos seus cortes" onPress={actions.openPortfolio} />
              </ProfileSection>
            ) : null}

            {/* Minha barbearia (donos); quem não é dono vê o convite */}
            {state.isOwner ? (
              <View style={{ gap: spacing.md }}>
                {state.barbershop ? (
                  <View style={{ gap: spacing.sm }}>
                    <Typography
                      variant="labelLarge"
                      weight="700"
                      color="secondary"
                      accessibilityRole="header"
                      style={{ paddingHorizontal: spacing.xs, letterSpacing: 0.8 }}
                    >
                      MINHA BARBEARIA
                    </Typography>
                    <ProfileBarbershopCard
                      name={state.barbershop.name}
                      imageUrl={state.barbershop.avatarUrl}
                      onPress={actions.openBarbershop}
                    />
                  </View>
                ) : null}
                <ProfileSection title={state.barbershop ? undefined : "Minha barbearia"}>
                  <ProfileMenuItem
                    icon="store"
                    title="Informações da barbearia"
                    description="Nome, telefone, endereço e fotografia"
                    onPress={actions.openBarbershop}
                  />
                  <ProfileMenuItem
                    icon="clock"
                    title="Horário de funcionamento"
                    description="Configure os dias e horários de atendimento"
                    onPress={actions.openHours}
                  />
                  <ProfileMenuItem
                    icon="group"
                    title="Profissionais"
                    description="Gerencie os profissionais da sua barbearia"
                    onPress={actions.openProfessionals}
                  />
                  <ProfileMenuItem
                    icon="scissors"
                    title="Serviços"
                    description="Gerencie cortes, preços, duração e imagens"
                    onPress={actions.openServices}
                  />
                </ProfileSection>
                {state.otherBarbershops > 0 ? (
                  <Typography variant="bodySmall" color="onSurfaceVariant" style={{ paddingHorizontal: spacing.xs }}>
                    {state.otherBarbershops === 1
                      ? "Você tem mais 1 barbearia. A agenda dela fica na aba Trabalho."
                      : `Você tem mais ${state.otherBarbershops} barbearias. A agenda delas fica na aba Trabalho.`}
                  </Typography>
                ) : null}
              </View>
            ) : (
              <ProfileSection title="Minha barbearia">
                <ProfileMenuItem
                  icon="store"
                  title="Cadastrar minha barbearia"
                  description="Receba agendamentos pelo app"
                  onPress={actions.registerBarbershop}
                />
              </ProfileSection>
            )}

            {/* Sair da conta */}
            <View style={{ gap: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.outlineVariant }}>
              {state.confirmingLogout ? (
                <View
                  accessibilityLiveRegion="polite"
                  style={{ gap: spacing.md, padding: spacing.lg, borderRadius: theme.shapes.extraLarge, backgroundColor: colors.surfaceContainer }}
                >
                  <Typography variant="titleMedium" weight="700">
                    Sair da conta?
                  </Typography>
                  <Typography variant="bodyMedium" color="onSurfaceVariant">
                    Você vai precisar entrar de novo com e-mail e senha.
                  </Typography>
                  <View style={{ flexDirection: "row", gap: spacing.sm }}>
                    <Button variant="text" size="small" style={{ flex: 1 }} onPress={actions.dismissLogout}>
                      Cancelar
                    </Button>
                    <Button
                      variant="filled"
                      size="small"
                      style={{ flex: 1, backgroundColor: colors.error }}
                      onPress={actions.logout}
                      accessibilityLabel="Confirmar sair da conta"
                    >
                      <Typography variant="labelLarge" color="onError">
                        Sair
                      </Typography>
                    </Button>
                  </View>
                </View>
              ) : (
                <View style={{ borderRadius: theme.shapes.extraLarge, overflow: "hidden" }}>
                  <ProfileMenuItem icon="logout" title="Sair da conta" onPress={actions.askLogout} destructive />
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      <MainTabBar active={tabs[0].active} tabs={tabs[0].tabs} onNavigate={tabs[1].navigate} />
    </SafeAreaView>
  );
};

export default Perfil;
