import type { AppointmentProposal, AppointmentStatus } from "@/model/entities/appointment";

/** Agendamento visto da agenda do profissional ou da barbearia: com quem pediu e com quem é. */
export type AgendaAppointment = {
  id: string;
  barbershopId: string;
  professionalId: string;
  professionalName: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  startsAt: Date;
  endsAt: Date;
  status: AppointmentStatus;
  proposal: AppointmentProposal | null;
  rejectionReason: string | null;
};
