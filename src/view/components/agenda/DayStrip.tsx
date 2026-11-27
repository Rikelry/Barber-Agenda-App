// Calendário semanal compacto (aba Trabalho e sugerir horário): setas de semana e os 7 dias, com
// o escolhido em marrom, hoje com contorno e um ponto nos dias com horários marcados. Dias
// passados podem ficar sem toque.

import { Pressable, View } from "react-native";

import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";

export type DayStripDay = {
    iso: string;
    date: Date;
    selected: boolean;
    today: boolean;
    /** Tem horário marcado (mostra o ponto). */
    marked?: boolean;
};

export type DayStripProps = {
    days: DayStripDay[];
    onSelect: (iso: string) => void;
    onPrevious: () => void;
    onNext: () => void;
    canGoBack: boolean;
    /** Dias antes deste ("YYYY-MM-DD") ficam desabilitados. */
    minDate?: string;
};

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

export const DayStrip = ({ days, onSelect, onPrevious, onNext, canGoBack, minDate }: DayStripProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const primeiro = days[0]?.date;

    return (
        <View style={{ gap: spacing.xs }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Typography variant="titleSmall" color="onSurfaceVariant" style={{ flex: 1 }}>
                    {primeiro ? `${MESES[primeiro.getMonth()]} de ${primeiro.getFullYear()}` : ""}
                </Typography>
                <IconButton
                    accessibilityLabel="Semana anterior"
                    onPress={onPrevious}
                    disabled={!canGoBack}
                    icon={(cor) => <Icon name="chevronLeft" color={cor} />}
                />
                <IconButton accessibilityLabel="Próxima semana" onPress={onNext} icon={(cor) => <Icon name="chevronRight" color={cor} />} />
            </View>
            <View style={{ flexDirection: "row", gap: spacing.xs }}>
                {days.map((d) => {
                    const desabilitado = Boolean(minDate && d.iso < minDate);
                    return (
                        <Pressable
                            key={d.iso}
                            onPress={() => onSelect(d.iso)}
                            disabled={desabilitado}
                            accessibilityRole="button"
                            accessibilityLabel={`${DIAS[d.date.getDay()]}, ${d.date.getDate()} de ${MESES[d.date.getMonth()]}${d.today ? ", hoje" : ""}${d.marked ? ", com horários" : ""}`}
                            accessibilityState={{
                                selected: d.selected,
                                disabled: desabilitado,
                            }}
                            style={{
                                flex: 1,
                                minHeight: componentSizes.dayButton.height,
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: theme.shapes.medium,
                                borderWidth: d.selected ? 0 : 1,
                                borderColor: d.today ? colors.primary : colors.outlineVariant,
                                backgroundColor: d.selected ? colors.primary : colors.surface,
                                opacity: desabilitado ? theme.state.disabledContent : 1,
                            }}
                        >
                            <Typography
                                variant="labelSmall"
                                style={{
                                    color: d.selected ? colors.onPrimary : colors.onSurfaceVariant,
                                }}
                            >
                                {DIAS[d.date.getDay()]}
                            </Typography>
                            <Typography
                                variant="titleSmall"
                                weight="700"
                                style={{
                                    color: d.selected ? colors.onPrimary : colors.onSurface,
                                }}
                            >
                                {d.date.getDate()}
                            </Typography>
                            <View
                                style={{
                                    width: componentSizes.agenda.dayMark,
                                    height: componentSizes.agenda.dayMark,
                                    marginTop: spacing.xs / 2,
                                    borderRadius: theme.shapes.full,
                                    backgroundColor: d.marked ? (d.selected ? colors.onPrimary : colors.primary) : "transparent",
                                }}
                            />
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};
