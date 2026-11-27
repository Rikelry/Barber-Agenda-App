// Editar barbearia: foto, dados e endereço completo (padrão 5 de 05-padroes.md). Horários,
// profissionais e serviços ficam no Perfil (Minha barbearia); a agenda, na Gestão.

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BarbershopFields } from "@/view/components/barbershopFields";
import { Button } from "@/view/components/button";
import { FormScreen } from "@/view/components/formScreen";
import { PhotoPicker } from "@/view/components/photoPicker";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { useEditarBarbeariaViewModel } from "@/viewmodel/useEditarBarbeariaViewModel";

const EditarBarbearia = () => {
  const [state, actions] = useEditarBarbeariaViewModel();
  const { theme } = useDesignSystem();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScreenHeader title="Editar barbearia" onBack={actions.goBack} />
      {state.status !== "content" ? (
        <View style={{ padding: theme.spacing.lg }}>
          <ScreenState
            status={state.status}
            loadingLabel="Carregando barbearia"
            errorMessage={state.errorMessage}
            onRetry={actions.retry}
            emptyTitle=""
          />
        </View>
      ) : (
        <FormScreen
          footer={
            <>
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
          }
        >
          <PhotoPicker
            uri={state.logoUri}
            label="Foto da barbearia"
            onPick={actions.pickLogo}
            title={state.form.name.trim()}
            subtitle="Toque na foto para trocar"
          />
          <BarbershopFields values={state.form} errors={state.fieldErrors} onChange={actions.setField} full />
        </FormScreen>
      )}
    </SafeAreaView>
  );
};

export default EditarBarbearia;
