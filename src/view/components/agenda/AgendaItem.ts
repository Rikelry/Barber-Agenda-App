import type { AppointmentStatusKey } from "@/view/components/statusBadge";

/** O que os componentes da agenda precisam de cada horário. */
export type AgendaItem = {
    id: string;
    status: AppointmentStatusKey;
    clientName: string;
    clientPhone: string;
    serviceName: string;
    professionalName: string;
    durationMinutes: number;
    startsAt: Date;
    endsAt: Date;
    /** Horário sugerido ao cliente (aguardando cliente). */
    proposal: { startsAt: Date; endsAt: Date } | null;
    rejectionReason: string | null;
};

export type AgendaTimelineEntry<T extends AgendaItem> =
    | { kind: "appointment"; appointment: T }
    | { kind: "free"; startsAt: Date; endsAt: Date };
