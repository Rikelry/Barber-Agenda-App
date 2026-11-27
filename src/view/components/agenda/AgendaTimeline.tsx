// Linha do tempo compacta do dia (aba Trabalho): a hora de início à esquerda, um trilho com o
// ponto na cor do status e o card com cliente, serviço e o chip de status (o profissional só na
// agenda da barbearia). Faixas livres aparecem tracejadas. Tocar num horário abre os detalhes.

import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

import { formatTime } from "@/view/components/format";
import { StatusBadge, statusBadgeColors } from "@/view/components/statusBadge";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import type { AgendaItem, AgendaTimelineEntry } from "@/view/components/agenda/AgendaItem";

export type AgendaTimelineProps<T extends AgendaItem> = {
    entries: AgendaTimelineEntry<T>[];
    showProfessional: boolean;
    onOpen: (item: T) => void;
};

export const AgendaTimeline = <T extends AgendaItem>({ entries, showProfessional, onOpen }: AgendaTimelineProps<T>) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const tamanhos = componentSizes.agenda;

    const linha = (chave: string, hora: Date, ponto: string, conteudo: ReactNode, ultimo: boolean) => (
        <View key={chave} style={{ flexDirection: "row", gap: spacing.sm }}>
            <Typography variant="labelLarge" weight="700" style={{ width: tamanhos.timeColumn, paddingTop: spacing.sm }}>
                {formatTime(hora)}
            </Typography>
            <View style={{ alignItems: "center", width: spacing.md }}>
                <View
                    style={{
                        width: spacing.md,
                        height: spacing.md,
                        marginTop: spacing.md,
                        borderRadius: theme.shapes.full,
                        backgroundColor: ponto,
                    }}
                />
                {ultimo ? null : (
                    <View
                        style={{
                            flex: 1,
                            width: tamanhos.timelineRail,
                            backgroundColor: colors.outlineVariant,
                        }}
                    />
                )}
            </View>
            <View style={{ flex: 1, paddingBottom: spacing.sm }}>{conteudo}</View>
        </View>
    );

    return (
        <View>
            {entries.map((entrada, i) => {
                const ultimo = i === entries.length - 1;
                if (entrada.kind === "free") {
                    return linha(
                        `livre-${entrada.startsAt.getTime()}`,
                        entrada.startsAt,
                        colors.outlineVariant,
                        <View
                            accessible
                            accessibilityLabel={`Livre das ${formatTime(entrada.startsAt)} às ${formatTime(entrada.endsAt)}`}
                            style={{
                                paddingHorizontal: spacing.md,
                                paddingVertical: spacing.sm,
                                borderRadius: theme.shapes.medium,
                                borderWidth: 1,
                                borderStyle: "dashed",
                                borderColor: colors.outline,
                            }}
                        >
                            <Typography variant="bodySmall" color="onSurfaceVariant">
                                Livre até {formatTime(entrada.endsAt)}
                            </Typography>
                        </View>,
                        ultimo,
                    );
                }
                const a = entrada.appointment;
                return linha(
                    a.id,
                    a.startsAt,
                    statusBadgeColors(a.status, colors).fundo,
                    <Pressable
                        onPress={() => onOpen(a)}
                        accessibilityRole="button"
                        accessibilityLabel={`${formatTime(a.startsAt)} às ${formatTime(a.endsAt)}, ${a.clientName}, ${a.serviceName}${showProfessional ? ` com ${a.professionalName}` : ""}`}
                        accessibilityHint="Abre os detalhes e as ações do horário"
                        style={({ pressed }) => ({
                            paddingHorizontal: spacing.md,
                            paddingVertical: spacing.sm,
                            borderRadius: theme.shapes.medium,
                            backgroundColor: pressed ? colors.surfaceContainerHighest : colors.surfaceContainer,
                        })}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: spacing.sm,
                            }}
                        >
                            <Typography variant="titleSmall" weight="700" numberOfLines={1} style={{ flex: 1 }}>
                                {a.clientName}
                            </Typography>
                            <StatusBadge status={a.status} />
                        </View>
                        <Typography variant="bodySmall" color="onSurfaceVariant" numberOfLines={1}>
                            {a.serviceName}
                            {showProfessional ? ` · ${a.professionalName}` : ""}
                        </Typography>
                    </Pressable>,
                    ultimo,
                );
            })}
        </View>
    );
};
