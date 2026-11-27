import type { AppointmentStatus } from "@/model/entities/appointment";
import type { RecurringUnavailability, Unavailability } from "@/model/entities/unavailability";

/** Quem é o profissional logado e em qual barbearia trabalha. */
export type ProfessionalIdentity = { professionalId: string; barbershopId: string; specialty?: string | null };

/** Agendamento da agenda do profissional; a API não manda o nome do cliente nem do serviço. */
export type AgendaAppointmentData = {
  id: string;
  serviceId: string;
  startsAt: Date;
  endsAt: Date;
  status: AppointmentStatus;
};

export interface IProfessionalDataSource {
  /** Com barbershopId, o vínculo naquela barbearia; sem, o primeiro. */
  getMe(barbershopId?: string): Promise<ProfessionalIdentity>;
  /** Todos os vínculos (uma barbearia por linha) do profissional logado. */
  listMyWorkplaces(): Promise<ProfessionalIdentity[]>;
  listMyAgenda(): Promise<AgendaAppointmentData[]>;
  completeAppointment(appointmentId: string): Promise<void>;
  cancelAppointment(appointmentId: string): Promise<void>;
  listUnavailabilities(who: ProfessionalIdentity): Promise<Unavailability[]>;
  addUnavailability(who: ProfessionalIdentity, startsAt: Date, endsAt: Date, reason?: string): Promise<void>;
  removeUnavailability(who: ProfessionalIdentity, id: string): Promise<void>;
  listRecurringUnavailabilities(who: ProfessionalIdentity): Promise<RecurringUnavailability[]>;
  addRecurringUnavailability(
    who: ProfessionalIdentity,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    reason?: string,
  ): Promise<void>;
  removeRecurringUnavailability(who: ProfessionalIdentity, id: string): Promise<void>;
}
