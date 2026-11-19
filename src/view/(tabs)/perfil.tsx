// Perfil (canvas de telas): foto, nome, "membro desde" e papéis; menu com Dados pessoais e
// Trocar senha, a área de trabalho de quem é profissional, "Cadastrar minha barbearia" para
// quem ainda não é dono e Sair da conta.

import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar } from "@/view/components/avatar";
import { Icon } from "@/view/components/icon";
import { MainTabBar } from "@/view/components/mainTabBar";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import { usePerfilViewModel } from "@/viewmodel/usePerfilViewModel";
import { useTabBarViewModel } from "@/viewmodel/useTabBarViewModel";

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const membroDesde = (data: Date) => `Membro desde ${MESES[data.getMonth()]} ${data.getFullYear()}`;

const Perfil = () => {
  const [state, actions] = usePerfilViewModel();
  const tabs = useTabBarViewModel("perfil");
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const { user } = state;

  const secao = (texto: string) => (
    <Typography
      variant="labelSmall"
      weight="700"
      color="primary"
      accessibilityRole="header"
      style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, letterSpacing: 0.5 }}
    >
      {texto.toUpperCase()}
    </Typography>
  );

  const item = (icone: string, titulo: string, onPress: () => void, subtitulo?: string, perigo = false) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={subtitulo ? `${titulo}, ${subtitulo}` : titulo}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.lg,
        minHeight: componentSizes.listItem.twoLine,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.outlineVariant,
        backgroundColor: pressed ? colors.surfaceContainer : "transparent",
      })}
    >
      <Icon name={icone} color={perigo ? colors.error : colors.primary} />
      <View style={{ flex: 1 }}>
        <Typography variant="bodyLarge" color={perigo ? "error" : "onSurface"}>
          {titulo}
        </Typography>
        {subtitulo ? (
          <Typography variant="bodyMedium" color="onSurfaceVariant">
            {subtitulo}
          </Typography>
        ) : null}
      </View>
      {perigo ? null : <Icon name="chevronRight" size={spacing.xl} color={colors.onSurfaceVariant} />}
    </Pressable>
  );

  const selo = (texto: string, destaque: boolean) => (
    <View
      key={texto}
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: theme.shapes.extraSmall,
        backgroundColor: destaque ? colors.primaryContainer : colors.surfaceDim,
      }}
    >
      <Typography variant="labelSmall" weight="700" style={{ color: destaque ? colors.onPrimaryContainer : colors.primary }}>
        {texto}
      </Typography>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {state.status !== "content" || !user ? (
          <View style={{ padding: spacing.lg }}>
            <ScreenState
              status={state.status === "content" ? "error" : state.status}
              loadingLabel="Carregando perfil"
              errorMessage={state.errorMessage}
              onRetry={actions.retry}
              emptyTitle=""
            />
          </View>
        ) : (
          <>
            <View style={{ alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.lg }}>
              <Avatar name={user.name} uri={user.avatarUrl} size="large" />
              <Typography variant="titleLarge" weight="500" align="center">
                {user.name}
              </Typography>
              <Typography variant="bodyMedium" color="onSurfaceVariant" align="center">
                {membroDesde(user.memberSince)}
              </Typography>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                {selo("Cliente", true)}
                {state.isProfessional ? selo("Profissional", false) : null}
                {state.isOwner ? selo("Dono", false) : null}
              </View>
            </View>

            {secao("Conta")}
            {item("person", "Dados pessoais", actions.openPersonalData, "Nome, telefone e e-mail")}
            {item("lock", "Trocar senha", actions.openChangePassword)}

            {state.isProfessional || !state.isOwner ? secao("Trabalho") : null}
            {state.isProfessional
              ? item("scissors", "Meu perfil profissional", actions.openWorkplace, "Especialidade, barbearia e horário")
              : null}
            {state.isOwner ? null : item("store", "Cadastrar minha barbearia", actions.registerBarbershop, "Receba agendamentos pelo app")}

            <View style={{ height: spacing.lg }} />
            {item("logout", "Sair da conta", actions.logout, undefined, true)}
          </>
        )}
      </ScrollView>

      <MainTabBar active={tabs[0].active} tabs={tabs[0].tabs} onNavigate={tabs[1].navigate} />
    </SafeAreaView>
  );
};

export default Perfil;
