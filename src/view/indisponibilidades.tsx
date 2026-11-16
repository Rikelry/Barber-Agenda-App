// Indisponibilidades (padrão 6 de 05-padroes.md): bloqueio recorrente (dias da semana) ou
// pontual (uma data), com horário e motivo, e a lista de bloqueios ativos com remover.

import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/view/components/button";
import { Card } from "@/view/components/card";
import { Chip } from "@/view/components/chip";
import { formatDayLabel, formatTime } from "@/view/components/format";
import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { TextField } from "@/view/components/textField";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { WeekCalendar } from "@/view/components/weekCalendar";
import { useIndisponibilidadesViewModel } from "@/viewmodel/useIndisponibilidadesViewModel";

const CURTOS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const ORDEM = [1, 2, 3, 4, 5, 6, 0];
const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const INICIAIS = ["D", "S", "T", "Q", "Q", "S", "S"];

/** [1,2,3,4,5] → "Seg a Sex"; [1,3] → "Seg, Qua". */
const rotuloDias = (dias: number[]) => {
  const pos = dias.map((d) => ORDEM.indexOf(d)).sort((a, b) => a - b);
  const seguidos = pos.length > 2 && pos.every((p, i) => i === 0 || p === (pos[i - 1] ?? 0) + 1);
  const nome = (p: number) => CURTOS[ORDEM[p] ?? 0];
  return seguidos ? `${nome(pos[0] ?? 0)} a ${nome(pos[pos.length - 1] ?? 0)}` : pos.map(nome).join(", ");
};

const deIso = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a ?? 0, (m ?? 1) - 1, d ?? 1);
};

