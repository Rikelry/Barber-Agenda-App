// Serviços da barbearia: lista com preço e duração, editar e o formulário de novo serviço
// (padrão 5 de 05-padroes.md, no mesmo modelo de Profissionais).

import { ScrollView, View } from "react-native";
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
import { Typography } from "@/view/components/typography";
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
                <View style={{ flex: 1, gap: spacing.xs }}>
                  <Typography variant="titleSmall" weight="700">
                    {s.name}
                  </Typography>
                  {s.description ? (
                    <Typography variant="bodySmall" color="onSurfaceVariant" numberOfLines={2}>
                      {s.description}
                    </Typography>
                  ) : null}
                  <Typography variant="bodySmall" color="onSurfaceVariant">
                    Duração: {formatDuration(s.durationMinutes)} • {formatPrice(s.price)}
                  </Typography>
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
                {novo ? "Novo Serviço" : "Editar Serviço"}
              </Typography>
              <IconButton accessibilityLabel="Fechar formulário" onPress={actions.closeForm} icon={(cor) => <Icon name="close" color={cor} />} />
            </View>
            <TextField
              labelBackgroundColor={colors.surfaceContainerHighest}
              label="Nome do serviço"
              placeholder="Ex: Corte de Cabelo Masculino"
              labelAlwaysFloating
              value={form.name}
              onChangeText={(t) => actions.setField("name", t)}
              errorText={fieldErrors.name}
            />
            <TextField
              labelBackgroundColor={colors.surfaceContainerHighest}
              label="Descrição (opcional)"
              placeholder="Ex: Tesoura e máquina, com lavagem"
              labelAlwaysFloating
              value={form.description}
              onChangeText={(t) => actions.setField("description", t)}
            />
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <View style={{ flex: 1 }}>
                <TextField
                  labelBackgroundColor={colors.surfaceContainerHighest}
                  label="Duração (min)"
                  placeholder="40"
                  labelAlwaysFloating
                  keyboardType="number-pad"
                  value={form.durationMinutes}
                  onChangeText={(t) => actions.setField("durationMinutes", t)}
                  errorText={fieldErrors.durationMinutes}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextField
                  labelBackgroundColor={colors.surfaceContainerHighest}
                  label="Preço (R$)"
                  placeholder="50,00"
                  labelAlwaysFloating
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
              {state.saving ? "Salvando..." : novo ? "Adicionar" : "Salvar"}
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
