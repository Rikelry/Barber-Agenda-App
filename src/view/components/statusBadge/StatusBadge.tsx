// Selo de status do agendamento (badge.md e padrão 7 de 05-padroes.md): Confirmado em verde,
// Concluído em tonal e Cancelado em vermelho.

import { View } from "react-native";

import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { statusColors } from "@/view/theme";

export type AppointmentStatusKey = "confirmed" | "completed" | "cancelled";

export const STATUS_LABEL: Record<AppointmentStatusKey, string> = {
    confirmed: "Confirmado",
    completed: "Concluído",
    cancelled: "Cancelado",
};

export type StatusBadgeProps = { status: AppointmentStatusKey };

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const cores =
        status === "confirmed"
            ? { fundo: statusColors.confirmed.container, texto: statusColors.confirmed.content }
            : status === "completed"
              ? { fundo: colors.secondaryContainer, texto: colors.onSecondaryContainer }
              : { fundo: colors.errorContainer, texto: colors.onErrorContainer };

    return (
        <View
            style={{
                alignSelf: "flex-start",
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: theme.shapes.extraSmall,
                backgroundColor: cores.fundo,
            }}
        >
            <Typography variant="labelSmall" weight="700" style={{ color: cores.texto }}>
                {STATUS_LABEL[status]}
            </Typography>
        </View>
    );
};

export type OpenBadgeProps = { open: boolean };

/** Selo Aberta/Fechada da barbearia (canvas de telas): verde quando aberta, tonal quando fechada. */
export const OpenBadge = ({ open }: OpenBadgeProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    return (
        <View
            style={{
                alignSelf: "flex-start",
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: theme.shapes.extraSmall,
                backgroundColor: open ? statusColors.confirmed.container : colors.primaryContainer,
            }}
        >
            <Typography
                variant="labelSmall"
                weight="700"
                style={{ color: open ? statusColors.confirmed.content : colors.onPrimaryContainer }}
            >
                {open ? "Aberta" : "Fechada"}
            </Typography>
        </View>
    );
};
