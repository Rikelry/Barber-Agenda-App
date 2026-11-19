// Redefinir senha (padrão 3 de 05-padroes.md): nova senha e confirmação, a partir do link
// recebido por e-mail.

import { View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/view/components/button";
import { FormScreen } from "@/view/components/formScreen";
import { ScreenHeader } from "@/view/components/screenHeader";
import { PasswordField } from "@/view/components/passwordField";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { useRedefinirSenhaViewModel } from "@/viewmodel/useRedefinirSenhaViewModel";

const RedefinirSenha = () => {
  const [state, actions] = useRedefinirSenhaViewModel();
  const { theme } = useDesignSystem();
  const { spacing } = theme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
    <ScreenHeader title="Redefinir senha" onBack={actions.goLogin} />
    <FormScreen
      footer={
        <>
          {state.errorMessage ? (
            <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
              {state.errorMessage}
            </Typography>
          ) : null}
          {state.done ? (
            <Button variant="filled" size="medium" fullWidth onPress={actions.goLogin}>
              Entrar com a nova senha
            </Button>
          ) : (
            <Button variant="filled" size="medium" fullWidth onPress={actions.submit} disabled={state.loading}>
              {state.loading ? "Redefinindo..." : "Redefinir"}
            </Button>
          )}
        </>
      }
    >
      {state.done ? (
        <View style={{ gap: spacing.sm }} accessibilityLiveRegion="polite">
          <Typography variant="titleMedium" weight="700" accessibilityRole="header">
            Senha redefinida
          </Typography>
          <Typography variant="bodyMedium" color="onSurfaceVariant">
            Sua senha foi trocada. Entre com a nova senha para continuar.
          </Typography>
        </View>
      ) : (
        <>
          <View style={{ gap: spacing.sm }}>
            <Typography variant="titleMedium" weight="700" accessibilityRole="header">
              Defina sua nova senha
            </Typography>
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              Escolha uma combinação segura de pelo menos 8 caracteres com letras e números.
            </Typography>
          </View>
          <PasswordField
            label="Nova senha"
            fieldName="nova senha"
            placeholder="Mínimo de 8 caracteres"
            value={state.form.newPassword}
            onChangeText={(t) => actions.setField("newPassword", t)}
            errorText={state.fieldErrors.newPassword}
            autoComplete="new-password"
            textContentType="newPassword"
          />
          <PasswordField
            label="Confirmar nova senha"
            fieldName="confirmação da senha"
            placeholder="Digite a nova senha novamente"
            value={state.form.confirmPassword}
            onChangeText={(t) => actions.setField("confirmPassword", t)}
            errorText={state.fieldErrors.confirmPassword}
            autoComplete="new-password"
            textContentType="newPassword"
            onSubmitEditing={actions.submit}
          />
        </>
      )}
    </FormScreen>
    </SafeAreaView>
  );
};

export default RedefinirSenha;
