// Card "Seu próximo agendamento" do Início: foto da barbearia, nome, data e hora, serviço e
// profissional, status e "Ver detalhes". O card inteiro é um botão. Sem agendamento futuro,
// NextAppointmentEmpty aponta para as barbearias da lista abaixo.

import { Platform, Pressable, View } from "react-native";

import { Icon } from "@/view/components/icon";
import { StatusBadge, STATUS_LABEL, type AppointmentStatusKey } from "@/view/components/statusBadge";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes, withAlpha } from "@/view/theme";

export type NextAppointmentCardProps = {
    barbershopName: string;
    imageUrl: string | null;
    /** Ex.: "Amanhã, 25 Nov". */
    dateLabel: string;
    /** Ex.: "15:00". */
    time: string;
    serviceName: string;
    professionalName: string;
    status: AppointmentStatusKey;
    onPress: () => void;
};

export const NextAppointmentCard = ({
    barbershopName,
    imageUrl,
    dateLabel,
    time,
    serviceName,
    professionalName,
    status,
    onPress,
}: NextAppointmentCardProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const texto = colors.onPrimaryContainer;

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Seu próximo agendamento: ${barbershopName}, ${dateLabel} às ${time}, ${serviceName} com ${professionalName}, ${STATUS_LABEL[status]}`}
            accessibilityHint="Abre os detalhes nos seus agendamentos"
            android_ripple={{ color: withAlpha(colors.primary, theme.state.pressed) }}
            style={({ pressed }) => ({
                backgroundColor: colors.primaryContainer,
                borderRadius: theme.shapes.large,
                padding: spacing.lg,
                gap: spacing.md,
                overflow: "hidden",
                opacity: Platform.OS === "ios" && pressed ? 1 - theme.state.pressed : 1,
                ...theme.getElevationStyle("level1", colors.shadow),
            })}
        >
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <Icon name="calendar" size={spacing.xl} color={texto} />
                <Typography variant="titleSmall" style={{ color: texto, flex: 1 }}>
                    Seu próximo agendamento
                </Typography>
                <StatusBadge status={status} pill />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <Thumbnail
                    uri={imageUrl}
                    label={`Foto da ${barbershopName}`}
                    width={componentSizes.home.appointmentImage}
                    height={componentSizes.home.appointmentImage}
                    radius={theme.shapes.medium}
                />
                <View style={{ flex: 1, gap: spacing.xs }}>
                    <Typography variant="titleMedium" weight="700" numberOfLines={2} style={{ color: texto }}>
                        {barbershopName}
                    </Typography>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <Icon name="calendar" size={spacing.lg + spacing.xs} color={texto} />
                        <Typography variant="bodyLarge" weight="500" style={{ color: texto, flexShrink: 1 }}>
                            {dateLabel} · {time}
                        </Typography>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <Icon name="scissors" size={spacing.lg + spacing.xs} color={texto} />
                        <Typography variant="bodyMedium" numberOfLines={2} style={{ color: texto, flexShrink: 1 }}>
                            {serviceName} · {professionalName}
                        </Typography>
                    </View>
                </View>
            </View>

            {/* Parte do botão do card (não é um alvo separado para o leitor de tela). */}
            <View
                importantForAccessibility="no-hide-descendants"
                accessibilityElementsHidden
                style={{
                    alignSelf: "flex-end",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.xs,
                    paddingLeft: spacing.lg,
                    paddingRight: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: theme.shapes.full,
                    backgroundColor: colors.secondaryContainer,
                }}
            >
                <Typography variant="labelLarge" color="onSecondaryContainer">
                    Ver detalhes
                </Typography>
                <Icon name="chevronRight" size={spacing.xl} color={colors.onSecondaryContainer} />
            </View>
        </Pressable>
    );
};

/** Estado vazio: nenhum agendamento futuro; as barbearias para agendar estão logo abaixo. */
export const NextAppointmentEmpty = () => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;

    return (
        <View
            style={{
                backgroundColor: colors.primaryContainer,
                borderRadius: theme.shapes.large,
                padding: spacing.lg,
                gap: spacing.md,
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    width: componentSizes.touchTarget,
                    height: componentSizes.touchTarget,
                    borderRadius: theme.shapes.full,
                    backgroundColor: colors.secondaryContainer,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Icon name="calendar" size={spacing.xxl} color={colors.onSecondaryContainer} />
            </View>
            <View style={{ flex: 1 }}>
                <Typography variant="titleMedium" weight="700" color="onPrimaryContainer">
                    Nenhum horário marcado
                </Typography>
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                    Escolha uma barbearia abaixo e garanta seu próximo corte.
                </Typography>
            </View>
        </View>
    );
};
