import type { AppointmentStatus } from "@/model/entities/appointment";
import type { Barbershop } from "@/model/entities/barbershop";
import type { Service } from "@/model/entities/service";
import type { Unavailability } from "@/model/entities/unavailability";

export type AgendaItem =
  | {
      kind: "appointment";
      id: string;
      serviceName: string;
      startsAt: Date;
      endsAt: Date;
      status: AppointmentStatus;
    }
  | { kind: "free"; startsAt: Date; endsAt: Date };

export type DayAgenda = {
  /** A barbearia não abre nesse dia (sem horário de funcionamento). */
  closed: boolean;
  items: AgendaItem[];
};

/** Bloqueios recorrentes iguais (mesmo horário e motivo) em vários dias aparecem juntos. */
export type RecurringBlock = {
  key: string;
  ids: string[];
  days: number[];
  startTime: string;
  endTime: string;
  reason: string | null;
};

export type MyBlocks = { recurring: RecurringBlock[]; oneOff: Unavailability[] };

export type RecurringForm = { days: number[]; startTime: string; endTime: string; reason: string };
export type OneOffForm = { date: string; startTime: string; endTime: string; reason: string };
export type BlockField = "days" | "date" | "startTime" | "endTime";

/** Onde o barbeiro trabalha: barbearia, horário da semana (segunda a domingo) e serviços. */
export type Workplace = {
  barbershop: Barbershop;
  specialty: string | null;
  /** 7 dias, segunda primeiro; null quando a barbearia não abre no dia. */
  week: { dayOfWeek: number; hours: { openTime: string; closeTime: string } | null }[];
  services: Service[];
};

export interface IProfessionalUseCases {
  getWorkplace(): Promise<Workplace>;
  /** Marca como concluído (só agendamentos confirmados que já começaram). */
  completeAppointment(appointmentId: string, startsAt: Date, now?: Date): Promise<void>;
  cancelAppointment(appointmentId: string): Promise<void>;
  /** Agenda do dia ("YYYY-MM-DD") com os agendamentos e as faixas livres do horário de funcionamento. */
  getDayAgenda(date: string): Promise<DayAgenda>;
  listMyBlocks(now?: Date): Promise<MyBlocks>;
  addRecurringBlock(form: RecurringForm): Promise<void>;
  addOneOffBlock(form: OneOffForm, now?: Date): Promise<void>;
  removeRecurringBlock(block: RecurringBlock): Promise<void>;
  removeOneOffBlock(id: string): Promise<void>;
}
