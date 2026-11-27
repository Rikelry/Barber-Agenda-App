// Detalhes do horário em bottom sheet (aba Trabalho): cliente, telefone, serviço, profissional,
// dia e hora e o status, com as ações de cada estado. Confirmado: Iniciar atendimento,
// Não compareceu e Cancelar; em andamento: Finalizar; pendente: Aprovar, Recusar e Sugerir
// outro horário; concluído, recusado, cancelado e não compareceu: só os detalhes. Cancelar e
// Não compareceu pedem confirmação no próprio sheet.

import { View } from "react-native";

import { BottomSheet } from "@/view/components/bottomSheet";
import { Button } from "@/view/components/button";
import { formatDayLabel, formatDuration, formatPhone, formatTime } from "@/view/components/format";
import { Icon } from "@/view/components/icon";
import { StatusBadge } from "@/view/components/statusBadge";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import type { AgendaItem } from "@/view/components/agenda/AgendaItem";

export type AppointmentSheetConfirm = "cancel" | "no_show" | null;

export type AppointmentSheetProps = {
    item: AgendaItem | null;
    showProfessional: boolean;
    /** O horário já começou (decide Não compareceu e Finalizar de confirmado). */
    started: boolean;
    /** Já dá para iniciar (a partir de alguns minutos antes). */
    canStart: boolean;
    confirming: AppointmentSheetConfirm;
    busy: boolean;
    message: string | null;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
    onPropose: () => void;
    onStart: () => void;
    onComplete: () => void;
    onAskConfirm: (what: "cancel" | "no_show") => void;
    onDismissConfirm: () => void;
    onConfirm: () => void;
};

export const AppointmentSheet = (props: AppointmentSheetProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const a = props.item;

    const info = (icone: string, texto: string) => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
            <Icon name={icone} size={spacing.xl} color={colors.onSurfaceVariant} />
            <Typography variant="bodyLarge" style={{ flex: 1 }}>
                {texto}
            </Typography>
        </View>
    );

    const perigo = (rotulo: string, onPress: () => void, label?: string) => (
        <Button variant="outlined" size="medium" onPress={onPress} disabled={props.busy} accessibilityLabel={label}>
            <Typography variant="labelLarge" color="error">
                {rotulo}
            </Typography>
        </Button>
    );

    const acoes = () => {
        if (!a) return null;
        if (props.confirming) {
            const cancelar = props.confirming === "cancel";
            return (
                <View accessibilityLiveRegion="polite" style={{ gap: spacing.sm }}>
                    <Typography variant="titleSmall" weight="700">
                        {cancelar
                            ? `Cancelar o horário de ${a.clientName.split(" ")[0]}?`
                            : `${a.clientName.split(" ")[0]} não compareceu?`}
                    </Typography>
                    <Typography variant="bodyMedium" color="onSurfaceVariant">
                        {cancelar
                            ? "O cliente vê o horário como cancelado e ele fica livre."
                            : "O horário fica registrado como não compareceu."}
                    </Typography>
                    <View style={{ flexDirection: "row", gap: spacing.sm }}>
                        <Button variant="text" size="medium" style={{ flex: 1 }} onPress={props.onDismissConfirm} disabled={props.busy}>
                            Voltar
                        </Button>
                        <Button
                            variant="filled"
                            size="medium"
                            style={{ flex: 1, backgroundColor: colors.error }}
                            onPress={props.onConfirm}
                            disabled={props.busy}
                        >
                            <Typography variant="labelLarge" color="onError">
                                {cancelar ? "Sim, cancelar" : "Confirmar"}
                            </Typography>
                        </Button>
                    </View>
                </View>
            );
        }
        switch (a.status) {
            case "pending":
                return (
                    <>
                        <Button variant="filled" size="medium" onPress={props.onApprove} disabled={props.busy}>
                            Aprovar
                        </Button>
                        <Button variant="tonal" size="medium" onPress={props.onPropose} disabled={props.busy}>
                            Sugerir outro horário
                        </Button>
                        {perigo("Recusar", props.onReject, `Recusar pedido de ${a.clientName}`)}
                    </>
                );
            case "awaiting_client":
                return perigo("Cancelar pedido", () => props.onAskConfirm("cancel"));
            case "confirmed":
                return (
                    <>
                        <Button
                            variant="filled"
                            size="medium"
                            onPress={props.onStart}
                            disabled={props.busy || !props.canStart}
                            leadingIcon={(cor) => <Icon name="play" size={spacing.xl} color={cor} />}
                        >
                            Iniciar atendimento
                        </Button>
                        {props.canStart ? null : (
                            <Typography variant="bodySmall" color="onSurfaceVariant" align="center">
                                Dá para iniciar a partir de 15 minutos antes do horário.
                            </Typography>
                        )}
                        {props.started ? (
                            <Button
                                variant="tonal"
                                size="medium"
                                onPress={() => props.onAskConfirm("no_show")}
                                disabled={props.busy}
                                leadingIcon={(cor) => <Icon name="personOff" size={spacing.xl} color={cor} />}
                            >
                                Não compareceu
                            </Button>
                        ) : null}
                        {perigo("Cancelar horário", () => props.onAskConfirm("cancel"))}
                    </>
                );
            case "in_progress":
                return (
                    <Button
                        variant="filled"
                        size="medium"
                        onPress={props.onComplete}
                        disabled={props.busy}
                        leadingIcon={(cor) => <Icon name="taskAlt" size={spacing.xl} color={cor} />}
                    >
                        Finalizar atendimento
                    </Button>
                );
            default:
                return null;
        }
    };

    const rodape = a ? acoes() : null;

    return (
        <BottomSheet
            visible={a !== null}
            title="Detalhes do horário"
            onClose={props.onClose}
            footer={
                rodape || props.message ? (
                    <>
                        {props.message ? (
                            <Typography variant="bodyMedium" color="error" accessibilityLiveRegion="polite">
                                {props.message}
                            </Typography>
                        ) : null}
                        {rodape}
                    </>
                ) : undefined
            }
        >
            {a ? (
                <>
                    <View style={{ gap: spacing.sm }}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: spacing.sm,
                            }}
                        >
                            <Typography variant="titleLarge" weight="700" style={{ flex: 1 }} numberOfLines={2}>
                                {a.clientName}
                            </Typography>
                            <StatusBadge status={a.status} />
                        </View>
                        {a.clientPhone ? info("phone", formatPhone(a.clientPhone)) : null}
                    </View>
                    <View
                        style={{
                            gap: spacing.md,
                            padding: spacing.lg,
                            borderRadius: theme.shapes.large,
                            backgroundColor: colors.surfaceContainer,
                        }}
                    >
                        {info("scissors", `${a.serviceName} · ${formatDuration(a.durationMinutes)}`)}
                        {props.showProfessional ? info("person", `Com ${a.professionalName}`) : null}
                        {info("calendar", `${formatDayLabel(a.startsAt)} · ${formatTime(a.startsAt)} – ${formatTime(a.endsAt)}`)}
                        {a.proposal
                            ? info("clock", `Sugerido: ${formatDayLabel(a.proposal.startsAt)} · ${formatTime(a.proposal.startsAt)}`)
                            : null}
                        {a.rejectionReason ? info("notes", `Motivo: ${a.rejectionReason}`) : null}
                    </View>
                </>
            ) : null}
        </BottomSheet>
    );
};
