// Nova foto do portfólio (canvas de telas): foto grande, legenda, serviço, "Mostrar nas
// Inspirações" e a confirmação de que o cliente autorizou a publicação.

import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/view/components/button";
import { Checkbox } from "@/view/components/checkbox";
import { Chip } from "@/view/components/chip";
import { FormScreen } from "@/view/components/formScreen";
import { Icon } from "@/view/components/icon";
import { ScreenHeader } from "@/view/components/screenHeader";
import { Switch } from "@/view/components/switch";
import { TextField } from "@/view/components/textField";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import { useNovaFotoViewModel } from "@/viewmodel/useNovaFotoViewModel";

const NovaFoto = () => {
  const [state, actions] = useNovaFotoViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const altura = componentSizes.portfolio.previewHeight;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Nova foto" onBack={actions.goBack} />
      <FormScreen
        footer={
          <>
            {state.errorMessage ? (
              <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
                {state.errorMessage}
              </Typography>
            ) : null}
            <Button variant="filled" size="medium" fullWidth onPress={actions.publish} disabled={state.saving}>
              {state.saving ? "Publicando..." : "Publicar no portfólio"}
            </Button>
          </>
        }
      >
        {state.photoUri ? (
          <>
            <Thumbnail uri={state.photoUri} label="Foto escolhida" width="100%" height={altura} radius={theme.shapes.large} />
            <View style={{ alignItems: "flex-start" }}>
              <Button variant="outlined" size="small" onPress={actions.pickPhoto}>
                Trocar foto
              </Button>
            </View>
          </>
        ) : (
          <Pressable
            onPress={actions.pickPhoto}
            accessibilityRole="button"
            accessibilityLabel="Escolher foto na galeria"
            style={{
              height: altura,
              borderRadius: theme.shapes.large,
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: state.fieldErrors.photo ? colors.error : colors.outline,
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.sm,
            }}
          >
            <Icon name="photos" size={spacing.huge} color={colors.primary} />
            <Typography variant="labelLarge" color="primary">
              Escolher foto na galeria
            </Typography>
          </Pressable>
        )}
        {state.fieldErrors.photo ? (
          <Typography variant="bodySmall" color="error" accessibilityLiveRegion="polite">
            {state.fieldErrors.photo}
          </Typography>
        ) : null}

        <TextField
          label="Legenda"
          placeholder="Ex: Degradê navalhado"
          value={state.form.caption}
          onChangeText={actions.setCaption}
          errorText={state.fieldErrors.caption}
          maxLength={120}
        />

        {state.services.length > 0 && (
          <View style={{ gap: spacing.sm }}>
            <Typography variant="bodySmall" color="onSurfaceVariant">
              Serviço
            </Typography>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              {state.services.map((s) => (
                <Chip
                  key={s.id}
                  variant="filter"
                  label={s.name}
                  selected={state.form.serviceId === s.id}
                  onPress={() => actions.toggleService(s.id)}
                />
              ))}
            </View>
          </View>
        )}

        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: componentSizes.touchTarget }}>
          <View style={{ flex: 1 }}>
            <Typography variant="titleMedium">Mostrar nas Inspirações</Typography>
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              Clientes veem a foto no Início.
            </Typography>
          </View>
          <Switch value={state.form.featured} onValueChange={actions.setFeatured} />
        </View>

        <Checkbox
          checked={state.form.consent}
          onCheckedChange={actions.setConsent}
          label="O cliente da foto autorizou a publicação"
        />
        {state.fieldErrors.consent ? (
          <Typography variant="bodySmall" color="error" accessibilityLiveRegion="polite">
            {state.fieldErrors.consent}
          </Typography>
        ) : null}
      </FormScreen>
    </SafeAreaView>
  );
};

export default NovaFoto;
