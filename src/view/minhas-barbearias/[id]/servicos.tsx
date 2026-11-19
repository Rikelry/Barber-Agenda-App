// Serviços da barbearia: lista com preço e duração, editar e o formulário de novo serviço
// (padrão 5 de 05-padroes.md, no mesmo modelo de Profissionais).

import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/view/components/button";
import { Card } from "@/view/components/card";
import { FAB } from "@/view/components/fab";
import { formatDuration, formatPrice } from "@/view/components/format";
import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { TextField } from "@/view/components/textField";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import { useServicosBarbeariaViewModel } from "@/viewmodel/useServicosBarbeariaViewModel";

const ServicosBarbearia = () => {
  const [state, actions] = useServicosBarbeariaViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const novo = state.editing === "novo";
  const { form, fieldErrors } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Serviços" onBack={actions.goBack} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }} keyboardShouldPersistTaps="handled">
        {state.status !== "content" ? (
          <ScreenState
            status={state.status}
            loadingLabel="Carregando serviços"
            errorMessage={state.errorMessage}
            onRetry={actions.retry}
            emptyTitle=""
          />
        ) : state.services.length === 0 && !state.editing ? (
          <Typography variant="bodyMedium" color="onSurfaceVariant">
            Nenhum serviço cadastrado. Toque no + para adicionar.
          </Typography>
        ) : (
          state.services.map((s) => (
            <Card key={s.id} variant="outlined">
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <Thumbnail
                  uri={s.imageUrl}
                  label={`Foto de ${s.name}`}
                  width={componentSizes.avatar.medium + spacing.sm}
                  height={componentSizes.avatar.medium + spacing.sm}
                />
                <View style={{ flex: 1, gap: spacing.xs }}>
                  <Typography variant="titleSmall" weight="700">
                    {s.name}
                  </Typography>
                  {s.description ? (
                    <Typography variant="bodySmall" color="onSurfaceVariant" numberOfLines={1}>
                      {s.description}
                    </Typography>
                  ) : null}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    <View
                      style={{
                        paddingHorizontal: spacing.sm,
                        paddingVertical: spacing.xs / 2,
                        borderRadius: theme.shapes.extraSmall,
                        backgroundColor: colors.surfaceContainerHighest,
                      }}
                    >
                      <Typography variant="labelSmall" color="onSurfaceVariant">
                        {formatDuration(s.durationMinutes)}
                      </Typography>
                    </View>
                    <Typography variant="labelLarge" weight="700" color="primary">
                      {formatPrice(s.price)}
                    </Typography>
                  </View>
                </View>
                <IconButton
                  accessibilityLabel={`Editar ${s.name}`}
                  onPress={() => actions.openEdit(s)}
                  icon={(cor) => <Icon name="edit" color={cor} />}
                />
              </View>
            </Card>
          ))
        )}

        {state.editing ? (
          <Card variant="filled" style={{ gap: spacing.md, marginTop: spacing.md }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Typography variant="titleSmall" weight="700" accessibilityRole="header" style={{ flex: 1 }}>
                {novo ? "Adicionar Novo Serviço" : "Editar Serviço"}
              </Typography>
              <IconButton accessibilityLabel="Fechar formulário" onPress={actions.closeForm} icon={(cor) => <Icon name="close" color={cor} />} />
            </View>
            <Pressable
              onPress={actions.pickPhoto}
              accessibilityRole="button"
              accessibilityLabel={state.photoUri ? "Trocar foto do serviço" : "Fazer upload de foto do serviço"}
              style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: componentSizes.touchTarget }}
            >
              <Thumbnail
                uri={state.photoUri}
                label="Foto do serviço"
                width={componentSizes.avatar.medium}
                height={componentSizes.avatar.medium}
              />
              <Typography variant="labelLarge" color="primary">
                {state.photoUri ? "Trocar foto do serviço" : "Fazer upload de foto do serviço"}
              </Typography>
            </Pressable>
            <TextField
              label="Nome do serviço"
              placeholder="Ex: Cabelo & Barba Premium"
              value={form.name}
              onChangeText={(t) => actions.setField("name", t)}
              errorText={fieldErrors.name}
            />
            <TextField
              label="Descrição"
              placeholder="Descreva brevemente o serviço..."
              value={form.description}
              onChangeText={(t) => actions.setField("description", t)}
            />
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <View style={{ flex: 1 }}>
                <TextField
                  label="Duração (minutos)"
                  placeholder="e.g. 45"
                  keyboardType="number-pad"
                  value={form.durationMinutes}
                  onChangeText={(t) => actions.setField("durationMinutes", t)}
                  errorText={fieldErrors.durationMinutes}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextField
                  label="Valor (R$)"
                  placeholder="e.g. 80,00"
                  keyboardType="decimal-pad"
                  value={form.price}
                  onChangeText={(t) => actions.setField("price", t)}
                  errorText={fieldErrors.price}
                />
              </View>
            </View>
            {state.errorMessage ? (
              <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
                {state.errorMessage}
              </Typography>
            ) : null}
            <Button variant="filled" size="medium" fullWidth onPress={actions.submit} disabled={state.saving}>
              {state.saving ? "Salvando..." : "Salvar Serviço"}
            </Button>
          </Card>
        ) : null}
      </ScrollView>
      {!state.editing && state.status === "content" ? (
        <FAB
          accessibilityLabel="Adicionar serviço"
          onPress={actions.openNew}
          icon={(cor) => <Icon name="plus" color={cor} />}
          style={{ position: "absolute", right: spacing.lg, bottom: spacing.xxl }}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default ServicosBarbearia;
