// Login (padrão 1 de 05-padroes.md): marca, e-mail, senha com mostrar/esconder, link para
// recuperar a senha, botão Entrar e link para criar conta.

import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/view/components/button";
import { Icon } from "@/view/components/icon";
import { PasswordField } from "@/view/components/passwordField";
import { TextField } from "@/view/components/textField";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import { useLoginViewModel } from "@/viewmodel/useLoginViewModel";

const Login = () => {
  const [state, actions] = useLoginViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: spacing.lg, gap: spacing.lg }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: "center", gap: spacing.sm, paddingTop: spacing.giant, paddingBottom: spacing.xl }}>
            <View
              style={{
                width: componentSizes.avatar.large * 0.5,
                height: componentSizes.avatar.large * 0.5,
                borderRadius: theme.shapes.full,
                backgroundColor: colors.primaryContainer,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="scissors" size={spacing.xxl} color={colors.onPrimaryContainer} />
            </View>
            <Typography variant="headlineMedium" weight="700" color="primary" accessibilityRole="header">
              barberAgenda
            </Typography>
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              Seu estilo no horário certo
            </Typography>
          </View>

          <TextField
            label="E-mail"
            value={state.form.email}
            onChangeText={(t) => actions.setField("email", t)}
            errorText={state.fieldErrors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
          />
          <PasswordField
            label="Senha"
            value={state.form.password}
            onChangeText={(t) => actions.setField("password", t)}
            errorText={state.fieldErrors.password}
            autoComplete="current-password"
            textContentType="password"
            onSubmitEditing={actions.submit}
          />

          <View style={{ alignItems: "flex-end" }}>
            <Button variant="text" size="xs" onPress={actions.goRecoverPassword}>
              Esqueceu a senha?
            </Button>
          </View>

          {state.errorMessage ? (
            <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
              {state.errorMessage}
            </Typography>
          ) : null}

          <Button variant="filled" size="medium" fullWidth onPress={actions.submit} disabled={state.loading}>
            {state.loading ? "Entrando..." : "Entrar"}
          </Button>

          <View style={{ flex: 1 }} />

          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: spacing.xs }}>
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              Não tem uma conta?
            </Typography>
            <Pressable
              onPress={actions.goRegister}
              accessibilityRole="link"
              accessibilityLabel="Criar conta"
              style={{ minHeight: componentSizes.touchTarget, justifyContent: "center" }}
            >
              <Typography variant="labelLarge" weight="700" color="primary">
                Criar conta
              </Typography>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
