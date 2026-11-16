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
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
                borderRadius: theme.shapes.small,
                backgroundColor: cores.fundo,
            }}
        >
            <Typography variant="labelSmall" weight="700" style={{ color: cores.texto }}>
                {STATUS_LABEL[status]}
            </Typography>
        </View>
    );
};
