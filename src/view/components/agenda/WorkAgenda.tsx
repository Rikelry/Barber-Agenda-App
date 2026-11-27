// Conteúdo da aba Trabalho (barbeiro e dono), em três seções: calendário semanal com os dias
// marcados, solicitações do dia e a agenda do dia em linha do tempo. Detalhes e sugerir outro
// horário abrem em bottom sheet; recusar, num diálogo. O aviso das ações (Snackbar) fica na tela.

import { View } from "react-native";

import { AgendaRequestCard } from "@/view/components/agenda/AgendaRequestCard";
import { AgendaTimeline } from "@/view/components/agenda/AgendaTimeline";
import { AppointmentSheet } from "@/view/components/agenda/AppointmentSheet";
import { DayStrip } from "@/view/components/agenda/DayStrip";
import { ProposeSheet } from "@/view/components/agenda/ProposeSheet";
import { RejectDialog } from "@/view/components/agenda/RejectDialog";
import { Button } from "@/view/components/button";
import { Icon } from "@/view/components/icon";
import { ScreenState } from "@/view/components/screenState";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import type { AgendaItem, AgendaTimelineEntry } from "@/view/components/agenda/AgendaItem";
import type { DayStripDay } from "@/view/components/agenda/DayStrip";

/** Dá para iniciar a partir de 15 minutos antes (a regra fica no caso de uso; aqui só esconde). */
const INICIO_ANTECIPADO_MS = 15 * 60000;

type SlotsStatus = "loading" | "error" | "empty" | "content";

/** O que a aba Trabalho mostra (vem da ViewModel da tela). */
export type WorkAgendaState<T extends AgendaItem> = {
    status: "loading" | "error" | "content";
    errorMessage: string | null;
    showProfessional: boolean;
    week: DayStripDay[];
    canGoToPreviousWeek: boolean;
    closed: boolean;
    requests: T[];
    otherDaysRequests: number;
    day: AgendaTimelineEntry<T>[];
    loadedAt: number;
    details: T | null;
    confirming: "cancel" | "no_show" | null;
    proposal: {
        appointment: T;
        week: DayStripDay[];
        canGoToPreviousWeek: boolean;
        slotsStatus: SlotsStatus;
        slots: string[];
        time: string | null;
        sending: boolean;
        errors: Partial<Record<"date" | "time", string>>;
        message: string | null;
    } | null;
    rejection: { appointment: T; reason: string; error: string | null } | null;
    actingId: string | null;
    detailsMessage: string | null;
};

export type WorkAgendaActions<T extends AgendaItem> = {
    selectDate: (iso: string) => void;
    previousWeek: () => void;
    nextWeek: () => void;
    retry: () => void;
    showNextRequest: () => void;
    approve: (item: T) => void;
    openDetails: (item: T) => void;
    closeDetails: () => void;
    start: () => void;
    complete: () => void;
    askConfirm: (what: "cancel" | "no_show") => void;
    dismissConfirm: () => void;
    confirm: () => void;
    askReject: (item: T) => void;
    changeRejectReason: (reason: string) => void;
    dismissReject: () => void;
    confirmReject: () => void;
    openProposal: (item: T) => void;
    closeProposal: () => void;
    proposalSelectDate: (iso: string) => void;
    proposalPreviousWeek: () => void;
    proposalNextWeek: () => void;
    proposalSelectTime: (time: string) => void;
    proposalRetrySlots: () => void;
    sendProposal: () => void;
};

export type WorkAgendaProps<T extends AgendaItem> = { state: WorkAgendaState<T>; actions: WorkAgendaActions<T> };

