// Profissionais da barbearia: lista com editar e o formulário de novo profissional
// (padrão 5 de 05-padroes.md).

import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar } from "@/view/components/avatar";
import { Button } from "@/view/components/button";
import { Card } from "@/view/components/card";
import { FAB } from "@/view/components/fab";
import { formatPhone } from "@/view/components/format";
import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { PasswordField } from "@/view/components/passwordField";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { TextField } from "@/view/components/textField";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { useProfissionaisBarbeariaViewModel } from "@/viewmodel/useProfissionaisBarbeariaViewModel";

const ProfissionaisBarbearia = () => {
  const [state, actions] = useProfissionaisBarbeariaViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const novo = state.editing === "novo";
  const { form, fieldErrors } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Profissionais" onBack={actions.goBack} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }} keyboardShouldPersistTaps="handled">
        {state.status !== "content" ? (
          <ScreenState
            status={state.status}
            loadingLabel="Carregando profissionais"
            errorMessage={state.errorMessage}
            onRetry={actions.retry}
            emptyTitle=""
          />
        ) : state.professionals.length === 0 && !state.editing ? (
          <Typography variant="bodyMedium" color="onSurfaceVariant">
            Nenhum profissional cadastrado. Toque no + para adicionar.
          </Typography>
        ) : (
          state.professionals.map((p) => (
            <Card key={p.id} variant="outlined">
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <Avatar name={p.name} uri={p.avatarUrl} />
                <View style={{ flex: 1, gap: spacing.xs }}>
                  <Typography variant="titleSmall" weight="700">
                    {p.name}
                  </Typography>
                  {p.specialty ? (
                    <View
                      style={{
                        alignSelf: "flex-start",
                        paddingHorizontal: spacing.sm,
                        paddingVertical: spacing.xs / 2,
                        borderRadius: theme.shapes.extraSmall,
                        backgroundColor: colors.secondaryContainer,
                      }}
                    >
                      <Typography variant="labelSmall" weight="700" color="onSecondaryContainer">
                        {p.specialty}
                      </Typography>
                    </View>
                  ) : null}
                  <Typography variant="bodySmall" color="onSurfaceVariant" numberOfLines={1}>
                    {formatPhone(p.phone)} • {p.email}
                  </Typography>
                </View>
                <IconButton
                  accessibilityLabel={`Editar ${p.name}`}
                  onPress={() => actions.openEdit(p)}
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
                {novo ? "Novo Profissional" : "Editar Profissional"}
              </Typography>
              <IconButton accessibilityLabel="Fechar formulário" onPress={actions.closeForm} icon={(cor) => <Icon name="close" color={cor} />} />
            </View>
            <TextField
              labelBackgroundColor={colors.surfaceContainerHighest}
              label="Nome completo"
              placeholder="Ex: Lucas Silva"
              labelAlwaysFloating
              value={form.name}
              onChangeText={(t) => actions.setField("name", t)}
              errorText={fieldErrors.name}
            />
            <TextField
              labelBackgroundColor={colors.surfaceContainerHighest}
              label="Telefone celular"
              placeholder="(11) 99999-9999"
              labelAlwaysFloating
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(t) => actions.setField("phone", t)}
              errorText={fieldErrors.phone}
            />
            <TextField
              labelBackgroundColor={colors.surfaceContainerHighest}
              label={novo ? "E-mail de acesso" : "E-mail de acesso (não muda)"}
              placeholder="profissional@provedor.com"
              labelAlwaysFloating
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(t) => actions.setField("email", t)}
              errorText={fieldErrors.email}
              disabled={!novo}
            />
            {novo ? (
              <PasswordField
                labelBackgroundColor={colors.surfaceContainerHighest}
                label="Senha de acesso"
                placeholder="Crie uma senha de acesso"
                labelAlwaysFloating
                value={form.password}
                onChangeText={(t) => actions.setField("password", t)}
                errorText={fieldErrors.password}
              />
            ) : null}
            <TextField
              labelBackgroundColor={colors.surfaceContainerHighest}
              label="Especialidade"
              placeholder="Ex: Cabelo, Barba, Sobrancelha"
              labelAlwaysFloating
              value={form.specialty}
              onChangeText={(t) => actions.setField("specialty", t)}
            />
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
          accessibilityLabel="Adicionar profissional"
          onPress={actions.openNew}
          icon={(cor) => <Icon name="plus" color={cor} />}
          style={{ position: "absolute", right: spacing.lg, bottom: spacing.xxl }}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default ProfissionaisBarbearia;
