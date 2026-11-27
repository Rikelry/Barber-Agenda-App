// Nova barbearia (padrão 8 de 05-padroes.md): foto, nome, telefone e endereço.

import { SafeAreaView } from "react-native-safe-area-context";

import { BarbershopFields } from "@/view/components/barbershopFields";
import { Button } from "@/view/components/button";
import { FormScreen } from "@/view/components/formScreen";
import { PhotoPicker } from "@/view/components/photoPicker";
import { ScreenHeader } from "@/view/components/screenHeader";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { useNovaBarbeariaViewModel } from "@/viewmodel/useNovaBarbeariaViewModel";

const NovaBarbearia = () => {
  const [state, actions] = useNovaBarbeariaViewModel();
  const { theme } = useDesignSystem();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScreenHeader title="Nova barbearia" onBack={actions.goBack} />
      <FormScreen
        footer={
          <>
            {state.errorMessage ? (
              <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
                {state.errorMessage}
              </Typography>
            ) : null}
            <Button variant="filled" size="medium" fullWidth onPress={actions.submit} disabled={state.saving}>
              {state.saving ? "Criando..." : "Criar barbearia"}
            </Button>
          </>
        }
      >
        <PhotoPicker
          uri={state.logoUri}
          label="Foto da barbearia"
          onPick={actions.pickLogo}
          title={state.form.name.trim()}
          subtitle={state.logoUri ? "Toque na foto para trocar" : "Toque para adicionar uma foto"}
        />
        <BarbershopFields values={state.form} errors={state.fieldErrors} onChange={actions.setField} />
      </FormScreen>
    </SafeAreaView>
  );
};

export default NovaBarbearia;
