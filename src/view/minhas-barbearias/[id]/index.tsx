// Editar barbearia: foto, dados e endereço completo; o menu ⋮ leva a horários,
// profissionais e serviços (padrão 5 de 05-padroes.md).

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BarbershopFields } from "@/view/components/barbershopFields";
import { Button } from "@/view/components/button";
import { FormScreen } from "@/view/components/formScreen";
import { OverflowMenu } from "@/view/components/overflowMenu";
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
      <ScreenHeader
        title="Editar Barbearia"
        onBack={actions.goBack}
        right={
          state.status === "content" ? (
            <OverflowMenu
              items={[
                { key: "horarios", label: "Horário de funcionamento", onPress: actions.openHours },
                { key: "profissionais", label: "Profissionais", onPress: actions.openProfessionals },
                { key: "servicos", label: "Serviços", onPress: actions.openServices },
              ]}
            />
          ) : null
        }
      />
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
                {state.saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </>
          }
        >
          <PhotoPicker uri={state.logoUri} label="Adicionar foto da barbearia" onPick={actions.pickLogo} />
          <BarbershopFields values={state.form} errors={state.fieldErrors} onChange={actions.setField} full />
        </FormScreen>
      )}
    </SafeAreaView>
  );
};

export default EditarBarbearia;