export const WorkAgenda = <T extends AgendaItem>({ state, actions }: WorkAgendaProps<T>) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const hoje = state.week.find((d) => d.selected)?.today ?? false;
    const secao = (titulo: string, contador?: number) => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
            <Typography variant="titleMedium" weight="700" accessibilityRole="header" style={{ flex: 1 }}>
                {titulo}
            </Typography>
            {contador ? (
                <View
                    style={{
                        minWidth: spacing.xxl,
                        paddingHorizontal: spacing.sm,
                        paddingVertical: spacing.xs / 2,
                        borderRadius: theme.shapes.full,
                        backgroundColor: colors.primary,
                        alignItems: "center",
                    }}
                >
                    <Typography variant="labelMedium" weight="700" color="onPrimary">
                        {contador}
                    </Typography>
                </View>
            ) : null}
        </View>
    );
    const d = state.details;

    return (
        <View style={{ gap: spacing.lg }}>
            <DayStrip
                days={state.week}
                onSelect={actions.selectDate}
                onPrevious={actions.previousWeek}
                onNext={actions.nextWeek}
                canGoBack={state.canGoToPreviousWeek}
            />

            {state.status !== "content" ? (
                <ScreenState
                    status={state.status}
                    loadingLabel="Carregando agenda"
                    errorMessage={state.errorMessage}
                    onRetry={actions.retry}
                    emptyTitle=""
                />
            ) : (
                <>
                    <View style={{ gap: spacing.sm }}>
                        {secao("Solicitações", state.requests.length)}
                        {state.requests.length === 0 ? (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: spacing.sm,
                                    paddingVertical: spacing.xs,
                                }}
                            >
                                <Icon name="checkCircle" size={spacing.xl} color={colors.onSurfaceVariant} />
                                <Typography variant="bodyMedium" color="onSurfaceVariant">
                                    Nenhuma solicitação neste dia.
                                </Typography>
                            </View>
                        ) : (
                            state.requests.map((r) => (
                                <AgendaRequestCard
                                    key={r.id}
                                    item={r}
                                    showProfessional={state.showProfessional}
                                    busy={state.actingId === r.id}
                                    onOpen={() => actions.openDetails(r)}
                                    onApprove={() => actions.approve(r)}
                                    onReject={() => actions.askReject(r)}
                                    onPropose={() => actions.openProposal(r)}
                                />
                            ))
                        )}
                        {state.otherDaysRequests > 0 ? (
                            <Button
                                variant="text"
                                size="xs"
                                onPress={actions.showNextRequest}
                                style={{ alignSelf: "flex-start" }}
                                accessibilityLabel={`${state.otherDaysRequests} solicitações em outros dias. Ir para a próxima`}
                            >
                                {state.otherDaysRequests === 1
                                    ? "+1 solicitação em outro dia"
                                    : `+${state.otherDaysRequests} solicitações em outros dias`}
                            </Button>
                        ) : null}
                    </View>

                    <View style={{ gap: spacing.sm }}>
                        {secao(hoje ? "Agenda de hoje" : "Agenda do dia")}
                        {state.day.length === 0 ? (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: spacing.sm,
                                    paddingVertical: spacing.xs,
                                }}
                            >
                                <Icon name="calendar" size={spacing.xl} color={colors.onSurfaceVariant} />
                                <Typography variant="bodyMedium" color="onSurfaceVariant">
                                    {state.closed ? "A barbearia não abre neste dia." : "Nenhum horário marcado neste dia."}
                                </Typography>
                            </View>
                        ) : (
                            <AgendaTimeline entries={state.day} showProfessional={state.showProfessional} onOpen={actions.openDetails} />
                        )}
                    </View>
                </>
            )}

            <AppointmentSheet
                item={d}
                showProfessional={state.showProfessional}
                started={d !== null && d.startsAt.getTime() <= state.loadedAt}
                canStart={d !== null && d.startsAt.getTime() - INICIO_ANTECIPADO_MS <= state.loadedAt}
                confirming={state.confirming}
                busy={d !== null && state.actingId === d.id}
                message={state.detailsMessage}
                onClose={actions.closeDetails}
                onApprove={() => d && actions.approve(d)}
                onReject={() => d && actions.askReject(d)}
                onPropose={() => d && actions.openProposal(d)}
                onStart={actions.start}
                onComplete={actions.complete}
                onAskConfirm={actions.askConfirm}
                onDismissConfirm={actions.dismissConfirm}
                onConfirm={actions.confirm}
            />
            <ProposeSheet
                item={state.proposal?.appointment ?? null}
                week={state.proposal?.week ?? []}
                canGoToPreviousWeek={state.proposal?.canGoToPreviousWeek ?? false}
                slotsStatus={state.proposal?.slotsStatus ?? "loading"}
                slots={state.proposal?.slots ?? []}
                time={state.proposal?.time ?? null}
                sending={state.proposal?.sending ?? false}
                errors={state.proposal?.errors ?? {}}
                message={state.proposal?.message ?? null}
                onClose={actions.closeProposal}
                onSelectDate={actions.proposalSelectDate}
                onPreviousWeek={actions.proposalPreviousWeek}
                onNextWeek={actions.proposalNextWeek}
                onSelectTime={actions.proposalSelectTime}
                onRetrySlots={actions.proposalRetrySlots}
                onSend={actions.sendProposal}
            />
            <RejectDialog
                clientName={state.rejection?.appointment.clientName ?? null}
                reason={state.rejection?.reason ?? ""}
                error={state.rejection?.error ?? null}
                busy={state.rejection !== null && state.actingId === state.rejection.appointment.id}
                onChangeReason={actions.changeRejectReason}
                onDismiss={actions.dismissReject}
                onConfirm={actions.confirmReject}
            />
        </View>
    );
};
