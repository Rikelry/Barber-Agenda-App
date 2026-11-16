// Horário de funcionamento: cada dia com o interruptor de aberto e os horários de abertura e
// fechamento (padrão 5 de 05-padroes.md).

import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/view/components/button";
import { Card } from "@/view/components/card";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { Switch } from "@/view/components/switch";
import { TextField } from "@/view/components/textField";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { useHorariosBarbeariaViewModel } from "@/viewmodel/useHorariosBarbeariaViewModel";

const DIAS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

const HorariosBarbearia = () => {
  const [state, actions] = useHorariosBarbeariaViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Horário de Funcionamento" onBack={actions.goBack} />
      {state.status !== "content" ? (
        <View style={{ padding: spacing.lg }}>
          <ScreenState
            status={state.status}
            loadingLabel="Carregando horários"
            errorMessage={state.errorMessage}
            onRetry={actions.retry}
            emptyTitle=""
          />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
            {state.week.map((d) => {
              const nome = DIAS[d.dayOfWeek] ?? "";
              const erro = state.dayErrors[String(d.dayOfWeek)];
              const fechouDiaSalvo = !d.open && state.savedOpenDays.includes(d.dayOfWeek);
              return (
                <Card
                  key={d.dayOfWeek}
                  variant={d.open ? "outlined" : "filled"}
                  style={{ gap: spacing.md }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    <Typography
                      variant="titleSmall"
                      weight="700"
                      color={d.open ? "onSurface" : "onSurfaceVariant"}
                      style={{ flex: 1 }}
                    >
                      {nome}
                    </Typography>
                    <View accessible accessibilityRole="switch" accessibilityLabel={`${nome} aberto`} accessibilityState={{ checked: d.open }}>
                      <Switch value={d.open} onValueChange={(v) => actions.setOpen(d.dayOfWeek, v)} />
                    </View>
                  </View>
                  {d.open ? (
                    <View style={{ flexDirection: "row", gap: spacing.md }}>
                      <View style={{ flex: 1 }}>
                        <TextField
                          label="Abertura"
                          value={d.openTime}
                          onChangeText={(t) => actions.setTime(d.dayOfWeek, "openTime", t)}
                          keyboardType="number-pad"
                          maxLength={5}
                          accessibilityLabel={`Abertura de ${nome}`}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <TextField
                          label="Fechamento"
                          value={d.closeTime}
                          onChangeText={(t) => actions.setTime(d.dayOfWeek, "closeTime", t)}
                          keyboardType="number-pad"
                          maxLength={5}
                          accessibilityLabel={`Fechamento de ${nome}`}
                        />
                      </View>
                    </View>
                  ) : (
                    <Typography variant="bodySmall" color="onSurfaceVariant">
                      {fechouDiaSalvo
                        ? "Por enquanto o servidor não apaga um dia já salvo: este dia continua aberto com o horário anterior."
                        : "Fechado o dia todo"}
                    </Typography>
                  )}
                  {erro ? (
                    <Typography variant="bodySmall" color="error">
                      {erro}
                    </Typography>
                  ) : null}
                </Card>
              );
            })}
          </ScrollView>
          <View style={{ padding: spacing.lg, gap: spacing.sm }}>
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
              {state.saving ? "Salvando..." : "Salvar Horários"}
            </Button>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default HorariosBarbearia;
