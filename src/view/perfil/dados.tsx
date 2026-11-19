// Dados pessoais (canvas de telas): nome, telefone e e-mail (só leitura) e Salvar.

import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/view/components/button";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { TextField } from "@/view/components/textField";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { usePerfilViewModel } from "@/viewmodel/usePerfilViewModel";

const DadosPessoais = () => {
  const [state, actions] = usePerfilViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Dados pessoais" onBack={actions.goBack} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {state.status !== "content" || !state.user ? (
          <View style={{ padding: spacing.lg }}>
            <ScreenState
              status={state.status === "content" ? "error" : state.status}
              loadingLabel="Carregando seus dados"
              errorMessage={state.errorMessage}
              onRetry={actions.retry}
              emptyTitle=""
            />
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: spacing.lg, gap: spacing.md }} keyboardShouldPersistTaps="handled">
            <TextField
              label="Nome completo"
              value={state.form.name}
              onChangeText={(t) => actions.setField("name", t)}
              errorText={state.fieldErrors.name}
              autoComplete="name"
              textContentType="name"
            />
            <TextField
              label="Telefone celular"
              value={state.form.phone}
              onChangeText={(t) => actions.setField("phone", t)}
              errorText={state.fieldErrors.phone}
              keyboardType="phone-pad"
              autoComplete="tel"
              textContentType="telephoneNumber"
            />
            <TextField label="E-mail" value={state.user.email} disabled supportingText="O e-mail não pode ser alterado." />

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
              {state.saving ? "Salvando..." : "Salvar"}
            </Button>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DadosPessoais;
