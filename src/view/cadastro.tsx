// Criar conta (padrão 1 de 05-padroes.md): nome, e-mail, telefone, senha e confirmação.

import { Button } from "@/view/components/button";
import { FormScreen } from "@/view/components/formScreen";
import { PasswordField } from "@/view/components/passwordField";
import { TextField } from "@/view/components/textField";
import { Typography } from "@/view/components/typography";
import { useCadastroViewModel } from "@/viewmodel/useCadastroViewModel";

const Cadastro = () => {
  const [state, actions] = useCadastroViewModel();
  const { form, fieldErrors } = state;

  return (
    <FormScreen
      footer={
        <>
          {state.errorMessage ? (
            <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
              {state.errorMessage}
            </Typography>
          ) : null}
          <Button variant="filled" size="medium" fullWidth onPress={actions.submit} disabled={state.loading}>
            {state.loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </>
      }
    >
      <Typography variant="bodyMedium" color="onSurfaceVariant">
        Preencha seus dados para começar a agendar.
      </Typography>
      <TextField
        label="Nome completo"
        placeholder="Ex: Lucas Silva"
        labelAlwaysFloating
        value={form.name}
        onChangeText={(t) => actions.setField("name", t)}
        errorText={fieldErrors.name}
        autoComplete="name"
        textContentType="name"
      />
      <TextField
        label="E-mail"
        placeholder="Ex: seuemail@provedor.com"
        labelAlwaysFloating
        value={form.email}
        onChangeText={(t) => actions.setField("email", t)}
        errorText={fieldErrors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <TextField
        label="Telefone"
        placeholder="Ex: (11) 99999-9999"
        labelAlwaysFloating
        value={form.phone}
        onChangeText={(t) => actions.setField("phone", t)}
        errorText={fieldErrors.phone}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
      />
      <PasswordField
        label="Senha"
        placeholder="Crie uma senha forte"
        labelAlwaysFloating
        value={form.password}
        onChangeText={(t) => actions.setField("password", t)}
        errorText={fieldErrors.password}
        supportingText={fieldErrors.password ? undefined : "Pelo menos 8 caracteres."}
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <PasswordField
        label="Confirmar senha"
        fieldName="confirmação da senha"
        placeholder="Repita a senha criada"
        labelAlwaysFloating
        value={form.confirmPassword}
        onChangeText={(t) => actions.setField("confirmPassword", t)}
        errorText={fieldErrors.confirmPassword}
        autoComplete="new-password"
        textContentType="newPassword"
        onSubmitEditing={actions.submit}
      />
    </FormScreen>
  );
};

export default Cadastro;
