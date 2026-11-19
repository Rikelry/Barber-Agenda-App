// Trocar senha (canvas de telas): senha atual, nova senha e Salvar.

import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/view/components/button";
import { PasswordField } from "@/view/components/passwordField";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { usePerfilViewModel } from "@/viewmodel/usePerfilViewModel";

const TrocarSenha = () => {
  const [state, actions] = usePerfilViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Trocar senha" onBack={actions.goBack} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {state.status !== "content" ? (
          <View style={{ padding: spacing.lg }}>
            <ScreenState
              status={state.status}
              loadingLabel="Carregando"
              errorMessage={state.errorMessage}
              onRetry={actions.retry}
              emptyTitle=""
            />
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: spacing.lg, gap: spacing.md }} keyboardShouldPersistTaps="handled">
            <PasswordField
              label="Senha atual"
              fieldName="senha atual"
              value={state.form.currentPassword}
              onChangeText={(t) => actions.setField("currentPassword", t)}
              errorText={state.fieldErrors.currentPassword}
              autoComplete="current-password"
              textContentType="password"
            />
            <PasswordField
              label="Nova senha"
              fieldName="nova senha"
              value={state.form.newPassword}
              onChangeText={(t) => actions.setField("newPassword", t)}
              errorText={state.fieldErrors.newPassword}
              supportingText="Mínimo de 8 caracteres."
              autoComplete="new-password"
              textContentType="newPassword"
              onSubmitEditing={actions.save}
            />

            <View style={{ flex: 1 }} />
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
              {state.saving ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TrocarSenha;
