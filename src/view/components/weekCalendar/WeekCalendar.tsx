// Calendário de uma semana (calendario.md, variante inline): mês e ano, setas de semana,
// dias com o selecionado em primary, hoje destacado e dias indisponíveis sem toque.

import { Pressable, View } from "react-native";

import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";

export type WeekCalendarDay = {
    /** "YYYY-MM-DD" */
    iso: string;
    /** Inicial do dia da semana (D, S, T...). */
    weekday: string;
    /** Nome completo para leitor de tela (ex.: "segunda-feira, 17 de novembro de 2026"). */
    fullLabel: string;
    day: number;
    selected: boolean;
    today: boolean;
    disabled: boolean;
};

export type WeekCalendarProps = {
    monthLabel: string;
    days: WeekCalendarDay[];
    canGoBack: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onSelect: (iso: string) => void;
};

export const WeekCalendar = ({ monthLabel, days, canGoBack, onPrevious, onNext, onSelect }: WeekCalendarProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const lado = componentSizes.touchTarget - spacing.sm;

    return (
        <View
            style={{
                gap: spacing.sm,
                padding: spacing.md,
                borderWidth: 1,
                borderColor: colors.outlineVariant,
                borderRadius: theme.shapes.medium,
                backgroundColor: colors.surface,
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Typography variant="titleMedium" style={{ flex: 1 }} accessibilityRole="header">
                    {monthLabel}
                </Typography>
                <IconButton
                    accessibilityLabel="Semana anterior"
                    disabled={!canGoBack}
                    onPress={onPrevious}
                    icon={(cor) => <Icon name="chevronLeft" color={cor} />}
                />
                <IconButton
                    accessibilityLabel="Próxima semana"
                    onPress={onNext}
                    icon={(cor) => <Icon name="chevronRight" color={cor} />}
                />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                {days.map((d) => {
                    const cor = d.selected ? colors.onPrimary : d.disabled ? colors.outline : colors.onSurface;
                    return (
                        <View key={d.iso} style={{ alignItems: "center", gap: spacing.xs }}>
                            <Typography variant="labelMedium" color="onSurfaceVariant" accessibilityElementsHidden>
                                {d.weekday}
                            </Typography>
                            <Pressable
                                onPress={() => onSelect(d.iso)}
                                disabled={d.disabled}
                                accessibilityRole="button"
                                accessibilityLabel={`${d.fullLabel}${d.today ? ", hoje" : ""}`}
                                accessibilityState={{ selected: d.selected, disabled: d.disabled }}
                                style={{
                                    width: lado,
                                    height: lado,
                                    borderRadius: theme.shapes.full,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: d.selected ? colors.primary : "transparent",
                                    borderWidth: d.today && !d.selected ? 1 : 0,
                                    borderColor: colors.primary,
                                }}
                            >
                                <Typography variant="bodyMedium" weight={d.selected ? "700" : "400"} style={{ color: cor }}>
                                    {d.day}
                                </Typography>
                            </Pressable>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};
