// Sugerir outro horário em bottom sheet (aba Trabalho): o pedido atual, a semana para escolher o
// dia, os horários realmente livres do profissional e Enviar sugestão. O cliente aceita ou
// recusa em Agendas.

import { Pressable, View } from "react-native";

import { BottomSheet } from "@/view/components/bottomSheet";
import { Button } from "@/view/components/button";
import { DayStrip, type DayStripDay } from "@/view/components/agenda/DayStrip";
import { formatDayLabelInline, formatTime } from "@/view/components/format";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";
import type { AgendaItem } from "@/view/components/agenda/AgendaItem";

export type ProposeSheetProps = {
    item: AgendaItem | null;
    week: DayStripDay[];
    canGoToPreviousWeek: boolean;
    slotsStatus: "loading" | "error" | "empty" | "content";
    slots: string[];
    time: string | null;
    sending: boolean;
    errors: Partial<Record<"date" | "time", string>>;
    message: string | null;
    onClose: () => void;
    onSelectDate: (iso: string) => void;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    onSelectTime: (time: string) => void;
    onRetrySlots: () => void;
    onSend: () => void;
};

export const ProposeSheet = (props: ProposeSheetProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const a = props.item;
    const hoje = props.week.find((d) => d.today)?.iso;

    return (
        <BottomSheet
            visible={a !== null}
            title="Sugerir outro horário"
            onClose={props.onClose}
            footer={
                <>
                    {props.message ? (
                        <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
                            {props.message}
                        </Typography>
                    ) : null}
                    <Button variant="filled" size="medium" onPress={props.onSend} disabled={props.sending || !props.time}>
                        {props.sending ? "Enviando..." : "Enviar sugestão"}
                    </Button>
                </>
            }
        >
            {a ? (
                <>
                    <Typography variant="bodyMedium" color="onSurfaceVariant">
                        {a.clientName} pediu {a.serviceName} para {formatDayLabelInline(a.startsAt)} às {formatTime(a.startsAt)}. Escolha
                        outro horário livre de {a.professionalName.split(" ")[0]}.
                    </Typography>
                    <DayStrip
                        days={props.week}
                        onSelect={props.onSelectDate}
                        onPrevious={props.onPreviousWeek}
                        onNext={props.onNextWeek}
                        canGoBack={props.canGoToPreviousWeek}
                        minDate={hoje}
                    />
                    {props.errors.date ? (
                        <Typography variant="bodySmall" color="error">
                            {props.errors.date}
                        </Typography>
                    ) : null}
                    {props.slotsStatus === "loading" ? (
                        <Typography variant="bodyMedium" color="onSurfaceVariant" accessibilityLiveRegion="polite">
                            Carregando horários...
                        </Typography>
                    ) : props.slotsStatus === "empty" ? (
                        <Typography variant="bodyMedium" color="onSurfaceVariant">
                            Nenhum horário livre nesse dia. Escolha outro dia.
                        </Typography>
                    ) : props.slotsStatus === "error" ? (
                        <View style={{ alignItems: "flex-start", gap: spacing.sm }}>
                            <Typography variant="bodyMedium" color="error">
                                Não foi possível carregar os horários.
                            </Typography>
                            <Button variant="tonal" size="xs" onPress={props.onRetrySlots}>
                                Tentar de novo
                            </Button>
                        </View>
                    ) : (
                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: spacing.sm,
                            }}
                        >
                            {props.slots.map((hora) => {
                                const ativo = hora === props.time;
                                return (
                                    <Pressable
                                        key={hora}
                                        onPress={() => props.onSelectTime(hora)}
                                        accessibilityRole="button"
                                        accessibilityLabel={`${hora}, ${ativo ? "selecionado" : "disponível"}`}
                                        accessibilityState={{ selected: ativo }}
                                        style={{
                                            width: "23%",
                                            minHeight: componentSizes.touchTarget,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: theme.shapes.small,
                                            borderWidth: ativo ? 0 : 1,
                                            borderColor: colors.outlineVariant,
                                            backgroundColor: ativo ? colors.primary : "transparent",
                                        }}
                                    >
                                        <Typography
                                            variant="labelLarge"
                                            style={{
                                                color: ativo ? colors.onPrimary : colors.onSurface,
                                            }}
                                        >
                                            {hora}
                                        </Typography>
                                    </Pressable>
                                );
                            })}
                        </View>
                    )}
                    {props.errors.time ? (
                        <Typography variant="bodySmall" color="error" accessibilityLiveRegion="polite">
                            {props.errors.time}
                        </Typography>
                    ) : null}
                </>
            ) : null}
        </BottomSheet>
    );
};
