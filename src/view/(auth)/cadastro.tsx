// Criar conta (canvas de telas): passo 1 escolhe como vai usar o app, passo 2 dados pessoais e,
// para quem tem barbearia, passo 3 com os dados dela.

import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BarbershopFields } from "@/view/components/barbershopFields";
import { Button } from "@/view/components/button";
import { FormScreen } from "@/view/components/formScreen";
import { Icon } from "@/view/components/icon";
import { PasswordField } from "@/view/components/passwordField";
import { PhotoPicker } from "@/view/components/photoPicker";
import { ScreenHeader } from "@/view/components/screenHeader";
import { StepProgress } from "@/view/components/stepProgress";
import { TextField } from "@/view/components/textField";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import { useCadastroViewModel, type CadastroTipoConta } from "@/viewmodel/useCadastroViewModel";

const Cadastro = () => {
  const [state, actions] = useCadastroViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const { form, fieldErrors } = state;
  const numero = state.step === "tipo" ? 1 : state.step === "dados" ? 2 : 3;

  const erro = state.errorMessage ? (
    <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
      {state.errorMessage}
    </Typography>
  ) : null;

  const opcao = (tipo: CadastroTipoConta, icone: string, titulo: string, texto: string) => {
    const ativa = state.accountType === tipo;
    return (
      <Pressable
        onPress={() => actions.setAccountType(tipo)}
        accessibilityRole="radio"
        accessibilityLabel={`${titulo}. ${texto}`}
        accessibilityState={{ checked: ativa }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.lg,
          padding: spacing.lg,
          borderRadius: theme.shapes.large,
          borderWidth: ativa ? 2 : 1,
          borderColor: ativa ? colors.primary : colors.outlineVariant,
          backgroundColor: ativa ? colors.surfaceContainer : colors.surface,
        }}
      >
        <View
          style={{
            width: componentSizes.avatar.medium,
            height: componentSizes.avatar.medium,
            borderRadius: theme.shapes.medium,
            backgroundColor: colors.primaryContainer,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={icone} color={colors.onPrimaryContainer} />
        </View>
        <View style={{ flex: 1, gap: spacing.xs / 2 }}>
          <Typography variant="titleMedium" weight="700">
            {titulo}
          </Typography>
          <Typography variant="bodyMedium" color="onSurfaceVariant">
            {texto}
          </Typography>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={state.step === "barbearia" ? "Sua barbearia" : "Criar conta"} onBack={actions.goBack} />
      <StepProgress current={numero} total={state.totalSteps} />

      {state.step === "tipo" && (
        <FormScreen
          footer={
            <Button variant="filled" size="medium" fullWidth onPress={actions.next}>
              Continuar
            </Button>
          }
        >
          <Typography variant="titleLarge" weight="500" accessibilityRole="header">
            Como você vai usar o app?
          </Typography>
          <View accessibilityRole="radiogroup" style={{ gap: spacing.lg }}>
            {opcao("cliente", "calendar", "Quero agendar", "Encontre barbearias e marque horários.")}
            {opcao("dono", "store", "Tenho uma barbearia", "Cadastre sua barbearia e receba agendamentos.")}
          </View>
          <Typography variant="bodyMedium" color="onSurfaceVariant">
            Você também pode cadastrar sua barbearia depois, pelo Perfil.
          </Typography>
        </FormScreen>
      )}

      {state.step === "dados" && (
        <FormScreen
          footer={
            <>
              {erro}
              <Button variant="filled" size="medium" fullWidth onPress={actions.submit} disabled={state.loading}>
                {state.loading ? "Criando conta..." : state.accountType === "dono" ? "Continuar" : "Criar conta"}
              </Button>
            </>
          }
        >
          <Typography variant="titleLarge" weight="500" accessibilityRole="header">
            Seus dados
          </Typography>
          <TextField
            label="Nome completo"
            placeholder="Ex: Lucas Silva"
            value={form.name}
            onChangeText={(t) => actions.setField("name", t)}
            errorText={fieldErrors.name}
            autoComplete="name"
            textContentType="name"
          />
          <TextField
            label="E-mail"
            placeholder="Ex: seuemail@provedor.com"
            value={form.email}
            onChangeText={(t) => actions.setField("email", t)}
            errorText={fieldErrors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
          />
          <TextField
            label="Telefone celular"
            placeholder="Ex: (86) 99999-9999"
            value={form.phone}
            onChangeText={(t) => actions.setField("phone", t)}
            errorText={fieldErrors.phone}
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
          />
          <PasswordField
            label="Senha"
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
            value={form.confirmPassword}
            onChangeText={(t) => actions.setField("confirmPassword", t)}
            errorText={fieldErrors.confirmPassword}
            autoComplete="new-password"
            textContentType="newPassword"
            onSubmitEditing={actions.submit}
          />
        </FormScreen>
      )}

      {state.step === "barbearia" && (
        <FormScreen
          footer={
            <>
              {erro}
              <Button variant="filled" size="medium" fullWidth onPress={actions.submitBarbershop} disabled={state.loading}>
                {state.loading ? "Cadastrando..." : "Cadastrar barbearia"}
              </Button>
              <Button variant="text" size="medium" fullWidth onPress={actions.skipBarbershop}>
                Fazer depois
              </Button>
            </>
          }
        >
          <Typography variant="bodyMedium" color="onSurfaceVariant">
            Sua conta foi criada. Agora, os dados da barbearia.
          </Typography>
          <PhotoPicker uri={state.logoUri} label="Adicionar foto da barbearia" onPick={actions.pickLogo} />
          <BarbershopFields values={state.barbershop} errors={state.barbershopErrors} onChange={actions.setBarbershopField} />
        </FormScreen>
      )}
    </SafeAreaView>
  );
};

export default Cadastro;
