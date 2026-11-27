/**
 * Status do agendamento. Na API: "pendente" (pedido aguardando o profissional ou o dono),
 * "aguardando_cliente" (o profissional sugeriu outro horário), "agendado" (Confirmado),
 * "em_andamento", "concluido", "recusado", "cancelado" e "nao_compareceu".
 */
export type AppointmentStatus =
  | "pending"
  | "awaiting_client"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "rejected"
  | "cancelled"
  | "no_show";

/** Ocupa o horário e ainda não terminou (pedido, sugestão, confirmado ou em andamento). */
export const isActiveStatus = (status: AppointmentStatus): boolean =>
  status === "pending" || status === "awaiting_client" || status === "confirmed" || status === "in_progress";

/** Horário sugerido pelo profissional, à espera da resposta do cliente. */
export type AppointmentProposal = { startsAt: Date; endsAt: Date };

export type Appointment = {
  id: string;
  barbershopId: string;
  barbershopName: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  startsAt: Date;
  endsAt: Date;
  status: AppointmentStatus;
  /** Sugestão de outro horário (status awaiting_client). */
  proposal?: AppointmentProposal | null;
  /** Motivo informado na recusa. */
  rejectionReason?: string | null;
};
