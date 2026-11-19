// Recuperar senha (padrão 3 de 05-padroes.md): pede o e-mail e envia o link de redefinição.

import { View } from "react-native";

import { Button } from "@/view/components/button";
import { FormScreen } from "@/view/components/formScreen";
import { Icon } from "@/view/components/icon";
import { TextField } from "@/view/components/textField";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import { useRecuperarSenhaViewModel } from "@/viewmodel/useRecuperarSenhaViewModel";

const RecuperarSenha = () => {
  const [state, actions] = useRecuperarSenhaViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;

  return (
    <FormScreen
      footer={
        <>
          {state.errorMessage ? (
            <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
              {state.errorMessage}
            </Typography>
          ) : null}
          {state.sent ? (
            <Button variant="filled" size="medium" fullWidth onPress={actions.backToLogin}>
              Voltar para o login
            </Button>
          ) : (
            <Button variant="filled" size="medium" fullWidth onPress={actions.submit} disabled={state.loading}>
              {state.loading ? "Enviando..." : "Enviar link"}
            </Button>
          )}
        </>
      }
    >
      <View style={{ alignItems: "center", paddingVertical: spacing.xxl }}>
        <View
          style={{
            width: componentSizes.avatar.large,
            height: componentSizes.avatar.large,
            borderRadius: theme.shapes.full,
            backgroundColor: colors.primaryContainer,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="lock" size={spacing.huge} color={colors.onPrimaryContainer} />
        </View>
      </View>

      {state.sent ? (
        <View style={{ gap: spacing.sm }} accessibilityLiveRegion="polite">
          <Typography variant="titleMedium" weight="700" accessibilityRole="header">
            Verifique seu e-mail
          </Typography>
          <Typography variant="bodyMedium" color="onSurfaceVariant">
            Se {state.email.trim()} estiver cadastrado, você vai receber um link para criar uma nova senha.
          </Typography>
        </View>
      ) : (
        <>
          <View style={{ gap: spacing.sm }}>
            <Typography variant="titleMedium" weight="700" accessibilityRole="header">
              Esqueceu seus dados de acesso?
            </Typography>
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              Insira o e-mail cadastrado abaixo. Enviaremos um link seguro para você redefinir sua senha de
              acesso.
            </Typography>
          </View>
          <TextField
            label="E-mail"
            placeholder="Digite seu e-mail cadastrado"
            labelAlwaysFloating
            value={state.email}
            onChangeText={actions.setEmail}
            errorText={state.emailError ?? undefined}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            onSubmitEditing={actions.submit}
          />
        </>
      )}
    </FormScreen>
  );
};

export default RecuperarSenha;
