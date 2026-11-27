// Selo de status do agendamento (badge.md e padrão 7 de 05-padroes.md), sempre com texto:
// Pendente e Aguardando cliente em âmbar, Confirmado em verde, Em andamento em marrom,
// Concluído em tonal, Não compareceu em neutro e Recusado/Cancelado em vermelho.

import { View } from "react-native";

import { Icon } from "@/view/components/icon";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { statusColors } from "@/view/theme";

export type AppointmentStatusKey =
    | "pending"
    | "awaiting_client"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "rejected"
    | "cancelled"
    | "no_show";

export const STATUS_LABEL: Record<AppointmentStatusKey, string> = {
    pending: "Pendente",
    awaiting_client: "Aguardando cliente",
    confirmed: "Confirmado",
    in_progress: "Em andamento",
    completed: "Concluído",
    rejected: "Recusado",
    cancelled: "Cancelado",
    no_show: "Não compareceu",
};

type Esquema = ReturnType<typeof useDesignSystem>["theme"]["colors"];

/** Fundo e texto do selo de cada status (também usados na faixa lateral da linha do tempo). */
export const statusBadgeColors = (status: AppointmentStatusKey, colors: Esquema) => {
    switch (status) {
        case "pending":
        case "awaiting_client":
            return { fundo: statusColors.pending.container, texto: statusColors.pending.content };
        case "confirmed":
            return { fundo: statusColors.confirmed.container, texto: statusColors.confirmed.content };
        case "in_progress":
            return { fundo: colors.primary, texto: colors.onPrimary };
        case "completed":
            return { fundo: colors.secondaryContainer, texto: colors.onSecondaryContainer };
        case "no_show":
            return { fundo: colors.surfaceContainerHighest, texto: colors.onSurfaceVariant };
        default:
            return { fundo: colors.errorContainer, texto: colors.onErrorContainer };
    }
};

export type StatusBadgeProps = {
    status: AppointmentStatusKey;
    /** Pílula com ícone de confirmação (card do próximo agendamento no Início). */
    pill?: boolean;
};

export const StatusBadge = ({ status, pill = false }: StatusBadgeProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const cores = statusBadgeColors(status, colors);

    return (
        <View
            style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.xs,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: pill ? theme.shapes.full : theme.shapes.extraSmall,
                backgroundColor: cores.fundo,
            }}
        >
            {pill && status === "confirmed" ? <Icon name="checkCircle" size={spacing.lg} color={cores.texto} /> : null}
            {pill && (status === "pending" || status === "awaiting_client") ? (
                <Icon name="clock" size={spacing.lg} color={cores.texto} />
            ) : null}
            <Typography variant={pill ? "labelLarge" : "labelSmall"} weight="700" style={{ color: cores.texto }}>
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
