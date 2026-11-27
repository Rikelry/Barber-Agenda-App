import type { AgendaAppointment } from "@/model/entities/agendaAppointment";

/**
 * De quem é a agenda: do profissional logado (numa das barbearias onde ele atende) ou de uma
 * barbearia do dono logado.
 */
export type AgendaScope = { kind: "professional"; barbershopId?: string } | { kind: "barbershop"; barbershopId: string };

/** Agendas do profissional e da barbearia, com as respostas aos pedidos e o andamento. */
export interface IAgendaDataSource {
  list(scope: AgendaScope): Promise<AgendaAppointment[]>;
  approve(appointmentId: string): Promise<void>;
  /** reason: motivo opcional mostrado ao cliente. */
  reject(appointmentId: string, reason?: string): Promise<void>;
  /** Pedido pendente: sugere outro horário (date "YYYY-MM-DD", time "HH:mm") ao cliente. */
  propose(appointmentId: string, date: string, time: string): Promise<void>;
  start(appointmentId: string): Promise<void>;
  complete(appointmentId: string): Promise<void>;
  noShow(appointmentId: string): Promise<void>;
  cancel(appointmentId: string): Promise<void>;
  /** Remarca um horário já confirmado. */
  reschedule(appointmentId: string, date: string, time: string): Promise<void>;
  /** Horários livres ("HH:mm") do profissional para o serviço na data. */
  listAvailableSlots(barbershopId: string, professionalId: string, serviceId: string, date: string): Promise<string[]>;
}
