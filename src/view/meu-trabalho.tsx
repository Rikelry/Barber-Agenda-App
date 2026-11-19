// Meu perfil profissional: especialidade, barbearia onde trabalha, horário de funcionamento
// da semana (hoje em destaque) e os serviços. O barbeiro edita nome e telefone no Perfil; a
// especialidade e a foto profissional são editadas pelo dono da barbearia.

import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar } from "@/view/components/avatar";
import { Card } from "@/view/components/card";
import { formatDuration, formatPhone, formatPrice } from "@/view/components/format";
import { ScreenHeader } from "@/view/components/screenHeader";
import { ScreenState } from "@/view/components/screenState";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import { useMeuTrabalhoViewModel } from "@/viewmodel/useMeuTrabalhoViewModel";

const DIAS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

const MeuTrabalho = () => {
  const [state, actions] = useMeuTrabalhoViewModel();
  const { theme } = useDesignSystem();
  const { colors, spacing } = theme;
  const w = state.workplace;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Meu perfil profissional" onBack={actions.goBack} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl }}>
        {state.status !== "content" || !w ? (
          <ScreenState
            status={state.status === "content" ? "error" : state.status}
            loadingLabel="Carregando seu local de trabalho"
            errorMessage={state.errorMessage}
            onRetry={actions.retry}
            emptyTitle=""
          />
        ) : (
          <>
            <View style={{ alignItems: "center", gap: spacing.sm }}>
              <Avatar name={state.user?.name ?? "Profissional"} uri={state.user?.avatarUrl} size="large" outlined />
              <Typography variant="titleLarge" weight="700" align="center">
                {state.user?.name}
              </Typography>
              <View
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  borderRadius: theme.shapes.full,
                  backgroundColor: colors.secondaryContainer,
                }}
              >
                <Typography variant="labelLarge" color="onSecondaryContainer">
                  {w.specialty ?? "Especialidade não informada"}
                </Typography>
              </View>
              <Typography variant="bodySmall" color="onSurfaceVariant" align="center">
                A especialidade e a foto profissional são alteradas pelo dono da barbearia.
              </Typography>
            </View>

            <View style={{ gap: spacing.md }}>
              <Typography variant="titleSmall" weight="700" accessibilityRole="header">
                Onde atendo
              </Typography>
              <Card variant="outlined">
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                  <Thumbnail
                    uri={w.barbershop.avatarUrl}
                    label={`Foto da ${w.barbershop.name}`}
                    width={componentSizes.thumbnail.card}
                    height={componentSizes.thumbnail.card}
                  />
                  <View style={{ flex: 1, gap: spacing.xs }}>
                    <Typography variant="titleSmall" weight="700">
                      {w.barbershop.name}
                    </Typography>
                    <Typography variant="bodySmall" color="onSurfaceVariant" numberOfLines={2}>
                      {w.barbershop.address}
                    </Typography>
                    <Typography variant="bodySmall" color="onSurfaceVariant">
                      {formatPhone(w.barbershop.phone)}
                    </Typography>
                  </View>
                </View>
              </Card>
            </View>

            <View style={{ gap: spacing.md }}>
              <Typography variant="titleSmall" weight="700" accessibilityRole="header">
                Horário de funcionamento
              </Typography>
              <Card variant="outlined">
                {w.week.map((d, i) => {
                  const hoje = d.dayOfWeek === state.today;
                  return (
                    <View
                      key={d.dayOfWeek}
                      accessible
                      accessibilityLabel={`${DIAS[d.dayOfWeek]}${hoje ? ", hoje" : ""}: ${d.hours ? `${d.hours.openTime} às ${d.hours.closeTime}` : "fechado"}`}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: spacing.sm,
                        borderTopWidth: i === 0 ? 0 : 1,
                        borderTopColor: colors.outlineVariant,
                      }}
                    >
                      <Typography
                        variant="bodyMedium"
                        weight={hoje ? "700" : "400"}
                        color={hoje ? "primary" : "onSurface"}
                        style={{ flex: 1 }}
                      >
                        {DIAS[d.dayOfWeek]}
                        {hoje ? " (hoje)" : ""}
                      </Typography>
                      <Typography
                        variant="bodyMedium"
                        weight={hoje ? "700" : "400"}
                        color={d.hours ? (hoje ? "primary" : "onSurface") : "onSurfaceVariant"}
                      >
                        {d.hours ? `${d.hours.openTime} - ${d.hours.closeTime}` : "Fechado"}
                      </Typography>
                    </View>
                  );
                })}
              </Card>
            </View>

            {w.services.length > 0 && (
              <View style={{ gap: spacing.md }}>
                <Typography variant="titleSmall" weight="700" accessibilityRole="header">
                  Serviços da barbearia
                </Typography>
                <Card variant="outlined">
                  {w.services.map((s, i) => (
                    <View
                      key={s.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.md,
                        paddingVertical: spacing.sm,
                        borderTopWidth: i === 0 ? 0 : 1,
                        borderTopColor: colors.outlineVariant,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Typography variant="bodyMedium">{s.name}</Typography>
                        <Typography variant="bodySmall" color="onSurfaceVariant">
                          {formatDuration(s.durationMinutes)}
                        </Typography>
                      </View>
                      <Typography variant="labelLarge" weight="700" color="primary">
                        {formatPrice(s.price)}
                      </Typography>
                    </View>
                  ))}
                </Card>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MeuTrabalho;