const Indisponibilidades = () => {
  const [state, actions] = useIndisponibilidadesViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const recorrente = state.tab === "recorrente";
  const fundoCampo = colors.surfaceContainerHighest;

  // Semana da data escolhida, de domingo a sábado, para o calendário do bloqueio pontual.
  const escolhida = deIso(state.date);
  const domingo = new Date(escolhida.getFullYear(), escolhida.getMonth(), escolhida.getDate() - escolhida.getDay());
  const hoje = new Date();
  const hojeIso = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
  const semana = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(domingo.getFullYear(), domingo.getMonth(), domingo.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return {
      iso,
      weekday: INICIAIS[d.getDay()] ?? "",
      fullLabel: `${CURTOS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]?.toLowerCase()}`,
      day: d.getDate(),
      selected: iso === state.date,
      today: iso === hojeIso,
      disabled: iso < hojeIso,
    };
  });
  const mudarSemana = (dias: number) => {
    const alvo = new Date(escolhida.getFullYear(), escolhida.getMonth(), escolhida.getDate() + dias);
    const iso = `${alvo.getFullYear()}-${String(alvo.getMonth() + 1).padStart(2, "0")}-${String(alvo.getDate()).padStart(2, "0")}`;
    actions.setDate(iso < hojeIso ? hojeIso : iso);
  };

  const aba = (valor: "recorrente" | "pontual", rotulo: string) => {
    const ativa = state.tab === valor;
    return (
      <Button
        variant={ativa ? "elevated" : "text"}
        size="small"
        onPress={() => actions.setTab(valor)}
        accessibilityRole="tab"
        accessibilityState={{ selected: ativa }}
        style={{ flex: 1 }}
      >
        {rotulo}
      </Button>
    );
  };

  const confirmar = (chave: string, remover: () => void, nome: string) =>
    state.confirmingRemove === chave ? (
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <Button variant="text" size="xs" onPress={actions.dismissRemove}>
          Voltar
        </Button>
        <Button variant="filled" size="xs" onPress={remover} disabled={state.saving} style={{ backgroundColor: colors.error }}>
          <Typography variant="labelMedium" color="onError">
            Remover
          </Typography>
        </Button>
      </View>
    ) : (
      <IconButton
        accessibilityLabel={`Remover ${nome}`}
        onPress={() => actions.askRemove(chave)}
        icon={() => <Icon name="trash" color={colors.error} />}
      />
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Indisponibilidades" onBack={actions.goBack} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }} keyboardShouldPersistTaps="handled">
        <View
          accessibilityRole="tablist"
          style={{
            flexDirection: "row",
            gap: spacing.xs,
            padding: spacing.xs,
            borderRadius: theme.shapes.medium,
            backgroundColor: colors.surfaceContainerHigh,
          }}
        >
          {aba("recorrente", "Recorrente")}
          {aba("pontual", "Pontual")}
        </View>

        <Card variant="filled" style={{ gap: spacing.md }}>
          <Typography variant="titleSmall" weight="700" accessibilityRole="header">
            {recorrente ? "Adicionar Bloqueio Recorrente" : "Adicionar Bloqueio Pontual"}
          </Typography>
          {recorrente ? (
            <View style={{ gap: spacing.xs }}>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
                {ORDEM.map((d) => (
                  <Chip
                    key={d}
                    variant="filter"
                    label={CURTOS[d] ?? ""}
                    selected={state.days.includes(d)}
                    onPress={() => actions.toggleDay(d)}
                  />
                ))}
              </View>
              {state.fieldErrors.days ? (
                <Typography variant="bodySmall" color="error">
                  {state.fieldErrors.days}
                </Typography>
              ) : null}
            </View>
          ) : (
            <View style={{ gap: spacing.xs }}>
              <WeekCalendar
                monthLabel={`${MESES[escolhida.getMonth()]} ${escolhida.getFullYear()}`}
                days={semana}
                canGoBack={domingo.getTime() > new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - hoje.getDay()).getTime()}
                onPrevious={() => mudarSemana(-7)}
                onNext={() => mudarSemana(7)}
                onSelect={actions.setDate}
              />
              {state.fieldErrors.date ? (
                <Typography variant="bodySmall" color="error">
                  {state.fieldErrors.date}
                </Typography>
              ) : null}
            </View>
          )}
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <TextField
                labelBackgroundColor={fundoCampo}
                label="Horário Inicial"
                value={state.startTime}
                onChangeText={actions.setStartTime}
                keyboardType="number-pad"
                maxLength={5}
                errorText={state.fieldErrors.startTime}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextField
                labelBackgroundColor={fundoCampo}
                label="Horário Final"
                value={state.endTime}
                onChangeText={actions.setEndTime}
                keyboardType="number-pad"
                maxLength={5}
                errorText={state.fieldErrors.endTime}
              />
            </View>
          </View>
          <TextField
            labelBackgroundColor={fundoCampo}
            label="Motivo (opcional)"
            placeholder={recorrente ? "Ex: Almoço com a equipe" : "Ex: Exame médico"}
            labelAlwaysFloating
            value={state.reason}
            onChangeText={actions.setReason}
            maxLength={255}
          />
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
          <Button variant="filled" size="medium" fullWidth onPress={actions.add} disabled={state.saving}>
            {state.saving ? "Salvando..." : "Adicionar Bloqueio"}
          </Button>
        </Card>

        <View style={{ gap: spacing.md }}>
          <Typography variant="titleSmall" weight="700" accessibilityRole="header">
            Bloqueios Ativos
          </Typography>
          {state.status !== "content" ? (
            <ScreenState
              status={state.status}
              loadingLabel="Carregando bloqueios"
              errorMessage={state.errorMessage}
              onRetry={actions.retry}
              emptyTitle=""
            />
          ) : state.blocks.recurring.length === 0 && state.blocks.oneOff.length === 0 ? (
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              Nenhum bloqueio ativo.
            </Typography>
          ) : (
            <>
              {state.blocks.recurring.map((b) => (
                <Card key={b.key} variant="outlined">
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    <View style={{ flex: 1, gap: spacing.xs }}>
                      <Typography variant="titleSmall" weight="700">
                        {b.reason ?? "Bloqueio recorrente"}
                      </Typography>
                      <Typography variant="bodySmall" color="onSurfaceVariant">
                        {rotuloDias(b.days)} • {b.startTime} - {b.endTime}
                      </Typography>
                    </View>
                    {confirmar(`r:${b.key}`, () => actions.removeRecurring(b), b.reason ?? "bloqueio recorrente")}
                  </View>
                </Card>
              ))}
              {state.blocks.oneOff.map((u) => (
                <Card key={u.id} variant="outlined">
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    <View style={{ flex: 1, gap: spacing.xs }}>
                      <Typography variant="titleSmall" weight="700">
                        {u.reason ?? "Bloqueio"} (Pontual)
                      </Typography>
                      <Typography variant="bodySmall" color="onSurfaceVariant">
                        {formatDayLabel(u.startsAt)} • {formatTime(u.startsAt)} - {formatTime(u.endsAt)}
                      </Typography>
                    </View>
                    {confirmar(`p:${u.id}`, () => actions.removeOneOff(u.id), u.reason ?? "bloqueio pontual")}
                  </View>
                </Card>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Indisponibilidades;
