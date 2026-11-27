// Solicitação compacta (aba Trabalho): iniciais, nome em destaque com o status em chip, serviço e
// horário numa linha (e o profissional, na agenda da barbearia). Pendente: Sugerir outro horário
// como ação secundária e Recusar/Aprovar lado a lado; aguardando cliente: só o resumo da sugestão.

import { Pressable, View } from "react-native";

import { Avatar } from "@/view/components/avatar";
import { Button } from "@/view/components/button";
import { formatDayLabelInline, formatTime } from "@/view/components/format";
import { StatusBadge } from "@/view/components/statusBadge";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import type { AgendaItem } from "@/view/components/agenda/AgendaItem";

export type AgendaRequestCardProps = {
    item: AgendaItem;
    showProfessional: boolean;
    busy: boolean;
    onOpen: () => void;
    onApprove: () => void;
    onReject: () => void;
    onPropose: () => void;
};

export const AgendaRequestCard = ({ item, showProfessional, busy, onOpen, onApprove, onReject, onPropose }: AgendaRequestCardProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const quando = `${formatDayLabelInline(item.startsAt)} às ${formatTime(item.startsAt)}`;

    return (
        <View
            style={{
                gap: spacing.sm,
                padding: spacing.md,
                borderRadius: theme.shapes.medium,
                backgroundColor: colors.surfaceContainer,
            }}
        >
            <Pressable
                onPress={onOpen}
                accessibilityRole="button"
                accessibilityLabel={`${item.clientName}, ${item.serviceName}${showProfessional ? ` com ${item.professionalName}` : ""}, ${quando}`}
                accessibilityHint="Abre os detalhes do pedido"
                style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}
            >
                <Avatar name={item.clientName} size="small" />
                <View style={{ flex: 1 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: spacing.sm,
                        }}
                    >
                        <Typography variant="titleSmall" weight="700" numberOfLines={1} style={{ flex: 1 }}>
                            {item.clientName}
                        </Typography>
                        <StatusBadge status={item.status} />
                    </View>
                    <Typography variant="bodySmall" color="onSurfaceVariant" numberOfLines={1}>
                        {item.serviceName} · {formatTime(item.startsAt)}
                        {showProfessional ? ` · ${item.professionalName}` : ""}
                    </Typography>
                </View>
            </Pressable>

            {item.status === "pending" ? (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.sm,
                    }}
                >
                    <View style={{ flex: 1, alignItems: "flex-start" }}>
                        <Button
                            variant="text"
                            size="xs"
                            onPress={onPropose}
                            disabled={busy}
                            accessibilityLabel={`Sugerir outro horário para ${item.clientName}`}
                        >
                            Sugerir outro horário
                        </Button>
                    </View>
                    <Button
                        variant="outlined"
                        size="xs"
                        onPress={onReject}
                        disabled={busy}
                        accessibilityLabel={`Recusar pedido de ${item.clientName}`}
                    >
                        <Typography variant="labelSmall" weight="700" color="error">
                            Recusar
                        </Typography>
                    </Button>
                    <Button
                        variant="filled"
                        size="xs"
                        onPress={onApprove}
                        disabled={busy}
                        accessibilityLabel={`Aprovar pedido de ${item.clientName}`}
                    >
                        Aprovar
                    </Button>
                </View>
            ) : item.proposal ? (
                <Typography variant="bodySmall" color="onSurfaceVariant">
                    Horário sugerido: {formatDayLabelInline(item.proposal.startsAt)} às {formatTime(item.proposal.startsAt)}. Aguardando
                    resposta do cliente.
                </Typography>
            ) : null}
        </View>
    );
};
