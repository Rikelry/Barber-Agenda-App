// Meu perfil: foto, nome e "membro desde", dados pessoais (e-mail só leitura), troca de senha,
// salvar alterações e a barra de navegação inferior. Usa os componentes de src/design-system.

import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Avatar,
  Button,
  Card,
  Icon,
  IconButton,
  TabBar,
  TextField,
  Typography,
  useDesignSystem,
} from "@/design-system";
import { usePerfilViewModel } from "@/viewmodel/usePerfilViewModel";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const membroDesde = (data: Date) => `Membro desde ${MESES[data.getMonth()]} ${data.getFullYear()}`;

const Perfil = () => {
  const [state, actions] = usePerfilViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const { user, form, fieldErrors } = state;

  const tituloSecao = (texto: string) => (
    <Typography variant="labelLarge" color="primary" accessibilityRole="header">
      {texto.toUpperCase()}
    </Typography>
  );

  const olho = (visivel: boolean, alternar: () => void, campo: string) => (
    <IconButton
      accessibilityLabel={visivel ? `Esconder ${campo}` : `Mostrar ${campo}`}
      onPress={alternar}
      icon={(cor) => <Icon name={visivel ? "close" : "👁"} color={cor} />}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
          keyboardShouldPersistTaps="handled"
        >
          <Typography variant="titleLarge" accessibilityRole="header" style={{ paddingVertical: spacing.sm }}>
            Meu perfil
          </Typography>

          {state.status === "loading" && (
            <View
              accessible
              accessibilityLabel="Carregando perfil"
              style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.xxxl }}
            >
              <ActivityIndicator color={colors.primary} />
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                Carregando perfil...
              </Typography>
            </View>
          )}

          {state.status === "error" && (
            <View style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.xxxl }}>
              <Typography variant="titleMedium" color="error" align="center">
                Não foi possível carregar o perfil
              </Typography>
              <Typography variant="bodyMedium" color="onSurfaceVariant" align="center">
                {state.errorMessage}
              </Typography>
              <Button variant="tonal" onPress={actions.retry}>
                Tentar de novo
              </Button>
            </View>
          )}

          {state.status === "content" && user && (
            <>
              <View style={{ alignItems: "center", gap: spacing.sm }}>
                <Avatar name={user.name} uri={user.avatarUrl} size="large" outlined />
                <Typography variant="titleLarge" weight="700" align="center">
                  {user.name}
                </Typography>
                <Typography variant="bodyMedium" color="onSurfaceVariant" align="center">
                  {membroDesde(user.memberSince)}
                </Typography>
              </View>

              <Card variant="filled" style={{ gap: spacing.lg }}>
                {tituloSecao("Dados pessoais")}
                <TextField
                  labelBackgroundColor={colors.surfaceContainerHighest}
                  label="Nome completo"
                  value={form.name}
                  onChangeText={(t) => actions.setField("name", t)}
                  errorText={fieldErrors.name}
                  autoComplete="name"
                  textContentType="name"
                />
                <TextField
                  labelBackgroundColor={colors.surfaceContainerHighest}
                  label="Telefone celular"
                  value={form.phone}
                  onChangeText={(t) => actions.setField("phone", t)}
                  errorText={fieldErrors.phone}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                />
                <TextField
                  labelBackgroundColor={colors.surfaceContainerHighest}
                  label="E-mail (somente leitura)"
                  value={user.email}
                  disabled
                />
              </Card>

              <Card variant="filled" style={{ gap: spacing.lg }}>
                {tituloSecao("Trocar senha")}
                <TextField
                  labelBackgroundColor={colors.surfaceContainerHighest}
                  label="Senha atual"
                  value={form.currentPassword}
                  onChangeText={(t) => actions.setField("currentPassword", t)}
                  errorText={fieldErrors.currentPassword}
                  secureTextEntry={!state.showCurrentPassword}
                  autoComplete="current-password"
                  textContentType="password"
                  trailingIcon={olho(state.showCurrentPassword, actions.toggleShowCurrentPassword, "senha atual")}
                />
                <TextField
                  labelBackgroundColor={colors.surfaceContainerHighest}
                  label="Nova senha"
                  placeholder="Digite a nova senha"
                  labelAlwaysFloating
                  value={form.newPassword}
                  onChangeText={(t) => actions.setField("newPassword", t)}
                  errorText={fieldErrors.newPassword}
                  supportingText="Deixe em branco para manter a senha atual."
                  secureTextEntry={!state.showNewPassword}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  trailingIcon={olho(state.showNewPassword, actions.toggleShowNewPassword, "nova senha")}
                />
              </Card>

              {state.errorMessage ? (
                <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
                  {state.errorMessage}
                </Typography>
              ) : null}
              {state.successMessage ? (
                <Typography variant="bodyMedium" color="primary" accessibilityLiveRegion="polite">
                  {state.successMessage}
                </Typography>
              ) : null}

              <Button variant="filled" size="medium" fullWidth onPress={actions.save} disabled={state.saving}>
                {state.saving ? "Salvando..." : "Salvar alterações"}
              </Button>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <TabBar
        items={[
          { key: "inicio", label: "Início", icon: "⌂", onPress: actions.goHome },
          { key: "buscar", label: "Buscar", icon: "search", onPress: actions.goSearch },
          { key: "agendas", label: "Agendas", icon: "calendar", disabled: true },
          { key: "perfil", label: "Perfil", icon: "person", selected: true },
        ]}
      />
    </SafeAreaView>
  );
};

export default Perfil;
